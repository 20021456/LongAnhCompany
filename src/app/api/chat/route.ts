import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

/**
 * Creates a visitor chat session. Called by the public chat widget the first
 * time a visitor sends a message. Realtime delivery is handled by the widget
 * + admin polling the `[id]` route — no socket server required.
 */
const schema = z.object({
  name: z.string().max(120).optional(),
  email: z.string().email().max(200).optional().or(z.literal('')),
  locale: z.string().max(5).optional(),
});

export async function POST(req: Request) {
  let body: unknown = {};
  try {
    body = await req.json();
  } catch {
    /* empty body is fine */
  }
  const parsed = schema.safeParse(body ?? {});
  const d = parsed.success ? parsed.data : {};
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;

  try {
    const session = await db.chatSession.create({
      data: {
        visitorName: d.name?.trim() || null,
        visitorEmail: d.email?.trim() || null,
        visitorIp: ip,
        locale: d.locale || null,
        status: 'open',
      },
    });
    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error('[chat] create session failed:', err);
    return NextResponse.json({ error: 'Không tạo được phiên chat.' }, { status: 500 });
  }
}
