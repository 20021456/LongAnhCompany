import Link from 'next/link';
import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead, AdminEmpty, StatusBadge } from '@/components/admin/AdminPageHead';
import { AdminIcon } from '@/components/admin/AdminIcon';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteProduct } from './actions';

export default async function AdminProductsPage() {
  await requirePermission('products.read');

  const products = await db.product.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { category: true, _count: { select: { variants: true } } },
  });

  return (
    <>
      <AdminPageHead
        crumbs={[{ label: 'Sản phẩm' }]}
        title="Sản phẩm"
        sub={`${products.length} sản phẩm trong catalogue`}
        actions={
          <Link href="/admin/products/new" className="ad-btn primary">
            <AdminIcon name="plus" size={15} /> Thêm sản phẩm
          </Link>
        }
      />

      {products.length === 0 ? (
        <AdminEmpty>
          Chưa có sản phẩm nào.{' '}
          <Link href="/admin/products/new" style={{ color: 'var(--ad-primary)', fontWeight: 600 }}>
            Tạo sản phẩm đầu tiên
          </Link>
        </AdminEmpty>
      ) : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Quy cách</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>{p.code}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.nameVi}</div>
                    <div style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>{p.summaryVi}</div>
                  </td>
                  <td>{p.category.nameVi}</td>
                  <td>{p._count.variants}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <StatusBadge status={p.isActive ? 'active' : 'hide'} />
                      {p.isFeatured ? (
                        <span className="ad-badge sched">
                          <span className="dot" />
                          nổi bật
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <Link href={`/admin/products/${p.code}`} className="ad-btn sm">
                        <AdminIcon name="file" size={13} /> Sửa
                      </Link>
                      <DeleteButton id={p.id} action={deleteProduct} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
