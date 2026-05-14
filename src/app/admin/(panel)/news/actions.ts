'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/auth-helpers';
import { recordAudit } from '@/lib/audit';

const schema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  categoryId: z.string().optional(),
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
    const data = {
      categoryId: d.categoryId || null,
      titleVi: d.titleVi,
      titleEn: d.titleEn || null,
      titleZh: d.titleZh || null,
      excerptVi: d.excerptVi || null,
      excerptEn: d.excerptEn || null,
      excerptZh: d.excerptZh || null,
      contentVi: d.contentVi || null,
      contentEn: d.contentEn || null,
      contentZh: d.contentZh || null,
      coverImageUrl: d.coverImageUrl || null,
      readTimeMin: d.readTimeMin,
      status: d.status,
      isFeatured: d.isFeatured,
      publishedAt: d.status === 'published' ? new Date() : null,
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
    return { ok: true };
  } catch (err) {
    console.error('saveArticle error:', err);
    return { error: 'Không lưu được — slug có thể đã tồn tại.' };
  }
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  const user = await requirePermission('news.delete');
  try {
    await db.article.delete({ where: { id } });
    await recordAudit({ userId: user.id, action: 'delete', entityType: 'article', entityId: id });
    revalidatePath('/admin/news');
    revalidatePath('/[locale]/news', 'page');
    return { ok: true };
  } catch (err) {
    console.error('deleteArticle error:', err);
    return { error: 'Không xoá được bài viết.' };
  }
}
