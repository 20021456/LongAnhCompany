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
  /** Optional datasheet rows shown under the body — fills the panel with hard figures. */
  facts?: { label: string; value: string }[];
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
      body: 'Hệ thống 05 nhà máy trên tổng diện tích 12 ha tại Quỳ Hợp – Nghệ An, vận hành 06 dây chuyền nghiền khô và 02 dây chuyền phủ Stearic Acid theo công nghệ Châu Âu. Tổng công suất trên 350.000 tấn/năm, sản xuất ổn định theo kế hoạch giao hàng của từng đối tác.',
      imageUrl: '/assets/nha-may-bot-sieu-min-3.webp',
      facts: [
        { label: 'Nhà máy', value: '05 · 12 ha' },
        { label: 'Dây chuyền', value: '06 nghiền · 02 phủ' },
        { label: 'Công suất', value: '350.000 tấn/năm' },
      ],
    },
    {
      name: 'Nguồn nguyên liệu',
      body: 'Long Anh trực tiếp khai thác 05 mỏ đá vôi trắng nguyên sinh tại Quỳ Hợp — vùng nguyên liệu chất lượng hàng đầu Việt Nam. Độ trắng vượt 98%, hàm lượng CaCO₃ trên 98,5%; chất lượng được kiểm soát ngay từ khâu khai thác và phân loại đá.',
      imageUrl: '/assets/da-nguyen-lieu-cao-cap2.webp',
      facts: [
        { label: 'Mỏ vận hành', value: '05 mỏ riêng' },
        { label: 'Độ trắng', value: '≥ 98%' },
        { label: 'Hàm lượng CaCO₃', value: '≥ 98,5%' },
      ],
    },
    {
      name: 'Cơ sở hạ tầng',
      body: 'Bãi nguyên liệu tập kết theo phân vùng phẩm cấp; kho thành phẩm đóng pallet, phân lô theo mã sản phẩm. Thiết bị nâng hạ và đội xe vận hành liên tục trong ngày, thuận tuyến về cảng Cửa Lò và Hải Phòng — lịch xuất hàng luôn chủ động.',
      imageUrl: '/assets/co-so-ha-tang.jpg',
      facts: [
        { label: 'Kho thành phẩm', value: 'Pallet · phân lô' },
        { label: 'Bốc xếp', value: 'Liên tục trong ngày' },
        { label: 'Cảng xuất', value: 'Cửa Lò · Hải Phòng' },
      ],
    },
    {
      name: 'Kiểm định chất lượng',
      body: 'Phòng QC kiểm tra từng lô theo bốn chỉ tiêu: độ trắng, hàm lượng CaCO₃, độ ẩm và cỡ hạt D50 (4–20 µm). Mỗi lô xuất xưởng kèm COA và MSDS theo hệ thống ISO 9001:2015; sẵn sàng kiểm định độc lập qua SGS khi khách hàng yêu cầu.',
      imageUrl: '/assets/kiem-dinh.jpg',
      facts: [
        { label: 'Chỉ tiêu', value: 'Trắng · CaCO₃ · Ẩm · D50' },
        { label: 'Chứng từ mỗi lô', value: 'COA · MSDS' },
        { label: 'Kiểm định độc lập', value: 'SGS' },
      ],
    },
    {
      name: 'Đóng gói sản phẩm',
      body: 'Bao PP 25 kg và 50 kg, bao jumbo 250/500/1000 kg hoặc container rời (bulk) theo yêu cầu — hỗ trợ in nhãn theo thương hiệu riêng của khách hàng. Hàng đóng container được chèn lót chống ẩm và niêm phong trước khi rời nhà máy.',
      imageUrl: '/assets/bao-bi-sieu-trang.jpg',
      facts: [
        { label: 'Bao PP', value: '25 · 50 kg' },
        { label: 'Jumbo', value: '250 · 500 · 1000 kg' },
        { label: 'Bulk', value: 'Container rời' },
      ],
    },
  ],
  en: [
    {
      name: 'Production capacity',
      body: 'A five-plant complex on 12 ha in Quy Hop, Nghe An, running 6 dry-grinding lines and 2 stearic-acid coating lines built to European spec. Total capacity exceeds 350,000 tons/year, produced steadily against each partner’s delivery schedule.',
      imageUrl: '/assets/nha-may-bot-sieu-min-3.webp',
      facts: [
        { label: 'Plants', value: '05 · 12 ha' },
        { label: 'Lines', value: '06 grinding · 02 coating' },
        { label: 'Capacity', value: '350,000 t/year' },
      ],
    },
    {
      name: 'Raw material',
      body: 'Long Anh directly operates 5 quarries of pristine white limestone in Quy Hop — one of Vietnam’s finest raw-material regions. Whiteness above 98% and CaCO₃ above 98.5%, with quality controlled from extraction and stone sorting onward.',
      imageUrl: '/assets/da-nguyen-lieu-cao-cap2.webp',
      facts: [
        { label: 'Quarries', value: '05 owned' },
        { label: 'Whiteness', value: '≥ 98%' },
        { label: 'CaCO₃ content', value: '≥ 98.5%' },
      ],
    },
    {
      name: 'Infrastructure',
      body: 'Raw stone is staged by grade zone; finished goods are palletized and lot-coded by product. Loaders and trucks run throughout the day, on convenient routes to Cua Lo and Hai Phong ports — keeping every export schedule in our control.',
      imageUrl: '/assets/co-so-ha-tang.jpg',
      facts: [
        { label: 'Finished goods', value: 'Palletized · lot-coded' },
        { label: 'Handling', value: 'Continuous daily' },
        { label: 'Ports', value: 'Cua Lo · Hai Phong' },
      ],
    },
    {
      name: 'Quality control',
      body: 'In-house QC tests every batch on four criteria: whiteness, CaCO₃ content, moisture and D50 particle size (4–20 µm). Every batch ships with COA and MSDS under ISO 9001:2015 — with independent SGS verification on request.',
      imageUrl: '/assets/kiem-dinh.jpg',
      facts: [
        { label: 'Criteria', value: 'Whiteness · CaCO₃ · Moisture · D50' },
        { label: 'Per batch', value: 'COA · MSDS' },
        { label: 'Independent', value: 'SGS' },
      ],
    },
    {
      name: 'Packaging',
      body: 'PP bags of 25 kg and 50 kg, jumbo bags of 250/500/1000 kg, or bulk containers to order — private-label printing available. Container cargo is moisture-protected and sealed before leaving the plant.',
      imageUrl: '/assets/bao-bi-sieu-trang.jpg',
      facts: [
        { label: 'PP bags', value: '25 · 50 kg' },
        { label: 'Jumbo', value: '250 · 500 · 1000 kg' },
        { label: 'Bulk', value: 'Full container' },
      ],
    },
  ],
  zh: [
    {
      name: '生产能力',
      body: '位于义安省归合县的5座工厂,总占地12公顷,运行6条干法研磨生产线和2条欧洲标准硬脂酸涂层生产线。总产能超过35万吨/年,按每位合作伙伴的交货计划稳定生产。',
      imageUrl: '/assets/nha-may-bot-sieu-min-3.webp',
      facts: [
        { label: '工厂', value: '05座 · 12公顷' },
        { label: '生产线', value: '06研磨 · 02涂层' },
        { label: '产能', value: '35万吨/年' },
      ],
    },
    {
      name: '原料来源',
      body: '龙英在归合直接开采5座原生白石灰岩矿山 — 越南品质领先的原料产区。白度超过98%,碳酸钙含量超过98.5%,从开采和选石环节即开始质量控制。',
      imageUrl: '/assets/da-nguyen-lieu-cao-cap2.webp',
      facts: [
        { label: '矿山', value: '05座自有' },
        { label: '白度', value: '≥ 98%' },
        { label: '碳酸钙', value: '≥ 98.5%' },
      ],
    },
    {
      name: '基础设施',
      body: '原料按品级分区堆放;成品打托盘、按产品批号分区存放。装卸设备与车队全天运转,邻近通往炉门港和海防港的干线 — 出口排期始终可控。',
      imageUrl: '/assets/co-so-ha-tang.jpg',
      facts: [
        { label: '成品仓', value: '托盘 · 批号分区' },
        { label: '装卸', value: '全天运转' },
        { label: '出口港', value: '炉门 · 海防' },
      ],
    },
    {
      name: '质量检验',
      body: '内部QC按四项指标检测每一批次:白度、碳酸钙含量、水分和D50粒径(4–20 µm)。每批出厂附COA与MSDS(ISO 9001:2015体系),可按客户要求提供SGS独立检验。',
      imageUrl: '/assets/kiem-dinh.jpg',
      facts: [
        { label: '检测指标', value: '白度 · 碳酸钙 · 水分 · D50' },
        { label: '每批附', value: 'COA · MSDS' },
        { label: '独立检验', value: 'SGS' },
      ],
    },
    {
      name: '产品包装',
      body: 'PP袋25公斤和50公斤,吨袋250/500/1000公斤,或按需散装集装箱 — 支持客户品牌定制印刷。集装箱货物防潮衬垫并铅封后出厂。',
      imageUrl: '/assets/bao-bi-sieu-trang.jpg',
      facts: [
        { label: 'PP袋', value: '25 · 50公斤' },
        { label: '吨袋', value: '250 · 500 · 1000公斤' },
        { label: '散装', value: '整柜' },
      ],
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
  // Defensive fallback — during hot-reload races or if `locale` is briefly
  // undefined/unknown, fall back to the Vietnamese COPY rather than throwing
  // "Cannot read properties of undefined". A throw in this Server Component
  // would leave the SSR pipeline with no HTML and the browser would later
  // hydrate a fresh RSC payload against the stale error fallback HTML — a
  // classic "Hydration failed" symptom.
  const C = (COPY[locale] ?? COPY.vi ?? {}) as Record<string, unknown>;
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
