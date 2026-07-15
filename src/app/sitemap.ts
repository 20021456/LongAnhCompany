import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n/config';
import { absUrl } from '@/lib/site-url';
import { db } from '@/lib/db';

/** Static landing routes for every locale. */
const STATIC_PATHS = ['', '/about', '/products', '/career', '/news', '/contact'] as const;

/** Build per-locale alternate links for one stripped path. */
function localeAlts(stripped: string): Record<string, string> {
  const langs: Record<string, string> = {};
  for (const l of locales) langs[l] = absUrl(`/${l}${stripped}`);
  langs['x-default'] = absUrl(`/vi${stripped}`);
  return langs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // ─── Static pages (per locale) ─────────────────────────────────────────
  for (const path of STATIC_PATHS) {
    const alts = localeAlts(path);
    for (const l of locales) {
      entries.push({
        url: alts[l],
        lastModified: now,
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.8,
        alternates: { languages: alts },
      });
    }
  }

  // ─── Dynamic detail pages — wrap in try/catch so a missing DB at build
  //     time (sandbox / CI) doesn't kill the sitemap output. ────────────
  try {
    const products = await db.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });
    for (const p of products) {
      const stripped = `/products/${p.slug}`;
      const alts = localeAlts(stripped);
      for (const l of locales) {
        entries.push({
          url: alts[l],
          lastModified: p.updatedAt,
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: { languages: alts },
        });
      }
    }
  } catch (err) {
    console.warn('[sitemap] products lookup failed:', err);
  }

  try {
    const jobs = await db.job.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });
    for (const j of jobs) {
      const stripped = `/career/${j.slug}`;
      const alts = localeAlts(stripped);
      for (const l of locales) {
        entries.push({
          url: alts[l],
          lastModified: j.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.6,
          alternates: { languages: alts },
        });
      }
    }
  } catch (err) {
    console.warn('[sitemap] jobs lookup failed:', err);
  }

  try {
    const articles = await db.article.findMany({
      where: { status: 'published' },
      select: { slug: true, updatedAt: true },
    });
    for (const a of articles) {
      const stripped = `/news/${a.slug}`;
      const alts = localeAlts(stripped);
      for (const l of locales) {
        entries.push({
          url: alts[l],
          lastModified: a.updatedAt,
          changeFrequency: 'monthly',
          priority: 0.5,
          alternates: { languages: alts },
        });
      }
    }
  } catch (err) {
    console.warn('[sitemap] articles lookup failed:', err);
  }

  return entries;
}
