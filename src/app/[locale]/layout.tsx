import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n/config';
import { SiteHeader } from '@/components/public/SiteHeader';
import { SiteFooter } from '@/components/public/SiteFooter';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'KS Long Anh — Khoáng đá nguyên sinh từ Nghệ An',
    template: '%s · KS Long Anh',
  },
  description:
    'Long Anh chuyên sản xuất bột đá CaCO₃ và đá tự nhiên — phục vụ ngành nhựa, sơn, giấy, xây dựng và xuất khẩu toàn cầu.',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="va">
            <SiteHeader locale={locale as Locale} />
            {children}
            <SiteFooter locale={locale as Locale} />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
