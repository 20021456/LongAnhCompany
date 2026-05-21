'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/auth-helpers';
import { recordAudit } from '@/lib/audit';

const schema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, 'Mã chứng nhận là bắt buộc'),
  name: z.string().min(1, 'Tên chứng nhận là bắt buộc'),
  descriptionVi: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionZh: z.string().optional(),
  badgeImageUrl: z.string().optional(),
  documentUrl: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
});

export type CertificationInput = z.input<typeof schema>;
export type ActionResult = { ok?: boolean; error?: string };

export async function saveCertification(raw: CertificationInput): Promise<ActionResult> {
  const user = await requirePermission('pages.update');
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' };
  }
  const d = parsed.data;

  try {
    const data = {
      code: d.code.trim(),
      name: d.name.trim(),
      descriptionVi: d.descriptionVi || null,
      descriptionEn: d.descriptionEn || null,
      descriptionZh: d.descriptionZh || null,
      badgeImageUrl: d.badgeImageUrl || null,
      documentUrl: d.documentUrl || null,
      sortOrder: d.sortOrder,
    };

    const cert = d.id
      ? await db.certification.update({ where: { id: d.id }, data })
      : await db.certification.create({ data });

    await recordAudit({
      userId: user.id,
      action: d.id ? 'update' : 'create',
      entityType: 'certification',
      entityId: cert.id,
    });

    revalidatePath('/admin/certifications');
    revalidatePath('/[locale]/about', 'page');
    return { ok: true };
  } catch (err) {
    console.error('saveCertification error:', err);
    return { error: 'Không lưu được — mã chứng nhận có thể đã tồn tại.' };
  }
}

export async function deleteCertification(id: string): Promise<ActionResult> {
  const user = await requirePermission('pages.update');
  try {
    await db.certification.delete({ where: { id } });
    await recordAudit({
      userId: user.id,
      action: 'delete',
      entityType: 'certification',
      entityId: id,
    });
    revalidatePath('/admin/certifications');
    revalidatePath('/[locale]/about', 'page');
    return { ok: true };
  } catch (err) {
    console.error('deleteCertification error:', err);
    return { error: 'Không xoá được chứng nhận.' };
  }
}
