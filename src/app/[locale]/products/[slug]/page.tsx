import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { getProducts } from '@/lib/queries';
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
  try {
    const products = await getProducts();
    const product = products[params.slug.toUpperCase()];
    if (product) {
      title = product.name[loc] || product.name.vi;
      description = product.desc[loc] || product.meta[loc] || '';
      ogImage = product.images[0];
    }
  } catch {
    /* DB unavailable */
  }
  const { canonical, languages } = hreflangAlternates(loc, `/products/${params.slug}`);
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

  const code = params.slug.toUpperCase();
  const products = await getProducts();
  const product = products[code];
  if (!product) notFound();

  const related = Object.values(products)
    .filter((p) => p.code !== code && p.cat === product.cat)
    .concat(
      Object.values(products)
        .filter((p) => p.cat !== product.cat)
        .slice(0, 2),
    )
    .slice(0, 3);

  const productUrl = `/${loc}/products/${params.slug}`;
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
