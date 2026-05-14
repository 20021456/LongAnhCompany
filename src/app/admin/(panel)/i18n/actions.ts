'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/auth-helpers';
import { recordAudit } from '@/lib/audit';

export type ActionResult = { ok?: boolean; error?: string };

const langSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  flagEmoji: z.string().optional(),
  isActive: z.boolean(),
  isDefault: z.boolean(),
  sortOrder: z.coerce.number().int(),
});

/** Update the language list (name / flag / active / default / order). */
export async function saveLanguages(rows: z.input<typeof langSchema>[]): Promise<ActionResult> {
  const user = await requirePermission('i18n.update');
  const parsed = z.array(langSchema).safeParse(rows);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' };
  }
  const data = parsed.data;
  if (!data.some((l) => l.isDefault)) {
    return { error: 'Phải có một ngôn ngữ mặc định.' };
  }

  try {
    await db.$transaction(
      data.map((l) =>
        db.language.update({
          where: { code: l.code },
          data: {
            name: l.name,
            flagEmoji: l.flagEmoji || null,
            isActive: l.isActive,
            isDefault: l.isDefault,
            sortOrder: l.sortOrder,
          },
        }),
      ),
    );
    await recordAudit({ userId: user.id, action: 'update', entityType: 'language' });
    revalidatePath('/admin/i18n');
    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (err) {
    console.error('saveLanguages error:', err);
    return { error: 'Không lưu được danh sách ngôn ngữ.' };
  }
}

const stringRowSchema = z.object({
  fullKey: z.string().min(1), // e.g. "nav.home"
  namespace: z.string().min(1), // e.g. "nav"
  vi: z.string(),
  en: z.string(),
  zh: z.string(),
});

/**
 * Save translation overrides. Each row carries the value for all three
 * locales; an empty value removes the override for that locale so the
 * base `messages/*.json` string takes over again.
 */
export async function saveTranslations(
  rows: z.input<typeof stringRowSchema>[],
): Promise<ActionResult> {
  const user = await requirePermission('i18n.update');
  const parsed = z.array(stringRowSchema).safeParse(rows);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' };
  }
  const data = parsed.data;

  try {
    const ops = [];
    for (const r of data) {
      for (const locale of ['vi', 'en', 'zh'] as const) {
        const value = r[locale].trim();
        if (value) {
          ops.push(
            db.translation.upsert({
              where: { key_locale: { key: r.fullKey, locale } },
              update: { value, namespace: r.namespace },
              create: { key: r.fullKey, locale, value, namespace: r.namespace },
            }),
          );
        } else {
          ops.push(db.translation.deleteMany({ where: { key: r.fullKey, locale } }));
        }
      }
    }
    await db.$transaction(ops);
    await recordAudit({ userId: user.id, action: 'update', entityType: 'translation' });
    revalidatePath('/admin/i18n');
    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (err) {
    console.error('saveTranslations error:', err);
    return { error: 'Không lưu được bản dịch.' };
  }
}
