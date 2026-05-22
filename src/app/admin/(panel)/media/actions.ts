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
  folderId: z.string().optional(),
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
        folderId: d.folderId || null,
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
  caption: z.string().optional(),
  tags: z.array(z.string()).optional(),
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
        caption: d.caption || null,
        tags: d.tags ?? [],
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

export interface MediaUsage {
  type: 'article' | 'product' | 'page';
  label: string;
  /** Admin edit URL for the entity using this image. */
  href: string;
}

/**
 * Find where an image URL is used across the site content. Scans articles
 * (cover / gallery / body HTML), products (cover / gallery) and page
 * sections. The dataset is small, so a stringify + substring scan is
 * simpler and more reliable than per-column JSON queries.
 */
export async function findMediaUsage(url: string): Promise<MediaUsage[]> {
  await requirePermission('media.read');
  const needle = url.trim();
  if (!needle) return [];

  const [articles, products, pages] = await Promise.all([
    db.article.findMany({
      select: {
        slug: true,
        titleVi: true,
        coverImageUrl: true,
        gallery: true,
        contentVi: true,
        contentEn: true,
        contentZh: true,
      },
    }),
    db.product.findMany({
      select: { code: true, nameVi: true, coverImageUrl: true, gallery: true },
    }),
    db.page.findMany({
      select: { key: true, titleVi: true, sections: { select: { content: true } } },
    }),
  ]);

  const out: MediaUsage[] = [];
  for (const a of articles) {
    if (JSON.stringify(a).includes(needle)) {
      out.push({ type: 'article', label: a.titleVi, href: `/admin/news/${a.slug}` });
    }
  }
  for (const p of products) {
    if (JSON.stringify(p).includes(needle)) {
      out.push({ type: 'product', label: p.nameVi, href: `/admin/products/${p.code}` });
    }
  }
  for (const pg of pages) {
    if (JSON.stringify(pg.sections).includes(needle)) {
      out.push({ type: 'page', label: pg.titleVi ?? pg.key, href: `/admin/pages/${pg.key}` });
    }
  }
  return out;
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
