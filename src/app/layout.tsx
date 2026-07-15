import type { Metadata } from 'next';
import { Inter, Be_Vietnam_Pro } from 'next/font/google';
// global styles
import '@/app/globals.css';
import { siteUrl } from '@/lib/site-url';
import { getSeoDefaults } from '@/lib/queries';
import { SiteAnalytics } from '@/components/seo/SiteAnalytics';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});
// Display / headline face — a geometric grotesque with more character than
// Inter and full Vietnamese diacritics. Wired to --va-display in globals.css.
const display = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

/**
 * Site-wide metadata. Defaults are overridable from /admin/seo (settings
 * group `seo`); static values below are the fallback when the DB is
 * unreachable or a field is left blank.
 */
export async function generateMetadata(): Promise<Metadata> {
  let base = siteUrl();
  let defaultTitle = 'KS Long Anh — Khoáng đá nguyên sinh từ Nghệ An';
  let description =
    'Long Anh chuyên sản xuất bột đá CaCO₃ và đá tự nhiên — phục vụ ngành nhựa, sơn, giấy, xây dựng và xuất khẩu toàn cầu.';
  let ogImage = '/assets/hero-sw.png';
  let twitterHandle: string | undefined;

  try {
    const seo = await getSeoDefaults();
    if (seo.canonicalBaseUrl) base = seo.canonicalBaseUrl.replace(/\/+$/, '');
    if (seo.metaTitle.vi) defaultTitle = seo.metaTitle.vi;
    if (seo.metaDesc.vi) description = seo.metaDesc.vi;
    if (seo.ogImage) ogImage = seo.ogImage;
    twitterHandle = seo.twitterHandle || undefined;
  } catch {
    // DB unavailable (build sandbox) — keep static fallbacks.
  }

  return {
    metadataBase: new URL(base),
    title: {
      default: defaultTitle,
      template: '%s · KS Long Anh',
    },
    description,
    openGraph: {
      type: 'website',
      siteName: 'KS Long Anh',
      locale: 'vi_VN',
      alternateLocale: ['en_US', 'zh_CN'],
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogImage],
      ...(twitterHandle ? { site: twitterHandle, creator: twitterHandle } : {}),
    },
    icons: {
      icon: '/assets/long-anh-logo.png',
    },
  };
}

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
    <html lang="vi" className={`${inter.variable} ${display.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SiteAnalytics />
        {children}
      </body>
    </html>
  );
}
