'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/auth-helpers';
import { recordAudit } from '@/lib/audit';

export type ActionResult = { ok?: boolean; error?: string };

export async function setContactStatus(id: string, status: string): Promise<ActionResult> {
  const user = await requirePermission('contacts.update');
  const valid = ['new', 'contacted', 'quoted', 'won', 'lost'];
  if (!valid.includes(status)) return { error: 'Trạng thái không hợp lệ' };
  try {
    await db.contact.update({
      where: { id },
      data: { status, repliedAt: status !== 'new' ? new Date() : null },
    });
    await recordAudit({
      userId: user.id,
      action: 'update',
      entityType: 'contact',
      entityId: id,
      changes: { status },
    });
    revalidatePath('/admin/contacts');
    revalidatePath(`/admin/contacts/${id}`);
    return { ok: true };
  } catch (err) {
    console.error('setContactStatus error:', err);
    return { error: 'Không cập nhật được trạng thái.' };
  }
}

const noteSchema = z.object({
  contactId: z.string().min(1),
  note: z.string().min(1, 'Ghi chú không được để trống'),
});

export async function addContactNote(raw: {
  contactId: string;
  note: string;
}): Promise<ActionResult> {
  const user = await requirePermission('contacts.update');
  const parsed = noteSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' };
  }
  try {
    await db.contactNote.create({
      data: {
        contactId: parsed.data.contactId,
        userId: user.id,
        note: parsed.data.note,
      },
    });
    revalidatePath(`/admin/contacts/${parsed.data.contactId}`);
    return { ok: true };
  } catch (err) {
    console.error('addContactNote error:', err);
    return { error: 'Không lưu được ghi chú.' };
  }
}
