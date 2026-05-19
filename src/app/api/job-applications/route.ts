import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { sendNotificationEmail, esc } from '@/lib/email';

const schema = z.object({
  jobSlug: z.string().min(1),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  cvUrl: z.string().url(),
  coverLetter: z.string().optional(),
});

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const data = parsed.data;

  try {
    const job = await db.job.findUnique({ where: { slug: data.jobSlug } });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const application = await db.jobApplication.create({
      data: {
        jobId: job.id,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        cvUrl: data.cvUrl,
        coverLetter: data.coverLetter,
        status: 'new',
      },
    });

    const hrInbox = process.env.HR_EMAIL;
    if (hrInbox) {
      // Best-effort notification — failure does not block the response.
      await sendNotificationEmail({
        to: hrInbox,
        replyTo: data.email,
        subject: `[Hồ sơ ứng tuyển] ${job.titleVi} — ${data.fullName}`,
        html: `
          <h2>Có hồ sơ ứng tuyển mới</h2>
          <table cellpadding="6" style="font-size:14px">
            <tr><td><b>Vị trí</b></td><td>${esc(job.titleVi)}</td></tr>
            <tr><td><b>Họ tên</b></td><td>${esc(data.fullName)}</td></tr>
            <tr><td><b>Email</b></td><td>${esc(data.email)}</td></tr>
            <tr><td><b>Điện thoại</b></td><td>${esc(data.phone)}</td></tr>
            <tr><td><b>CV</b></td><td><a href="${esc(data.cvUrl)}">${esc(data.cvUrl)}</a></td></tr>
          </table>
          ${
            data.coverLetter
              ? `<h3>Thư xin việc</h3><p style="white-space:pre-wrap;line-height:1.55">${esc(data.coverLetter)}</p>`
              : ''
          }
          <hr/>
          <p style="font-size:12px;color:#6b7280">
            Mở chi tiết trong admin: <code>/admin/jobs/${esc(data.jobSlug)}/applications</code>
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
