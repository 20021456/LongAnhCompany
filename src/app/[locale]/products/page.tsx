import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Icon } from '@/components/ui/Icon';

export default function ProductsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const loc = locale as Locale;
  const C = COPY[loc];

  return (
    <>
      <section className="va-hero" style={{ background: 'var(--va-bg-alt)' }}>
        <div
          className="va-wrap"
          style={{ padding: '90px 0', textAlign: 'center', maxWidth: 920, margin: '0 auto' }}
        >
          <div className="va-eyebrow">{C.productsEy}</div>
          <h1 style={{ fontSize: 'clamp(36px,4.4vw,58px)', margin: '16px 0 22px' }}>
            {loc === 'vi'
              ? 'Hai dòng sản phẩm. Năm tiêu chuẩn.'
              : loc === 'en'
                ? 'Two product lines. Five SKUs.'
                : '两大产品系列。五个标准。'}
          </h1>
          <p className="va-hero-sub" style={{ margin: '0 auto', maxWidth: 680 }}>
            {C.productsSub}
          </p>
        </div>
      </section>

      <section id="powder" className="va-section">
        <div className="va-wrap">
          <div className="va-shead">
            <div>
              <div className="va-eyebrow">P-01 — P-02</div>
              <h2>{loc === 'zh' ? '碳酸钙粉' : loc === 'en' ? 'CaCO₃ Powder' : 'Bột đá CaCO₃'}</h2>
            </div>
            <p>
              {loc === 'vi'
                ? 'Coated · Uncoated · 3–20 µm — phụ gia cho nhựa, sơn, giấy, thức ăn chăn nuôi.'
                : loc === 'en'
                  ? 'Coated · Uncoated · 3–20 µm — additive for plastics, paint, paper, animal feed.'
                  : '涂层 · 未涂层 · 3–20 µm — 用于塑料、涂料、纸张、动物饲料的添加剂。'}
            </p>
          </div>

          <div className="va-products">
            {C.products
              .filter((p: { cat: number }) => p.cat === 0)
              .map((p: { code: string; img: string; name: string; meta: string; desc: string; tags: string[] }) => (
                <ProductCard key={p.code} product={p} locale={loc} />
              ))}
          </div>
        </div>
      </section>

      <section id="stone" className="va-section" style={{ background: 'var(--va-bg-alt)' }}>
        <div className="va-wrap">
          <div className="va-shead">
            <div>
              <div className="va-eyebrow">P-03 — P-05</div>
              <h2>
                {loc === 'zh'
                  ? '天然石材饰面'
                  : loc === 'en'
                    ? 'Natural cladding stone'
                    : 'Đá ốp lát tự nhiên'}
              </h2>
            </div>
            <p>
              {loc === 'vi'
                ? 'Slab · Đá xẻ · Đá trang trí — cho công trình và không gian sống cao cấp.'
                : loc === 'en'
                  ? 'Slab · Cut tile · Decorative — for premium architecture and living spaces.'
                  : '大板 · 定制石材 · 装饰石材 — 用于高端建筑和生活空间。'}
            </p>
          </div>

          <div className="va-products">
            {C.products
              .filter((p: { cat: number }) => p.cat === 1)
              .map((p: { code: string; img: string; name: string; meta: string; desc: string; tags: string[] }) => (
                <ProductCard key={p.code} product={p} locale={loc} />
              ))}
          </div>
        </div>
      </section>

      <section className="va-section tight">
        <div className="va-wrap">
          <div className="va-cap">
            <div>
              <div className="va-eyebrow">{C.capEy}</div>
              <h2>{C.capH}</h2>
              <p>{C.capP}</p>
              <Link
                className="va-btn va-btn-p"
                href={`/${loc}/contact`}
                style={{ marginTop: 18 }}
              >
                {C.ctaGhost} <Icon name="arrow" size={15} />
              </Link>
            </div>
            <div className="va-markets">
              {C.markets.map((m: string) => (
                <div key={m} className="va-market">
                  <span className="va-market-dot" />
                  {m}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ProductCard({
  product,
  locale,
}: {
  product: { code: string; img: string; name: string; meta: string; desc: string; tags: string[] };
  locale: Locale;
}) {
  return (
    <Link
      href={`/${locale}/products/${product.code.toLowerCase()}`}
      className="va-pcard"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.img}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div className="la-cc-badge">{product.code}</div>
      </div>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="la-cc-meta">{product.meta}</div>
        <h3 style={{ fontSize: 19, lineHeight: 1.25, margin: '0 0 12px', fontWeight: 700, letterSpacing: '-0.01em' }}>
          {product.name}
        </h3>
        <p style={{ fontSize: 13.5, lineHeight: 1.55, opacity: 0.72, flex: 1, margin: 0 }}>
          {product.desc}
        </p>
        <div className="la-cc-tags">
          {product.tags.slice(0, 4).map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
