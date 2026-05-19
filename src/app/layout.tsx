import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import '@/app/globals.css';
import { siteUrl } from '@/lib/site-url';

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
  metadataBase: new URL(siteUrl()),
  title: {
    default: 'KS Long Anh — Khoáng đá nguyên sinh từ Nghệ An',
    template: '%s · KS Long Anh',
  },
  description:
    'Long Anh chuyên sản xuất bột đá CaCO₃ và đá tự nhiên — phục vụ ngành nhựa, sơn, giấy, xây dựng và xuất khẩu toàn cầu.',
  openGraph: {
    type: 'website',
    siteName: 'KS Long Anh',
    locale: 'vi_VN',
    alternateLocale: ['en_US', 'zh_CN'],
    images: [{ url: '/assets/hero-sw.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/assets/hero-sw.png'],
  },
  icons: {
    icon: '/assets/long-anh-logo.png',
  },
};

/**
 * Root layout — required by Next.js App Router. Provides <html>/<body>
 * for every route (localized public pages under [locale] and the
 * non-localized /admin panel).
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // `suppressHydrationWarning` on <html> covers attributes injected by dark-
    // mode / theme extensions (Dark Reader, color-scheme, etc.). The same on
    // <body> covers password-manager / autofill probes on form inputs.
    <html lang="vi" className={`${inter.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
