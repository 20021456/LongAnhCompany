import Link from 'next/link';
import { requireAuth } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminIcon, type AdminIconName } from '@/components/admin/AdminIcon';

export default async function DashboardPage() {
  const user = await requireAuth();

  // Headline counts
  const [products, jobs, articles, newLeads, openApplications, newChats] =
    await Promise.all([
      db.product.count({ where: { isActive: true } }),
      db.job.count({ where: { isActive: true } }),
      db.article.count({ where: { status: 'published' } }),
      db.contact.count({ where: { status: 'new' } }),
      db.jobApplication.count({ where: { status: 'new' } }),
      db.chatSession.count({ where: { status: 'open' } }),
    ]);

  // Recent leads
  const recentLeads = await db.contact.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  const stats: { icon: AdminIconName; value: number; label: string; href: string }[] = [
    { icon: 'rock', value: products, label: 'Sản phẩm đang bán', href: '/admin/products' },
    { icon: 'users', value: jobs, label: 'Vị trí tuyển dụng', href: '/admin/jobs' },
    { icon: 'news', value: articles, label: 'Bài viết đã đăng', href: '/admin/news' },
    { icon: 'mail', value: newLeads, label: 'Liên hệ mới', href: '/admin/contacts' },
  ];

  return (
    <>
      <div className="ad-crumb">
        <span className="cur">Dashboard</span>
      </div>
      <div className="ad-phead">
        <div>
          <h1>Xin chào, {user.name ?? user.email}</h1>
          <p>Tổng quan hệ thống Long Anh — cập nhật theo thời gian thực.</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="ad-stats">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="ad-stat" style={{ display: 'block' }}>
            <div className="ad-stat-ico">
              <AdminIcon name={s.icon} size={18} />
            </div>
            <b>{s.value}</b>
            <span>{s.label}</span>
          </Link>
        ))}
      </div>

      {/* Secondary row */}
      <div className="ad-stats" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="ad-stat">
          <div className="ad-stat-ico">
            <AdminIcon name="users" size={18} />
          </div>
          <b>{openApplications}</b>
          <span>Đơn ứng tuyển chưa xử lý</span>
        </div>
        <div className="ad-stat">
          <div className="ad-stat-ico">
            <AdminIcon name="chat" size={18} />
          </div>
          <b>{newChats}</b>
          <span>Phiên chat đang mở</span>
        </div>
      </div>

      {/* Recent leads */}
      <div className="ad-card" style={{ marginTop: 8 }}>
        <div className="ad-card-head">
          <div>
            <h3>Liên hệ gần đây</h3>
            <p>6 lead mới nhất gửi qua form trên website</p>
          </div>
          <Link href="/admin/contacts" className="ad-btn sm">
            Xem tất cả
          </Link>
        </div>
        {recentLeads.length === 0 ? (
          <div className="ad-card-body">
            <div className="ad-empty">Chưa có liên hệ nào.</div>
          </div>
        ) : (
          <div className="ad-table-wrap" style={{ border: 0, borderRadius: 0 }}>
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Nguồn</th>
                  <th>Trạng thái</th>
                  <th>Ngày</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.fullName}</td>
                    <td>{c.email}</td>
                    <td>{c.source ?? '—'}</td>
                    <td>
                      <span className={'ad-badge ' + (c.status === 'new' ? 'draft' : 'pub')}>
                        <span className="dot" />
                        {c.status}
                      </span>
                    </td>
                    <td>{c.createdAt.toLocaleDateString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
