'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { ProductDetail } from '@/data/products';
import { Icon, type IconName } from '@/components/ui/Icon';
import { SmartImage } from '@/components/ui/SmartImage';

interface Props {
  locale: Locale;
  product: ProductDetail;
  related: ProductDetail[];
}

const L = {
  vi: {
    home: 'Trang chủ',
    products: 'Sản phẩm',
    catTitles: ['Bột đá CaCO₃', 'Đá ốp lát tự nhiên'],
    inStock: 'Sẵn hàng',
    trustCoa: 'COA & MSDS theo từng lô',
    trustCoaStone: 'CO/CQ & kiểm định SGS theo lô',
    trustExport: 'Xuất khẩu 12 quốc gia',
    termsTitle: 'Điều kiện thương mại',
    termsNote: 'Giá FOB theo khối lượng & quy cách — báo giá trong 24h làm việc.',
    packagingLabel: 'Đóng gói',
    port: 'Cảng xuất hàng',
    classification: 'Quy cách',
    popular: 'Phổ biến',
    contactQuote: 'Nhận báo giá FOB trong 24h làm việc',
    requestQuote: 'Yêu cầu báo giá',
    overview: 'Tổng quan',
    descTitle: 'Mô tả chi tiết',
    category: 'Danh mục',
    moq: 'Đơn hàng tối thiểu',
    leadTime: 'Thời gian sản xuất',
    keyFeatures: 'Đặc điểm nổi bật',
    technicalSpecs: 'Thông số kỹ thuật',
    property: 'Chỉ tiêu',
    value: 'Giá trị',
    unit: 'Đơn vị',
    relatedProducts: 'Sản phẩm liên quan',
    sendInquiry: 'Gửi yêu cầu',
    quoteTitle: (n: string) => `Cần báo giá ${n} cho lô hàng tiếp theo?`,
    quoteBody:
      'Gửi yêu cầu kèm số lượng và cảng đến — chúng tôi phản hồi trong 24h làm việc với spec sheet, COA và FOB pricing.',
  },
  en: {
    home: 'Home',
    products: 'Products',
    catTitles: ['CaCO₃ powder', 'Natural cladding stone'],
    inStock: 'In stock',
    trustCoa: 'COA & MSDS with every batch',
    trustCoaStone: 'CO/CQ & SGS inspection per lot',
    trustExport: 'Exported to 12 countries',
    termsTitle: 'Commercial terms',
    termsNote: 'FOB pricing by volume & grade — quote within 24 business hours.',
    packagingLabel: 'Packaging',
    port: 'Loading port',
    classification: 'Grade',
    popular: 'Popular',
    contactQuote: 'Get an FOB quote within 24 business hours',
    requestQuote: 'Request a quote',
    overview: 'Overview',
    descTitle: 'Detailed description',
    category: 'Category',
    moq: 'Min. order',
    leadTime: 'Lead time',
    keyFeatures: 'Key features',
    technicalSpecs: 'Technical Specifications',
    property: 'Property',
    value: 'Value',
    unit: 'Unit',
    relatedProducts: 'Related products',
    sendInquiry: 'Send inquiry',
    quoteTitle: (n: string) => `Need a ${n} quote for your next shipment?`,
    quoteBody:
      'Send quantity and destination port — we reply within 24 business hours with spec sheet, COA and FOB pricing.',
  },
  zh: {
    home: '首页',
    products: '产品',
    catTitles: ['碳酸钙粉', '天然石材饰面'],
    inStock: '现货',
    trustCoa: '每批附COA与MSDS',
    trustCoaStone: '每批附CO/CQ及SGS检验',
    trustExport: '出口12个国家',
    termsTitle: '商务条款',
    termsNote: 'FOB价格按数量与规格而定 — 24个工作小时内报价。',
    packagingLabel: '包装',
    port: '装运港',
    classification: '规格',
    popular: '热门',
    contactQuote: '24个工作小时内获取FOB报价',
    requestQuote: '请求报价',
    overview: '概览',
    descTitle: '详细描述',
    category: '类别',
    moq: '最小订量',
    leadTime: '生产周期',
    keyFeatures: '主要特点',
    technicalSpecs: '技术规格',
    property: '指标',
    value: '数值',
    unit: '单位',
    relatedProducts: '相关产品',
    sendInquiry: '发送询价',
    quoteTitle: (n: string) => `需要 ${n} 的下次发货报价?`,
    quoteBody: '发送数量和目的港信息 — 我们将在24个工作小时内回复,附规格表、COA和FOB价格。',
  },
} as const;

const SPEC_LABELS: Record<string, Record<Locale, string>> = {
  caco3: { vi: 'Hàm lượng CaCO₃', en: 'CaCO₃ content', zh: '碳酸钙含量' },
  white: { vi: 'Độ trắng', en: 'Whiteness', zh: '白度' },
  moist: { vi: 'Độ ẩm', en: 'Moisture', zh: '水分' },
  density: { vi: 'Tỷ trọng đổ đống', en: 'Bulk density', zh: '堆积密度' },
  stearic: { vi: 'Hàm lượng Stearic', en: 'Stearic content', zh: '硬脂酸含量' },
  d50: { vi: 'Cỡ hạt D50', en: 'Particle size D50', zh: '粒径D50' },
  format: { vi: 'Quy cách', en: 'Format', zh: '规格' },
  thickness: { vi: 'Độ dày', en: 'Thickness', zh: '厚度' },
  finish: { vi: 'Hoàn thiện', en: 'Finish', zh: '表面处理' },
};

/** Variant labels may be a plain string ('3 µm') or an i18n object ({ vi, en, zh }). */
function variantLabel(label: string | Record<string, string>, lang: Locale) {
  return typeof label === 'string' ? label : label[lang] || label.vi || '';
}

export function ProductDetailView({ locale, product, related }: Props) {
  const t = L[locale];
  const isPowder = product.cat === 0;
  const productName = product.name[locale] || product.name.vi;
  const categoryName = t.catTitles[product.cat];

  const initialVariant = Math.max(
    0,
    product.variants.findIndex((v) => v.popular),
  );
  const [activeImg, setActiveImg] = useState(0);
  const [variantIdx, setVariantIdx] = useState(initialVariant);

  const v = product.variants[variantIdx];

  return (
    <div className="pd">
      {/* HERO */}
      <section className="pd-hero">
        <div className="va-wrap">
          <nav className="pd-bcrumb">
            <Link href={`/${locale}`}>{t.home}</Link>
            <Icon name="chevron" size={12} />
            <Link href={`/${locale}/products`}>{t.products}</Link>
            <Icon name="chevron" size={12} />
            <span className="now">{productName}</span>
          </nav>

          <div className="pd-hero-grid" style={{ marginTop: 24 }}>
            <div className="pd-gallery">
              <div className="pd-gallery-main">
                <SmartImage
                  key={activeImg}
                  src={product.images[activeImg]}
                  alt={productName}
                  width={1000}
                  height={750}
                  priority
                />
                <div className="pd-gallery-cat">{categoryName}</div>
              </div>
              <div className="pd-gallery-thumbs">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className={'pd-gallery-thumb' + (i === activeImg ? ' on' : '')}
                    onClick={() => setActiveImg(i)}
                  >
                    <SmartImage src={img} alt="" width={200} height={200} sizes="120px" />
                  </div>
                ))}
              </div>
            </div>

            <div className="pd-info">
              <div className="pd-info-meta">
                <span className="pd-info-meta-chip cat">{categoryName}</span>
                <span className="pd-info-meta-chip stock">
                  <Icon name="check" size={11} /> {t.inStock}
                </span>
              </div>
              <h1>{productName}</h1>
              <div className="pd-info-sub">{product.meta[locale]}</div>

              <div className="pd-trust-row">
                <span>
                  <Icon name="check" size={13} /> ISO 9001:2015
                </span>
                <span>
                  <Icon name="check" size={13} /> {isPowder ? t.trustCoa : t.trustCoaStone}
                </span>
                <span>
                  <Icon name="check" size={13} /> {t.trustExport}
                </span>
              </div>

              {/* COMMERCIAL TERMS */}
              <div className="pd-price-box">
                <div className="pd-price-label">{t.termsTitle}</div>
                <div className="pd-terms-grid">
                  <div className="pd-term">
                    <span>{t.moq}</span>
                    <b>{product.moq[locale]}</b>
                  </div>
                  <div className="pd-term">
                    <span>{t.leadTime}</span>
                    <b>{product.leadTime[locale]}</b>
                  </div>
                  <div className="pd-term">
                    <span>{t.packagingLabel}</span>
                    <b>
                      {product.packaging
                        .slice(0, 3)
                        .map((pk) => pk[locale])
                        .join(' · ')}
                    </b>
                  </div>
                  <div className="pd-term">
                    <span>{t.port}</span>
                    <b>FOB Cửa Lò · Hải Phòng</b>
                  </div>
                </div>
                <div className="pd-price-note">{t.termsNote}</div>
              </div>

              {/* VARIANTS */}
              <div className="pd-variants">
                <div className="pd-variants-head">
                  <div className="pd-variants-label">
                    {t.classification}:{' '}
                    <span style={{ color: 'var(--brand-accent,#F08023)', fontWeight: 700 }}>
                      {variantLabel(v.label, locale)}
                    </span>
                  </div>
                </div>
                <div className="pd-variants-grid">
                  {product.variants.map((variant, i) => (
                    <button
                      key={variant.id}
                      type="button"
                      className={'pd-variant-chip' + (i === variantIdx ? ' on' : '')}
                      onClick={() => setVariantIdx(i)}
                    >
                      {variant.popular ? (
                        <span className="pd-variant-popular">{t.popular}</span>
                      ) : null}
                      {variantLabel(variant.label, locale)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pd-cta-box">
                <div className="pd-cta-box-title">{t.contactQuote}</div>
                <div className="pd-cta-box-row">
                  <Link className="pd-cta-btn primary" href={`/${locale}/contact`}>
                    <Icon name="mail" size={16} /> {t.requestQuote}
                  </Link>
                  <a className="pd-cta-btn secondary" href="tel:+84942224499">
                    <Icon name="phone" size={16} /> (+84) 942 224 499
                  </a>
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                <div className="pd-tags">
                  {product.tags[locale].map((tag, i) => (
                    <span key={i}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED DESCRIPTION */}
      <section className="pd-section alt">
        <div className="va-wrap">
          <div className="pd-section-head">
            <div className="ix">
              <Icon name="check" size={20} />
            </div>
            <div>
              <div className="num">— 01 · {t.overview}</div>
              <h2>{t.descTitle}</h2>
            </div>
          </div>
          <div className="pd-longdesc">
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '.16em',
                  textTransform: 'uppercase',
                  color: 'var(--brand-accent,#F08023)',
                  marginBottom: 10,
                }}
              >
                {productName}
              </div>
              <div style={{ fontSize: 14, opacity: 0.65, lineHeight: 1.7, marginBottom: 24 }}>
                {t.category}: <b>{categoryName}</b>
                <br />
                {t.moq}: <b>{product.moq[locale]}</b>
                <br />
                {t.leadTime}: <b>{product.leadTime[locale]}</b>
              </div>
              <div className="pd-features">
                <div className="pd-features-title">{t.keyFeatures}</div>
                <ul>
                  {product.features[locale].map((f, i) => (
                    <li key={i}>
                      <Icon name="check" size={16} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.75, marginBottom: 18, fontWeight: 500 }}>
                {product.desc[locale]}
              </p>
              <p>{product.longDesc[locale]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNICAL SPECS */}
      <section className="pd-section">
        <div className="va-wrap">
          <div className="pd-section-head">
            <div className="ix">
              <Icon name="grid" size={20} />
            </div>
            <div>
              <div className="num">— 02 · {t.technicalSpecs}</div>
              <h2>{t.technicalSpecs}</h2>
            </div>
          </div>
          <div className="pd-spec-card">
            <div className="pd-spec-row h">
              <div>{t.property}</div>
              <div>{t.value}</div>
              <div>{t.unit}</div>
            </div>
            {product.specs.map((s, i) => (
              <div key={i} className="pd-spec-row">
                <div className="label">{SPEC_LABELS[s.key]?.[locale] ?? s.key}</div>
                <div className="val">{s.val}</div>
                <div className="unit">{s.unit ?? '—'}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATIONS */}
      <section className="pd-section alt">
        <div className="va-wrap">
          <div className="pd-section-head">
            <div className="ix">
              <Icon name="spark" size={20} />
            </div>
            <div>
              <div className="num">
                — 03 · {locale === 'vi' ? 'Ứng dụng' : locale === 'en' ? 'Applications' : '应用'}
              </div>
              <h2>{locale === 'vi' ? 'Ứng dụng' : locale === 'en' ? 'Applications' : '应用'}</h2>
            </div>
          </div>
          <div className="pd-apps-grid">
            {product.applications.map((app, i) => (
              <div key={i} className="pd-app">
                <div className="pd-app-i">
                  <Icon name={(app.icon as IconName) || 'check'} size={26} />
                </div>
                <h4>{app[locale]}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGING */}
      <section className="pd-section">
        <div className="va-wrap">
          <div className="pd-section-head">
            <div className="ix">
              <Icon name="box" size={20} />
            </div>
            <div>
              <div className="num">
                — 04 · {locale === 'vi' ? 'Đóng gói' : locale === 'en' ? 'Packaging' : '包装'}
              </div>
              <h2>{locale === 'vi' ? 'Đóng gói' : locale === 'en' ? 'Packaging' : '包装'}</h2>
            </div>
          </div>
          <div className="pd-pack-grid">
            {product.packaging.map((pk, i) => (
              <div key={i} className="pd-pack-card">
                <div className="pd-pack-icon">
                  <Icon name="box" size={20} />
                </div>
                <span>{pk[locale]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 ? (
        <section className="pd-section alt">
          <div className="va-wrap">
            <div className="pd-section-head">
              <div className="ix">
                <Icon name="grid" size={20} />
              </div>
              <div>
                <div className="num">— 05 · {t.relatedProducts}</div>
                <h2>{t.relatedProducts}</h2>
              </div>
            </div>
            <div className="pd-related-grid">
              {related.map((r) => (
                <Link
                  key={r.code}
                  href={`/${locale}/products/${r.slug}`}
                  className="pd-related-card"
                >
                  <div className="pd-related-img">
                    <SmartImage src={r.images[0]} alt="" width={400} height={300} sizes="300px" />
                  </div>
                  <div className="pd-related-body">
                    <div className="meta">
                      {r.code} · {r.meta[locale]}
                    </div>
                    <h4>{r.name[locale]}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* QUOTE CTA */}
      <section className="pd-section">
        <div className="va-wrap">
          <div className="pd-quote">
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '.16em',
                  textTransform: 'uppercase',
                  color: 'var(--brand-accent,#F08023)',
                  marginBottom: 14,
                }}
              >
                {t.requestQuote}
              </div>
              <h2>{t.quoteTitle(productName)}</h2>
              <p style={{ marginTop: 14 }}>{t.quoteBody}</p>
            </div>
            <div className="pd-quote-r">
              <Link className="pd-cta-btn primary" href={`/${locale}/contact`}>
                <Icon name="arrow" size={15} /> {t.sendInquiry}
              </Link>
              <a className="pd-cta-btn secondary" href="mailto:info@longanhcorp.com">
                <Icon name="mail" size={15} /> info@longanhcorp.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
