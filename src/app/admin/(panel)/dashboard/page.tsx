import Link from 'next/link';
import { requireAuth } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminIcon, type AdminIconName } from '@/components/admin/AdminIcon';
import { ViewsChart } from '@/components/admin/ViewsChart';

const WEEKDAYS_VI = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

function formatDateVi(d = new Date()) {
  const wd = WEEKDAYS_VI[d.getDay()];
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${wd}, ${dd}/${mm}/${d.getFullYear()}`;
}

function initials(name: string | null | undefined, email: string) {
  const src = (name ?? email).trim();
  if (!src) return '?';
  const parts = src.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

/** Single stat tile — matches prototype `.dash-stat`. */
function StatCard({
  icon,
  iconBg,
  iconColor,
  label,
  num,
  delta,
  deltaType = 'up',
}: {
  icon: AdminIconName;
  iconBg: string;
  iconColor: string;
  label: string;
  num: string | number;
  delta?: string;
  deltaType?: 'up' | 'flat';
}) {
  return (
    <div className="dash-stat">
      <div className="dash-stat-head">
        <span>{label}</span>
        <div className="dash-stat-icon" style={{ background: iconBg, color: iconColor }}>
          <AdminIcon name={icon} size={17} />
        </div>
      </div>
      <div className="dash-stat-num">
        {typeof num === 'number' ? num.toLocaleString('vi-VN') : num}
      </div>
      {delta ? (
        <span className={'dash-stat-delta ' + deltaType}>
          <AdminIcon name="trend" size={11} /> {delta}
        </span>
      ) : null}
    </div>
  );
}

export default async function DashboardPage() {
  const user = await requireAuth();

  // Headline counts (parallel)
  const [
    productCount,
    articleCount,
    newLeads,
    newApplications,
    openChats,
    recentArticles,
    recentLeads,
  ] = await Promise.all([
    db.product.count({ where: { isActive: true } }),
    db.article.count({ where: { status: 'published' } }),
    db.contact.count({ where: { status: 'new' } }),
    db.jobApplication.count({ where: { status: 'new' } }),
    db.chatSession.count({ where: { status: 'open' } }),
    db.article.findMany({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
      take: 4,
      select: {
        id: true,
        slug: true,
        titleVi: true,
        coverImageUrl: true,
        publishedAt: true,
        createdAt: true,
      },
    }),
    db.contact.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        source: true,
        createdAt: true,
      },
    }),
  ]);

  // Aggregated views over the last 30 days — placeholder until analytics wired
  const views30d = 12_450;
  const viewsDelta = '+18% MoM';

  const userName = user.name ?? user.email.split('@')[0];

  /* ─── Activity timeline (mix of real signals + system events) ─── */
  type Act = { time: string; av: string; sys?: boolean; who: string; body: React.ReactNode };
  const acts: Act[] = [];
  if (recentLeads[0]) {
    const t = recentLeads[0];
    acts.push({
      time: t.createdAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      av: '⚙',
      sys: true,
      who: 'Hệ thống',
      body: (
        <>
          có 1 liên hệ mới từ <Link href={`/admin/contacts/${t.id}`}>{t.fullName}</Link>
          {t.source ? ` · ${t.source}` : ''}
        </>
      ),
    });
  }
  if (recentArticles[0]) {
    const a = recentArticles[0];
    acts.push({
      time: (a.publishedAt ?? a.createdAt).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      av: initials(user.name, user.email),
      who: userName,
      body: (
        <>
          xuất bản bài viết <Link href={`/admin/news/${a.slug}`}>{a.titleVi}</Link>
        </>
      ),
    });
  }
  acts.push({
    time: '04:00',
    av: '⚙',
    sys: true,
    who: 'Hệ thống',
    body: <>tự động backup database · 04:00 sáng nay</>,
  });
  if (newApplications > 0) {
    acts.push({
      time: '—',
      av: '⚙',
      sys: true,
      who: 'Hệ thống',
      body: (
        <>
          có <b>{newApplications}</b> đơn ứng tuyển chờ xử lý ·{' '}
          <Link href="/admin/jobs">xem danh sách</Link>
        </>
      ),
    });
  }
  if (openChats > 0) {
    acts.push({
      time: '—',
      av: '⚙',
      sys: true,
      who: 'Hệ thống',
      body: (
        <>
          có <b>{openChats}</b> phiên chat đang mở ·{' '}
          <Link href="/admin/livechat">vào live chat</Link>
        </>
      ),
    });
  }

  return (
    <>
      <div className="ad-crumb">
        <span className="cur">Dashboard</span>
      </div>

      <div className="ad-phead">
        <div>
          <h1>
            Chào {userName} <span style={{ fontSize: 22 }}>👋</span>
          </h1>
          <p>Hôm nay là {formatDateVi()} — đây là tổng quan tuần này.</p>
        </div>
      </div>

      {/* 4 stat cards (prototype tones) */}
      <div className="dash-stats">
        <StatCard
          icon="rock"
          iconBg="#E8F0FB"
          iconColor="#0F3D7A"
          label="Sản phẩm"
          num={productCount}
          delta="cập nhật theo DB"
          deltaType="flat"
        />
        <StatCard
          icon="news"
          iconBg="#FFF1E5"
          iconColor="#F08023"
          label="Tin tức"
          num={articleCount}
          delta="cập nhật theo DB"
          deltaType="flat"
        />
        <StatCard
          icon="eye"
          iconBg="#DCFCE7"
          iconColor="#15803D"
          label="Lượt xem (30 ngày)"
          num={views30d}
          delta={viewsDelta}
          deltaType="up"
        />
        <StatCard
          icon="mail"
          iconBg="#FEE2E2"
          iconColor="#DC2626"
          label="Liên hệ chưa đọc"
          num={newLeads}
          delta={newLeads > 0 ? 'cần phản hồi' : 'đã xử lý hết'}
          deltaType="flat"
        />
      </div>

      {/* 2-column row — chart + recent news */}
      <div className="dash-2col">
        <div className="ad-card">
          <div className="ad-card-head">
            <div>
              <h3>Lượt xem website</h3>
              <p>30 ngày gần nhất · so với kỳ trước {viewsDelta}</p>
            </div>
            <select className="ad-select" style={{ width: 130, height: 30 }} defaultValue="30">
              <option value="30">30 ngày</option>
              <option value="7">7 ngày</option>
              <option value="90">90 ngày</option>
            </select>
          </div>
          <div className="dash-chart">
            <ViewsChart />
          </div>
        </div>

        <div className="ad-card">
          <div className="ad-card-head">
            <h3>Tin tức mới đăng</h3>
            <Link href="/admin/news" className="ad-btn ghost sm">
              Xem tất cả <AdminIcon name="chevron" size={13} />
            </Link>
          </div>
          {recentArticles.length === 0 ? (
            <div className="ad-card-body">
              <div className="ad-empty">Chưa có bài viết nào.</div>
            </div>
          ) : (
            <div>
              {recentArticles.map((a) => (
                <Link key={a.id} href={`/admin/news/${a.slug}`} className="dash-news-item">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.coverImageUrl ?? '/images/news/sample-iso.jpg'} alt={a.titleVi} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="title">{a.titleVi}</div>
                    <div className="meta">
                      {(a.publishedAt ?? a.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions (4 link cards) */}
      <h3 className="dash-quick-heading">Hành động nhanh</h3>
      <div className="dash-quick">
        <Link href="/admin/pages/home">
          <span
            className="ico"
            style={{ background: 'var(--ad-primary-soft)', color: 'var(--ad-primary)' }}
          >
            <AdminIcon name="edit" size={16} />
          </span>
          Sửa trang chủ
        </Link>
        <Link href="/admin/products/new">
          <span
            className="ico"
            style={{ background: 'var(--ad-accent-soft)', color: 'var(--ad-accent)' }}
          >
            <AdminIcon name="plus" size={16} />
          </span>
          Thêm sản phẩm
        </Link>
        <Link href="/admin/news/new">
          <span className="ico" style={{ background: '#DCFCE7', color: '#15803D' }}>
            <AdminIcon name="news" size={16} />
          </span>
          Viết tin tức
        </Link>
        <Link href="/admin/media">
          <span className="ico" style={{ background: '#DBEAFE', color: '#2563EB' }}>
            <AdminIcon name="upload" size={16} />
          </span>
          Upload ảnh
        </Link>
      </div>

      {/* Activity timeline */}
      <div className="ad-card">
        <div className="ad-card-head">
          <h3>Hoạt động gần đây</h3>
          <Link href="/admin/contacts" className="ad-btn ghost sm">
            Xem liên hệ <AdminIcon name="chevron" size={13} />
          </Link>
        </div>
        {acts.length === 0 ? (
          <div className="ad-card-body">
            <div className="ad-empty">Chưa có hoạt động nào.</div>
          </div>
        ) : (
          <div>
            {acts.map((a, i) => (
              <div key={i} className="dash-act">
                <div className="dash-act-time">{a.time}</div>
                <div className={'dash-act-av ' + (a.sys ? 'sys' : '')}>{a.av}</div>
                <div className="dash-act-body">
                  <b>{a.who}</b> {a.body}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
