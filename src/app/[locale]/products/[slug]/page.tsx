import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { getProducts } from '@/lib/queries';
import { ProductDetailView } from '@/components/public/ProductDetailView';

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
    .concat(Object.values(products).filter((p) => p.cat !== product.cat).slice(0, 2))
    .slice(0, 3);

  return <ProductDetailView locale={loc} product={product} related={related} />;
}
