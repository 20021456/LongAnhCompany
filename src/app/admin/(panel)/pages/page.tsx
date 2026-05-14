import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead } from '@/components/admin/AdminPageHead';
import { PagesTable, type PageRow } from '@/components/admin/PagesTable';
import { KNOWN_PAGES } from './known';

export default async function AdminPagesPage() {
  await requirePermission('pages.read');

  const pages = await db.page.findMany();
  const byKey = new Map(pages.map((p) => [p.key, p]));

  const rows: PageRow[] = KNOWN_PAGES.map((kp) => {
    const row = byKey.get(kp.key);
    return {
      key: kp.key,
      label: kp.label,
      path: kp.path,
      isPublished: row ? row.isPublished : true,
      metaTitle: row?.metaTitleVi ?? row?.titleVi ?? '',
      updatedAt: row?.updatedAt ? row.updatedAt.toISOString() : null,
    };
  });

  const pubCount = rows.filter((r) => r.isPublished).length;

  return (
    <>
      <AdminPageHead
        crumbs={[{ label: 'Trang' }]}
        title="Quản lý Trang"
        sub={`${rows.length} trang · ${pubCount} đã xuất bản · ${rows.length - pubCount} đã ẩn`}
      />
      <PagesTable rows={rows} />
      <p style={{ fontSize: 12.5, color: 'var(--ad-text-mute)', marginTop: 14 }}>
        Nội dung từng section (hero, thống kê, dòng thời gian…) vẫn lấy từ dữ liệu COPY + DB; trang
        này quản lý phần tiêu đề và SEO của mỗi trang.
      </p>
    </>
  );
}
