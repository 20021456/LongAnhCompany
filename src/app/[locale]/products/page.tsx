import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { PageHero } from '@/components/public/PageHero';
import { ProductsShowcase } from '@/components/public/ProductsShowcase';
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
  slug: string;
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

  // PageHero copy comes from the CMS page-sections; the product grid comes from
  // the product catalogue. The body uses the gpt-taste showcase (approach B)
  // re-themed to the site's light theme.
  const [productMap, S] = await Promise.all([getProducts(), getProductsPageSections(loc)]);
  const products: Product[] = Object.values(productMap).map((p) => ({
    code: p.code,
    slug: p.slug,
    cat: p.cat,
    img: p.images[0] ?? '',
    name: p.name[loc],
    meta: p.meta[loc],
    desc: p.desc[loc],
    tags: p.tags[loc] ?? [],
  }));

  return (
    <div className="pr">
      <PageHero
        eyebrow={S.header.eyebrow}
        title={S.header.title}
        sub={S.header.sub}
        breadcrumb={[
          { label: loc === 'zh' ? '首页' : loc === 'en' ? 'Home' : 'Trang chủ', href: `/${loc}` },
          { label: C.nav[2] },
        ]}
        bgImage={S.header.imageUrl || '/assets/nha-may-bot-sieu-min-1.webp'}
        stats={S.stats.items}
      />

      <ProductsShowcase
        locale={loc}
        products={products}
        cats={cats}
        process={S.process}
        cta={S.cta}
      />
    </div>
  );
}
