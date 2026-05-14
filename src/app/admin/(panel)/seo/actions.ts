'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/auth-helpers';
import { recordAudit } from '@/lib/audit';

export type ActionResult = { ok?: boolean; error?: string };

/**
 * Upsert the site-wide default SEO settings. Each key lives in the
 * `settings` table under group `seo`; localized keys use vi/en/zh,
 * technical keys store their single value in `valueVi`.
 */
export async function saveSeoSettings(
  values: Record<string, { vi: string; en: string; zh: string }>,
): Promise<ActionResult> {
  const user = await requirePermission('seo.update');
  try {
    await db.$transaction(
      Object.entries(values).map(([key, v]) =>
        db.setting.upsert({
          where: { key },
          update: { valueVi: v.vi, valueEn: v.en, valueZh: v.zh },
          create: {
            key,
            valueVi: v.vi,
            valueEn: v.en,
            valueZh: v.zh,
            group: 'seo',
          },
        }),
      ),
    );
    await recordAudit({ userId: user.id, action: 'update', entityType: 'seo' });
    revalidatePath('/admin/seo');
    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (err) {
    console.error('saveSeoSettings error:', err);
    return { error: 'Không lưu được cài đặt SEO.' };
  }
}
