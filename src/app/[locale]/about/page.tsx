import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { ContactForm } from '@/components/public/ContactForm';
import { Icon } from '@/components/ui/Icon';

const TIMELINE = [
  {
    year: 2008,
    vi: ['Khởi nguồn', 'Thành lập tại Quỳ Hợp, Nghệ An — bắt đầu từ một mỏ đá vôi trắng.'],
    en: ['Founded', 'Founded in Quy Hop, Nghe An — starting from a single white limestone quarry.'],
    zh: ['创立', '在义安省归合县创立 — 从一个白石灰岩矿场起步。'],
  },
  {
    year: 2013,
    vi: ['Nhà máy đầu', 'Lắp đặt dây chuyền nghiền khô đầu tiên, công suất 80,000 tấn/năm.'],
    en: ['First plant', 'Installed our first dry-grinding line at 80,000 t/y.'],
    zh: ['首座工厂', '安装首条干法研磨生产线,年产能8万吨。'],
  },
  {
    year: 2017,
    vi: ['Phủ Stearic', 'Đưa vào vận hành dây chuyền phủ Stearic Acid theo công nghệ EU.'],
    en: ['Stearic coating', 'Commissioned a stearic-acid coating line built to European specs.'],
    zh: ['硬脂酸涂层', '投产符合欧洲标准的硬脂酸涂层生产线。'],
  },
  {
    year: 2020,
    vi: ['ISO 9001', 'Đạt chứng nhận ISO 9001:2015. Mở rộng xuất khẩu sang Hàn Quốc, Nhật Bản.'],
    en: ['ISO 9001', 'Certified ISO 9001:2015. Began exports to Korea and Japan.'],
    zh: ['ISO 9001', '获得ISO 9001:2015认证。开始向韩国、日本出口。'],
  },
  {
    year: 2024,
    vi: ['Mở rộng', 'Khánh thành xưởng đá Slab 1.6×2.4m. Tổng công suất 350,000 t/y.'],
    en: ['Expansion', 'Opened 1.6×2.4m Slab workshop. Total capacity reached 350,000 t/y.'],
    zh: ['扩建', '开设1.6×2.4米大板工坊。总产能达到35万吨/年。'],
  },
];

const VALUES = [
  {
    vi: ['Chất lượng nguyên sinh', 'Mỏ riêng tại Quỳ Hợp với độ trắng > 98% và CaCO₃ > 98.5% — kiểm soát từ gốc.'],
    en: ['Source-grade quality', 'Owned quarry in Quy Hop · whiteness >98%, CaCO₃ >98.5% — controlled at the source.'],
    zh: ['原产质量', '归合自有矿场 · 白度>98%、碳酸钙>98.5% — 从源头控制。'],
  },
  {
    vi: ['Công nghệ chính xác', 'Dây chuyền nghiền và phủ Stearic Acid theo công nghệ Châu Âu, kiểm tra từng lô.'],
    en: ['Precise technology', 'EU-spec grinding and stearic-acid coating lines · per-batch QC.'],
    zh: ['精准技术', '欧洲标准研磨和硬脂酸涂层生产线 · 每批次QC。'],
  },
  {
    vi: ['Cam kết giao hàng', 'Cảng Cửa Lò & Hải Phòng — đóng gói linh hoạt, lịch giao đúng hẹn.'],
    en: ['Delivery commitment', 'Cua Lo & Hai Phong ports · flexible packaging, schedules we keep.'],
    zh: ['交付承诺', '窗碧港和海防港 · 灵活包装,按期履约。'],
  },
];

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const loc = locale as Locale;
  const C = COPY[loc];
  const li = loc === 'vi' ? 'vi' : loc === 'en' ? 'en' : 'zh';

  return (
    <>
      <section className="va-hero" style={{ background: 'var(--va-bg-alt)' }}>
        <div className="va-wrap" style={{ padding: '90px 0', textAlign: 'center', maxWidth: 920, margin: '0 auto' }}>
          <div className="va-eyebrow">{C.nav[1]}</div>
          <h1 style={{ fontSize: 'clamp(36px,4.4vw,58px)', margin: '16px 0 22px' }}>
            {loc === 'vi'
              ? 'Khoáng đá nguyên sinh từ Nghệ An'
              : loc === 'en'
                ? 'Pure mineral stone from Nghe An'
                : '源自义安省的原始矿物石材'}
          </h1>
          <p className="va-hero-sub" style={{ margin: '0 auto', maxWidth: 680 }}>
            {loc === 'vi'
              ? 'Hơn 20 năm khai thác và chế biến — chúng tôi xây dựng từng mối quan hệ qua từng container giao đúng hẹn.'
              : loc === 'en'
                ? '20+ years of mining and milling — we build each partnership through containers delivered on time.'
                : '20多年的开采与加工 — 我们通过准时交付的每一个集装箱建立每一份合作关系。'}
          </p>
        </div>
      </section>

      {/* Story / intro */}
      <section className="va-section">
        <div className="va-wrap">
          <div className="va-shead">
            <div>
              <div className="va-eyebrow">
                {loc === 'vi' ? 'Câu chuyện' : loc === 'en' ? 'Our story' : '我们的故事'}
              </div>
              <h2>{C.aboutH}</h2>
            </div>
            <p>{C.aboutP1}</p>
          </div>
          <p style={{ maxWidth: 780, fontSize: 16, lineHeight: 1.7, opacity: 0.78 }}>
            {C.aboutP2}
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="va-section tight" style={{ background: 'var(--va-bg-alt)' }}>
        <div className="va-wrap">
          <div className="va-shead center" style={{ marginBottom: 40 }}>
            <div>
              <div className="va-eyebrow">
                {loc === 'vi' ? 'Lịch sử' : loc === 'en' ? 'Our journey' : '历程'}
              </div>
              <h2>
                {loc === 'vi'
                  ? '20 năm — một mạch đá'
                  : loc === 'en'
                    ? '20 years — one continuous vein'
                    : '20年 — 一脉相承'}
              </h2>
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 20,
            }}
            className="ab-timeline-grid"
          >
            {TIMELINE.map((t) => (
              <div
                key={t.year}
                style={{
                  background: 'var(--va-card)',
                  border: '1px solid var(--va-line)',
                  borderRadius: 14,
                  padding: '28px 22px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--va-display,"Inter")',
                    fontSize: 30,
                    fontWeight: 700,
                    color: 'var(--brand-accent,#F08023)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                  }}
                >
                  {t.year}
                </div>
                <h3 style={{ marginTop: 12, fontSize: 16 }}>{t[li][0]}</h3>
                <p style={{ marginTop: 8, fontSize: 13.5, lineHeight: 1.55, opacity: 0.7 }}>
                  {t[li][1]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="va-section">
        <div className="va-wrap">
          <div className="va-shead">
            <div>
              <div className="va-eyebrow">
                {loc === 'vi' ? 'Giá trị cốt lõi' : loc === 'en' ? 'Core values' : '核心价值'}
              </div>
              <h2>
                {loc === 'vi'
                  ? 'Ba điều chúng tôi không bao giờ thỏa hiệp'
                  : loc === 'en'
                    ? 'Three things we never compromise'
                    : '我们绝不妥协的三件事'}
              </h2>
            </div>
            <p>
              {loc === 'vi'
                ? 'Mỗi tấn đá là một cam kết — về chất lượng, thời hạn và mối quan hệ lâu dài.'
                : loc === 'en'
                  ? 'Every ton of stone is a promise — to quality, to deadlines, to long-term partnership.'
                  : '每一吨石粉都是承诺 — 对品质、对期限、对长期合作。'}
            </p>
          </div>
          <div className="va-apps">
            {VALUES.map((v, i) => (
              <div key={i} className="va-app">
                <div className="va-app-i">
                  <Icon name={(['drop', 'spark', 'ship'] as const)[i]} size={28} />
                </div>
                <h4>{v[li][0]}</h4>
                <p>{v[li][1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="va-wrap">
        <div className="va-contact">
          <div>
            <div className="va-eyebrow">{C.contactEy}</div>
            <h2>{C.contactH}</h2>
            <p style={{ opacity: 0.7, fontSize: 15, lineHeight: 1.65 }}>{C.contactP}</p>
          </div>
          <ContactForm locale={loc} source="contact_page" />
        </div>
      </section>
    </>
  );
}
