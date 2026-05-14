'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';
import { recordAudit } from '@/lib/audit';

export type ActionResult = { ok?: boolean; error?: string };

const messageSchema = z.object({
  sessionId: z.string().min(1),
  message: z.string().min(1, 'Nội dung không được để trống'),
});

/** Post an agent reply into a chat session and mark visitor messages read. */
export async function sendAgentMessage(raw: z.input<typeof messageSchema>): Promise<ActionResult> {
  const user = await requireAuth();
  const parsed = messageSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' };
  }
  const d = parsed.data;

  try {
    const session = await db.chatSession.findUnique({ where: { id: d.sessionId } });
    if (!session) return { error: 'Phiên chat không tồn tại.' };

    await db.$transaction([
      db.chatMessage.create({
        data: {
          sessionId: d.sessionId,
          senderType: 'agent',
          senderId: user.id,
          message: d.message.trim(),
          isRead: true,
        },
      }),
      db.chatMessage.updateMany({
        where: { sessionId: d.sessionId, senderType: 'visitor', isRead: false },
        data: { isRead: true },
      }),
      // First reply claims an unassigned session.
      ...(session.assignedAgentId
        ? []
        : [
            db.chatSession.update({
              where: { id: d.sessionId },
              data: { assignedAgentId: user.id },
            }),
          ]),
    ]);

    revalidatePath('/admin/livechat');
    revalidatePath(`/admin/livechat/${d.sessionId}`);
    return { ok: true };
  } catch (err) {
    console.error('sendAgentMessage error:', err);
    return { error: 'Không gửi được tin nhắn.' };
  }
}

export async function setSessionStatus(
  id: string,
  status: 'open' | 'closed',
): Promise<ActionResult> {
  const user = await requireAuth();
  try {
    await db.chatSession.update({
      where: { id },
      data: {
        status,
        endedAt: status === 'closed' ? new Date() : null,
      },
    });
    await recordAudit({
      userId: user.id,
      action: 'update',
      entityType: 'chat_session',
      entityId: id,
    });
    revalidatePath('/admin/livechat');
    revalidatePath(`/admin/livechat/${id}`);
    return { ok: true };
  } catch (err) {
    console.error('setSessionStatus error:', err);
    return { error: 'Không cập nhật được trạng thái.' };
  }
}

/** Assign the session to the current agent (or release it). */
export async function assignSession(id: string, release = false): Promise<ActionResult> {
  const user = await requireAuth();
  try {
    await db.chatSession.update({
      where: { id },
      data: { assignedAgentId: release ? null : user.id },
    });
    revalidatePath('/admin/livechat');
    revalidatePath(`/admin/livechat/${id}`);
    return { ok: true };
  } catch (err) {
    console.error('assignSession error:', err);
    return { error: 'Không gán được phụ trách.' };
  }
}
