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
  whatsapp: {
    label: 'WhatsApp',
    path: 'M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.004c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zM12.04 20.15h-.004c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.264 8.264 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z',
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
            <h3>{locale === 'zh' ? '产品' : locale === 'en' ? 'Products' : 'Sản phẩm'}</h3>
            {C.products.map((p: { name: string }, i: number) => (
              <Link key={i} href={`/${locale}/products`}>
                {p.name}
              </Link>
            ))}
          </div>

          <div>
            <h3>{locale === 'zh' ? '公司' : locale === 'en' ? 'Company' : 'Công ty'}</h3>
            {companyLinks.map((link, i) => (
              <Link key={i} href={localizeHref(link.url, locale)}>
                {link.label}
              </Link>
            ))}
          </div>

          <div>
            <h3>{locale === 'zh' ? '联系' : locale === 'en' ? 'Contact' : 'Liên hệ'}</h3>
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
