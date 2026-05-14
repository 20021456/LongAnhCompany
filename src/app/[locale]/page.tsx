import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Icon } from '@/components/ui/Icon';
import { ProductCarousel } from '@/components/public/ProductCarousel';
import { ExportMap } from '@/components/public/ExportMap';
import { ContactForm } from '@/components/public/ContactForm';
import { getProducts, getStats } from '@/lib/queries';

const ABOUT_TILES = [
  {
    key: 'capacity',
    img: '/assets/nha-may-bot-sieu-min-3.webp',
    titleVi: 'Năng lực sản xuất',
    titleEn: 'Production capacity',
    titleZh: '生产能力',
    bodyVi: '05 nhà máy với tổng diện tích 12ha, dây chuyền hiện đại — công suất đạt trên 350,000 tấn/năm.',
    bodyEn: '5 plants over 12ha of modern lines — capacity exceeding 350,000 tons/year.',
    bodyZh: '5座工厂占地12公顷,配备现代化生产线 — 年产能超过35万吨。',
  },
  {
    key: 'raw',
    img: '/assets/da-nguyen-lieu-cao-cap2.webp',
    titleVi: 'Nguồn nguyên liệu',
    titleEn: 'Raw material',
    titleZh: '原料来源',
    bodyVi: 'Đá vôi trắng nguyên sinh từ Quỳ Hợp – Nghệ An, độ trắng > 98% và CaCO₃ > 98.5% — kiểm soát từ gốc.',
    bodyEn: 'Pristine white limestone from Quy Hop · whiteness > 98%, CaCO₃ > 98.5% — controlled at the source.',
    bodyZh: '源自归合-义安省的原始白石灰岩 · 白度>98%,碳酸钙>98.5% — 从源头控制。',
  },
  {
    key: 'infra',
    img: '/assets/co-so-ha-tang.jpg',
    titleVi: 'Cơ sở hạ tầng',
    titleEn: 'Infrastructure',
    titleZh: '基础设施',
    bodyVi: 'Hệ thống dây chuyền nghiền và phủ Stearic Acid theo công nghệ Châu Âu, vận hành đồng bộ và ổn định.',
    bodyEn: 'EU-spec grinding and stearic-acid coating lines, running in stable synchronization.',
    bodyZh: '欧洲标准的研磨和硬脂酸涂层生产线,稳定同步运行。',
  },
  {
    key: 'qc',
    img: '/assets/kiem-dinh.jpg',
    titleVi: 'Kiểm định chất lượng',
    titleEn: 'Quality control',
    titleZh: '质量检验',
    bodyVi: 'Phòng QC kiểm tra từng lô — độ trắng, CaCO₃, độ ẩm, cỡ hạt — kèm COA và MSDS theo tiêu chuẩn ISO 9001:2015.',
    bodyEn: 'Per-batch QC — whiteness, CaCO₃, moisture, particle size — with COA and MSDS to ISO 9001:2015.',
    bodyZh: '每批次QC检测 — 白度、碳酸钙、水分、粒径 — 提供符合ISO 9001:2015的COA和MSDS。',
  },
  {
    key: 'pack',
    img: '/assets/bao-bi-sieu-trang.jpg',
    titleVi: 'Đóng gói sản phẩm',
    titleEn: 'Packaging',
    titleZh: '产品包装',
    bodyVi: 'Đáp ứng mọi quy cách: PP 25kg/50kg, jumbo 250kg/500kg/1000kg và bulk theo yêu cầu khách hàng.',
    bodyEn: 'Every spec covered: PP 25/50kg, jumbo 250/500/1000kg, and bulk to customer requirements.',
    bodyZh: '满足各种规格:PP 25/50公斤、吨袋250/500/1000公斤,以及按客户需求散装。',
  },
];

const CERT_TILES = [
  {
    key: 'iso',
    img: '/assets/cert-iso-9001.svg',
    name: 'ISO 9001:2015',
    issuerVi: 'BSI · 2020',
    issuerEn: 'BSI · 2020',
    issuerZh: 'BSI · 2020',
    descVi: 'Hệ thống quản lý chất lượng',
    descEn: 'Quality Management System',
    descZh: '质量管理体系',
  },
  {
    key: 'reach',
    img: '/assets/cert-reach.svg',
    name: 'REACH',
    issuerVi: 'EU · 2021',
    issuerEn: 'EU · 2021',
    issuerZh: '欧盟 · 2021',
    descVi: 'Tuân thủ hóa chất Châu Âu',
    descEn: 'EU Chemical Compliance',
    descZh: '欧盟化学品合规',
  },
  {
    key: 'sgs',
    img: '/assets/cert-sgs.svg',
    name: 'SGS',
    issuerVi: 'Báo cáo · 2024',
    issuerEn: 'Inspection · 2024',
    issuerZh: '检测报告 · 2024',
    descVi: 'Kiểm định độc lập độ trắng & cỡ hạt',
    descEn: 'Independent test for whiteness & particle size',
    descZh: '独立白度和粒径检测',
  },
  {
    key: 'msds',
    img: '/assets/cert-msds.svg',
    name: 'MSDS',
    issuerVi: 'GHS / OSHA',
    issuerEn: 'GHS / OSHA',
    issuerZh: 'GHS / OSHA',
    descVi: 'Phiếu an toàn hóa chất sản phẩm',
    descEn: 'Material safety data sheet',
    descZh: '材料安全数据表',
  },
];

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const loc = locale as Locale;
  const C = COPY[loc];

  // Phase 4: products carousel + stats strip come from the database
  const productMap = await getProducts();
  const carouselProducts = Object.values(productMap).map((p) => ({
    code: p.code,
    cat: p.cat,
    img: p.images[0] ?? '',
    name: p.name[loc],
    meta: p.meta[loc],
    desc: p.desc[loc],
    tags: p.tags[loc] ?? [],
  }));
  const stats = await getStats('home');
  const lang = loc;

  return (
    <>
      {/* HERO */}
      <section id="home" className="va-hero split">
        <div className="va-wrap va-hero-l">
          <div className="va-eyebrow va-hero-eb">{C.heroEy}</div>
          <h1>
            {C.heroH[0]}
            <br />
            <b style={{ color: 'var(--brand-accent, #F08023)' }}>{C.heroH[1]}</b>
          </h1>
          <p className="va-hero-sub">{C.heroSub}</p>
          <div className="va-hero-cta">
            <Link className="va-btn va-btn-p" href={`/${loc}/products`}>
              {C.ctaPrimary} <Icon name="arrow" size={15} />
            </Link>
            <Link className="va-btn va-btn-g" href={`/${loc}/contact`}>
              {C.ctaGhost}
            </Link>
          </div>
        </div>
        <div className="va-hero-r">
          <div className="va-hero-art" />
          <div className="va-hero-grid" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="va-hero-img" src="/assets/hero-sw.png" alt="Long Anh product" />
        </div>
      </section>

      {/* STATS */}
      <section className="va-stats">
        <div className="va-wrap">
          <div className="va-stats-in">
            {stats.map((s) => (
              <div key={s.key} className="va-stat">
                <b>{s.value}</b>
                <span>{s.label[loc]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="va-section" style={{ background: 'var(--va-bg-alt)' }}>
        <div className="va-wrap">
          <div className="va-shead">
            <div>
              <div className="va-eyebrow">{C.productsEy}</div>
              <h2>{C.productsH}</h2>
            </div>
            <p>{C.productsSub}</p>
          </div>
          <ProductCarousel products={carouselProducts} locale={loc} sideArrows />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="va-section">
        <div className="va-wrap">
          <div className="va-shead">
            <div>
              <div className="va-eyebrow">{C.aboutEy}</div>
              <h2>{C.aboutH}</h2>
            </div>
            <p>{C.aboutP1}</p>
          </div>
          <div className="va-caps4">
            {ABOUT_TILES.map((it) => (
              <div
                key={it.key}
                className="va-cap4"
                style={{
                  backgroundImage: `linear-gradient(180deg,rgba(15,30,50,.45) 0%,rgba(8,16,30,.95) 85%),url('${it.img}')`,
                }}
              >
                <div className="va-cap4-body">
                  <h3>
                    {lang === 'zh' ? it.titleZh : lang === 'en' ? it.titleEn : it.titleVi}
                  </h3>
                  <p>
                    {lang === 'zh' ? it.bodyZh : lang === 'en' ? it.bodyEn : it.bodyVi}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTS */}
      <section id="certs" className="va-section">
        <div className="va-wrap">
          <div className="va-shead">
            <div>
              <div className="va-eyebrow">
                {lang === 'zh' ? '认证' : lang === 'en' ? 'Certifications' : 'Chứng chỉ'}
              </div>
              <h2>
                {lang === 'zh'
                  ? '符合国际标准。'
                  : lang === 'en'
                    ? 'Built to international standards.'
                    : 'Đạt chuẩn chất lượng quốc tế.'}
              </h2>
            </div>
            <p>
              {lang === 'zh'
                ? '每批产品均按ISO 9001进行QC检测,提供COA和MSDS — 满足韩国、日本、印度和中东市场最严苛的要求。'
                : lang === 'en'
                  ? 'Each batch is QC-controlled to ISO 9001 and ships with COA and MSDS — meeting the toughest requirements from Korea, Japan, India and the Middle East.'
                  : 'Mỗi lô sản phẩm đều được kiểm tra QC theo ISO 9001, kèm COA và MSDS — đáp ứng yêu cầu khắt khe nhất từ thị trường Hàn Quốc, Nhật Bản, Ấn Độ và Trung Đông.'}
            </p>
          </div>

          <div className="va-certs-grid">
            {CERT_TILES.map((c) => (
              <div key={c.key} className="va-cert-card">
                <div className="va-cert-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt={c.name} />
                </div>
                <div className="va-cert-body">
                  <div className="va-cert-meta">
                    {lang === 'zh' ? c.issuerZh : lang === 'en' ? c.issuerEn : c.issuerVi}
                  </div>
                  <h3>{c.name}</h3>
                  <p>{lang === 'zh' ? c.descZh : lang === 'en' ? c.descEn : c.descVi}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link className="va-btn va-btn-p" href={`/${loc}/about#certs`}>
              {lang === 'zh'
                ? '查看所有认证'
                : lang === 'en'
                  ? 'View all certifications'
                  : 'Xem tất cả chứng chỉ'}{' '}
              <Icon name="arrow" size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* EXPORT MAP */}
      <section className="va-section tight">
        <div className="va-wrap">
          <ExportMap locale={loc} />
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="va-wrap">
        <div className="va-contact">
          <div>
            <div className="va-eyebrow">{C.contactEy}</div>
            <h2>{C.contactH}</h2>
            <p style={{ opacity: 0.7, fontSize: 15, lineHeight: 1.65 }}>{C.contactP}</p>
            <div className="va-contact-info">
              <div className="va-ci-row">
                <div className="va-ci-i">
                  <Icon name="pin" size={16} />
                </div>
                <div>
                  <div className="lbl">
                    {lang === 'zh' ? '总部' : lang === 'en' ? 'Headquarters' : 'Trụ sở'}
                  </div>
                  <div className="val">{C.addr}</div>
                </div>
              </div>
              <div className="va-ci-row">
                <div className="va-ci-i">
                  <Icon name="phone" size={16} />
                </div>
                <div>
                  <div className="lbl">
                    {lang === 'zh' ? '电话' : lang === 'en' ? 'Phone' : 'Điện thoại'}
                  </div>
                  <div className="val">
                    {C.phone[0]}
                    <br />
                    {C.phone[1]}
                  </div>
                </div>
              </div>
              <div className="va-ci-row">
                <div className="va-ci-i">
                  <Icon name="mail" size={16} />
                </div>
                <div>
                  <div className="lbl">Email</div>
                  <div className="val">{C.email}</div>
                </div>
              </div>
            </div>
          </div>
          <ContactForm locale={loc} source="home_form" />
        </div>
      </section>
    </>
  );
}
