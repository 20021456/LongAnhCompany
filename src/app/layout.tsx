import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
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

/**
 * Root layout — required by Next.js App Router. Provides <html>/<body>
 * for every route (localized public pages under [locale] and the
 * non-localized /admin panel).
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${fraunces.variable}`}>
      {/* suppressHydrationWarning: password managers / browser extensions
          inject attributes into <body> and form inputs before hydration */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
