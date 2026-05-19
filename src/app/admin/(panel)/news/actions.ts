'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/auth-helpers';
import { recordAudit } from '@/lib/audit';

const schema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  categoryId: z.string().optional(),
  authorId: z.string().optional(),
  titleVi: z.string().min(1),
  titleEn: z.string().optional(),
  titleZh: z.string().optional(),
  excerptVi: z.string().optional(),
  excerptEn: z.string().optional(),
  excerptZh: z.string().optional(),
  contentVi: z.string().optional(),
  contentEn: z.string().optional(),
  contentZh: z.string().optional(),
  coverImageUrl: z.string().optional(),
  readTimeMin: z.coerce.number().int().min(1).default(3),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  isFeatured: z.boolean().default(false),
  /** ISO yyyy-mm-dd string from the date input. */
  publishedDate: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metaTitleVi: z.string().optional(),
  metaDescVi: z.string().optional(),
  /** Image gallery attached to the article. The item flagged `featured: true`
   *  becomes the cover (saved as `coverImageUrl` for fast list rendering). */
  gallery: z
    .array(
      z.object({
        src: z.string().min(1),
        alt: z.string().default(''),
        featured: z.boolean().default(false),
      }),
    )
    .optional(),
});

export type ArticleInput = z.input<typeof schema>;
export type ActionResult = { ok?: boolean; error?: string };

export async function saveArticle(raw: ArticleInput): Promise<ActionResult> {
  const user = await requirePermission('news.update');
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' };
  }
  const d = parsed.data;

  try {
    // Prefer the explicit date from the form; fall back to "now" the first
    // time a post is flipped to "published" without one supplied.
    const explicitDate = d.publishedDate ? new Date(d.publishedDate) : null;
    const publishedAt =
      explicitDate && !Number.isNaN(explicitDate.getTime())
        ? explicitDate
        : d.status === 'published'
          ? new Date()
          : null;

    // Sync cover: when a gallery tile is flagged featured, use its src as the
    // article cover so the list view + social card stay consistent.
    const gallery = d.gallery ?? [];
    const featuredTile = gallery.find((g) => g.featured) ?? gallery[0];
    const coverImageUrl = d.coverImageUrl || featuredTile?.src || null;

    const data = {
      categoryId: d.categoryId || null,
      authorId: d.authorId || null,
      titleVi: d.titleVi,
      titleEn: d.titleEn || null,
      titleZh: d.titleZh || null,
      excerptVi: d.excerptVi || null,
      excerptEn: d.excerptEn || null,
      excerptZh: d.excerptZh || null,
      contentVi: d.contentVi || null,
      contentEn: d.contentEn || null,
      contentZh: d.contentZh || null,
      coverImageUrl,
      readTimeMin: d.readTimeMin,
      status: d.status,
      isFeatured: d.isFeatured,
      publishedAt,
      tags: (d.tags ?? []) as unknown as Prisma.InputJsonValue,
      gallery: gallery as unknown as Prisma.InputJsonValue,
      metaTitleVi: d.metaTitleVi || null,
      metaDescVi: d.metaDescVi || null,
    };

    const article = await db.article.upsert({
      where: { slug: d.slug },
      update: data,
      create: { slug: d.slug, ...data },
    });

    await recordAudit({
      userId: user.id,
      action: d.id ? 'update' : 'create',
      entityType: 'article',
      entityId: article.id,
    });

    revalidatePath('/admin/news');
    revalidatePath('/[locale]/news', 'page');
    revalidatePath(`/[locale]/news/${d.slug}`, 'page');
    return { ok: true };
  } catch (err) {
    console.error('saveArticle error:', err);
    return { error: 'Không lưu được — slug có thể đã tồn tại.' };
  }
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  const user = await requirePermission('news.delete');
  try {
    // Fetch the slug before deleting so we can revalidate the detail page too.
    const existing = await db.article.findUnique({
      where: { id },
      select: { slug: true },
    });
    await db.article.delete({ where: { id } });
    await recordAudit({ userId: user.id, action: 'delete', entityType: 'article', entityId: id });
    revalidatePath('/admin/news');
    revalidatePath('/[locale]/news', 'page');
    if (existing) revalidatePath(`/[locale]/news/${existing.slug}`, 'page');
    return { ok: true };
  } catch (err) {
    console.error('deleteArticle error:', err);
    return { error: 'Không xoá được bài viết.' };
  }
}
