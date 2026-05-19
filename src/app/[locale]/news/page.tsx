import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { getArticles, getNewsPageSections } from '@/lib/queries';
import { NewsBoard } from '@/components/public/NewsBoard';
import { buildPageMetadata } from '@/lib/page-metadata';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildPageMetadata({
    pageKey: 'news',
    locale: locale as Locale,
    pathStripped: '/news',
    fallbackTitle: 'Tin tức · KS Long Anh',
    fallbackDescription:
      'Cập nhật mới nhất từ Long Anh — xuất khẩu, dây chuyền sản xuất, chứng nhận quốc tế, sự kiện ngành khoáng sản.',
    fallbackOgImage: '/assets/kho-hang-xuat-khau.webp',
  });
}

export default async function NewsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const loc = locale as Locale;
  const [items, sections] = await Promise.all([getArticles(), getNewsPageSections(loc)]);
  return <NewsBoard locale={loc} items={items} sections={sections} />;
}
