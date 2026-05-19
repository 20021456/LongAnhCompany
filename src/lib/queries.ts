/**
 * Data-access layer — Phase 4.
 *
 * Server Components call these helpers to read content from the database
 * (seeded in Phase 3). Each helper reshapes Prisma rows into the same
 * structures the UI components already consume (the old `src/data/*`
 * shapes), so pages only swap their import + add `await`.
 *
 * These run only in Server Components / route handlers (they touch the
 * Prisma client directly).
 */

import { db } from '@/lib/db';
import type { ProductDetail } from '@/data/products';
import type { JobDetail } from '@/data/jobs';
import type { NewsItem } from '@/data/news';
import type { Locale } from '@/lib/i18n/config';
import { homeDefaults, HOME_SECTION_KEYS, type HomeSectionsLocale } from '@/lib/home-content';
import { aboutDefaults, ABOUT_SECTION_KEYS, type AboutSectionsLocale } from '@/lib/about-content';
import {
  productsPageDefaults,
  PRODUCTS_PAGE_SECTION_KEYS,
  type ProductsPageSectionsLocale,
} from '@/lib/products-page-content';
import {
  careersPageDefaults,
  CAREERS_PAGE_SECTION_KEYS,
  type CareersPageSectionsLocale,
} from '@/lib/careers-page-content';
import {
  newsPageDefaults,
  NEWS_PAGE_SECTION_KEYS,
  type NewsPageSectionsLocale,
} from '@/lib/news-page-content';
import {
  contactPageDefaults,
  CONTACT_PAGE_SECTION_KEYS,
  type ContactPageSectionsLocale,
} from '@/lib/contact-page-content';

type L3 = { vi: string; en: string; zh: string };

const l3 = (vi: string | null, en: string | null, zh: string | null): L3 => ({
  vi: vi ?? '',
  en: en ?? vi ?? '',
  zh: zh ?? vi ?? '',
});

// ─── Products ────────────────────────────────────────────────────────────

/** All products keyed by code — same shape as the old `PRODUCTS` map. */
export async function getProducts(): Promise<Record<string, ProductDetail>> {
  const rows = await db.product.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      category: true,
      variants: { orderBy: { sortOrder: 'asc' } },
      applications: { orderBy: { sortOrder: 'asc' } },
      packagings: { orderBy: { sortOrder: 'asc' } },
      specs: { orderBy: { sortOrder: 'asc' } },
    },
  });

  const out: Record<string, ProductDetail> = {};
  for (const p of rows) {
    out[p.code] = {
      code: p.code,
      cat: p.category.slug === 'caco3-powder' ? 0 : 1,
      name: l3(p.nameVi, p.nameEn, p.nameZh),
      meta: l3(p.summaryVi, p.summaryEn, p.summaryZh),
      desc: l3(p.shortDescVi, p.shortDescEn, p.shortDescZh),
      longDesc: l3(p.longDescVi, p.longDescEn, p.longDescZh),
      images:
        (p.gallery as unknown as string[] | null) ?? (p.coverImageUrl ? [p.coverImageUrl] : []),
      specs: p.specs.map((s) => ({
        key: s.specKey ?? '',
        val: s.valueVi,
        unit: s.unitText ?? undefined,
      })),
      applications: p.applications.map((a) => ({
        icon: a.icon ?? 'check',
        vi: a.nameVi,
        en: a.nameEn ?? a.nameVi,
        zh: a.nameZh ?? a.nameVi,
      })),
      packaging: p.packagings.map((pk) => ({
        vi: pk.nameVi,
        en: pk.nameEn ?? pk.nameVi,
        zh: pk.nameZh ?? pk.nameVi,
      })),
      features: (p.features as unknown as ProductDetail['features']) ?? { vi: [], en: [], zh: [] },
      tags: (p.tags as unknown as ProductDetail['tags']) ?? { vi: [], en: [], zh: [] },
      moq: l3(p.moq, p.moqEn, p.moqZh),
      leadTime: l3(p.productionTime, p.productionTimeEn, p.productionTimeZh),
      unit: l3(p.unitVi, p.unitEn, p.unitZh),
      variants: p.variants.map((v) => ({
        id: v.variantCode,
        label: l3(v.labelVi, v.labelEn, v.labelZh),
        vnd: v.price ? Number(v.price) : 0,
        stock: v.stock,
        popular: v.isPopular,
      })),
    };
  }
  return out;
}

export async function getProductByCode(code: string): Promise<ProductDetail | null> {
  const all = await getProducts();
  return all[code.toUpperCase()] ?? null;
}

export interface ProductCategorySummary {
  slug: string;
  cat: number;
  name: L3;
  description: L3;
  coverImageUrl: string | null;
}

export async function getProductCategories(): Promise<ProductCategorySummary[]> {
  const rows = await db.productCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
  return rows.map((c) => ({
    slug: c.slug,
    cat: c.slug === 'caco3-powder' ? 0 : 1,
    name: l3(c.nameVi, c.nameEn, c.nameZh),
    description: l3(c.descriptionVi, c.descriptionEn, c.descriptionZh),
    coverImageUrl: c.coverImageUrl,
  }));
}

// ─── Jobs ────────────────────────────────────────────────────────────────

/** All jobs keyed by slug — same shape as the old `JOBS` map. */
export async function getJobs(): Promise<Record<string, JobDetail>> {
  const rows = await db.job.findMany({
    where: { isActive: true },
    orderBy: { slug: 'asc' },
    include: { department: true },
  });

  const out: Record<string, JobDetail> = {};
  for (const j of rows) {
    out[j.slug] = {
      id: j.slug,
      dept: j.department.code,
      deptLabel: l3(j.department.nameVi, j.department.nameEn, j.department.nameZh),
      title: l3(j.titleVi, j.titleEn, j.titleZh),
      loc: l3(j.location, j.location, j.location),
      type: l3(j.typeVi, j.typeEn, j.typeZh),
      exp: l3(j.experienceVi, j.experienceEn, j.experienceZh),
      level: l3(j.levelVi, j.levelEn, j.levelZh),
      salary: l3(j.salaryTextVi, j.salaryTextEn, j.salaryTextZh),
      deadline: j.deadlineText ?? '',
      headcount: String(j.slots).padStart(2, '0'),
      tags: (j.tags as unknown as string[] | null) ?? [],
      overview: l3(j.descriptionVi, j.descriptionEn, j.descriptionZh),
      responsibilities: (j.responsibilities as unknown as JobDetail['responsibilities']) ?? {
        vi: [],
        en: [],
        zh: [],
      },
      requirements: (j.requirements as unknown as JobDetail['requirements']) ?? {
        vi: [],
        en: [],
        zh: [],
      },
      benefits: (j.benefits as unknown as JobDetail['benefits']) ?? { vi: [], en: [], zh: [] },
    };
  }
  return out;
}

export async function getJobBySlug(slug: string): Promise<JobDetail | null> {
  const all = await getJobs();
  return all[slug] ?? null;
}

// ─── Articles ────────────────────────────────────────────────────────────

/** Published articles, newest first — same shape as the old `NEWS` array. */
export async function getArticles(): Promise<NewsItem[]> {
  const rows = await db.article.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
    include: { category: true },
  });
  return rows.map((a) => ({
    id: Number(a.slug),
    views: a.views,
    comments: a.commentCount,
    cat: a.category?.slug ?? 'business',
    date: (a.publishedAt ?? a.createdAt).toISOString().slice(0, 10),
    readMin: a.readTimeMin ?? 3,
    img: a.coverImageUrl ?? '',
    title: l3(a.titleVi, a.titleEn, a.titleZh),
    excerpt: l3(a.excerptVi, a.excerptEn, a.excerptZh),
    content: l3(a.contentVi, a.contentEn, a.contentZh),
  }));
}

export async function getArticleBySlug(slug: string): Promise<NewsItem | null> {
  const all = await getArticles();
  return all.find((n) => String(n.id) === slug) ?? null;
}

// ─── CMS content ─────────────────────────────────────────────────────────

export interface CertItem {
  code: string;
  name: string;
  badge: string;
  desc: L3;
}

export async function getCertifications(): Promise<CertItem[]> {
  const rows = await db.certification.findMany({ orderBy: { sortOrder: 'asc' } });
  return rows.map((c) => ({
    code: c.code,
    name: c.name,
    badge: c.badgeImageUrl ?? '',
    desc: l3(c.descriptionVi, c.descriptionEn, c.descriptionZh),
  }));
}

export interface TimelineItem {
  year: number;
  title: L3;
  body: L3;
}

export async function getTimeline(): Promise<TimelineItem[]> {
  const rows = await db.timelineEvent.findMany({ orderBy: { sortOrder: 'asc' } });
  return rows.map((t) => ({
    year: t.year,
    title: l3(t.titleVi, t.titleEn, t.titleZh),
    body: l3(t.bodyVi, t.bodyEn, t.bodyZh),
  }));
}

export interface CoreValueItem {
  scope: string;
  icon: string;
  title: L3;
  body: L3;
}

export async function getCoreValues(scope?: string): Promise<CoreValueItem[]> {
  const rows = await db.coreValue.findMany({
    where: scope ? { scope } : undefined,
    orderBy: { sortOrder: 'asc' },
  });
  return rows.map((cv) => ({
    scope: cv.scope,
    icon: cv.icon ?? 'check',
    title: l3(cv.titleVi, cv.titleEn, cv.titleZh),
    body: l3(cv.bodyVi, cv.bodyEn, cv.bodyZh),
  }));
}

export interface StatItem {
  key: string;
  value: string;
  label: L3;
  icon: string;
}

export async function getStats(scope = 'home'): Promise<StatItem[]> {
  const rows = await db.stat.findMany({
    where: { scope },
    orderBy: { sortOrder: 'asc' },
  });
  return rows.map((s) => ({
    key: s.key,
    value: s.value,
    label: l3(s.labelVi, s.labelEn, s.labelZh),
    icon: s.icon ?? 'box',
  }));
}

/** Settings as a nested map: settings['contact']['phone_main'] = L3 */
export async function getSettings(): Promise<Record<string, Record<string, L3>>> {
  const rows = await db.setting.findMany();
  const out: Record<string, Record<string, L3>> = {};
  for (const s of rows) {
    const [group, key] = s.key.includes('.') ? s.key.split('.') : ['general', s.key];
    (out[group] ??= {})[key] = l3(s.valueVi, s.valueEn, s.valueZh);
  }
  return out;
}

export interface MenuLink {
  label: L3;
  url: string;
}

export async function getMenu(location: 'header' | 'footer'): Promise<MenuLink[]> {
  const menu = await db.menu.findUnique({
    where: { location },
    include: { items: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
  });
  if (!menu) return [];
  return menu.items.map((i) => ({
    label: l3(i.labelVi, i.labelEn, i.labelZh),
    url: i.url,
  }));
}

// ─── Pages / sections ─────────────────────────────────────────────────────

/**
 * Editable content for every section of the home page. Each section is read
 * from the `page_sections` table; sections that have not been customised in
 * the admin fall back to the static COPY-derived defaults.
 */
export async function getHomeSections(locale: Locale): Promise<HomeSectionsLocale> {
  const out = homeDefaults(locale);
  const page = await db.page.findUnique({
    where: { key: 'home' },
    include: { sections: true },
  });
  if (!page) return out;

  const view = out as unknown as Record<string, Record<string, unknown>>;
  for (const key of HOME_SECTION_KEYS) {
    const section = page.sections.find((s) => s.sectionKey === key);
    if (!section || !section.isVisible) continue;
    const byLocale = section.content as Record<string, unknown> | null;
    const c = byLocale?.[locale];
    if (c && typeof c === 'object') {
      view[key] = { ...view[key], ...(c as Record<string, unknown>) };
    }
  }
  return out;
}

/**
 * Same shape as getHomeSections but for /about. Returns the merged
 * `aboutDefaults(locale)` overlaid with any rows persisted in
 * `page_sections` for the "about" page.
 */
export async function getAboutSections(locale: Locale): Promise<AboutSectionsLocale> {
  const out = aboutDefaults(locale);
  const page = await db.page.findUnique({
    where: { key: 'about' },
    include: { sections: true },
  });
  if (!page) return out;

  const view = out as unknown as Record<string, Record<string, unknown>>;
  for (const key of ABOUT_SECTION_KEYS) {
    const section = page.sections.find((s) => s.sectionKey === key);
    if (!section || !section.isVisible) continue;
    const byLocale = section.content as Record<string, unknown> | null;
    const c = byLocale?.[locale];
    if (c && typeof c === 'object') {
      view[key] = { ...view[key], ...(c as Record<string, unknown>) };
    }
  }
  return out;
}

/**
 * Same shape, for the /products listing page. Returns the merged
 * `productsPageDefaults(locale)` overlaid with any rows persisted in
 * `page_sections` for the "products" page.
 */
export async function getProductsPageSections(locale: Locale): Promise<ProductsPageSectionsLocale> {
  const out = productsPageDefaults(locale);
  const page = await db.page.findUnique({
    where: { key: 'products' },
    include: { sections: true },
  });
  if (!page) return out;

  const view = out as unknown as Record<string, Record<string, unknown>>;
  for (const key of PRODUCTS_PAGE_SECTION_KEYS) {
    const section = page.sections.find((s) => s.sectionKey === key);
    if (!section || !section.isVisible) continue;
    const byLocale = section.content as Record<string, unknown> | null;
    const c = byLocale?.[locale];
    if (c && typeof c === 'object') {
      view[key] = { ...view[key], ...(c as Record<string, unknown>) };
    }
  }
  return out;
}

/** Same shape, for the /career listing page. */
export async function getCareersPageSections(locale: Locale): Promise<CareersPageSectionsLocale> {
  const out = careersPageDefaults(locale);
  const page = await db.page.findUnique({
    where: { key: 'career' },
    include: { sections: true },
  });
  if (!page) return out;

  const view = out as unknown as Record<string, Record<string, unknown>>;
  for (const key of CAREERS_PAGE_SECTION_KEYS) {
    const section = page.sections.find((s) => s.sectionKey === key);
    if (!section || !section.isVisible) continue;
    const byLocale = section.content as Record<string, unknown> | null;
    const c = byLocale?.[locale];
    if (c && typeof c === 'object') {
      view[key] = { ...view[key], ...(c as Record<string, unknown>) };
    }
  }
  return out;
}

/** Same shape, for the /news listing page. */
export async function getNewsPageSections(locale: Locale): Promise<NewsPageSectionsLocale> {
  const out = newsPageDefaults(locale);
  const page = await db.page.findUnique({
    where: { key: 'news' },
    include: { sections: true },
  });
  if (!page) return out;

  const view = out as unknown as Record<string, Record<string, unknown>>;
  for (const key of NEWS_PAGE_SECTION_KEYS) {
    const section = page.sections.find((s) => s.sectionKey === key);
    if (!section || !section.isVisible) continue;
    const byLocale = section.content as Record<string, unknown> | null;
    const c = byLocale?.[locale];
    if (c && typeof c === 'object') {
      view[key] = { ...view[key], ...(c as Record<string, unknown>) };
    }
  }
  return out;
}

/** Same shape, for the /contact page. */
export async function getContactPageSections(locale: Locale): Promise<ContactPageSectionsLocale> {
  const out = contactPageDefaults(locale);
  const page = await db.page.findUnique({
    where: { key: 'contact' },
    include: { sections: true },
  });
  if (!page) return out;

  const view = out as unknown as Record<string, Record<string, unknown>>;
  for (const key of CONTACT_PAGE_SECTION_KEYS) {
    const section = page.sections.find((s) => s.sectionKey === key);
    if (!section || !section.isVisible) continue;
    const byLocale = section.content as Record<string, unknown> | null;
    const c = byLocale?.[locale];
    if (c && typeof c === 'object') {
      view[key] = { ...view[key], ...(c as Record<string, unknown>) };
    }
  }
  return out;
}
