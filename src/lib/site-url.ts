import type { Locale } from '@/lib/i18n/config';
import { locales } from '@/lib/i18n/config';

/**
 * Canonical site URL used for absolute URLs in sitemap, OpenGraph,
 * JSON-LD, etc. Reads `NEXT_PUBLIC_SITE_URL` first (set in production),
 * falls back to `NEXTAUTH_URL`, then to localhost for dev.
 *
 * Always returns a value with no trailing slash.
 */
export function siteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return raw.replace(/\/+$/, '');
}

/** Build an absolute URL from a path beginning with `/`. */
export function absUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl()}${p}`;
}

/**
 * For a given pathname under one locale (e.g. `/vi/products`), return the
 * `alternates.languages` map pointing to the same content in each locale
 * plus an `x-default`. Use inside `generateMetadata`.
 */
export function hreflangAlternates(
  currentLocale: Locale,
  relPath: string,
): {
  canonical: string;
  languages: Record<string, string>;
} {
  // Strip any leading locale segment from relPath.
  const stripped = relPath.replace(/^\/(vi|en|zh)(?=\/|$)/, '') || '/';
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = absUrl(`/${l}${stripped === '/' ? '' : stripped}`);
  }
  languages['x-default'] = absUrl(`/vi${stripped === '/' ? '' : stripped}`);
  return {
    canonical: absUrl(`/${currentLocale}${stripped === '/' ? '' : stripped}`),
    languages,
  };
}
