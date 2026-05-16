'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { ProductDetail } from '@/data/products';
import { Icon, type IconName } from '@/components/ui/Icon';
import { fmtNumberVn } from '@/lib/format';

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
    reviews: 'đánh giá',
    soldCount: 'đã bán',
    stockUnit: 'sẵn có',
    estimatedPrice: 'Giá tham khảo',
    priceNote: 'Giá tham khảo · Liên hệ để báo giá chính xác',
    total: 'Tạm tính',
    classification: 'Phân loại',
    available: 'còn lại',
    popular: 'Phổ biến',
    qty: 'Số lượng',
    contactQuote: 'Liên hệ để báo giá chính xác',
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
    reviews: 'reviews',
    soldCount: 'sold',
    stockUnit: 'in stock',
    estimatedPrice: 'Indicative price',
    priceNote: 'Indicative price · Contact for accurate quote',
    total: 'Subtotal',
    classification: 'Classification',
    available: 'available',
    popular: 'Popular',
    qty: 'Quantity',
    contactQuote: 'Contact for accurate quote',
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
    reviews: '评价',
    soldCount: '已售',
    stockUnit: '现货',
    estimatedPrice: '参考价格',
    priceNote: '参考价格 · 联系获取准确报价',
    total: '小计',
    classification: '分类',
    available: '剩余',
    popular: '热门',
    qty: '数量',
    contactQuote: '联系获取准确报价',
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

function fmtPriceUsd(n: number) {
  // Manual thousands grouping with comma, mirrors en-US numbers without
  // depending on Intl (which differs between Node ICU and browser).
  const s = String(Math.abs(Math.trunc(n)));
  let out = '';
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) out += ',';
    out += s[i];
  }
  return (n < 0 ? '-' : '') + out;
}

function fmtPrice(vnd: number, lang: Locale) {
  if (lang === 'en') return '$' + fmtPriceUsd(Math.round(vnd / 25000));
  if (lang === 'zh') return '¥' + fmtPriceUsd(Math.round(vnd / 3500));
  return fmtNumberVn(vnd) + ' ₫';
}

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
  const [qty, setQty] = useState(1);

  const v = product.variants[variantIdx];
  const totalStock = product.variants.reduce((s, x) => s + x.stock, 0);

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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={activeImg} src={product.images[activeImg]} alt={productName} />
                <div className="pd-gallery-cat">{categoryName}</div>
              </div>
              <div className="pd-gallery-thumbs">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className={'pd-gallery-thumb' + (i === activeImg ? ' on' : '')}
                    onClick={() => setActiveImg(i)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" />
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

              <div className="pd-info-rating">
                <span className="stars">★★★★★</span>
                <span>
                  <b>4.9</b> · 86 {t.reviews}
                </span>
                <span className="sep">|</span>
                <span>
                  <b>{fmtNumberVn(120 + parseInt(product.code.slice(2)) * 47)}</b> {t.soldCount}
                </span>
                <span className="sep">|</span>
                <span>
                  <b>{fmtNumberVn(totalStock)}</b> {product.unit[locale]} {t.stockUnit}
                </span>
              </div>

              {/* PRICE BOX */}
              <div className="pd-price-box">
                <div className="pd-price-label">{t.estimatedPrice}</div>
                <div>
                  <span className="pd-price-main">{fmtPrice(v.vnd, locale)}</span>
                  <span className="pd-price-unit">/ {product.unit[locale]}</span>
                </div>
                <div className="pd-price-note">{t.priceNote}</div>
                <div className="pd-price-subtotal">
                  <span>
                    {t.total} ({qty} {product.unit[locale]} × {variantLabel(v.label, locale)})
                  </span>
                  <b>{fmtPrice(v.vnd * qty, locale)}</b>
                </div>
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
                  <div className={'pd-variants-stock' + (v.stock < 200 ? ' low' : '')}>
                    {fmtNumberVn(v.stock)} {product.unit[locale]} {t.available}
                  </div>
                </div>
                <div className="pd-variants-grid">
                  {product.variants.map((variant, i) => (
                    <button
                      key={variant.id}
                      type="button"
                      className={'pd-variant-chip' + (i === variantIdx ? ' on' : '')}
                      onClick={() => {
                        setVariantIdx(i);
                        setQty(1);
                      }}
                    >
                      {variant.popular ? (
                        <span className="pd-variant-popular">{t.popular}</span>
                      ) : null}
                      {variantLabel(variant.label, locale)}
                    </button>
                  ))}
                </div>
              </div>

              {/* QUANTITY */}
              <div className="pd-qty-row">
                <div className="pd-qty-label">{t.qty}</div>
                <div className="pd-qty-controls">
                  <button
                    type="button"
                    className="pd-qty-btn"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={qty <= 1}
                    aria-label="Decrease"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    className="pd-qty-input"
                    value={qty}
                    min={1}
                    max={v.stock}
                    onChange={(e) => {
                      const n = parseInt(e.target.value) || 1;
                      setQty(Math.max(1, Math.min(v.stock, n)));
                    }}
                  />
                  <button
                    type="button"
                    className="pd-qty-btn"
                    onClick={() => setQty(Math.min(v.stock, qty + 1))}
                    disabled={qty >= v.stock}
                    aria-label="Increase"
                  >
                    +
                  </button>
                </div>
                <div className="pd-qty-stock">
                  <b>{fmtNumberVn(v.stock)}</b> {product.unit[locale]} {t.available}
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
                  href={`/${locale}/products/${r.code.toLowerCase()}`}
                  className="pd-related-card"
                >
                  <div className="pd-related-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.images[0]} alt="" />
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
