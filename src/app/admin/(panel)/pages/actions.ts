'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/auth-helpers';
import { recordAudit } from '@/lib/audit';
import { KNOWN_PAGES } from './known';

const schema = z.object({
  key: z.string().min(1),
  titleVi: z.string().min(1, 'Tiêu đề (VI) không được để trống'),
  titleEn: z.string().optional(),
  titleZh: z.string().optional(),
  metaTitleVi: z.string().optional(),
  metaTitleEn: z.string().optional(),
  metaTitleZh: z.string().optional(),
  metaDescVi: z.string().optional(),
  metaDescEn: z.string().optional(),
  metaDescZh: z.string().optional(),
  ogImageUrl: z.string().optional(),
  isPublished: z.boolean().default(true),
});

export type PageInput = z.input<typeof schema>;
export type ActionResult = { ok?: boolean; error?: string };

export async function savePage(raw: PageInput): Promise<ActionResult> {
  const user = await requirePermission('pages.update');
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' };
  }
  const d = parsed.data;
  if (!KNOWN_PAGES.some((p) => p.key === d.key)) {
    return { error: 'Trang không hợp lệ.' };
  }

  try {
    const data = {
      titleVi: d.titleVi,
      titleEn: d.titleEn || null,
      titleZh: d.titleZh || null,
      metaTitleVi: d.metaTitleVi || null,
      metaTitleEn: d.metaTitleEn || null,
      metaTitleZh: d.metaTitleZh || null,
      metaDescVi: d.metaDescVi || null,
      metaDescEn: d.metaDescEn || null,
      metaDescZh: d.metaDescZh || null,
      ogImageUrl: d.ogImageUrl || null,
      isPublished: d.isPublished,
      publishedAt: d.isPublished ? new Date() : null,
      updatedById: user.id,
    };

    await db.page.upsert({
      where: { key: d.key },
      update: data,
      create: { key: d.key, ...data },
    });

    await recordAudit({
      userId: user.id,
      action: 'update',
      entityType: 'page',
      entityId: d.key,
    });

    revalidatePath('/admin/pages');
    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (err) {
    console.error('savePage error:', err);
    return { error: 'Không lưu được trang.' };
  }
}
