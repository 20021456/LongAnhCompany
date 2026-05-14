import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

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

    // TODO Phase 6: notify HR by email/Slack

    return NextResponse.json({ ok: true, id: application.id }, { status: 201 });
  } catch (err) {
    console.error('Job application error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
