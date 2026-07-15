import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { sendNotificationEmail, esc } from '@/lib/email';
import { uploadObject } from '@/lib/storage';

const fieldSchema = z.object({
  jobSlug: z.string().min(1),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  coverLetter: z.string().optional(),
});

const ALLOWED_CV_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_CV_BYTES = 8 * 1024 * 1024; // 8 MB

interface ParseResult {
  fields: z.infer<typeof fieldSchema>;
  cvUrl: string;
}

/**
 * Accept either multipart/form-data (the public apply form posts a File for
 * `cv`) or JSON with a pre-uploaded `cvUrl`. Uploads the CV through the
 * shared storage helper — S3 when configured, inline data URL otherwise.
 */
async function readBody(
  req: Request,
): Promise<{ ok: true; data: ParseResult } | { ok: false; status: number; error: string }> {
  const contentType = req.headers.get('content-type') ?? '';

  if (contentType.startsWith('multipart/')) {
    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return { ok: false, status: 400, error: 'Expected multipart/form-data' };
    }

    const file = form.get('cv');
    if (!(file instanceof File)) {
      return { ok: false, status: 400, error: 'Thiếu CV.' };
    }
    if (!ALLOWED_CV_TYPES.includes(file.type)) {
      return { ok: false, status: 415, error: 'Chỉ chấp nhận tệp PDF / DOC / DOCX.' };
    }
    if (file.size > MAX_CV_BYTES) {
      return { ok: false, status: 413, error: 'CV vượt quá 8MB.' };
    }

    const fields = fieldSchema.safeParse({
      jobSlug: String(form.get('jobSlug') ?? ''),
      fullName: String(form.get('fullName') ?? ''),
      email: String(form.get('email') ?? ''),
      phone: form.get('phone') ? String(form.get('phone')) : undefined,
      coverLetter: form.get('coverLetter') ? String(form.get('coverLetter')) : undefined,
    });
    if (!fields.success) {
      return {
        ok: false,
        status: 422,
        error: fields.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ',
      };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadObject({
      buffer,
      contentType: file.type,
      filename: file.name || 'cv.pdf',
      folder: 'cv',
    });

    return { ok: true, data: { fields: fields.data, cvUrl: uploaded.url } };
  }

  // Fallback: JSON with a pre-uploaded URL.
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return { ok: false, status: 400, error: 'Invalid JSON' };
  }
  const jsonSchema = fieldSchema.extend({ cvUrl: z.string().min(1) });
  const parsed = jsonSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      status: 422,
      error: parsed.error.issues[0]?.message ?? 'Validation failed',
    };
  }
  const { cvUrl, ...fields } = parsed.data;
  return { ok: true, data: { fields, cvUrl } };
}

export async function POST(req: Request) {
  const parsed = await readBody(req);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }
  const { fields, cvUrl } = parsed.data;

  try {
    const job = await db.job.findUnique({ where: { slug: fields.jobSlug } });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const application = await db.jobApplication.create({
      data: {
        jobId: job.id,
        fullName: fields.fullName,
        email: fields.email,
        phone: fields.phone,
        cvUrl,
        coverLetter: fields.coverLetter,
        status: 'new',
      },
    });

    const hrInbox = process.env.HR_EMAIL;
    if (hrInbox) {
      // Best-effort notification — failure does not block the response.
      await sendNotificationEmail({
        to: hrInbox,
        replyTo: fields.email,
        subject: `[Hồ sơ ứng tuyển] ${job.titleVi} — ${fields.fullName}`,
        html: `
          <h2>Có hồ sơ ứng tuyển mới</h2>
          <table cellpadding="6" style="font-size:14px">
            <tr><td><b>Vị trí</b></td><td>${esc(job.titleVi)}</td></tr>
            <tr><td><b>Họ tên</b></td><td>${esc(fields.fullName)}</td></tr>
            <tr><td><b>Email</b></td><td>${esc(fields.email)}</td></tr>
            <tr><td><b>Điện thoại</b></td><td>${esc(fields.phone)}</td></tr>
            <tr><td><b>CV</b></td><td><a href="${esc(cvUrl)}">${esc(cvUrl).slice(0, 80)}</a></td></tr>
          </table>
          ${
            fields.coverLetter
              ? `<h3>Thư xin việc</h3><p style="white-space:pre-wrap;line-height:1.55">${esc(fields.coverLetter)}</p>`
              : ''
          }
          <hr/>
          <p style="font-size:12px;color:#6b7280">
            Mở chi tiết trong admin: <code>/admin/jobs/${esc(fields.jobSlug)}/applications</code>
          </p>
        `,
      });
    }

    return NextResponse.json({ ok: true, id: application.id }, { status: 201 });
  } catch (err) {
    console.error('Job application error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
