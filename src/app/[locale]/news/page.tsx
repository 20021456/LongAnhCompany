import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Icon } from '@/components/ui/Icon';

const ARTICLES = [
  {
    slug: 'long-anh-mo-rong-xuong-da-slab-1-6m',
    cat: ['Sự kiện', 'Event', '活动'],
    title: [
      'Long Anh mở rộng xưởng đá Slab 1.6m — công suất đạt 350,000 t/y',
      'Long Anh expands 1.6m Slab workshop — capacity now 350,000 t/y',
      '龙英扩建1.6米大板工坊 — 产能达35万吨/年',
    ],
    date: '2026-04-15',
    excerpt: [
      'Bước ngoặt sản lượng mới giúp Long Anh đáp ứng thị trường Hàn Quốc và Trung Đông.',
      'A new capacity milestone helps Long Anh serve Korea and Middle East markets.',
      '新产能里程碑帮助龙英服务韩国和中东市场。',
    ],
    image: '/assets/nha-may-bot-sieu-min.webp',
  },
  {
    slug: 'xuat-khau-bot-caco3-sang-an-do',
    cat: ['Xuất khẩu', 'Export', '出口'],
    title: [
      'Xuất khẩu bột CaCO₃ phủ Stearic sang Ấn Độ — lô 5000 tấn đầu tiên',
      'First 5000-ton shipment of coated CaCO₃ to India',
      '首批5000吨涂层碳酸钙出口印度',
    ],
    date: '2026-03-22',
    excerpt: [
      'Hợp đồng dài hạn 12 tháng với đối tác masterbatch lớn nhất Nam Á.',
      'A 12-month contract with the largest masterbatch producer in South Asia.',
      '与南亚最大母粒制造商签订12个月长期合同。',
    ],
    image: '/assets/bot-sieu-min.webp',
  },
  {
    slug: 'iso-9001-tai-chung-nhan-2026',
    cat: ['Chất lượng', 'Quality', '质量'],
    title: [
      'Long Anh tái chứng nhận ISO 9001:2015 — chu kỳ 2026–2029',
      'Long Anh recertified ISO 9001:2015 — 2026-2029 cycle',
      '龙英再次获得ISO 9001:2015认证',
    ],
    date: '2026-02-08',
    excerpt: [
      'Audit thông qua không có findings — đánh dấu chu kỳ chứng nhận thứ 3.',
      'Audit passed without findings — marking the 3rd certification cycle.',
      '审核无发现 — 标志着第三个认证周期。',
    ],
    image: '/assets/kiem-dinh.jpg',
  },
];

export default function NewsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const loc = locale as Locale;
  const C = COPY[loc];
  const li = loc === 'vi' ? 0 : loc === 'en' ? 1 : 2;

  return (
    <>
      <section className="va-hero" style={{ background: 'var(--va-bg-alt)' }}>
        <div className="va-wrap" style={{ padding: '90px 0', textAlign: 'center', maxWidth: 920, margin: '0 auto' }}>
          <div className="va-eyebrow">{C.nav[4]}</div>
          <h1 style={{ fontSize: 'clamp(36px,4.4vw,58px)', margin: '16px 0 22px' }}>
            {loc === 'vi'
              ? 'Tin tức & Sự kiện'
              : loc === 'en'
                ? 'News & Events'
                : '新闻与活动'}
          </h1>
          <p className="va-hero-sub" style={{ margin: '0 auto', maxWidth: 680 }}>
            {loc === 'vi'
              ? 'Cập nhật những bước phát triển mới nhất của Long Anh và thị trường khoáng sản.'
              : loc === 'en'
                ? "Stay current with Long Anh's milestones and the minerals market."
                : '了解龙英的最新里程碑和矿产市场。'}
          </p>
        </div>
      </section>

      <section className="va-section">
        <div className="va-wrap">
          <div className="va-products">
            {ARTICLES.map((a) => (
              <Link
                key={a.slug}
                href={`/${loc}/news/${a.slug}`}
                className="va-pcard"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.image}
                    alt={a.title[li]}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div className="la-cc-badge">{a.cat[li]}</div>
                </div>
                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: 11.5, opacity: 0.6, marginBottom: 8 }}>
                    {new Date(a.date).toLocaleDateString(loc)}
                  </div>
                  <h3 style={{ fontSize: 18, lineHeight: 1.3, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 10px' }}>
                    {a.title[li]}
                  </h3>
                  <p style={{ fontSize: 13.5, lineHeight: 1.55, opacity: 0.72, flex: 1 }}>
                    {a.excerpt[li]}
                  </p>
                  <div
                    style={{
                      marginTop: 16,
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: 'var(--brand-accent,#F08023)',
                      display: 'inline-flex',
                      gap: 6,
                      alignItems: 'center',
                    }}
                  >
                    {loc === 'vi' ? 'Đọc tiếp' : loc === 'en' ? 'Read more' : '阅读更多'}{' '}
                    <Icon name="arrow" size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
