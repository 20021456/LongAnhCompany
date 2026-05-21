import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

/** Always hit the DB — this route is polled for new messages. */
export const dynamic = 'force-dynamic';

interface Ctx {
  params: { id: string };
}

function serialize(m: { id: string; senderType: string; message: string; createdAt: Date }): {
  id: string;
  senderType: string;
  message: string;
  createdAt: string;
} {
  return {
    id: m.id,
    senderType: m.senderType,
    message: m.message,
    createdAt: m.createdAt.toISOString(),
  };
}

/** Poll endpoint: the widget fetches this every few seconds. */
export async function GET(_req: Request, { params }: Ctx) {
  const session = await db.chatSession.findUnique({
    where: { id: params.id },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });
  if (!session) {
    return NextResponse.json({ error: 'Phiên chat không tồn tại.' }, { status: 404 });
  }
  return NextResponse.json({
    status: session.status,
    messages: session.messages.map(serialize),
  });
}

const postSchema = z.object({ message: z.string().min(1).max(2000) });

/** Visitor posts a message into the session. */
export async function POST(req: Request, { params }: Ctx) {
  const session = await db.chatSession.findUnique({ where: { id: params.id } });
  if (!session) {
    return NextResponse.json({ error: 'Phiên chat không tồn tại.' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Nội dung không hợp lệ.' }, { status: 400 });
  }

  try {
    const message = await db.chatMessage.create({
      data: {
        sessionId: params.id,
        senderType: 'visitor',
        message: parsed.data.message.trim(),
        isRead: false,
      },
    });
    // A returning visitor re-opens a closed session.
    if (session.status === 'closed') {
      await db.chatSession.update({
        where: { id: params.id },
        data: { status: 'open', endedAt: null },
      });
    }
    return NextResponse.json({ ok: true, message: serialize(message) });
  } catch (err) {
    console.error('[chat] post message failed:', err);
    return NextResponse.json({ error: 'Không gửi được tin nhắn.' }, { status: 500 });
  }
}
