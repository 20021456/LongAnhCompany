import { absUrl, siteUrl } from '@/lib/site-url';

/**
 * Emit a single `<script type="application/ld+json">` tag. Server-rendered
 * — drop it anywhere inside a Server Component's tree.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // Data is built server-side from typed objects below — no user HTML
      // ever reaches this string, so the eslint dangerous-html rule is fine
      // to suppress here.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── Schema builders ──────────────────────────────────────────────────────

export function organizationSchema(opts: {
  name: string;
  legalName?: string;
  url?: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  sameAs?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: opts.name,
    ...(opts.legalName ? { legalName: opts.legalName } : {}),
    url: opts.url ?? siteUrl(),
    ...(opts.logo ? { logo: absUrl(opts.logo) } : {}),
    ...(opts.email ? { email: opts.email } : {}),
    ...(opts.phone ? { telephone: opts.phone } : {}),
    ...(opts.address
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: opts.address,
            addressCountry: 'VN',
          },
        }
      : {}),
    ...(opts.sameAs?.length ? { sameAs: opts.sameAs } : {}),
  };
}

export function webSiteSchema(opts: { name: string; url?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: opts.name,
    url: opts.url ?? siteUrl(),
  };
}

export function productSchema(opts: {
  name: string;
  description?: string;
  imageUrls?: string[];
  sku?: string;
  brand?: string;
  category?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.imageUrls?.length ? { image: opts.imageUrls.map(absUrl) } : {}),
    ...(opts.sku ? { sku: opts.sku } : {}),
    ...(opts.brand ? { brand: { '@type': 'Brand', name: opts.brand } } : {}),
    ...(opts.category ? { category: opts.category } : {}),
    url: absUrl(opts.url),
  };
}

export function jobPostingSchema(opts: {
  title: string;
  description?: string;
  datePosted: string; // ISO
  validThrough?: string; // ISO
  employmentType?: string; // FULL_TIME / PART_TIME / CONTRACTOR / TEMPORARY / INTERN
  location?: string;
  hiringOrgName: string;
  hiringOrgUrl?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  url: string;
}) {
  const employmentMap: Record<string, string> = {
    full_time: 'FULL_TIME',
    part_time: 'PART_TIME',
    contract: 'CONTRACTOR',
    contractor: 'CONTRACTOR',
    intern: 'INTERN',
    temporary: 'TEMPORARY',
  };
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: opts.title,
    ...(opts.description ? { description: opts.description } : {}),
    datePosted: opts.datePosted,
    ...(opts.validThrough ? { validThrough: opts.validThrough } : {}),
    ...(opts.employmentType
      ? {
          employmentType: employmentMap[opts.employmentType.toLowerCase()] ?? opts.employmentType,
        }
      : {}),
    hiringOrganization: {
      '@type': 'Organization',
      name: opts.hiringOrgName,
      ...(opts.hiringOrgUrl ? { sameAs: opts.hiringOrgUrl } : {}),
    },
    ...(opts.location
      ? {
          jobLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              addressLocality: opts.location,
              addressCountry: 'VN',
            },
          },
        }
      : {}),
    ...(opts.salaryMin || opts.salaryMax
      ? {
          baseSalary: {
            '@type': 'MonetaryAmount',
            currency: opts.salaryCurrency ?? 'VND',
            value: {
              '@type': 'QuantitativeValue',
              ...(opts.salaryMin ? { minValue: opts.salaryMin } : {}),
              ...(opts.salaryMax ? { maxValue: opts.salaryMax } : {}),
              unitText: 'MONTH',
            },
          },
        }
      : {}),
    url: absUrl(opts.url),
  };
}

export function articleSchema(opts: {
  headline: string;
  description?: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  publisherName: string;
  publisherLogo?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: opts.headline,
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.imageUrl ? { image: [absUrl(opts.imageUrl)] } : {}),
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    ...(opts.authorName ? { author: { '@type': 'Person', name: opts.authorName } } : {}),
    publisher: {
      '@type': 'Organization',
      name: opts.publisherName,
      ...(opts.publisherLogo
        ? { logo: { '@type': 'ImageObject', url: absUrl(opts.publisherLogo) } }
        : {}),
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': absUrl(opts.url) },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absUrl(it.url),
    })),
  };
}
