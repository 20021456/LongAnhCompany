import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/public/PageHeader';
import { ProductsBrowser } from '@/components/public/ProductsBrowser';

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

export default function ProductsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const loc = locale as Locale;
  const C = COPY[loc];
  const cats: string[] = C.catTitles ?? ['Bột đá CaCO₃', 'Đá ốp lát tự nhiên'];
  const products: Product[] = C.products;

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

      {/* CATEGORY TILES + FILTERED PRODUCT BLOCKS + PARTICLE SIZE (client) */}
      <ProductsBrowser locale={loc} products={products} cats={cats} />

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
