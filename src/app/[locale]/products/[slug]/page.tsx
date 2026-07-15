import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { getProducts } from '@/lib/queries';
import type { ProductDetail } from '@/data/products';

/** Resolve by SEO slug, falling back to the legacy code form ('p-01'). */
function findProduct(
  products: Record<string, ProductDetail>,
  slug: string,
): { product: ProductDetail | null; legacy: boolean } {
  const bySlug = Object.values(products).find((p) => p.slug === slug);
  if (bySlug) return { product: bySlug, legacy: false };
  const byCode = products[slug.toUpperCase()];
  return { product: byCode ?? null, legacy: !!byCode };
}
import { ProductDetailView } from '@/components/public/ProductDetailView';
import { hreflangAlternates, absUrl } from '@/lib/site-url';
import { JsonLd, productSchema, breadcrumbSchema } from '@/components/seo/JsonLd';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const loc = params.locale as Locale;
  let title = params.slug;
  let description = '';
  let ogImage: string | undefined;
  let canonicalSlug = params.slug;
  try {
    const products = await getProducts();
    const { product } = findProduct(products, params.slug);
    if (product) {
      title = product.name[loc] || product.name.vi;
      description = product.desc[loc] || product.meta[loc] || '';
      ogImage = product.images[0];
      canonicalSlug = product.slug;
    }
  } catch {
    /* DB unavailable */
  }
  const { canonical, languages } = hreflangAlternates(loc, `/products/${canonicalSlug}`);
  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      ...(ogImage ? { images: [{ url: absUrl(ogImage) }] } : {}),
    },
    twitter: {
      title,
      description,
      ...(ogImage ? { images: [absUrl(ogImage)] } : {}),
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(params.locale);
  const loc = params.locale as Locale;

  const products = await getProducts();
  const { product, legacy } = findProduct(products, params.slug);
  if (!product) notFound();
  // Old code-based URLs ('/products/p-01') permanently redirect to the SEO slug.
  if (legacy) permanentRedirect(`/${loc}/products/${product.slug}`);

  const related = Object.values(products)
    .filter((p) => p.code !== product.code && p.cat === product.cat)
    .concat(
      Object.values(products)
        .filter((p) => p.cat !== product.cat)
        .slice(0, 2),
    )
    .slice(0, 3);

  const productUrl = `/${loc}/products/${product.slug}`;
  const homeLabel = loc === 'zh' ? '首页' : loc === 'en' ? 'Home' : 'Trang chủ';
  const productsLabel = loc === 'zh' ? '产品' : loc === 'en' ? 'Products' : 'Sản phẩm';

  return (
    <>
      <JsonLd
        data={productSchema({
          name: product.name[loc] || product.name.vi,
          description: product.desc[loc] || product.meta[loc],
          imageUrls: product.images,
          sku: product.code,
          brand: 'KS Long Anh',
          url: productUrl,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: homeLabel, url: `/${loc}` },
          { name: productsLabel, url: `/${loc}/products` },
          { name: product.name[loc] || product.name.vi, url: productUrl },
        ])}
      />
      <ProductDetailView locale={loc} product={product} related={related} />
    </>
  );
}
