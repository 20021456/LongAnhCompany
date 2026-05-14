'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/auth-helpers';
import { recordAudit } from '@/lib/audit';
import { KNOWN_PAGES } from './known';

const heroLocaleSchema = z.object({
  eyebrow: z.string().default(''),
  titleLine1: z.string().default(''),
  titleLine2: z.string().default(''),
  sub: z.string().default(''),
  ctaPrimary: z.string().default(''),
  ctaSecondary: z.string().default(''),
});

const heroSchema = z.object({
  vi: heroLocaleSchema,
  en: heroLocaleSchema,
  zh: heroLocaleSchema,
});

export type HeroInput = z.input<typeof heroSchema>;

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
  hero: heroSchema.optional(),
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

    const page = await db.page.upsert({
      where: { key: d.key },
      update: data,
      create: { key: d.key, ...data },
    });

    if (d.hero) {
      await db.pageSection.upsert({
        where: { pageId_sectionKey: { pageId: page.id, sectionKey: 'hero' } },
        update: { content: d.hero, sectionType: 'hero', isVisible: true },
        create: {
          pageId: page.id,
          sectionKey: 'hero',
          sectionType: 'hero',
          content: d.hero,
          sortOrder: 0,
        },
      });
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
