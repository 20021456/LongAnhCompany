'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/auth-helpers';
import { recordAudit } from '@/lib/audit';

const variantSchema = z.object({
  variantCode: z.string().min(1),
  label: z.string().min(1),
  price: z.coerce.number().min(0),
  unit: z.string().min(1),
  stock: z.coerce.number().int().min(0),
  isPopular: z.boolean().default(false),
});

const productSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(2),
  slug: z.string().min(2),
  categoryId: z.string().min(1),
  nameVi: z.string().min(1),
  nameEn: z.string().optional(),
  nameZh: z.string().optional(),
  summaryVi: z.string().optional(),
  summaryEn: z.string().optional(),
  summaryZh: z.string().optional(),
  shortDescVi: z.string().optional(),
  shortDescEn: z.string().optional(),
  shortDescZh: z.string().optional(),
  longDescVi: z.string().optional(),
  longDescEn: z.string().optional(),
  longDescZh: z.string().optional(),
  unitVi: z.string().optional(),
  unitEn: z.string().optional(),
  unitZh: z.string().optional(),
  moq: z.string().optional(),
  moqEn: z.string().optional(),
  moqZh: z.string().optional(),
  productionTime: z.string().optional(),
  productionTimeEn: z.string().optional(),
  productionTimeZh: z.string().optional(),
  coverImageUrl: z.string().optional(),
  gallery: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  variants: z.array(variantSchema).default([]),
});

export type ProductInput = z.input<typeof productSchema>;
export type ActionResult = { ok?: boolean; error?: string; code?: string };

export async function saveProduct(raw: ProductInput): Promise<ActionResult> {
  const user = await requirePermission('products.update');

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' };
  }
  const d = parsed.data;

  try {
    const data = {
      slug: d.slug,
      categoryId: d.categoryId,
      nameVi: d.nameVi,
      nameEn: d.nameEn || null,
      nameZh: d.nameZh || null,
      summaryVi: d.summaryVi || null,
      summaryEn: d.summaryEn || null,
      summaryZh: d.summaryZh || null,
      shortDescVi: d.shortDescVi || null,
      shortDescEn: d.shortDescEn || null,
      shortDescZh: d.shortDescZh || null,
      longDescVi: d.longDescVi || null,
      longDescEn: d.longDescEn || null,
      longDescZh: d.longDescZh || null,
      unitVi: d.unitVi || null,
      unitEn: d.unitEn || null,
      unitZh: d.unitZh || null,
      moq: d.moq || null,
      moqEn: d.moqEn || null,
      moqZh: d.moqZh || null,
      productionTime: d.productionTime || null,
      productionTimeEn: d.productionTimeEn || null,
      productionTimeZh: d.productionTimeZh || null,
      coverImageUrl: d.coverImageUrl || (d.gallery[0] ?? null),
      gallery: d.gallery,
      isFeatured: d.isFeatured,
      isActive: d.isActive,
      sortOrder: d.sortOrder,
    };

    const product = await db.product.upsert({
      where: { code: d.code },
      update: data,
      create: { code: d.code, ...data },
    });

    // Replace variants
    await db.productVariant.deleteMany({ where: { productId: product.id } });
    if (d.variants.length > 0) {
      await db.productVariant.createMany({
        data: d.variants.map((v, i) => ({
          productId: product.id,
          variantCode: v.variantCode,
          labelVi: v.label,
          labelEn: v.label,
          labelZh: v.label,
          price: v.price,
          unit: v.unit,
          stock: v.stock,
          isPopular: v.isPopular,
          sortOrder: i,
        })),
      });
    }

    await recordAudit({
      userId: user.id,
      action: d.id ? 'update' : 'create',
      entityType: 'product',
      entityId: product.id,
    });

    revalidatePath('/admin/products');
    revalidatePath('/[locale]/products', 'page');
    revalidatePath(`/[locale]/products/${d.slug}`, 'page');
    return { ok: true, code: d.code };
  } catch (err) {
    console.error('saveProduct error:', err);
    return { error: 'Không lưu được — mã sản phẩm hoặc slug có thể đã tồn tại.' };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const user = await requirePermission('products.delete');
  try {
    const existing = await db.product.findUnique({ where: { id }, select: { slug: true } });
    await db.product.delete({ where: { id } });
    await recordAudit({ userId: user.id, action: 'delete', entityType: 'product', entityId: id });
    revalidatePath('/admin/products');
    revalidatePath('/[locale]/products', 'page');
    if (existing) revalidatePath(`/[locale]/products/${existing.slug}`, 'page');
    return { ok: true };
  } catch (err) {
    console.error('deleteProduct error:', err);
    return { error: 'Không xoá được sản phẩm.' };
  }
}
