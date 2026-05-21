import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n/config';
import { SiteHeader } from '@/components/public/SiteHeader';
import { SiteFooter } from '@/components/public/SiteFooter';
import { ChatWidget } from '@/components/public/ChatWidget';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Locale layout — wraps the public site. The <html>/<body> live in the
 * root layout; this layer adds the i18n provider + public chrome.
 */
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
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="va">
        <SiteHeader locale={locale as Locale} />
        {children}
        <SiteFooter locale={locale as Locale} />
        {process.env.ENABLE_LIVE_CHAT === 'true' ? <ChatWidget locale={locale as Locale} /> : null}
      </div>
    </NextIntlClientProvider>
  );
}
