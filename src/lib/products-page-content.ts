/**
 * Products page section content — the editable CMS model for
 * `/admin/pages/products`. Mirrors home-content / about-content so the
 * three section editors share the same persistence shape
 * (`{ vi, en, zh }` JSON per sectionKey in `page_sections`).
 *
 * 7 sections, matching admin/page-edit-products.html in the prototype:
 *   header     — banner title + sub
 *   stats      — 4-number strip
 *   tiles      — 2 category tiles (CaCO₃ powder / Natural cladding stone)
 *   skuList    — chosen SKU codes shown on the page (P-01…P-05)
 *   particle   — particle-size visualizer (eyebrow + title + two size lists
 *                + Stearic ratio)
 *   specTable  — spec table title + N rows (label, coated, uncoated, unit)
 *                + certification chips
 *   cta        — quote-request banner at the bottom
 *
 * (SEO is handled by the page-level meta fields, not a section.)
 */

import type { Locale } from './i18n/config';

// ─── Per-section content shapes ───────────────────────────────────────────

export interface ProductsHeaderSection {
  eyebrow: string;
  title: string;
  sub: string;
}

export interface ProductsStatItem {
  value: string;
  label: string;
}
export interface ProductsStatsSection {
  items: ProductsStatItem[];
}

export interface ProductsTile {
  number: string; // "01" / "02"
  title: string;
  desc: string;
  imageUrl: string;
  anchor: string;
}
export interface ProductsTilesSection {
  items: ProductsTile[];
}

export interface ProductsSkuListSection {
  /** Catalog codes to show on the public page in this order. */
  codes: string[];
}

export interface ProductsParticleSection {
  eyebrow: string;
  title: string;
  uncoatedSizes: string;
  coatedSizes: string;
  stearicRatio: string;
}

export interface ProductsSpecRow {
  label: string;
  coated: string;
  uncoated: string;
  unit: string;
}
export interface ProductsSpecTableSection {
  title: string;
  colUncoated: string;
  colCoated: string;
  rows: ProductsSpecRow[];
  certBadges: string[];
}

export interface ProductsCtaSection {
  title: string;
  sub: string;
  primaryLabel: string;
  primaryHref: string;
}

export interface ProductsPageSectionsLocale {
  header: ProductsHeaderSection;
  stats: ProductsStatsSection;
  tiles: ProductsTilesSection;
  skuList: ProductsSkuListSection;
  particle: ProductsParticleSection;
  specTable: ProductsSpecTableSection;
  cta: ProductsCtaSection;
}

export type ProductsPageSections = Record<Locale, ProductsPageSectionsLocale>;

export const PRODUCTS_PAGE_SECTION_KEYS = [
  'header',
  'stats',
  'tiles',
  'skuList',
  'particle',
  'specTable',
  'cta',
] as const;
export type ProductsPageSectionKey = (typeof PRODUCTS_PAGE_SECTION_KEYS)[number];

// ─── Default content (per locale) ─────────────────────────────────────────

const HEADER: Record<Locale, ProductsHeaderSection> = {
  vi: {
    eyebrow: 'Sản phẩm',
    title: 'Hai dòng sản phẩm. Năm tiêu chuẩn.',
    sub: 'Từ bột đá CaCO₃ siêu mịn cho compound nhựa, đến đá tự nhiên cỡ lớn cho công trình cao cấp — tất cả đều đến từ một mỏ duy nhất.',
  },
  en: {
    eyebrow: 'Products',
    title: 'Two product families. Five standards.',
    sub: 'From ultra-fine CaCO₃ powder for plastic compounds to large natural stone for premium construction — all sourced from a single quarry.',
  },
  zh: {
    eyebrow: '产品',
    title: '两大产品系列。五项标准。',
    sub: '从用于塑料复合的超细碳酸钙粉到用于高端建筑的大型天然石材 — 全部来自同一个矿场。',
  },
};

const STATS: Record<Locale, ProductsStatsSection> = {
  vi: {
    items: [
      { value: '05', label: 'Dòng sản phẩm chính' },
      { value: '98%+', label: 'Độ trắng CaCO₃' },
      { value: '3–20µm', label: 'Cỡ hạt' },
      { value: '12', label: 'Thị trường xuất khẩu' },
    ],
  },
  en: {
    items: [
      { value: '05', label: 'Core product lines' },
      { value: '98%+', label: 'CaCO₃ whiteness' },
      { value: '3–20µm', label: 'Particle size' },
      { value: '12', label: 'Export markets' },
    ],
  },
  zh: {
    items: [
      { value: '05', label: '核心产品线' },
      { value: '98%+', label: '碳酸钙白度' },
      { value: '3–20µm', label: '粒径' },
      { value: '12', label: '出口市场' },
    ],
  },
};

const TILES: Record<Locale, ProductsTilesSection> = {
  vi: {
    items: [
      {
        number: '01',
        title: 'Bột đá CaCO₃',
        desc: 'Coated · Uncoated · 3–20 µm — phụ gia cho nhựa, sơn, giấy, thức ăn chăn nuôi.',
        imageUrl: '/assets/bot-caco3-sieu-min.webp',
        anchor: '#cat-powder',
      },
      {
        number: '02',
        title: 'Đá ốp lát tự nhiên',
        desc: 'Slab · Đá xẻ · Đá trang trí — cho công trình và không gian sống cao cấp.',
        imageUrl: '/assets/da-slab-sieu-trang.webp',
        anchor: '#cat-stone',
      },
    ],
  },
  en: {
    items: [
      {
        number: '01',
        title: 'CaCO₃ powder',
        desc: 'Coated · Uncoated · 3–20 µm — for plastics, paint, paper, animal feed.',
        imageUrl: '/assets/bot-caco3-sieu-min.webp',
        anchor: '#cat-powder',
      },
      {
        number: '02',
        title: 'Natural cladding stone',
        desc: 'Slab · Cut tile · Decorative — for premium construction and living spaces.',
        imageUrl: '/assets/da-slab-sieu-trang.webp',
        anchor: '#cat-stone',
      },
    ],
  },
  zh: {
    items: [
      {
        number: '01',
        title: '碳酸钙粉',
        desc: '涂层 · 未涂层 · 3–20µm — 适用于塑料、涂料、造纸、动物饲料。',
        imageUrl: '/assets/bot-caco3-sieu-min.webp',
        anchor: '#cat-powder',
      },
      {
        number: '02',
        title: '天然石材饰面',
        desc: '大板 · 定制石材 · 装饰石材 — 用于高端建筑和居住空间。',
        imageUrl: '/assets/da-slab-sieu-trang.webp',
        anchor: '#cat-stone',
      },
    ],
  },
};

const SKU_LIST: ProductsSkuListSection = {
  codes: ['P-01', 'P-02', 'P-03', 'P-04', 'P-05'],
};

const PARTICLE: Record<Locale, ProductsParticleSection> = {
  vi: {
    eyebrow: 'Cỡ hạt khả dụng',
    title: 'Từ siêu mịn đến tiêu chuẩn — chọn cỡ hạt phù hợp ứng dụng',
    uncoatedSizes: '3, 8, 10, 12, 15, 17, 18, 20',
    coatedSizes: '3, 10, 12, 15, 17, 18, 20',
    stearicRatio: '1.0–1.5%',
  },
  en: {
    eyebrow: 'Available particle sizes',
    title: 'From ultra-fine to standard — pick the right size for your application',
    uncoatedSizes: '3, 8, 10, 12, 15, 17, 18, 20',
    coatedSizes: '3, 10, 12, 15, 17, 18, 20',
    stearicRatio: '1.0–1.5%',
  },
  zh: {
    eyebrow: '可用粒径',
    title: '从超细到标准 — 为您的应用选择合适的粒径',
    uncoatedSizes: '3, 8, 10, 12, 15, 17, 18, 20',
    coatedSizes: '3, 10, 12, 15, 17, 18, 20',
    stearicRatio: '1.0–1.5%',
  },
};

const SPEC_TABLE: Record<Locale, ProductsSpecTableSection> = {
  vi: {
    title: 'Chỉ tiêu chất lượng — Bột đá CaCO₃',
    colUncoated: 'Bột không phủ',
    colCoated: 'Bột phủ Stearic',
    rows: [
      { label: 'Độ trắng', coated: '≥ 98', uncoated: '96–98', unit: '%' },
      { label: 'CaCO₃', coated: '≥ 98.5', uncoated: '97–98.5', unit: '%' },
      { label: 'Độ ẩm', coated: '≤ 0.3', uncoated: '≤ 0.5', unit: '%' },
      { label: 'Cỡ hạt D50', coated: '3–20', uncoated: '5–25', unit: 'µm' },
      { label: 'Tỉ trọng', coated: '2.7', uncoated: '2.7', unit: 'g/cm³' },
    ],
    certBadges: ['ISO 9001:2015', 'REACH', 'SGS'],
  },
  en: {
    title: 'Quality specs — CaCO₃ powder',
    colUncoated: 'Uncoated',
    colCoated: 'Coated',
    rows: [
      { label: 'Whiteness', coated: '≥ 98', uncoated: '96–98', unit: '%' },
      { label: 'CaCO₃', coated: '≥ 98.5', uncoated: '97–98.5', unit: '%' },
      { label: 'Moisture', coated: '≤ 0.3', uncoated: '≤ 0.5', unit: '%' },
      { label: 'Particle size D50', coated: '3–20', uncoated: '5–25', unit: 'µm' },
      { label: 'Density', coated: '2.7', uncoated: '2.7', unit: 'g/cm³' },
    ],
    certBadges: ['ISO 9001:2015', 'REACH', 'SGS'],
  },
  zh: {
    title: '质量规格 — 碳酸钙粉',
    colUncoated: '未涂层',
    colCoated: '涂层',
    rows: [
      { label: '白度', coated: '≥ 98', uncoated: '96–98', unit: '%' },
      { label: '碳酸钙', coated: '≥ 98.5', uncoated: '97–98.5', unit: '%' },
      { label: '水分', coated: '≤ 0.3', uncoated: '≤ 0.5', unit: '%' },
      { label: '粒径 D50', coated: '3–20', uncoated: '5–25', unit: 'µm' },
      { label: '密度', coated: '2.7', uncoated: '2.7', unit: 'g/cm³' },
    ],
    certBadges: ['ISO 9001:2015', 'REACH', 'SGS'],
  },
};

const CTA: Record<Locale, ProductsCtaSection> = {
  vi: {
    title: 'Cần báo giá FOB cho lô hàng tiếp theo?',
    sub: 'Gửi yêu cầu kèm cỡ hạt, số lượng và cảng đến — chúng tôi phản hồi trong 24h làm việc.',
    primaryLabel: 'Yêu cầu báo giá',
    primaryHref: '/contact',
  },
  en: {
    title: 'Need an FOB quote for your next shipment?',
    sub: 'Send your request with particle size, quantity and destination port — we reply within 24 business hours.',
    primaryLabel: 'Request a quote',
    primaryHref: '/contact',
  },
  zh: {
    title: '需要下次发货的FOB报价?',
    sub: '发送您的需求(粒径、数量和目的港) — 我们将在24个工作小时内回复。',
    primaryLabel: '请求报价',
    primaryHref: '/contact',
  },
};

export function productsPageDefaults(locale: Locale): ProductsPageSectionsLocale {
  return {
    header: HEADER[locale],
    stats: STATS[locale],
    tiles: TILES[locale],
    // SKU list is locale-independent (codes are catalog identifiers).
    skuList: { ...SKU_LIST },
    particle: PARTICLE[locale],
    specTable: SPEC_TABLE[locale],
    cta: CTA[locale],
  };
}
