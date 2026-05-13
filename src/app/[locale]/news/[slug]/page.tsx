import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Icon } from '@/components/ui/Icon';

export default function ArticlePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(params.locale);
  const loc = params.locale as Locale;
  const C = COPY[loc];

  return (
    <>
      <section style={{ background: 'var(--va-bg-alt)', borderBottom: '1px solid var(--va-line)' }}>
        <div className="va-wrap" style={{ padding: '14px 0' }}>
          <nav style={{ fontSize: 12.5, opacity: 0.7, display: 'flex', gap: 6, alignItems: 'center' }}>
            <Link href={`/${loc}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              {C.nav[0]}
            </Link>
            <Icon name="chevron" size={12} />
            <Link href={`/${loc}/news`} style={{ color: 'inherit', textDecoration: 'none' }}>
              {C.nav[4]}
            </Link>
          </nav>
        </div>
      </section>

      <article className="va-section">
        <div className="va-wrap" style={{ maxWidth: 820, margin: '0 auto' }}>
          <div className="va-eyebrow">
            {loc === 'vi' ? 'Sự kiện' : loc === 'en' ? 'Event' : '活动'} · 15/04/2026 · 4 min
          </div>
          <h1
            style={{
              fontSize: 'clamp(28px,3.4vw,46px)',
              lineHeight: 1.1,
              margin: '14px 0 28px',
              letterSpacing: '-0.02em',
            }}
          >
            {params.slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </h1>

          <div
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              aspectRatio: '16 / 9',
              marginBottom: 32,
              background: 'var(--va-bg-alt)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/nha-may-bot-sieu-min.webp"
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ fontSize: 16, lineHeight: 1.75, opacity: 0.85 }}>
            <p>
              {loc === 'vi'
                ? 'Việc đưa xưởng đá Slab 1.6m vào vận hành nâng tổng công suất nhóm nhà máy lên 350,000 tấn/năm — đáp ứng các đơn hàng container cỡ lớn từ thị trường Hàn Quốc, Nhật Bản và Trung Đông.'
                : 'Commissioning the 1.6m Slab workshop raises group capacity to 350,000 t/y — enabling large container orders from Korea, Japan and the Middle East.'}
            </p>
            <h2 style={{ marginTop: 32, fontSize: 24 }}>
              {loc === 'vi' ? 'Bước ngoặt sản lượng' : 'Capacity milestone'}
            </h2>
            <p>
              {loc === 'vi'
                ? 'Đầu tư mới giúp tăng tỉ lệ tự động hóa và giảm thời gian giao hàng FOB còn dưới 14 ngày kể từ khi nhận đơn.'
                : 'New investment increases automation and cuts FOB lead time to under 14 days from order.'}
            </p>
            <h2 style={{ marginTop: 24, fontSize: 24 }}>
              {loc === 'vi' ? 'Kế hoạch xuất khẩu 2026' : 'Export plan 2026'}
            </h2>
            <ul style={{ paddingLeft: 22 }}>
              <li>{loc === 'vi' ? 'Tăng 35% sản lượng xuất sang Ấn Độ và Bangladesh' : '+35% volume to India and Bangladesh'}</li>
              <li>{loc === 'vi' ? 'Triển khai dây chuyền đóng gói jumbo bag 1 tấn cho thị trường EU' : '1-ton jumbo bag packaging line for EU markets'}</li>
              <li>{loc === 'vi' ? 'Mở rộng kho FOB tại cảng Cửa Lò 4500 m²' : 'Expand FOB warehouse at Cua Lo port to 4,500 m²'}</li>
            </ul>
          </div>
        </div>
      </article>
    </>
  );
}
