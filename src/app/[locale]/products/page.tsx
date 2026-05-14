import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/public/PageHeader';

interface Product {
  code: string;
  cat: number;
  img: string;
  name: string;
  meta: string;
  desc: string;
  tags: string[];
}

const SPECS: Record<Locale, { head: string[]; rows: string[][] }> = {
  vi: {
    head: ['Chỉ tiêu', 'Bột không phủ', 'Bột phủ Stearic', 'Đơn vị'],
    rows: [
      ['Hàm lượng CaCO₃', '≥ 98.5', '≥ 98.5', '%'],
      ['Độ trắng', '≥ 98', '≥ 98', '%'],
      ['Độ ẩm', '≤ 0.3', '≤ 0.2', '%'],
      ['Tỷ trọng đổ đống', '0.9 – 1.1', '0.7 – 0.9', 'g/cm³'],
      ['Hàm lượng Stearic', '—', '1.0 – 1.5', '%'],
      ['Cỡ hạt D50', '3 – 20', '3 – 20', 'µm'],
    ],
  },
  en: {
    head: ['Property', 'Uncoated', 'Coated', 'Unit'],
    rows: [
      ['CaCO₃ content', '≥ 98.5', '≥ 98.5', '%'],
      ['Whiteness', '≥ 98', '≥ 98', '%'],
      ['Moisture', '≤ 0.3', '≤ 0.2', '%'],
      ['Bulk density', '0.9 – 1.1', '0.7 – 0.9', 'g/cm³'],
      ['Stearic content', '—', '1.0 – 1.5', '%'],
      ['Particle size D50', '3 – 20', '3 – 20', 'µm'],
    ],
  },
  zh: {
    head: ['指标', '未涂层', '涂层', '单位'],
    rows: [
      ['碳酸钙含量', '≥ 98.5', '≥ 98.5', '%'],
      ['白度', '≥ 98', '≥ 98', '%'],
      ['水分', '≤ 0.3', '≤ 0.2', '%'],
      ['堆积密度', '0.9 – 1.1', '0.7 – 0.9', 'g/cm³'],
      ['硬脂酸含量', '—', '1.0 – 1.5', '%'],
      ['粒径D50', '3 – 20', '3 – 20', 'µm'],
    ],
  },
};

const SIZE_ROWS = (loc: Locale) => [
  {
    name: loc === 'zh' ? '未涂层' : loc === 'en' ? 'Uncoated' : 'Bột không phủ',
    sub: loc === 'zh' ? '8 种规格' : loc === 'en' ? '8 sizes' : '8 quy cách',
    eyebrow: 'CaCO₃ ≥ 98.5%',
    values: [5, 8, 10, 12, 15, 17, 18, 20],
  },
  {
    name: loc === 'zh' ? '硬脂酸涂层' : loc === 'en' ? 'Stearic-coated' : 'Bột phủ Stearic',
    sub: loc === 'zh' ? '7 种规格' : loc === 'en' ? '7 sizes' : '7 quy cách',
    eyebrow: '+ Stearic 1.0–1.5%',
    values: [5, 10, 12, 15, 17, 18, 20],
  },
];

export default function ProductsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const loc = locale as Locale;
  const C = COPY[loc];
  const cats: string[] = C.catTitles ?? ['Bột đá CaCO₃', 'Đá ốp lát tự nhiên'];
  const products: Product[] = C.products;
  const groups = [0, 1].map((ci) => ({
    ci,
    products: products.filter((p) => p.cat === ci),
  }));

  const catTiles = [
    {
      id: 'powder',
      img: '/assets/bot-caco3-sieu-min.webp',
      cat: 0,
      title: { vi: 'Bột đá CaCO₃', en: 'CaCO₃ powder', zh: '碳酸钙粉' },
      desc: {
        vi: 'Coated · Uncoated · 3–20 µm — phụ gia cho nhựa, sơn, giấy, thức ăn chăn nuôi.',
        en: 'Coated · Uncoated · 3–20 µm — additive for plastics, paint, paper, animal feed.',
        zh: '涂层 · 未涂层 · 3–20 µm — 用于塑料、涂料、纸张、动物饲料的添加剂。',
      },
    },
    {
      id: 'stone',
      img: '/assets/da-slab-sieu-trang.webp',
      cat: 1,
      title: { vi: 'Đá ốp lát tự nhiên', en: 'Natural cladding stone', zh: '天然石材饰面' },
      desc: {
        vi: 'Slab · Đá xẻ · Đá trang trí — cho công trình và không gian sống cao cấp.',
        en: 'Slab · Cut tile · Decorative — for premium architecture and living spaces.',
        zh: '大板 · 定制石材 · 装饰石材 — 用于高端建筑和生活空间。',
      },
    },
  ];

  return (
    <div className="pr">
      <PageHeader
        eyebrow={C.productsEy}
        title={
          loc === 'zh'
            ? '两大产品系列。五个标准。'
            : loc === 'en'
              ? 'Two product lines. Five SKUs.'
              : 'Hai dòng sản phẩm. Năm tiêu chuẩn.'
        }
        sub={
          loc === 'zh'
            ? '从塑料复合材料用的超细碳酸钙粉,到高端项目用的大尺寸天然石材 — 全部来自同一矿源。'
            : loc === 'en'
              ? 'From ultra-fine CaCO₃ for plastic compounds, to large-format natural stone for premium projects — all from a single quarry.'
              : 'Từ bột đá CaCO₃ siêu mịn cho compound nhựa, đến đá tự nhiên cỡ lớn cho công trình cao cấp — tất cả đều đến từ một mỏ duy nhất.'
        }
        breadcrumb={[
          { label: loc === 'zh' ? '首页' : loc === 'en' ? 'Home' : 'Trang chủ', href: `/${loc}` },
          { label: C.nav[2] },
        ]}
      />

      {/* STATS STRIP */}
      <section className="pr-stats">
        <div className="pr-stat">
          <b>05</b>
          <span>
            {loc === 'zh' ? '核心产品系列' : loc === 'en' ? 'Core product lines' : 'Dòng sản phẩm chính'}
          </span>
        </div>
        <div className="pr-stat">
          <b>98%+</b>
          <span>{loc === 'zh' ? '白度' : loc === 'en' ? 'Whiteness' : 'Độ trắng CaCO₃'}</span>
        </div>
        <div className="pr-stat">
          <b>3–20µm</b>
          <span>{loc === 'zh' ? '粒径范围' : loc === 'en' ? 'Particle range' : 'Cỡ hạt'}</span>
        </div>
        <div className="pr-stat">
          <b>12</b>
          <span>
            {loc === 'zh' ? '出口市场' : loc === 'en' ? 'Export markets' : 'Thị trường xuất khẩu'}
          </span>
        </div>
      </section>

      {/* CATEGORY TILES */}
      <section className="pr-section tight">
        <div className="va-wrap">
          <div className="pr-cat-tiles">
            {catTiles.map((tile, ti) => {
              const cnt = products.filter((p) => p.cat === tile.cat).length;
              return (
                <Link key={tile.id} href={`#cat-${tile.id}`} className="pr-cat-tile">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={tile.img} alt="" className="pr-cat-tile-img" />
                  <div className="pr-cat-tile-overlay" />
                  <div className="pr-cat-tile-arrow">
                    <Icon name="arrow" size={16} />
                  </div>
                  <div className="pr-cat-tile-body">
                    <div className="pr-cat-tile-num">
                      — 0{ti + 1} · {cnt}{' '}
                      {loc === 'zh' ? '款' : loc === 'en' ? 'SKUs' : 'sản phẩm'}
                    </div>
                    <h3>{tile.title[loc]}</h3>
                    <p>{tile.desc[loc]}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRODUCTS BY CATEGORY */}
      <section className="pr-section">
        <div className="va-wrap">
          {groups.map((group) => (
            <div
              key={group.ci}
              className="pr-cat-block"
              id={`cat-${group.ci === 0 ? 'powder' : 'stone'}`}
            >
              <div className="pr-cat-head">
                <div>
                  <div className="pr-cat-head-meta">
                    — 0{group.ci + 1} · {group.products.length}{' '}
                    {loc === 'zh' ? '款产品' : loc === 'en' ? 'products' : 'sản phẩm'}
                  </div>
                  <h2>
                    {group.ci === 0
                      ? loc === 'zh'
                        ? '从原始石灰岩 — 到工业用细粉'
                        : loc === 'en'
                          ? 'From raw limestone — to fine powder for industry'
                          : 'Từ đá vôi nguyên sinh — đến bột mịn cho công nghiệp'
                      : loc === 'zh'
                        ? '天然石材 — 用于建筑和生活空间'
                        : loc === 'en'
                          ? 'Natural stone — for architecture and living spaces'
                          : 'Đá tự nhiên — cho công trình và không gian sống'}
                  </h2>
                </div>
                <p>
                  {group.ci === 0
                    ? loc === 'zh'
                      ? '我们的碳酸钙粉是从义安省归合矿场的原始白石灰岩研磨加工而成 — 白度超过98%,碳酸钙含量超过98.5%。粒径范围3至20微米,用作多个行业的添加剂。'
                      : loc === 'en'
                        ? 'Our CaCO₃ powder is milled from pristine white limestone at our Quy Hop quarry in Nghe An — whiteness above 98% and CaCO₃ content above 98.5%. Particle sizes range from 3 to 20 µm, used as an additive across many industries.'
                        : 'Sản phẩm bột đá CaCO₃ được nghiền từ đá vôi trắng nguyên sinh tại Quỳ Hợp – Nghệ An, độ trắng > 98% và CaCO₃ > 98.5%. Cỡ hạt 3–20 µm, dùng làm phụ gia cho nhiều ngành công nghiệp.'
                    : loc === 'zh'
                      ? '龙英天然石材在矿场直接开采加工 — 确保品质均匀和稳定供应。包括大板、定制石材和装饰石材,提供多种表面饰面选择。'
                      : loc === 'en'
                        ? 'Long Anh natural stone is mined and processed in-house — ensuring consistent quality and reliable supply. Includes large-format Slab, cut-to-size tile and decorative outdoor stone with various finishes.'
                        : 'Đá tự nhiên Long Anh được khai thác và chế biến trực tiếp tại mỏ — đảm bảo chất lượng đồng đều, nguồn cung ổn định. Gồm đá Slab tấm lớn, đá xẻ quy cách và đá trang trí ngoại thất với nhiều hoàn thiện.'}
                </p>
              </div>

              <div className="pr-grid">
                {group.products.map((p) => (
                  <Link
                    key={p.code}
                    className="pr-card"
                    href={`/${loc}/products/${p.code.toLowerCase()}`}
                  >
                    <div className="pr-card-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.img} alt={p.name} />
                      <div className="pr-card-cat">{cats[p.cat]}</div>
                    </div>
                    <div className="pr-card-body">
                      <h3>{p.name}</h3>
                      <p>{p.desc}</p>
                      <div className="pr-card-tags">
                        {p.tags.map((tag, j) => (
                          <span key={j}>{tag}</span>
                        ))}
                      </div>
                      <div className="pr-card-foot">
                        <div className="pr-card-foot-cell">
                          <div className="lbl">
                            {loc === 'zh' ? '白度' : loc === 'en' ? 'Whiteness' : 'Độ trắng'}
                          </div>
                          <div className="val">{p.cat === 0 ? '≥ 98%' : '90–95%'}</div>
                        </div>
                        <div className="pr-card-foot-cell">
                          <div className="lbl">
                            {loc === 'zh' ? '包装' : loc === 'en' ? 'Packaging' : 'Đóng gói'}
                          </div>
                          <div className="val">{p.cat === 0 ? '25kg / 1T' : 'Crate / pallet'}</div>
                        </div>
                        <div className="pr-card-cta">
                          <Icon name="arrow" size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PARTICLE SIZE VISUALIZER */}
      <section className="pr-sizes-section">
        <div className="va-wrap">
          <div
            style={{ textAlign: 'center', marginBottom: 48, maxWidth: 680, marginInline: 'auto' }}
          >
            <div className="pr-eyebrow">
              {loc === 'zh' ? '粒径选择' : loc === 'en' ? 'Particle sizes' : 'Cỡ hạt khả dụng'}
            </div>
            <h2 style={{ fontSize: 'clamp(26px,3vw,38px)' }}>
              {loc === 'zh'
                ? '从超细到标准 — 选择适合您应用的粒径'
                : loc === 'en'
                  ? 'From ultra-fine to standard — pick the size for your application'
                  : 'Từ siêu mịn đến tiêu chuẩn — chọn cỡ hạt phù hợp ứng dụng'}
            </h2>
          </div>
          {SIZE_ROWS(loc).map((row, ri) => (
            <div key={ri} className="pr-sizes-row">
              <div className="pr-sizes-label">
                <div className="pr-sizes-label-eyebrow">{row.eyebrow}</div>
                <h4>{row.name}</h4>
                <span>{row.sub}</span>
              </div>
              <div className="pr-sizes-viz">
                {row.values.map((v) => {
                  const size = 22 + (v - 5) * 3.6;
                  return (
                    <div key={v} className="pr-size-circle">
                      <div className="pr-size-circle-dot" style={{ width: size, height: size }}>
                        {v < 13 ? v : ''}
                      </div>
                      <div className="pr-size-circle-label">{v} µm</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SPEC TABLE */}
      <section className="pr-spec-section">
        <div className="va-wrap">
          <div className="pr-spec-head">
            <div className="pr-eyebrow">
              {loc === 'zh'
                ? '技术规格'
                : loc === 'en'
                  ? 'Technical specifications'
                  : 'Thông số kỹ thuật'}
            </div>
            <h2>
              {loc === 'zh'
                ? '质量指标 — 碳酸钙粉'
                : loc === 'en'
                  ? 'Quality specifications — CaCO₃ powder'
                  : 'Chỉ tiêu chất lượng — Bột đá CaCO₃'}
            </h2>
          </div>
          <div className="pr-spec-card">
            <div className="pr-spec-table">
              {SPECS[loc].head.map((h, i) => (
                <div key={`h${i}`} className="pr-spec-cell h">
                  {h}
                </div>
              ))}
              {SPECS[loc].rows.map((row, ri) => (
                <div key={ri} style={{ display: 'contents' }}>
                  <div className="pr-spec-cell label">{row[0]}</div>
                  <div className="pr-spec-cell num">{row[1]}</div>
                  <div className="pr-spec-cell num">{row[2]}</div>
                  <div className="pr-spec-cell unit">{row[3]}</div>
                </div>
              ))}
            </div>
            <div className="pr-spec-foot">
              <span className="pr-spec-foot-chip">ISO 9001:2015</span>
              <span className="pr-spec-foot-chip">REACH</span>
              <span className="pr-spec-foot-chip">SGS</span>
              <span>·</span>
              <span>
                {loc === 'zh'
                  ? '每批生产均提供COA和MSDS'
                  : loc === 'en'
                    ? 'Each batch ships with COA and MSDS'
                    : 'Mỗi lô sản xuất kèm COA và MSDS'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE CTA */}
      <section className="pr-quote-section">
        <div className="va-wrap">
          <div className="pr-quote">
            <div>
              <div className="pr-eyebrow">
                {loc === 'zh' ? '快速报价' : loc === 'en' ? 'Quick quote' : 'Báo giá nhanh'}
              </div>
              <h2>
                {loc === 'zh'
                  ? '需要下次发货的FOB报价?'
                  : loc === 'en'
                    ? 'Need an FOB quote for your next shipment?'
                    : 'Cần báo giá FOB cho lô hàng tiếp theo?'}
              </h2>
              <p>
                {loc === 'zh'
                  ? '请发送粒径、数量和目的港信息 — 我们将在24个工作小时内回复,附规格表、COA和FOB价格。'
                  : loc === 'en'
                    ? 'Send us your particle size, volume and destination port — we reply within 24 business hours, with spec sheet, COA and FOB pricing.'
                    : 'Gửi yêu cầu kèm cỡ hạt, số lượng và cảng đến — chúng tôi phản hồi trong 24h làm việc, đính kèm spec, COA và báo giá FOB.'}
              </p>
            </div>
            <div className="pr-quote-r">
              <Link className="pr-btn pr-btn-p" href={`/${loc}/contact`}>
                {loc === 'zh' ? '请求报价' : loc === 'en' ? 'Request a quote' : 'Yêu cầu báo giá'}
                <Icon name="arrow" size={16} />
              </Link>
              <Link className="pr-btn pr-btn-g" href={`/${loc}/about`}>
                {loc === 'zh' ? '关于龙英' : loc === 'en' ? 'About Long Anh' : 'Về Long Anh'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
