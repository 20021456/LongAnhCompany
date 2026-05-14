import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { getArticles } from '@/lib/queries';
import { NewsBoard } from '@/components/public/NewsBoard';

export default async function NewsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const loc = locale as Locale;
  const items = await getArticles();
  return <NewsBoard locale={loc} items={items} />;
}
