/**
 * Home page section content — the editable CMS model for `/admin/pages/home`.
 *
 * Each section is stored as one `page_sections` row whose `content` JSON is
 * keyed by locale: `{ vi: {...}, en: {...}, zh: {...} }`. `homeDefaults()`
 * builds the fallback content from the static COPY file so the public site
 * keeps working until an editor customises a section.
 */

// Relative imports (not the `@/` alias) so this module also resolves cleanly
// when `prisma/seed.ts` is run through tsx.
import { COPY } from '../data/copy';
import type { Locale } from './i18n/config';

// ─── Per-section content shapes (one locale) ──────────────────────────────

export interface HeroSection {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  imageUrl: string;
  imageAlt: string;
}

export interface StatItem {
  value: string;
  label: string;
}
export interface StatsSection {
  items: StatItem[];
}

export interface ProductsSection {
  eyebrow: string;
  title: string;
  sub: string;
}

export interface AboutCard {
  name: string;
  body: string;
  imageUrl: string;
}
export interface AboutSection {
  eyebrow: string;
  title: string;
  intro: string;
  cards: AboutCard[];
}

export interface CertCard {
  name: string;
  issuer: string;
  desc: string;
  logoUrl: string;
}
export interface CertsSection {
  eyebrow: string;
  title: string;
  sub: string;
  items: CertCard[];
}

export interface ExportFeature {
  title: string;
  body: string;
}
export interface ExportSection {
  eyebrow: string;
  title: string;
  sub: string;
  features: ExportFeature[];
  markets: string[];
  mapCaption: string;
}

export interface ContactSection {
  eyebrow: string;
  title: string;
  sub: string;
  address: string;
  phone1: string;
  phone2: string;
  email: string;
}

export interface HomeSectionsLocale {
  hero: HeroSection;
  stats: StatsSection;
  products: ProductsSection;
  about: AboutSection;
  certs: CertsSection;
  exportCap: ExportSection;
  contact: ContactSection;
}

export type HomeSections = Record<Locale, HomeSectionsLocale>;

export const HOME_SECTION_KEYS = [
  'hero',
  'stats',
  'products',
  'about',
  'certs',
  'exportCap',
  'contact',
] as const;
export type HomeSectionKey = (typeof HOME_SECTION_KEYS)[number];

// ─── Static extras not present in COPY ────────────────────────────────────
// (about cards, cert cards, export features, cert section text, captions)

const HERO_IMAGE = '/assets/hero-sw.png';
const HERO_ALT: Record<Locale, string> = {
  vi: 'Bao bột đá CaCO₃ Long Anh siêu trắng',
  en: 'Long Anh super-white CaCO₃ powder bags',
  zh: '龙英超白碳酸钙粉袋',
};

const ABOUT_CARDS: Record<Locale, AboutCard[]> = {
  vi: [
    {
      name: 'Năng lực sản xuất',
      body: '05 nhà máy với tổng diện tích 12ha, dây chuyền hiện đại — công suất đạt trên 350,000 tấn/năm.',
      imageUrl: '/assets/nha-may-bot-sieu-min-3.webp',
    },
    {
      name: 'Nguồn nguyên liệu',
      body: 'Đá vôi trắng nguyên sinh từ Quỳ Hợp – Nghệ An, độ trắng > 98% và CaCO₃ > 98.5% — kiểm soát từ gốc.',
      imageUrl: '/assets/da-nguyen-lieu-cao-cap2.webp',
    },
    {
      name: 'Cơ sở hạ tầng',
      body: 'Hệ thống dây chuyền nghiền và phủ Stearic Acid theo công nghệ Châu Âu, vận hành đồng bộ và ổn định.',
      imageUrl: '/assets/co-so-ha-tang.jpg',
    },
    {
      name: 'Kiểm định chất lượng',
      body: 'Phòng QC kiểm tra từng lô — độ trắng, CaCO₃, độ ẩm, cỡ hạt — kèm COA và MSDS theo tiêu chuẩn ISO 9001:2015.',
      imageUrl: '/assets/kiem-dinh.jpg',
    },
    {
      name: 'Đóng gói sản phẩm',
      body: 'Đáp ứng mọi quy cách: PP 25kg/50kg, jumbo 250kg/500kg/1000kg và bulk theo yêu cầu khách hàng.',
      imageUrl: '/assets/bao-bi-sieu-trang.jpg',
    },
  ],
  en: [
    {
      name: 'Production capacity',
      body: '5 plants over 12ha of modern lines — capacity exceeding 350,000 tons/year.',
      imageUrl: '/assets/nha-may-bot-sieu-min-3.webp',
    },
    {
      name: 'Raw material',
      body: 'Pristine white limestone from Quy Hop · whiteness > 98%, CaCO₃ > 98.5% — controlled at the source.',
      imageUrl: '/assets/da-nguyen-lieu-cao-cap2.webp',
    },
    {
      name: 'Infrastructure',
      body: 'EU-spec grinding and stearic-acid coating lines, running in stable synchronization.',
      imageUrl: '/assets/co-so-ha-tang.jpg',
    },
    {
      name: 'Quality control',
      body: 'Per-batch QC — whiteness, CaCO₃, moisture, particle size — with COA and MSDS to ISO 9001:2015.',
      imageUrl: '/assets/kiem-dinh.jpg',
    },
    {
      name: 'Packaging',
      body: 'Every spec covered: PP 25/50kg, jumbo 250/500/1000kg, and bulk to customer requirements.',
      imageUrl: '/assets/bao-bi-sieu-trang.jpg',
    },
  ],
  zh: [
    {
      name: '生产能力',
      body: '5座工厂占地12公顷,配备现代化生产线 — 年产能超过35万吨。',
      imageUrl: '/assets/nha-may-bot-sieu-min-3.webp',
    },
    {
      name: '原料来源',
      body: '源自归合-义安省的原始白石灰岩 · 白度>98%,碳酸钙>98.5% — 从源头控制。',
      imageUrl: '/assets/da-nguyen-lieu-cao-cap2.webp',
    },
    {
      name: '基础设施',
      body: '欧洲标准的研磨和硬脂酸涂层生产线,稳定同步运行。',
      imageUrl: '/assets/co-so-ha-tang.jpg',
    },
    {
      name: '质量检验',
      body: '每批次QC检测 — 白度、碳酸钙、水分、粒径 — 提供符合ISO 9001:2015的COA和MSDS。',
      imageUrl: '/assets/kiem-dinh.jpg',
    },
    {
      name: '产品包装',
      body: '满足各种规格:PP 25/50公斤、吨袋250/500/1000公斤,以及按客户需求散装。',
      imageUrl: '/assets/bao-bi-sieu-trang.jpg',
    },
  ],
};

const CERT_CARDS: Record<Locale, CertCard[]> = {
  vi: [
    {
      name: 'ISO 9001:2015',
      issuer: 'BSI · 2020',
      desc: 'Hệ thống quản lý chất lượng',
      logoUrl: '/assets/cert-iso-9001.svg',
    },
    {
      name: 'REACH',
      issuer: 'EU · 2021',
      desc: 'Tuân thủ hóa chất Châu Âu',
      logoUrl: '/assets/cert-reach.svg',
    },
    {
      name: 'SGS',
      issuer: 'Báo cáo · 2024',
      desc: 'Kiểm định độc lập độ trắng & cỡ hạt',
      logoUrl: '/assets/cert-sgs.svg',
    },
    {
      name: 'MSDS',
      issuer: 'GHS / OSHA',
      desc: 'Phiếu an toàn hóa chất sản phẩm',
      logoUrl: '/assets/cert-msds.svg',
    },
  ],
  en: [
    {
      name: 'ISO 9001:2015',
      issuer: 'BSI · 2020',
      desc: 'Quality Management System',
      logoUrl: '/assets/cert-iso-9001.svg',
    },
    {
      name: 'REACH',
      issuer: 'EU · 2021',
      desc: 'EU Chemical Compliance',
      logoUrl: '/assets/cert-reach.svg',
    },
    {
      name: 'SGS',
      issuer: 'Inspection · 2024',
      desc: 'Independent test for whiteness & particle size',
      logoUrl: '/assets/cert-sgs.svg',
    },
    {
      name: 'MSDS',
      issuer: 'GHS / OSHA',
      desc: 'Material safety data sheet',
      logoUrl: '/assets/cert-msds.svg',
    },
  ],
  zh: [
    {
      name: 'ISO 9001:2015',
      issuer: 'BSI · 2020',
      desc: '质量管理体系',
      logoUrl: '/assets/cert-iso-9001.svg',
    },
    {
      name: 'REACH',
      issuer: '欧盟 · 2021',
      desc: '欧盟化学品合规',
      logoUrl: '/assets/cert-reach.svg',
    },
    {
      name: 'SGS',
      issuer: '检测报告 · 2024',
      desc: '独立白度和粒径检测',
      logoUrl: '/assets/cert-sgs.svg',
    },
    {
      name: 'MSDS',
      issuer: 'GHS / OSHA',
      desc: '材料安全数据表',
      logoUrl: '/assets/cert-msds.svg',
    },
  ],
};

const CERTS_TEXT: Record<Locale, { eyebrow: string; title: string; sub: string }> = {
  vi: {
    eyebrow: 'Chứng chỉ',
    title: 'Đạt chuẩn chất lượng quốc tế.',
    sub: 'Mỗi lô sản phẩm đều được kiểm tra QC theo ISO 9001, kèm COA và MSDS — đáp ứng yêu cầu khắt khe nhất từ thị trường Hàn Quốc, Nhật Bản, Ấn Độ và Trung Đông.',
  },
  en: {
    eyebrow: 'Certifications',
    title: 'Built to international standards.',
    sub: 'Each batch is QC-controlled to ISO 9001 and ships with COA and MSDS — meeting the toughest requirements from Korea, Japan, India and the Middle East.',
  },
  zh: {
    eyebrow: '认证',
    title: '符合国际标准。',
    sub: '每批产品均按ISO 9001进行QC检测,提供COA和MSDS — 满足韩国、日本、印度和中东市场最严苛的要求。',
  },
};

const EXPORT_FEATURES: Record<Locale, ExportFeature[]> = {
  vi: [
    { title: 'Chất lượng cao cấp', body: 'Độ trắng 98%+, CaCO₃ 98.5%+' },
    { title: 'Tầm phủ toàn cầu', body: '12 quốc gia · 8+ thị trường' },
    { title: 'Logistics tin cậy', body: 'FOB cảng Cửa Lò & Hải Phòng' },
    { title: 'Niềm tin khách hàng', body: '10+ năm đối tác dài hạn' },
  ],
  en: [
    { title: 'Premium Quality', body: 'Whiteness 98%+, CaCO₃ 98.5%+' },
    { title: 'Global Reach', body: '12 countries · 8+ key markets' },
    { title: 'Reliable Logistics', body: 'FOB Cua Lo & Hai Phong ports' },
    { title: 'Customer Trust', body: '10+ years long-term partners' },
  ],
  zh: [
    { title: '优质碳酸钙', body: '白度 98%+,CaCO₃ 98.5%+' },
    { title: '全球覆盖', body: '12个国家 · 8+核心市场' },
    { title: '可靠物流', body: 'FOB窗碧港和海防港' },
    { title: '客户信任', body: '10年以上稳定合作' },
  ],
};

const MAP_CAPTION: Record<Locale, string> = {
  vi: 'Từ nhà máy của chúng tôi đến cảng của bạn — giao hàng chất lượng, xây dựng niềm tin.',
  en: 'From our factory to your destination — delivering quality, building trust.',
  zh: '从我们的工厂到您的目的地 — 优质交付,信任建立。',
};

// ─── Defaults builder ─────────────────────────────────────────────────────

/** Build the fallback section content for one locale from the static COPY. */
export function homeDefaults(locale: Locale): HomeSectionsLocale {
  const C = COPY[locale] as Record<string, unknown>;
  const heroH = (C.heroH as string[] | undefined) ?? ['', ''];
  const statVals = (C.statVals as string[] | undefined) ?? [];
  const statLabels = (C.statLabels as string[] | undefined) ?? [];
  const phone = (C.phone as string[] | undefined) ?? ['', ''];

  return {
    hero: {
      eyebrow: (C.heroEy as string) ?? '',
      titleLine1: heroH[0] ?? '',
      titleLine2: heroH[1] ?? '',
      sub: (C.heroSub as string) ?? '',
      ctaPrimary: (C.ctaPrimary as string) ?? '',
      ctaSecondary: (C.ctaGhost as string) ?? '',
      imageUrl: HERO_IMAGE,
      imageAlt: HERO_ALT[locale],
    },
    stats: {
      items: statLabels.map((label, i) => ({ value: statVals[i] ?? '', label })),
    },
    products: {
      eyebrow: (C.productsEy as string) ?? '',
      title: (C.productsH as string) ?? '',
      sub: (C.productsSub as string) ?? '',
    },
    about: {
      eyebrow: (C.aboutEy as string) ?? '',
      title: (C.aboutH as string) ?? '',
      intro: (C.aboutP1 as string) ?? '',
      cards: ABOUT_CARDS[locale],
    },
    certs: {
      ...CERTS_TEXT[locale],
      items: CERT_CARDS[locale],
    },
    exportCap: {
      eyebrow: (C.capEy as string) ?? '',
      title: (C.capH as string) ?? '',
      sub: (C.capP as string) ?? '',
      features: EXPORT_FEATURES[locale],
      // Markets are stored as world-pin slugs (see src/lib/world-pins.ts) so
      // the public ExportMap can render each pin at its real geographic
      // coordinates regardless of the editing locale. Same set for all 3
      // locales — the localised label comes from WORLD_PINS[slug].name[locale].
      markets: [
        'south-korea',
        'japan',
        'india',
        'bangladesh',
        'indonesia',
        'uae',
        'europe',
        'africa',
      ],
      mapCaption: MAP_CAPTION[locale],
    },
    contact: {
      eyebrow: (C.contactEy as string) ?? '',
      title: (C.contactH as string) ?? '',
      sub: (C.contactP as string) ?? '',
      address: (C.addr as string) ?? '',
      phone1: phone[0] ?? '',
      phone2: phone[1] ?? '',
      email: (C.email as string) ?? '',
    },
  };
}
