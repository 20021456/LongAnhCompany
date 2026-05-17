/**
 * News page section content — the editable CMS model for
 * `/admin/pages/news`. Mirrors the home / about / products / careers page
 * editors so all five share the `page_sections` persistence shape
 * (`{ vi, en, zh }` JSON per sectionKey).
 *
 * 6 sections, matching admin/page-edit-news.html in the prototype:
 *   hero          — eyebrow + main title + sub + search placeholder + toggle
 *   categories    — N category rows (label + slug)
 *   featured      — featured-pick mode + ordered article IDs
 *   listConfig    — per-page + sort + layout + sidebar toggles
 *   byCategory    — eyebrow + title + how many cats + articles per cat
 *   newsletter    — title + sub + placeholder + button + footer + list ID
 *
 * (SEO is handled by the page-level meta fields, not a section.)
 */

import type { Locale } from './i18n/config';

// ─── Per-section shapes ───────────────────────────────────────────────────

export interface NewsHeroSection {
  eyebrow: string;
  title: string;
  sub: string;
  searchPlaceholder: string;
  searchEnabled: boolean;
}

export interface NewsCategoryRow {
  /** Category label shown on the chip. Locale-aware. */
  label: string;
  /** URL slug — locale-independent so we don't store per-locale. */
  slug: string;
}
export interface NewsCategoriesSection {
  items: NewsCategoryRow[];
}

export type NewsFeaturedMode = 'auto-views' | 'manual' | 'flag';
export interface NewsFeaturedSection {
  mode: NewsFeaturedMode;
  /** Ordered list of article IDs/slugs that should appear when mode='manual'. */
  articleIds: string[];
}

export type NewsListLayout = 'grid-3' | 'grid-2' | 'list-image-left';
export type NewsListSort = 'newest' | 'oldest' | 'most-viewed' | 'most-commented';
export interface NewsListConfigSection {
  perPage: number;
  sort: NewsListSort;
  layout: NewsListLayout;
  sidebarHotTopics: boolean;
  sidebarLatest: boolean;
  sidebarNewsletter: boolean;
  sidebarAd: boolean;
}

export type NewsByCategoryMode = 'top-2' | 'top-3' | 'all';
export interface NewsByCategorySection {
  eyebrow: string;
  title: string;
  mode: NewsByCategoryMode;
  articlesPerCategory: number;
}

export interface NewsNewsletterSection {
  title: string;
  sub: string;
  inputPlaceholder: string;
  buttonLabel: string;
  footer: string;
  mailingListId: string;
}

export interface NewsPageSectionsLocale {
  hero: NewsHeroSection;
  categories: NewsCategoriesSection;
  featured: NewsFeaturedSection;
  listConfig: NewsListConfigSection;
  byCategory: NewsByCategorySection;
  newsletter: NewsNewsletterSection;
}

export type NewsPageSections = Record<Locale, NewsPageSectionsLocale>;

export const NEWS_PAGE_SECTION_KEYS = [
  'hero',
  'categories',
  'featured',
  'listConfig',
  'byCategory',
  'newsletter',
] as const;
export type NewsPageSectionKey = (typeof NEWS_PAGE_SECTION_KEYS)[number];

// ─── Default content (per locale) ─────────────────────────────────────────

const HERO: Record<Locale, NewsHeroSection> = {
  vi: {
    eyebrow: '// Newsroom · KS Long Anh',
    title: 'Tin tức & Cập nhật ngành khoáng sản',
    sub: 'Theo dõi hoạt động kinh doanh, sản phẩm mới, cập nhật công nghệ và phân tích thị trường xuất khẩu bột đá CaCO₃ của Long Anh.',
    searchPlaceholder: 'Tìm bài viết theo tiêu đề, danh mục…',
    searchEnabled: true,
  },
  en: {
    eyebrow: '// Newsroom · Long Anh',
    title: 'News & mineral-industry updates',
    sub: 'Follow Long Anh business deals, new products, technology updates and CaCO₃ export-market analysis.',
    searchPlaceholder: 'Search articles by title or category…',
    searchEnabled: true,
  },
  zh: {
    eyebrow: '// 新闻室 · 龙英',
    title: '新闻与矿业更新',
    sub: '跟踪龙英的商业活动、新产品、技术更新以及碳酸钙出口市场分析。',
    searchPlaceholder: '按标题或类别搜索文章…',
    searchEnabled: true,
  },
};

const CATEGORIES: Record<Locale, NewsCategoriesSection> = {
  vi: {
    items: [
      { label: 'Kinh doanh', slug: 'business' },
      { label: 'Cột mốc', slug: 'milestone' },
      { label: 'Sản phẩm', slug: 'product' },
      { label: 'Công nghệ', slug: 'tech' },
      { label: 'Sự kiện', slug: 'event' },
      { label: 'CSR', slug: 'csr' },
    ],
  },
  en: {
    items: [
      { label: 'Business', slug: 'business' },
      { label: 'Milestones', slug: 'milestone' },
      { label: 'Products', slug: 'product' },
      { label: 'Technology', slug: 'tech' },
      { label: 'Events', slug: 'event' },
      { label: 'CSR', slug: 'csr' },
    ],
  },
  zh: {
    items: [
      { label: '商业', slug: 'business' },
      { label: '里程碑', slug: 'milestone' },
      { label: '产品', slug: 'product' },
      { label: '技术', slug: 'tech' },
      { label: '活动', slug: 'event' },
      { label: 'CSR', slug: 'csr' },
    ],
  },
};

// Featured + list config + byCategory are locale-independent in practice; we
// still split per-locale so the editor can switch without losing data.
const FEATURED_DEFAULT: NewsFeaturedSection = {
  mode: 'auto-views',
  articleIds: [],
};

const LIST_CONFIG_DEFAULT: NewsListConfigSection = {
  perPage: 9,
  sort: 'newest',
  layout: 'grid-3',
  sidebarHotTopics: true,
  sidebarLatest: true,
  sidebarNewsletter: true,
  sidebarAd: false,
};

const BY_CATEGORY: Record<Locale, NewsByCategorySection> = {
  vi: {
    eyebrow: '// Chuyên mục',
    title: 'Tin theo chủ đề',
    mode: 'top-2',
    articlesPerCategory: 4,
  },
  en: {
    eyebrow: '// Topics',
    title: 'News by topic',
    mode: 'top-2',
    articlesPerCategory: 4,
  },
  zh: {
    eyebrow: '// 专栏',
    title: '按主题分类',
    mode: 'top-2',
    articlesPerCategory: 4,
  },
};

const NEWSLETTER: Record<Locale, NewsNewsletterSection> = {
  vi: {
    title: 'Đăng ký nhận tin Long Anh',
    sub: 'Tin tức ngành, báo cáo thị trường và bảng giá xuất khẩu hàng tháng — gửi trực tiếp đến hộp thư của bạn.',
    inputPlaceholder: 'Email của bạn',
    buttonLabel: 'Đăng ký nhận tin',
    footer: 'Chúng tôi không spam. Hủy đăng ký bất cứ lúc nào.',
    mailingListId: 'long-anh-newsletter',
  },
  en: {
    title: 'Subscribe to the Long Anh newsletter',
    sub: 'Industry news, market reports and monthly export pricing — delivered straight to your inbox.',
    inputPlaceholder: 'Your email',
    buttonLabel: 'Subscribe',
    footer: 'We never spam. Unsubscribe anytime.',
    mailingListId: 'long-anh-newsletter',
  },
  zh: {
    title: '订阅龙英新闻',
    sub: '行业新闻、市场报告和每月出口价格 — 直接发送到您的邮箱。',
    inputPlaceholder: '您的邮箱',
    buttonLabel: '订阅',
    footer: '我们绝不发送垃圾邮件。随时可以取消订阅。',
    mailingListId: 'long-anh-newsletter',
  },
};

export function newsPageDefaults(locale: Locale): NewsPageSectionsLocale {
  return {
    hero: HERO[locale],
    categories: CATEGORIES[locale],
    featured: { ...FEATURED_DEFAULT, articleIds: [...FEATURED_DEFAULT.articleIds] },
    listConfig: { ...LIST_CONFIG_DEFAULT },
    byCategory: BY_CATEGORY[locale],
    newsletter: NEWSLETTER[locale],
  };
}
