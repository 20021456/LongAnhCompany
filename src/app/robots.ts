import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site-url';
import { getSeoDefaults } from '@/lib/queries';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = siteUrl();

  // When "Cho phép lập chỉ mục" is turned off at /admin/seo, block everything
  // — used while the site is still staging / unpublished.
  let indexable = true;
  try {
    indexable = (await getSeoDefaults()).robotsIndexable;
  } catch {
    // DB unavailable (build sandbox) — default to indexable.
  }

  return {
    rules: indexable
      ? [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }]
      : [{ userAgent: '*', disallow: '/' }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
