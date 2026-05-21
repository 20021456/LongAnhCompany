import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Logo } from '@/components/ui/Icon';
import { getMenu, getSettings } from '@/lib/queries';

interface Props {
  locale: Locale;
}

/** Prefix a CMS menu URL with the active locale (external URLs untouched). */
function localizeHref(url: string, locale: Locale): string {
  if (/^https?:\/\//i.test(url)) return url;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `/${locale}${path === '/' ? '' : path}`;
}

const FALLBACK_PATHS = ['/', '/about', '/products', '/career', '/news', '/contact'];

/** SVG glyphs for the social icons, keyed by the `social.*` settings key. */
const SOCIAL_GLYPHS: Record<string, { label: string; path: string }> = {
  facebook: {
    label: 'Facebook',
    path: 'M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01z',
  },
  linkedin: {
    label: 'LinkedIn',
    path: 'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43c-1.14 0-2.07-.93-2.07-2.07s.93-2.07 2.07-2.07 2.07.93 2.07 2.07-.93 2.07-2.07 2.07zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z',
  },
  twitter: {
    label: 'X / Twitter',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z',
  },
  zalo: {
    label: 'Zalo',
    path: 'M12 2C6.48 2 2 5.94 2 10.8c0 2.78 1.47 5.26 3.77 6.88l-.84 2.97c-.07.24.18.44.4.32l3.16-1.78c1.07.32 2.22.49 3.41.49h.1c5.52 0 10-3.94 10-8.8S17.52 2 12 2zm-4.5 9.6h-2v-.85h1.05V8.4H5.5v-.85h2v4.05zm2.5 0h-1.1v-4.05h1.1v4.05zm3.4 0h-2.95v-.65l1.78-2.6h-1.69V7.55h2.85v.65l-1.79 2.6h1.8v.8zm3.7-2.02c0 1.13-.92 2.05-2.05 2.05s-2.05-.92-2.05-2.05.92-2.05 2.05-2.05 2.05.92 2.05 2.05zm-2.05 1.05c.58 0 1.05-.47 1.05-1.05s-.47-1.05-1.05-1.05-1.05.47-1.05 1.05.47 1.05 1.05 1.05z',
  },
};

export async function SiteFooter({ locale }: Props) {
  const C = COPY[locale];
  const [menu, settings] = await Promise.all([getMenu('footer'), getSettings()]);

  const shortBrand =
    settings.site?.brand_short?.[locale] ||
    (locale === 'zh' ? '龙英矿业' : locale === 'en' ? 'LONG ANH MINERAL' : 'KS LONG ANH');
  const footnote = settings.site?.footnote?.[locale] || C.footnote;

  const companyLinks: { label: string; url: string }[] =
    menu.length > 0
      ? menu.map((m) => ({ label: m.label[locale] || m.label.vi, url: m.url }))
      : C.nav.map((label: string, i: number) => ({ label, url: FALLBACK_PATHS[i] }));

  const phoneMain = settings.contact?.phone_main?.[locale] || C.phone[0];
  const phoneSecondary = settings.contact?.phone_secondary?.[locale] || C.phone[1];
  const emailMain = settings.contact?.email_main?.[locale] || C.email;

  // Social links — only render the channels that have a URL configured.
  const socials = Object.entries(SOCIAL_GLYPHS)
    .map(([key, glyph]) => ({ ...glyph, url: settings.social?.[key]?.[locale] || '' }))
    .filter((s) => s.url);

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
            {socials.length > 0 ? (
              <div className="va-ft-social">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener"
                    aria-label={s.label}
                    title={s.label}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
              </div>
            ) : null}
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
            {companyLinks.map((link, i) => (
              <Link key={i} href={localizeHref(link.url, locale)}>
                {link.label}
              </Link>
            ))}
          </div>

          <div>
            <h5>{locale === 'zh' ? '联系' : locale === 'en' ? 'Contact' : 'Liên hệ'}</h5>
            {phoneMain ? <a href={`tel:${phoneMain}`}>{phoneMain}</a> : null}
            {phoneSecondary ? <a href={`tel:${phoneSecondary}`}>{phoneSecondary}</a> : null}
            {emailMain ? <a href={`mailto:${emailMain}`}>{emailMain}</a> : null}
          </div>
        </div>
        <div className="va-ft-bottom">
          <span>{footnote}</span>
          <span>Made in Nghệ An · Vietnam</span>
        </div>
      </div>
    </footer>
  );
}
