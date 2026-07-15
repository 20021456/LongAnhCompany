import Link from 'next/link';
import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead, AdminEmpty } from '@/components/admin/AdminPageHead';
import { AdminIcon } from '@/components/admin/AdminIcon';
import { ProductsBrowser, type ProductRow } from '@/components/admin/ProductsBrowser';
import { deleteProduct } from './actions';

export default async function AdminProductsPage() {
  await requirePermission('products.read');

  const [products, categories] = await Promise.all([
    db.product.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { category: true, _count: { select: { variants: true } } },
    }),
    db.productCategory.findMany({ orderBy: { nameVi: 'asc' } }),
  ]);

  const rows: ProductRow[] = products.map((p) => ({
    id: p.id,
    code: p.code,
    slug: p.slug,
    nameVi: p.nameVi,
    summaryVi: p.summaryVi ?? '',
    categoryId: p.categoryId,
    categoryName: p.category.nameVi,
    coverImageUrl: p.coverImageUrl,
    isActive: p.isActive,
    isFeatured: p.isFeatured,
    variantCount: p._count.variants,
    updatedAt: p.updatedAt.toISOString(),
  }));

  const activeCount = rows.filter((r) => r.isActive).length;

  return (
    <>
      <AdminPageHead
        crumbs={[{ label: 'Sản phẩm' }]}
        title="Sản phẩm"
        sub={`${rows.length} sản phẩm · ${activeCount} đang hiển thị · ${rows.length - activeCount} đã ẩn`}
        actions={
          <Link href="/admin/products/new" className="lac-btn primary">
            <AdminIcon name="plus" size={15} /> Thêm sản phẩm
          </Link>
        }
      />

      {rows.length === 0 ? (
        <AdminEmpty>
          Chưa có sản phẩm nào.{' '}
          <Link href="/admin/products/new" style={{ color: 'var(--ad-primary)', fontWeight: 600 }}>
            Tạo sản phẩm đầu tiên
          </Link>
        </AdminEmpty>
      ) : (
        <ProductsBrowser rows={rows} categories={categories} deleteAction={deleteProduct} />
      )}
    </>
  );
}
