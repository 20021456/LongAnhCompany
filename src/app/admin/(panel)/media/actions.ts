'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/auth-helpers';
import { recordAudit } from '@/lib/audit';

export type ActionResult = { ok?: boolean; error?: string };

const addSchema = z.object({
  url: z.string().min(1, 'Đường dẫn ảnh không được để trống'),
  filename: z.string().optional(),
  altVi: z.string().optional(),
  altEn: z.string().optional(),
  altZh: z.string().optional(),
});

/** Register an image by URL / public path into the media library. */
export async function addMedia(raw: z.input<typeof addSchema>): Promise<ActionResult> {
  const user = await requirePermission('media.upload');
  const parsed = addSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' };
  }
  const d = parsed.data;

  try {
    const filename = (d.filename || d.url.split('/').pop() || 'image').trim();
    const media = await db.media.create({
      data: {
        url: d.url.trim(),
        filename,
        originalName: filename,
        altVi: d.altVi || null,
        altEn: d.altEn || null,
        altZh: d.altZh || null,
        uploadedById: user.id,
      },
    });
    await recordAudit({
      userId: user.id,
      action: 'create',
      entityType: 'media',
      entityId: media.id,
    });
    revalidatePath('/admin/media');
    return { ok: true };
  } catch (err) {
    console.error('addMedia error:', err);
    return { error: 'Không thêm được ảnh.' };
  }
}

const updateSchema = z.object({
  id: z.string().min(1),
  filename: z.string().min(1, 'Tên tệp không được để trống'),
  altVi: z.string().optional(),
  altEn: z.string().optional(),
  altZh: z.string().optional(),
});

export async function updateMedia(raw: z.input<typeof updateSchema>): Promise<ActionResult> {
  const user = await requirePermission('media.upload');
  const parsed = updateSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' };
  }
  const d = parsed.data;

  try {
    await db.media.update({
      where: { id: d.id },
      data: {
        filename: d.filename,
        altVi: d.altVi || null,
        altEn: d.altEn || null,
        altZh: d.altZh || null,
      },
    });
    await recordAudit({
      userId: user.id,
      action: 'update',
      entityType: 'media',
      entityId: d.id,
    });
    revalidatePath('/admin/media');
    return { ok: true };
  } catch (err) {
    console.error('updateMedia error:', err);
    return { error: 'Không cập nhật được ảnh.' };
  }
}

export async function deleteMedia(id: string): Promise<ActionResult> {
  const user = await requirePermission('media.delete');
  try {
    await db.media.delete({ where: { id } });
    await recordAudit({
      userId: user.id,
      action: 'delete',
      entityType: 'media',
      entityId: id,
    });
    revalidatePath('/admin/media');
    return { ok: true };
  } catch (err) {
    console.error('deleteMedia error:', err);
    return { error: 'Không xoá được ảnh.' };
  }
}
