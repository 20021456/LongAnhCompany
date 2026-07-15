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
  /** Hero banner background photo. */
  imageUrl?: string;
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
  /** Small uppercase label above the title. */
  kicker: string;
  title: string;
  sub: string;
  primaryLabel: string;
  primaryHref: string;
  /** Phone shown on the secondary (call) button. */
  phone: string;
}

export interface ProductsProcessStep {
  k: string;
  t: string;
  d: string;
}
export interface ProductsProcessSection {
  eyebrow: string;
  title: string;
  /** Scroll-revealed statement below the steps. */
  statement: string;
  steps: ProductsProcessStep[];
}

export interface ProductsPageSectionsLocale {
  header: ProductsHeaderSection;
  stats: ProductsStatsSection;
  tiles: ProductsTilesSection;
  skuList: ProductsSkuListSection;
  particle: ProductsParticleSection;
  specTable: ProductsSpecTableSection;
  process: ProductsProcessSection;
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
  'process',
  'cta',
] as const;
export type ProductsPageSectionKey = (typeof PRODUCTS_PAGE_SECTION_KEYS)[number];

// ─── Default content (per locale) ─────────────────────────────────────────

const HEADER: Record<Locale, ProductsHeaderSection> = {
  vi: {
    eyebrow: 'Sản phẩm',
    title: 'Hai dòng sản phẩm. Năm tiêu chuẩn.',
    sub: 'Từ bột đá CaCO₃ siêu mịn cho compound nhựa, đến đá tự nhiên cỡ lớn cho công trình cao cấp — tất cả đều đến từ một mỏ duy nhất.',
    imageUrl: '/assets/nha-may-bot-sieu-min-1.webp',
  },
  en: {
    eyebrow: 'Products',
    title: 'Two product families. Five standards.',
    sub: 'From ultra-fine CaCO₃ powder for plastic compounds to large natural stone for premium construction — all sourced from a single quarry.',
    imageUrl: '/assets/nha-may-bot-sieu-min-1.webp',
  },
  zh: {
    eyebrow: '产品',
    title: '两大产品系列。五项标准。',
    sub: '从用于塑料复合的超细碳酸钙粉到用于高端建筑的大型天然石材 — 全部来自同一个矿场。',
    imageUrl: '/assets/nha-may-bot-sieu-min-1.webp',
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
    kicker: 'Đối tác cùng Long Anh',
    title: 'Sẵn sàng cho đơn hàng tiếp theo của bạn',
    sub: 'Gửi yêu cầu kèm sản lượng, quy cách và cảng đến. Chúng tôi phản hồi kèm bảng spec và báo giá FOB trong 24 giờ.',
    primaryLabel: 'Nhận báo giá',
    primaryHref: '/contact',
    phone: '(+84) 942 224 499',
  },
  en: {
    kicker: 'Partner with Long Anh',
    title: 'Ready for your next order',
    sub: 'Send quantity, specs and destination port — we reply with a spec sheet and FOB pricing within 24 hours.',
    primaryLabel: 'Request a quote',
    primaryHref: '/contact',
    phone: '(+84) 942 224 499',
  },
  zh: {
    kicker: '与龙英合作',
    title: '为您的下一个订单做好准备',
    sub: '发送数量、规格和目的港 — 我们将在24小时内回复规格表和FOB报价。',
    primaryLabel: '获取报价',
    primaryHref: '/contact',
    phone: '(+84) 942 224 499',
  },
};

const PROCESS: Record<Locale, ProductsProcessSection> = {
  vi: {
    eyebrow: 'Quy trình',
    title: 'Bốn bước, một tiêu chuẩn duy nhất',
    statement:
      'Từ mỏ đá vôi trắng ở Nghệ An đến container rời tại cảng, chúng tôi kiểm soát trọn vẹn chất lượng CaCO₃.',
    steps: [
      {
        k: '01',
        t: 'Khai thác từ mỏ',
        d: 'Đá vôi trắng nguyên sinh từ 05 mỏ riêng tại Quỳ Hợp, Nghệ An — độ trắng vượt 98%, tuyển chọn ngay tại bãi khai thác.',
      },
      {
        k: '02',
        t: 'Nghiền siêu mịn',
        d: '06 dây chuyền nghiền khô công nghệ Châu Âu cho cỡ hạt D50 từ 3 tới 20 µm — đồng đều theo từng lô sản xuất.',
      },
      {
        k: '03',
        t: 'Phủ Stearic Acid',
        d: '02 dây chuyền phủ xử lý bề mặt, tăng độ phân tán và giảm hút ẩm — cho compound nhựa PVC, PE, PP và sơn cao cấp.',
      },
      {
        k: '04',
        t: 'Kiểm định & xuất khẩu',
        d: 'Bốn chỉ tiêu QC mỗi lô, kèm COA và MSDS theo ISO 9001:2015 — giao FOB Cửa Lò và Hải Phòng đi 12 quốc gia.',
      },
    ],
  },
  en: {
    eyebrow: 'Process',
    title: 'Four steps, one standard',
    statement:
      'From white limestone quarries in Nghe An to bulk containers at port, we control CaCO₃ quality end to end.',
    steps: [
      {
        k: '01',
        t: 'Quarrying',
        d: 'Pristine white limestone from 5 owned quarries in Quy Hop, Nghe An — whiteness above 98%, sorted right at the pit.',
      },
      {
        k: '02',
        t: 'Ultra-fine grinding',
        d: '6 European-spec dry-grinding lines deliver D50 particle sizes from 3 to 20 µm — uniform batch after batch.',
      },
      {
        k: '03',
        t: 'Stearic-acid coating',
        d: '2 coating lines treat the surface for better dispersion and lower moisture uptake — for PVC, PE, PP compounds and premium paint.',
      },
      {
        k: '04',
        t: 'QC & export',
        d: 'Four QC criteria per batch, with COA and MSDS under ISO 9001:2015 — FOB Cua Lo and Hai Phong to 12 countries.',
      },
    ],
  },
  zh: {
    eyebrow: '流程',
    title: '四个步骤,一个标准',
    statement: '从义安省的白石灰岩矿山到港口的散装集装箱,我们全程掌控碳酸钙质量。',
    steps: [
      {
        k: '01',
        t: '矿山开采',
        d: '来自归合5座自有矿山的原生白石灰岩 — 白度超过98%,在采场即完成分选。',
      },
      {
        k: '02',
        t: '超细研磨',
        d: '6条欧洲标准干法研磨线,D50粒径3至20 µm — 批批均匀。',
      },
      {
        k: '03',
        t: '硬脂酸涂层',
        d: '2条涂层线进行表面处理,提高分散性、降低吸湿 — 适用于PVC、PE、PP复合材料和高端涂料。',
      },
      {
        k: '04',
        t: '检验与出口',
        d: '每批四项QC指标,附ISO 9001:2015体系下的COA与MSDS — 经炉门港和海防港FOB出口12个国家。',
      },
    ],
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
    process: PROCESS[locale],
    cta: CTA[locale],
  };
}
