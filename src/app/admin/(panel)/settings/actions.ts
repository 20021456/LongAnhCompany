'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/auth-helpers';
import { recordAudit } from '@/lib/audit';

export type ActionResult = { ok?: boolean; error?: string };

/**
 * Bulk-update settings. `values` maps setting key → { vi, en, zh }.
 * Only keys that already exist are updated.
 */
export async function saveSettings(
  values: Record<string, { vi: string; en: string; zh: string }>,
): Promise<ActionResult> {
  const user = await requirePermission('settings.update');
  try {
    await db.$transaction(
      Object.entries(values).map(([key, v]) =>
        db.setting.update({
          where: { key },
          data: { valueVi: v.vi, valueEn: v.en, valueZh: v.zh },
        }),
      ),
    );
    await recordAudit({ userId: user.id, action: 'update', entityType: 'settings' });
    revalidatePath('/admin/settings');
    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (err) {
    console.error('saveSettings error:', err);
    return { error: 'Không lưu được cài đặt.' };
  }
}
