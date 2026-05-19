import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { db } from '@/lib/db';
import { absUrl, hreflangAlternates } from '@/lib/site-url';

const SUF: Record<Locale, 'Vi' | 'En' | 'Zh'> = { vi: 'Vi', en: 'En', zh: 'Zh' };
const OG_LOCALE: Record<Locale, string> = {
  vi: 'vi_VN',
  en: 'en_US',
  zh: 'zh_CN',
};

interface PageMetaInput {
  /** KNOWN_PAGES key — looks up the matching `pages` row for meta overrides. */
  pageKey: string;
  locale: Locale;
  /** Path without the leading `/locale` (e.g. `/products`). Use `/` for home. */
  pathStripped: string;
  fallbackTitle: string;
  fallbackDescription: string;
  /** Default OG image when neither the page row nor the page itself has one. */
  fallbackOgImage?: string;
}

/**
 * Build per-page `<Metadata>` honouring the editor's overrides on the
 * `pages` row (metaTitle / metaDesc / ogImageUrl) and falling back to
 * sensible static defaults when the DB is unreachable (build sandbox).
 *
 * Also wires `alternates.languages` for hreflang.
 */
export async function buildPageMetadata({
  pageKey,
  locale,
  pathStripped,
  fallbackTitle,
  fallbackDescription,
  fallbackOgImage,
}: PageMetaInput): Promise<Metadata> {
  let title = fallbackTitle;
  let description = fallbackDescription;
  let ogImage = fallbackOgImage;

  try {
    const row = await db.page.findUnique({ where: { key: pageKey } });
    if (row) {
      const suf = SUF[locale];
      const metaTitle =
        (row[`metaTitle${suf}` as 'metaTitleVi'] as string | null | undefined) ?? null;
      const baseTitle = (row[`title${suf}` as 'titleVi'] as string | null | undefined) ?? null;
      const metaDesc = (row[`metaDesc${suf}` as 'metaDescVi'] as string | null | undefined) ?? null;
      title = metaTitle || baseTitle || fallbackTitle;
      description = metaDesc || fallbackDescription;
      ogImage = row.ogImageUrl || ogImage;
    }
  } catch {
    // DB unavailable (sandbox / build without DATABASE_URL) — keep fallbacks.
  }

  const { canonical, languages } = hreflangAlternates(locale, pathStripped);
  const ogImages = ogImage ? [{ url: absUrl(ogImage) }] : undefined;

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: OG_LOCALE[locale],
      ...(ogImages ? { images: ogImages } : {}),
    },
    twitter: {
      title,
      description,
      ...(ogImage ? { images: [absUrl(ogImage)] } : {}),
    },
  };
}
