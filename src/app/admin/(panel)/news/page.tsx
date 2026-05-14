import Link from 'next/link';
import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead, AdminEmpty, StatusBadge } from '@/components/admin/AdminPageHead';
import { AdminIcon } from '@/components/admin/AdminIcon';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteArticle } from './actions';

export default async function AdminNewsPage() {
  await requirePermission('news.read');

  const articles = await db.article.findMany({
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    include: { category: true },
  });

  return (
    <>
      <AdminPageHead
        crumbs={[{ label: 'Tin tức' }]}
        title="Tin tức"
        sub={`${articles.length} bài viết`}
        actions={
          <Link href="/admin/news/new" className="ad-btn primary">
            <AdminIcon name="plus" size={15} /> Viết bài mới
          </Link>
        }
      />

      {articles.length === 0 ? (
        <AdminEmpty>
          Chưa có bài viết nào.{' '}
          <Link href="/admin/news/new" style={{ color: 'var(--ad-primary)', fontWeight: 600 }}>
            Viết bài đầu tiên
          </Link>
        </AdminEmpty>
      ) : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Trạng thái</th>
                <th>Lượt xem</th>
                <th>Ngày đăng</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{a.titleVi}</div>
                    <div style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>/{a.slug}</div>
                  </td>
                  <td>{a.category?.nameVi ?? '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <StatusBadge status={a.status} />
                      {a.isFeatured ? (
                        <span className="ad-badge sched">
                          <span className="dot" />
                          nổi bật
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td>{a.views.toLocaleString('vi-VN')}</td>
                  <td>{a.publishedAt ? a.publishedAt.toLocaleDateString('vi-VN') : '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <Link href={`/admin/news/${a.slug}`} className="ad-btn sm">
                        <AdminIcon name="file" size={13} /> Sửa
                      </Link>
                      <DeleteButton id={a.id} action={deleteArticle} />
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
