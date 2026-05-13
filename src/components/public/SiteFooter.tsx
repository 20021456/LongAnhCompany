import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Logo } from '@/components/ui/Icon';

interface Props {
  locale: Locale;
}

export function SiteFooter({ locale }: Props) {
  const C = COPY[locale];

  const shortBrand =
    locale === 'zh' ? '龙英矿业' : locale === 'en' ? 'LONG ANH MINERAL' : 'KS LONG ANH';

  const navHrefs = [
    `/${locale}`,
    `/${locale}/about`,
    `/${locale}/products`,
    `/${locale}/career`,
    `/${locale}/news`,
    `/${locale}/contact`,
  ];

  return (
    <footer className="va-ft">
      <div className="va-wrap">
        <div className="va-ft-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <Logo size={42} />
              <b style={{ color: '#fff', fontSize: 14, letterSpacing: '.04em' }}>{shortBrand}</b>
            </div>
            <p style={{ lineHeight: 1.6, opacity: 0.65, margin: 0 }}>
              {locale === 'zh'
                ? '越南北中部领先的碳酸钙粉和天然石材制造商。'
                : locale === 'en'
                  ? 'A leading manufacturer of calcium carbonate powder and natural stone in North-Central Vietnam.'
                  : 'Nhà sản xuất bột đá Canxi Cacbonat và đá tự nhiên hàng đầu Bắc Trung Bộ.'}
            </p>
            <div className="va-ft-social">
              <a
                href="https://www.facebook.com/longanhcorp"
                target="_blank"
                rel="noopener"
                aria-label="Facebook"
                title="Facebook"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/longanhcorp"
                target="_blank"
                rel="noopener"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43c-1.14 0-2.07-.93-2.07-2.07s.93-2.07 2.07-2.07 2.07.93 2.07 2.07-.93 2.07-2.07 2.07zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/longanhcorp"
                target="_blank"
                rel="noopener"
                aria-label="X / Twitter"
                title="X / Twitter"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
                </svg>
              </a>
              <a
                href="https://zalo.me/longanhcorp"
                target="_blank"
                rel="noopener"
                aria-label="Zalo"
                title="Zalo"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 5.94 2 10.8c0 2.78 1.47 5.26 3.77 6.88l-.84 2.97c-.07.24.18.44.4.32l3.16-1.78c1.07.32 2.22.49 3.41.49h.1c5.52 0 10-3.94 10-8.8S17.52 2 12 2zm-4.5 9.6h-2v-.85h1.05V8.4H5.5v-.85h2v4.05zm2.5 0h-1.1v-4.05h1.1v4.05zm3.4 0h-2.95v-.65l1.78-2.6h-1.69V7.55h2.85v.65l-1.79 2.6h1.8v.8zm3.7-2.02c0 1.13-.92 2.05-2.05 2.05s-2.05-.92-2.05-2.05.92-2.05 2.05-2.05 2.05.92 2.05 2.05zm-2.05 1.05c.58 0 1.05-.47 1.05-1.05s-.47-1.05-1.05-1.05-1.05.47-1.05 1.05.47 1.05 1.05 1.05z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h5>{locale === 'zh' ? '产品' : locale === 'en' ? 'Products' : 'Sản phẩm'}</h5>
            {C.products.map((p: { name: string }, i: number) => (
              <Link key={i} href={`/${locale}/products`}>
                {p.name}
              </Link>
            ))}
          </div>

          <div>
            <h5>{locale === 'zh' ? '公司' : locale === 'en' ? 'Company' : 'Công ty'}</h5>
            {C.nav.map((n: string, i: number) => (
              <Link key={i} href={navHrefs[i]}>
                {n}
              </Link>
            ))}
          </div>

          <div>
            <h5>{locale === 'zh' ? '联系' : locale === 'en' ? 'Contact' : 'Liên hệ'}</h5>
            <a href={`tel:${C.phone[0]}`}>{C.phone[0]}</a>
            <a href={`tel:${C.phone[1]}`}>{C.phone[1]}</a>
            <a href={`mailto:${C.email}`}>{C.email}</a>
          </div>
        </div>
        <div className="va-ft-bottom">
          <span>{C.footnote}</span>
          <span>Made in Nghệ An · Vietnam</span>
        </div>
      </div>
    </footer>
  );
}
