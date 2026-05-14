import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { ProductForm, type ProductFormValue } from '@/components/admin/ProductForm';

const EMPTY: ProductFormValue = {
  code: '',
  slug: '',
  categoryId: '',
  nameVi: '',
  nameEn: '',
  nameZh: '',
  summaryVi: '',
  summaryEn: '',
  summaryZh: '',
  shortDescVi: '',
  shortDescEn: '',
  shortDescZh: '',
  longDescVi: '',
  longDescEn: '',
  longDescZh: '',
  unitVi: 'tấn',
  unitEn: 'ton',
  unitZh: '吨',
  moq: '',
  moqEn: '',
  moqZh: '',
  productionTime: '',
  productionTimeEn: '',
  productionTimeZh: '',
  coverImageUrl: '',
  gallery: [],
  isFeatured: false,
  isActive: true,
  sortOrder: 0,
  variants: [],
};

export default async function ProductEditPage({ params }: { params: { code: string } }) {
  await requirePermission('products.update');

  const categoryRows = await db.productCategory.findMany({ orderBy: { sortOrder: 'asc' } });
  const categories = categoryRows.map((c) => ({ id: c.id, name: c.nameVi }));

  const isNew = params.code === 'new';
  let initial = EMPTY;

  if (!isNew) {
    const p = await db.product.findUnique({
      where: { code: params.code.toUpperCase() },
      include: { variants: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!p) notFound();
    initial = {
      id: p.id,
      code: p.code,
      slug: p.slug,
      categoryId: p.categoryId,
      nameVi: p.nameVi,
      nameEn: p.nameEn ?? '',
      nameZh: p.nameZh ?? '',
      summaryVi: p.summaryVi ?? '',
      summaryEn: p.summaryEn ?? '',
      summaryZh: p.summaryZh ?? '',
      shortDescVi: p.shortDescVi ?? '',
      shortDescEn: p.shortDescEn ?? '',
      shortDescZh: p.shortDescZh ?? '',
      longDescVi: p.longDescVi ?? '',
      longDescEn: p.longDescEn ?? '',
      longDescZh: p.longDescZh ?? '',
      unitVi: p.unitVi ?? '',
      unitEn: p.unitEn ?? '',
      unitZh: p.unitZh ?? '',
      moq: p.moq ?? '',
      moqEn: p.moqEn ?? '',
      moqZh: p.moqZh ?? '',
      productionTime: p.productionTime ?? '',
      productionTimeEn: p.productionTimeEn ?? '',
      productionTimeZh: p.productionTimeZh ?? '',
      coverImageUrl: p.coverImageUrl ?? '',
      gallery: (p.gallery as unknown as string[] | null) ?? [],
      isFeatured: p.isFeatured,
      isActive: p.isActive,
      sortOrder: p.sortOrder,
      variants: p.variants.map((v) => ({
        variantCode: v.variantCode,
        label: v.labelVi,
        price: v.price ? Number(v.price) : 0,
        unit: v.unit,
        stock: v.stock,
        isPopular: v.isPopular,
      })),
    };
  }

  return <ProductForm initial={initial} categories={categories} isNew={isNew} />;
}
