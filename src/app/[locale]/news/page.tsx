import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { NEWS } from '@/data/news';
import { NewsBoard } from '@/components/public/NewsBoard';

export default function NewsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const loc = locale as Locale;
  return <NewsBoard locale={loc} items={NEWS} />;
}
