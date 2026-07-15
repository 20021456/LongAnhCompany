import Link from 'next/link';
import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead, AdminEmpty } from '@/components/admin/AdminPageHead';
import { AdminIcon } from '@/components/admin/AdminIcon';
import { AdminNewsList, type AdminNewsRow } from '@/components/admin/AdminNewsList';
import { fmtNumberVn } from '@/lib/format';

/** Pull author initials from a User. Falls back to email if no name. */
function initials(name: string | null, email: string | null): string {
  const src = (name && name.trim()) || (email && email.split('@')[0]) || '';
  if (!src) return '';
  const parts = src.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[parts.length - 1][0] ?? '')).toUpperCase();
}

export default async function AdminNewsPage() {
  await requirePermission('news.read');

  const articles = await db.article.findMany({
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    include: { category: true, author: true },
  });

  const rows: AdminNewsRow[] = articles.map((a) => ({
    id: a.id,
    slug: a.slug,
    titleVi: a.titleVi,
    cat: a.category?.slug ?? 'business',
    catLabel: a.category?.nameVi ?? '—',
    author: a.author ? initials(a.author.fullName, a.author.email) : '',
    publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
    views: a.views,
    comments: a.commentCount,
    status: a.status,
    isFeatured: a.isFeatured,
    coverImageUrl: a.coverImageUrl ?? '',
  }));

  const totalViews = rows.reduce((s, r) => s + r.views, 0);
  const numCats = new Set(rows.map((r) => r.cat)).size;

  return (
    <>
      <AdminPageHead
        crumbs={[{ label: 'Tin tức' }]}
        title="Tin tức"
        sub={`${rows.length} bài viết · ${fmtNumberVn(totalViews)} lượt xem tổng · ${numCats} danh mục`}
        actions={
          <>
            <button type="button" className="lac-btn" disabled title="Phase 7">
              <AdminIcon name="download" size={14} /> Xuất CSV
            </button>
            <Link href="/admin/news/new" className="lac-btn primary">
              <AdminIcon name="plus" size={14} /> Bài viết mới
            </Link>
          </>
        }
      />

      {rows.length === 0 ? (
        <AdminEmpty>
          Chưa có bài viết nào.{' '}
          <Link href="/admin/news/new" style={{ color: 'var(--ad-primary)', fontWeight: 600 }}>
            Viết bài đầu tiên
          </Link>
        </AdminEmpty>
      ) : (
        <AdminNewsList rows={rows} />
      )}
    </>
  );
}
