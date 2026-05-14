import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Icon, type IconName } from '@/components/ui/Icon';
import { PageHeader } from '@/components/public/PageHeader';

const TIMELINE: Record<Locale, [string, string, string][]> = {
  vi: [
    ['2008', 'Khởi nguồn', 'Thành lập tại Quỳ Hợp, Nghệ An — bắt đầu từ một mỏ đá vôi trắng.'],
    ['2013', 'Nhà máy đầu', 'Lắp đặt dây chuyền nghiền khô đầu tiên, công suất 80,000 tấn/năm.'],
    ['2017', 'Phủ Stearic', 'Đưa vào vận hành dây chuyền phủ Stearic Acid theo công nghệ EU.'],
    ['2020', 'ISO 9001', 'Đạt chứng nhận ISO 9001:2015. Mở rộng xuất khẩu sang Hàn Quốc, Nhật Bản.'],
    ['2024', 'Mở rộng', 'Khánh thành xưởng đá Slab 1.6×2.4m. Tổng công suất đạt 350,000 tấn/năm.'],
  ],
  en: [
    ['2008', 'Founded', 'Founded in Quy Hop, Nghe An — starting from a single white limestone quarry.'],
    ['2013', 'First plant', 'Installed our first dry-grinding line at 80,000 tons/year capacity.'],
    ['2017', 'Coating line', 'Commissioned a stearic-acid coating line built to European specs.'],
    ['2020', 'ISO 9001', 'Certified ISO 9001:2015. Began exports to Korea and Japan.'],
    ['2024', 'Expansion', 'Opened our 1.6×2.4m Slab workshop. Total capacity reached 350,000 t/y.'],
  ],
  zh: [
    ['2008', '创立', '在义安省归合县创立 — 从一个白石灰岩矿场起步。'],
    ['2013', '首个工厂', '安装首条干法研磨生产线,年产能8万吨。'],
    ['2017', '涂层生产线', '投产符合欧洲标准的硬脂酸涂层生产线。'],
    ['2020', 'ISO 9001', '获得ISO 9001:2015认证。开始向韩国、日本出口。'],
    ['2024', '扩张', '开设1.6×2.4米大板工坊。总产能达到35万吨/年。'],
  ],
};

const VALUES: Record<Locale, [IconName, string, string][]> = {
  vi: [
    ['drop', 'Chất lượng nguyên sinh', 'Mỏ riêng tại Quỳ Hợp với độ trắng > 98% và CaCO₃ > 98.5% — kiểm soát từ gốc.'],
    ['spark', 'Công nghệ chính xác', 'Dây chuyền nghiền và phủ Stearic Acid theo công nghệ Châu Âu, kiểm tra từng lô.'],
    ['ship', 'Cam kết giao hàng', 'Cảng Cửa Lò & Hải Phòng — đóng gói linh hoạt, lịch giao đúng hẹn.'],
  ],
  en: [
    ['drop', 'Pure raw material', 'Owned quarry in Quy Hop · whiteness >98%, CaCO₃ >98.5% — controlled at the source.'],
    ['spark', 'Precision technology', 'EU-spec grinding and stearic-acid coating lines · per-batch QC.'],
    ['ship', 'On-time delivery', 'Cua Lo & Hai Phong ports · flexible packaging, schedules we keep.'],
  ],
  zh: [
    ['drop', '纯原料', '归合自有矿场 · 白度>98%、碳酸钙>98.5% — 从源头控制。'],
    ['spark', '精密技术', '欧洲标准研磨和硬脂酸涂层生产线 · 每批次QC。'],
    ['ship', '准时交付', '窗碧港和海防港 · 灵活包装,按期履约。'],
  ],
};

const CAPS: Record<Locale, [string, string][]> = {
  vi: [
    ['Mỏ đá vận hành', '05 mỏ'],
    ['Công suất hàng năm', '350,000 tấn'],
    ['Dây chuyền nghiền khô', '06 dây chuyền'],
    ['Dây chuyền phủ Stearic', '02 dây chuyền'],
    ['Đóng gói', '25kg · Jumbo 1T · Bulk'],
    ['Cảng xuất hàng', 'Cửa Lò · Hải Phòng'],
  ],
  en: [
    ['Quarries operated', '05 sites'],
    ['Annual capacity', '350,000 tons'],
    ['Dry-grinding lines', '06 lines'],
    ['Stearic coating lines', '02 lines'],
    ['Packaging', '25kg · 1T jumbo · Bulk'],
    ['Export ports', 'Cua Lo · Hai Phong'],
  ],
  zh: [
    ['运营矿场', '5个矿场'],
    ['年产能', '35万吨'],
    ['干法研磨生产线', '6条'],
    ['硬脂酸涂层生产线', '2条'],
    ['包装', '25公斤 · 1吨吨袋 · 散装'],
    ['出口港', '窗碧港 · 海防港'],
  ],
};

const CERTS = [
  {
    key: 'iso',
    img: '/assets/cert-iso-9001.svg',
    name: 'ISO 9001:2015',
    issuer: { vi: 'BSI · 2020', en: 'BSI · 2020', zh: 'BSI · 2020' },
    desc: { vi: 'Hệ thống quản lý chất lượng', en: 'Quality Management System', zh: '质量管理体系' },
  },
  {
    key: 'reach',
    img: '/assets/cert-reach.svg',
    name: 'REACH',
    issuer: { vi: 'EU · 2021', en: 'EU · 2021', zh: '欧盟 · 2021' },
    desc: { vi: 'Tuân thủ hóa chất Châu Âu', en: 'EU Chemical Compliance', zh: '欧盟化学品合规' },
  },
  {
    key: 'sgs',
    img: '/assets/cert-sgs.svg',
    name: 'SGS',
    issuer: { vi: 'Báo cáo · 2024', en: 'Inspection · 2024', zh: '检测报告 · 2024' },
    desc: {
      vi: 'Kiểm định độc lập độ trắng & cỡ hạt',
      en: 'Independent test for whiteness & particle size',
      zh: '独立白度和粒径检测',
    },
  },
  {
    key: 'msds',
    img: '/assets/cert-msds.svg',
    name: 'MSDS',
    issuer: { vi: 'GHS / OSHA', en: 'GHS / OSHA', zh: 'GHS / OSHA' },
    desc: {
      vi: 'Phiếu an toàn hóa chất sản phẩm',
      en: 'Material safety data sheet',
      zh: '材料安全数据表',
    },
  },
];

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const loc = locale as Locale;
  const C = COPY[loc];

  return (
    <div className="ab">
      <PageHeader
        eyebrow={C.aboutEy}
        title={
          loc === 'zh'
            ? '源自义安省的原始矿物石材'
            : loc === 'en'
              ? 'Pure mineral stone from Nghe An'
              : 'Khoáng đá nguyên sinh từ Nghệ An'
        }
        sub={
          loc === 'zh'
            ? '20多年的开采与加工 — 我们通过准时交付的每一个集装箱建立每一份合作关系。'
            : loc === 'en'
              ? '20+ years of mining and milling — we build each partnership through containers delivered on time.'
              : 'Hơn 20 năm khai thác và chế biến — chúng tôi xây dựng từng mối quan hệ qua từng container giao đúng hẹn.'
        }
        breadcrumb={[
          { label: loc === 'zh' ? '首页' : loc === 'en' ? 'Home' : 'Trang chủ', href: `/${loc}` },
          { label: C.nav[1] },
        ]}
      />

      {/* INTRO */}
      <section className="ab-section ab-intro-wrap">
        <div className="ab-intro-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/nha-may-bot-sieu-min-1.webp" alt="" />
        </div>
        <div className="va-wrap">
          <div className="ab-intro">
            <div className="ab-intro-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/da-nguyen-lieu-cao-cap.webp" alt="Long Anh quarry" />
            </div>
            <div>
              <div className="ab-eyebrow">
                {loc === 'zh' ? '我们的故事' : loc === 'en' ? 'Our story' : 'Câu chuyện'}
              </div>
              <h2>
                {loc === 'zh' ? (
                  <>
                    可持续开采。
                    <br />
                    精准加工。
                  </>
                ) : loc === 'en' ? (
                  <>
                    Sustainably mined.
                    <br />
                    Precisely milled.
                  </>
                ) : (
                  <>
                    Khai thác bền vững.
                    <br />
                    Chế biến chính xác.
                  </>
                )}
              </h2>
              <p>{C.aboutP1}</p>
              <p>{C.aboutP2}</p>
              <p>
                {loc === 'zh'
                  ? '我们将每一吨石粉视为一份承诺 — 对品质、对期限、对与合作伙伴的长期关系。'
                  : loc === 'en'
                    ? 'Every ton of stone is a promise — to quality, to deadlines, and to a long-term partnership.'
                    : 'Chúng tôi xem mỗi tấn bột đá là một cam kết — về chất lượng, thời hạn và mối quan hệ lâu dài với đối tác.'}
              </p>
              <div className="ab-sig">
                <div className="ab-sig-img" />
                <div>
                  <b>Nguyễn Long Anh</b>
                  <span>
                    {loc === 'zh'
                      ? '董事长 · 创始人'
                      : loc === 'en'
                        ? 'Founder · Chairman'
                        : 'Chủ tịch · Sáng lập'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="ab-time">
        <div className="va-wrap">
          <div className="ab-time-head">
            <div className="ab-eyebrow">
              {loc === 'zh' ? '历程' : loc === 'en' ? 'Journey' : 'Hành trình'}
            </div>
            <h2>
              {loc === 'zh'
                ? '20年 — 一脉相承'
                : loc === 'en'
                  ? '20 years — one continuous vein'
                  : '20 năm — một mạch đá'}
            </h2>
          </div>
          <div className="ab-time-grid">
            {TIMELINE[loc].map(([y, h, p], i) => (
              <div key={i} className="ab-tnode">
                <div className="ab-tdot" />
                <b>{y}</b>
                <h4>{h}</h4>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="ab-section">
        <div className="va-wrap">
          <div
            style={{ textAlign: 'center', marginBottom: 48, maxWidth: 680, marginInline: 'auto' }}
          >
            <div className="ab-eyebrow">
              {loc === 'zh' ? '核心价值' : loc === 'en' ? 'Core values' : 'Giá trị cốt lõi'}
            </div>
            <h2 style={{ fontSize: 'clamp(30px,3.6vw,44px)' }}>
              {loc === 'zh'
                ? '我们绝不妥协的三件事'
                : loc === 'en'
                  ? 'Three things we never compromise'
                  : 'Ba điều chúng tôi không bao giờ thỏa hiệp'}
            </h2>
          </div>
          <div className="ab-vals">
            {VALUES[loc].map(([icon, h, p], i) => (
              <div key={i} className="ab-val">
                <div className="ab-val-i">
                  <Icon name={icon} size={24} />
                </div>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITIES — Năng lực sản xuất */}
      <section className="ab-section" style={{ background: 'var(--va-bg-alt)' }}>
        <div className="va-wrap">
          <div className="ab-caps">
            <div className="ab-caps-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/nha-may-bot-sieu-min-3.webp" alt="Long Anh plant" />
            </div>
            <div>
              <div className="ab-eyebrow">
                {loc === 'zh'
                  ? '生产能力'
                  : loc === 'en'
                    ? 'Production capability'
                    : 'Năng lực sản xuất'}
              </div>
              <h2>
                {loc === 'zh'
                  ? '工厂基础设施。用数字衡量。'
                  : loc === 'en'
                    ? 'Plant infrastructure. Measured in numbers.'
                    : 'Hệ thống nhà máy. Đo bằng con số.'}
              </h2>
              <p>
                {loc === 'zh'
                  ? '龙英的工厂设计为稳定生产、大产能、按B2B订单灵活调整。'
                  : loc === 'en'
                    ? "Long Anh's plants are built for stable output, high capacity, and B2B-flexible production."
                    : 'Hệ thống nhà máy của Long Anh được thiết kế để sản xuất ổn định, công suất lớn và linh hoạt theo từng đơn hàng B2B.'}
              </p>
              <div className="ab-caps-list">
                {CAPS[loc].map(([h, v], i) => (
                  <div key={i} className="ab-cap-row">
                    <div className="ab-cap-n">— 0{i + 1}</div>
                    <h4>{h}</h4>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WAREHOUSE — Kho bãi & Logistics */}
      <section className="ab-section">
        <div className="va-wrap">
          <div className="ab-shead-row">
            <div>
              <div className="ab-eyebrow">
                {loc === 'zh'
                  ? '仓库与物流'
                  : loc === 'en'
                    ? 'Warehouse & Logistics'
                    : 'Kho bãi & Logistics'}
              </div>
              <h2 style={{ fontSize: 'clamp(28px,3.4vw,42px)', marginBottom: 0 }}>
                {loc === 'zh'
                  ? '准时发货 — 按规格交付。'
                  : loc === 'en'
                    ? 'Ready to ship — on time, to spec.'
                    : 'Sẵn sàng giao hàng — đúng hẹn, đúng quy cách.'}
              </h2>
            </div>
            <p style={{ fontSize: 15, opacity: 0.7, lineHeight: 1.65, maxWidth: 480 }}>
              {loc === 'zh'
                ? '归合的宽敞仓库 — 灵活包装,国内和出口准时交付。'
                : loc === 'en'
                  ? 'Spacious warehouses at Quy Hop — flexible packaging, on-time delivery for both domestic and export.'
                  : 'Hệ thống kho rộng tại Quỳ Hợp — đóng gói linh hoạt, lịch giao đúng hẹn cho cả nội địa và xuất khẩu.'}
            </p>
          </div>
          <div className="ab-warehouse-grid">
            <div className="ab-wh-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/kho-hang.webp" alt="Kho hàng Long Anh" />
            </div>
            <div className="ab-wh-col">
              <div className="ab-wh-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/kho-hang-2.webp" alt="Kho hàng" />
              </div>
              <div className="ab-wh-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/kho-da-nguyen-lieu.webp" alt="Kho đá nguyên liệu" />
              </div>
            </div>
            <div className="ab-wh-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/kho-hang-xuat-khau.webp" alt="Kho hàng xuất khẩu" />
            </div>
          </div>
        </div>
      </section>

      {/* CERTS — Chứng nhận */}
      <section className="ab-certs">
        <div className="va-wrap">
          <div className="ab-certs-head">
            <div>
              <div className="ab-eyebrow">
                {loc === 'zh' ? '认证' : loc === 'en' ? 'Certifications' : 'Chứng nhận'}
              </div>
              <h2>
                {loc === 'zh'
                  ? '达到国际标准'
                  : loc === 'en'
                    ? 'Built to international standards'
                    : 'Đạt chuẩn quốc tế'}
              </h2>
            </div>
            <p>
              {loc === 'zh'
                ? '每批产品均提供COA和MSDS,满足韩国、日本、印度和中东市场最严苛的要求。'
                : loc === 'en'
                  ? 'Every batch ships with COA and MSDS, meeting the toughest requirements from Korea, Japan, India and the Middle East.'
                  : 'Tất cả lô sản phẩm đều được kiểm tra COA, MSDS và đáp ứng yêu cầu khắt khe nhất từ thị trường Hàn Quốc, Nhật Bản, Ấn Độ và Trung Đông.'}
            </p>
          </div>
          <div className="ab-certs-grid">
            {CERTS.map((c) => (
              <div key={c.key} className="ab-cert-card">
                <div className="ab-cert-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt={c.name} />
                </div>
                <div className="ab-cert-body">
                  <div className="ab-cert-meta">{c.issuer[loc]}</div>
                  <h3>{c.name}</h3>
                  <p>{c.desc[loc]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="va-wrap">
        <div className="ab-cta">
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '.16em',
                textTransform: 'uppercase',
                color: '#F08023',
                marginBottom: 14,
              }}
            >
              {loc === 'zh'
                ? '与龙英合作'
                : loc === 'en'
                  ? 'Partner with Long Anh'
                  : 'Đối tác cùng Long Anh'}
            </div>
            <h2>
              {loc === 'zh'
                ? '从一个问题开始。'
                : loc === 'en'
                  ? 'Start with a single question.'
                  : 'Hãy bắt đầu từ một câu hỏi.'}
            </h2>
            <p>
              {loc === 'zh'
                ? '销售团队在24个工作小时内回复 — 提供规格、COA和FOB报价。'
                : loc === 'en'
                  ? 'Sales replies within 24 business hours — with spec, COA and FOB pricing.'
                  : 'Đội ngũ kinh doanh phản hồi trong 24h làm việc — kèm spec, COA và báo giá FOB.'}
            </p>
          </div>
          <div className="ab-cta-btns">
            <Link className="ab-btn ab-btn-p" href={`/${loc}/products`}>
              {loc === 'zh' ? '浏览产品' : loc === 'en' ? 'Browse products' : 'Xem sản phẩm'} →
            </Link>
            <Link className="ab-btn ab-btn-g" href={`/${loc}/contact`}>
              {loc === 'zh' ? '立即联系' : loc === 'en' ? 'Contact us' : 'Liên hệ ngay'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
