import Link from 'next/link';
import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead } from '@/components/admin/AdminPageHead';
import { AdminIcon } from '@/components/admin/AdminIcon';
import { KNOWN_PAGES } from './known';

export default async function AdminPagesPage() {
  await requirePermission('pages.read');

  const pages = await db.page.findMany();
  const byKey = new Map(pages.map((p) => [p.key, p]));

  return (
    <>
      <AdminPageHead
        crumbs={[{ label: 'Trang' }]}
        title="Quản lý Trang"
        sub="Tiêu đề, thẻ meta SEO và trạng thái xuất bản cho từng trang chính"
      />
      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr>
              <th>Trang</th>
              <th>Đường dẫn</th>
              <th>Tiêu đề SEO</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {KNOWN_PAGES.map((kp) => {
              const row = byKey.get(kp.key);
              const published = row ? row.isPublished : true;
              return (
                <tr key={kp.key}>
                  <td style={{ fontWeight: 600 }}>{kp.label}</td>
                  <td style={{ color: 'var(--ad-text-mute)' }}>{kp.path}</td>
                  <td>{row?.metaTitleVi ?? row?.titleVi ?? '— mặc định —'}</td>
                  <td>
                    <span className={'ad-badge ' + (published ? 'pub' : 'hide')}>
                      <span className="dot" />
                      {published ? 'đã xuất bản' : 'ẩn'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Link href={`/admin/pages/${kp.key}`} className="ad-btn sm">
                        <AdminIcon name="file" size={13} /> Sửa
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--ad-text-mute)', marginTop: 14 }}>
        Nội dung từng section (hero, thống kê, dòng thời gian…) vẫn lấy từ dữ liệu COPY + DB; trang
        này quản lý phần tiêu đề và SEO của mỗi trang.
      </p>
    </>
  );
}
