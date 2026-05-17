'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/auth-helpers';
import { recordAudit } from '@/lib/audit';
import { HOME_SECTION_KEYS } from '@/lib/home-content';
import { ABOUT_SECTION_KEYS } from '@/lib/about-content';
import { PRODUCTS_PAGE_SECTION_KEYS } from '@/lib/products-page-content';
import { CAREERS_PAGE_SECTION_KEYS } from '@/lib/careers-page-content';
import { KNOWN_PAGES } from './known';

/**
 * `sections` is a map of sectionKey → per-locale content JSON
 * (`{ vi: {...}, en: {...}, zh: {...} }`). It is kept loosely typed here —
 * the shape is owned by `@/lib/home-content` and the editor form.
 */
const localeContentSchema = z.record(z.string(), z.unknown());
const sectionsSchema = z.record(
  z.string(),
  z.object({ vi: localeContentSchema, en: localeContentSchema, zh: localeContentSchema }),
);

export type SectionsInput = z.input<typeof sectionsSchema>;

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
  sections: sectionsSchema.optional(),
});

export type PageInput = z.input<typeof schema>;
export type ActionResult = { ok?: boolean; error?: string };

const VALID_SECTION_KEYS = new Set<string>([
  ...HOME_SECTION_KEYS,
  ...ABOUT_SECTION_KEYS,
  ...PRODUCTS_PAGE_SECTION_KEYS,
  ...CAREERS_PAGE_SECTION_KEYS,
]);

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

    const page = await db.page.upsert({
      where: { key: d.key },
      update: data,
      create: { key: d.key, ...data },
    });

    if (d.sections) {
      for (const [sectionKey, raw] of Object.entries(d.sections)) {
        if (!VALID_SECTION_KEYS.has(sectionKey)) continue;
        const content = raw as unknown as Prisma.InputJsonValue;
        await db.pageSection.upsert({
          where: { pageId_sectionKey: { pageId: page.id, sectionKey } },
          update: { content, isVisible: true },
          create: {
            pageId: page.id,
            sectionKey,
            sectionType: sectionKey,
            content,
            sortOrder: 0,
          },
        });
      }
    }

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
