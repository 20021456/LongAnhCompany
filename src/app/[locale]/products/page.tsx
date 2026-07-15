import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/public/PageHeader';
import { ProductsBrowser } from '@/components/public/ProductsBrowser';
import { getProducts, getProductsPageSections } from '@/lib/queries';
import { buildPageMetadata } from '@/lib/page-metadata';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildPageMetadata({
    pageKey: 'products',
    locale: locale as Locale,
    pathStripped: '/products',
    fallbackTitle: 'Sản phẩm · Bột đá CaCO₃ & đá tự nhiên',
    fallbackDescription:
      'Hai dòng sản phẩm chính: bột đá CaCO₃ phủ / không phủ Stearic Acid và đá tự nhiên (Slab, đá xẻ, đá trang trí).',
    fallbackOgImage: '/assets/bot-caco3-sieu-min.webp',
  });
}

interface Product {
  code: string;
  cat: number;
  img: string;
  name: string;
  meta: string;
  desc: string;
  tags: string[];
}

export default async function ProductsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const loc = locale as Locale;
  const C = COPY[loc];
  const cats: string[] = C.catTitles ?? ['Bột đá CaCO₃', 'Đá ốp lát tự nhiên'];

  // Products catalogue + every editable page section come from page_sections.
  // ProductsBrowser receives tiles + particle + sku-list as props so admin
  // edits to those sections show up immediately on the public page.
  const [productMap, S] = await Promise.all([getProducts(), getProductsPageSections(loc)]);
  const products: Product[] = Object.values(productMap).map((p) => ({
    code: p.code,
    cat: p.cat,
    img: p.images[0] ?? '',
    name: p.name[loc],
    meta: p.meta[loc],
    desc: p.desc[loc],
    tags: p.tags[loc] ?? [],
  }));

  return (
    <div className="pr">
      <PageHeader
        eyebrow={S.header.eyebrow}
        title={S.header.title}
        sub={S.header.sub}
        breadcrumb={[
          { label: loc === 'zh' ? '首页' : loc === 'en' ? 'Home' : 'Trang chủ', href: `/${loc}` },
          { label: C.nav[2] },
        ]}
      />

      {/* STATS STRIP */}
      <section className="pr-stats">
        {S.stats.items.map((s, i) => (
          <div key={i} className="pr-stat">
            <b>{s.value}</b>
            <span>{s.label}</span>
          </div>
        ))}
      </section>

      {/* CATEGORY TILES + FILTERED PRODUCT BLOCKS + PARTICLE SIZE (client) */}
      <ProductsBrowser
        locale={loc}
        products={products}
        cats={cats}
        tiles={S.tiles.items}
        particle={S.particle}
        skuListCodes={S.skuList.codes}
      />

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
            <h2>{S.specTable.title}</h2>
          </div>
          <div className="pr-spec-card">
            <div className="pr-spec-table">
              <div className="pr-spec-cell h">
                {loc === 'zh' ? '指标' : loc === 'en' ? 'Property' : 'Chỉ tiêu'}
              </div>
              <div className="pr-spec-cell h">{S.specTable.colUncoated}</div>
              <div className="pr-spec-cell h">{S.specTable.colCoated}</div>
              <div className="pr-spec-cell h">
                {loc === 'zh' ? '单位' : loc === 'en' ? 'Unit' : 'Đơn vị'}
              </div>
              {S.specTable.rows.map((row, ri) => (
                <div key={ri} style={{ display: 'contents' }}>
                  <div className="pr-spec-cell label">{row.label}</div>
                  <div className="pr-spec-cell num">{row.uncoated}</div>
                  <div className="pr-spec-cell num">{row.coated}</div>
                  <div className="pr-spec-cell unit">{row.unit}</div>
                </div>
              ))}
            </div>
            <div className="pr-spec-foot">
              {S.specTable.certBadges.map((b, i) => (
                <span key={i} className="pr-spec-foot-chip">
                  {b}
                </span>
              ))}
              {S.specTable.certBadges.length > 0 ? <span>·</span> : null}
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
              <h2>{S.cta.title}</h2>
              <p>{S.cta.sub}</p>
            </div>
            <div className="pr-quote-r">
              <Link className="pr-btn pr-btn-p" href={S.cta.primaryHref || `/${loc}/contact`}>
                {S.cta.primaryLabel}
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
