/**
 * About page section content — the editable CMS model for
 * `/admin/pages/about`. Mirrors the structure of home-content.ts so the
 * editor and the public page can share the same `page_sections` row
 * conventions (`{ vi, en, zh }` JSON keyed by sectionKey).
 *
 * 9 sections, matching the LongAnhCorp prototype admin/page-edit-about.html:
 *   header   — banner title + sub
 *   story    — brand narrative (eyebrow, 2-line title, 3 paragraphs,
 *              image, signer + role)
 *   timeline — 5+ milestones (year + title + body)
 *   values   — 3 core-value cards
 *   caps     — capability metrics + an image
 *   warehouse — strip of 4 logistics images
 *   certs    — toggleable list of international certifications
 *   cta      — final call-to-action with two buttons
 *
 * (SEO is handled by the page-level meta fields, not a separate section.)
 */

import type { Locale } from './i18n/config';

// ─── Per-section content shapes (one locale) ──────────────────────────────

export interface AboutHeaderSection {
  eyebrow: string;
  title: string;
  sub: string;
}

export interface AboutStorySection {
  eyebrow: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  imageUrl: string;
  imageAlt: string;
  bgImageUrl: string;
  signerName: string;
  signerTitle: string;
}

export interface AboutTimelineItem {
  year: string;
  title: string;
  body: string;
}
export interface AboutTimelineSection {
  eyebrow: string;
  title: string;
  items: AboutTimelineItem[];
}

export interface AboutValueCard {
  name: string;
  body: string;
  icon: string;
}
export interface AboutValuesSection {
  eyebrow: string;
  title: string;
  items: AboutValueCard[];
}

export interface AboutCapMetric {
  label: string;
  value: string;
}
export interface AboutCapsSection {
  eyebrow: string;
  title: string;
  sub: string;
  imageUrl: string;
  imageAlt: string;
  metrics: AboutCapMetric[];
}

export interface AboutWarehouseSection {
  eyebrow: string;
  title: string;
  images: string[];
}

export interface AboutCertItem {
  name: string;
  enabled: boolean;
}
export interface AboutCertsSection {
  title: string;
  sub: string;
  items: AboutCertItem[];
}

export interface AboutCtaSection {
  title: string;
  sub: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

export interface AboutSectionsLocale {
  header: AboutHeaderSection;
  story: AboutStorySection;
  timeline: AboutTimelineSection;
  values: AboutValuesSection;
  caps: AboutCapsSection;
  warehouse: AboutWarehouseSection;
  certs: AboutCertsSection;
  cta: AboutCtaSection;
}

export type AboutSections = Record<Locale, AboutSectionsLocale>;

export const ABOUT_SECTION_KEYS = [
  'header',
  'story',
  'timeline',
  'values',
  'caps',
  'warehouse',
  'certs',
  'cta',
] as const;

export type AboutSectionKey = (typeof ABOUT_SECTION_KEYS)[number];

// ─── Default content (per locale) ─────────────────────────────────────────

const HEADER: Record<Locale, AboutHeaderSection> = {
  vi: {
    eyebrow: 'Về chúng tôi',
    title: 'Khoáng đá nguyên sinh từ Nghệ An',
    sub: 'Hơn 20 năm khai thác và chế biến — chúng tôi xây dựng từng mối quan hệ qua từng container giao đúng hẹn.',
  },
  en: {
    eyebrow: 'About us',
    title: 'Pure mineral stone from Nghe An',
    sub: 'Over 20 years of mining and processing — we build every relationship one on-time container at a time.',
  },
  zh: {
    eyebrow: '关于我们',
    title: '来自义安省的原生矿石',
    sub: '20多年的开采和加工经验 — 我们通过每个按时交付的集装箱建立每段合作关系。',
  },
};

const STORY: Record<Locale, AboutStorySection> = {
  vi: {
    eyebrow: 'Câu chuyện',
    title: 'Khai thác bền vững. / Chế biến chính xác.',
    paragraph1:
      'Long Anh khai thác và chế biến đá vôi trắng nguyên sinh từ mỏ riêng tại Quỳ Hợp – Nghệ An.',
    paragraph2:
      'Hệ thống 5 nhà máy với dây chuyền nghiền và phủ Stearic Acid theo công nghệ Châu Âu — tổng công suất 350,000 tấn/năm.',
    paragraph3:
      'Chúng tôi xem mỗi tấn bột đá là một cam kết — về chất lượng, thời hạn và mối quan hệ lâu dài với đối tác.',
    imageUrl: '/assets/da-nguyen-lieu-cao-cap.webp',
    imageAlt: 'Mỏ đá Long Anh tại Quỳ Hợp',
    bgImageUrl: '/assets/nha-may-bot-sieu-min-1.webp',
    signerName: 'Nguyễn Long Anh',
    signerTitle: 'Chủ tịch · Sáng lập',
  },
  en: {
    eyebrow: 'Our story',
    title: 'Sustainable mining. / Precision processing.',
    paragraph1:
      'Long Anh mines and processes pristine white limestone from our own quarry in Quy Hop, Nghe An.',
    paragraph2:
      'Five plants running European-spec dry-grinding and stearic-acid coating lines — total capacity 350,000 tons/year.',
    paragraph3:
      'Every ton of stone powder is a promise — quality, schedule, and a long-term partnership.',
    imageUrl: '/assets/da-nguyen-lieu-cao-cap.webp',
    imageAlt: 'Long Anh quarry in Quy Hop',
    bgImageUrl: '/assets/nha-may-bot-sieu-min-1.webp',
    signerName: 'Nguyen Long Anh',
    signerTitle: 'Chairman · Founder',
  },
  zh: {
    eyebrow: '我们的故事',
    title: '可持续开采。/ 精密加工。',
    paragraph1: '龙英在义安省归合县的自有矿场开采和加工原生白色石灰岩。',
    paragraph2: '5个工厂运行欧洲标准的干法研磨和硬脂酸涂层生产线 — 总产能35万吨/年。',
    paragraph3: '每一吨石粉都是一个承诺 — 质量、进度和长期合作关系。',
    imageUrl: '/assets/da-nguyen-lieu-cao-cap.webp',
    imageAlt: '龙英归合矿场',
    bgImageUrl: '/assets/nha-may-bot-sieu-min-1.webp',
    signerName: 'Nguyen Long Anh',
    signerTitle: '主席 · 创始人',
  },
};

const TIMELINE: Record<Locale, AboutTimelineSection> = {
  vi: {
    eyebrow: 'Hành trình',
    title: '20 năm — một mạch đá',
    items: [
      {
        year: '2008',
        title: 'Khởi nguồn',
        body: 'Thành lập tại Quỳ Hợp, Nghệ An — bắt đầu từ một mỏ đá vôi trắng.',
      },
      {
        year: '2013',
        title: 'Nhà máy đầu',
        body: 'Lắp đặt dây chuyền nghiền khô đầu tiên, công suất 80,000 tấn/năm.',
      },
      {
        year: '2017',
        title: 'Phủ Stearic',
        body: 'Đưa vào vận hành dây chuyền phủ Stearic Acid theo công nghệ EU.',
      },
      {
        year: '2020',
        title: 'ISO 9001',
        body: 'Đạt chứng nhận ISO 9001:2015. Mở rộng xuất khẩu sang Hàn Quốc, Nhật Bản.',
      },
      {
        year: '2024',
        title: 'Mở rộng',
        body: 'Khánh thành xưởng đá Slab 1.6×2.4m. Tổng công suất đạt 350,000 tấn/năm.',
      },
    ],
  },
  en: {
    eyebrow: 'Journey',
    title: '20 years — one continuous vein',
    items: [
      {
        year: '2008',
        title: 'Founded',
        body: 'Founded in Quy Hop, Nghe An — starting from a single white limestone quarry.',
      },
      {
        year: '2013',
        title: 'First plant',
        body: 'Installed our first dry-grinding line at 80,000 tons/year capacity.',
      },
      {
        year: '2017',
        title: 'Coating line',
        body: 'Commissioned a stearic-acid coating line built to European specs.',
      },
      {
        year: '2020',
        title: 'ISO 9001',
        body: 'Certified ISO 9001:2015. Began exports to Korea and Japan.',
      },
      {
        year: '2024',
        title: 'Expansion',
        body: 'Opened our 1.6×2.4m Slab workshop. Total capacity reached 350,000 t/y.',
      },
    ],
  },
  zh: {
    eyebrow: '历程',
    title: '20年 — 一脉石矿',
    items: [
      { year: '2008', title: '创立', body: '在义安省归合县创立 — 从一个白石灰岩矿场起步。' },
      { year: '2013', title: '首个工厂', body: '安装首条干法研磨生产线,年产能8万吨。' },
      { year: '2017', title: '涂层生产线', body: '投产符合欧洲标准的硬脂酸涂层生产线。' },
      { year: '2020', title: 'ISO 9001', body: '获得ISO 9001:2015认证。开始向韩国、日本出口。' },
      { year: '2024', title: '扩张', body: '开设1.6×2.4米大板工坊。总产能达到35万吨/年。' },
    ],
  },
};

const VALUES: Record<Locale, AboutValuesSection> = {
  vi: {
    eyebrow: 'Giá trị cốt lõi',
    title: 'Ba điều chúng tôi không bao giờ thỏa hiệp',
    items: [
      {
        name: 'Chất lượng nguyên sinh',
        body: 'Mỏ riêng tại Quỳ Hợp với độ trắng > 98% và CaCO₃ > 98.5% — kiểm soát từ gốc.',
        icon: 'drop',
      },
      {
        name: 'Công nghệ chính xác',
        body: 'Dây chuyền nghiền và phủ Stearic Acid theo công nghệ Châu Âu, kiểm tra từng lô.',
        icon: 'spark',
      },
      {
        name: 'Cam kết giao hàng',
        body: 'Cảng Cửa Lò & Hải Phòng — đóng gói linh hoạt, lịch giao đúng hẹn.',
        icon: 'ship',
      },
    ],
  },
  en: {
    eyebrow: 'Core values',
    title: 'Three things we never compromise on',
    items: [
      {
        name: 'Pure raw material',
        body: 'Owned quarry in Quy Hop · whiteness >98%, CaCO₃ >98.5% — controlled at the source.',
        icon: 'drop',
      },
      {
        name: 'Precision technology',
        body: 'EU-spec grinding and stearic-acid coating lines · per-batch QC.',
        icon: 'spark',
      },
      {
        name: 'On-time delivery',
        body: 'Cua Lo & Hai Phong ports · flexible packaging, schedules we keep.',
        icon: 'ship',
      },
    ],
  },
  zh: {
    eyebrow: '核心价值',
    title: '我们永不妥协的三件事',
    items: [
      {
        name: '纯原料',
        body: '归合自有矿场 · 白度>98%、碳酸钙>98.5% — 从源头控制。',
        icon: 'drop',
      },
      { name: '精密技术', body: '欧洲标准研磨和硬脂酸涂层生产线 · 每批次QC。', icon: 'spark' },
      { name: '准时交付', body: '窗碧港和海防港 · 灵活包装,按期履约。', icon: 'ship' },
    ],
  },
};

const CAPS: Record<Locale, AboutCapsSection> = {
  vi: {
    eyebrow: 'Năng lực sản xuất',
    title: 'Hệ thống nhà máy. Đo bằng con số.',
    sub: 'Hệ thống nhà máy của Long Anh được thiết kế để sản xuất ổn định, công suất lớn và linh hoạt theo từng đơn hàng B2B.',
    imageUrl: '/assets/nha-may-bot-sieu-min-3.webp',
    imageAlt: 'Nhà máy bột siêu mịn Long Anh',
    metrics: [
      { label: 'Mỏ đá vận hành', value: '05 mỏ' },
      { label: 'Công suất hàng năm', value: '350,000 tấn' },
      { label: 'Dây chuyền nghiền khô', value: '06 dây chuyền' },
      { label: 'Dây chuyền phủ Stearic', value: '02 dây chuyền' },
      { label: 'Đóng gói', value: '25kg · Jumbo 1T · Bulk' },
      { label: 'Cảng xuất hàng', value: 'Cửa Lò · Hải Phòng' },
    ],
  },
  en: {
    eyebrow: 'Production capacity',
    title: 'The plants. By the numbers.',
    sub: 'Long Anh plants are designed for stable, high-volume production with order-by-order flexibility for B2B customers.',
    imageUrl: '/assets/nha-may-bot-sieu-min-3.webp',
    imageAlt: 'Long Anh fine-powder plant',
    metrics: [
      { label: 'Operating quarries', value: '5 sites' },
      { label: 'Annual capacity', value: '350,000 tons' },
      { label: 'Dry-grinding lines', value: '6 lines' },
      { label: 'Stearic coating lines', value: '2 lines' },
      { label: 'Packaging', value: '25kg · Jumbo 1T · Bulk' },
      { label: 'Export ports', value: 'Cua Lo · Hai Phong' },
    ],
  },
  zh: {
    eyebrow: '生产能力',
    title: '工厂。用数字说话。',
    sub: '龙英的工厂为稳定、大批量生产而设计,可根据B2B客户的订单灵活调整。',
    imageUrl: '/assets/nha-may-bot-sieu-min-3.webp',
    imageAlt: '龙英超细粉工厂',
    metrics: [
      { label: '运营矿场', value: '5个矿场' },
      { label: '年产能', value: '35万吨' },
      { label: '干法研磨线', value: '6条' },
      { label: '硬脂酸涂层线', value: '2条' },
      { label: '包装', value: '25kg · 吨袋1T · 散装' },
      { label: '出口港口', value: '窗碧 · 海防' },
    ],
  },
};

const WAREHOUSE: Record<Locale, AboutWarehouseSection> = {
  vi: {
    eyebrow: 'Kho bãi & Logistics',
    title: 'Sẵn sàng giao hàng — đúng hẹn, đúng quy cách.',
    images: [
      '/assets/kho-hang.webp',
      '/assets/kho-hang-2.webp',
      '/assets/kho-da-nguyen-lieu.webp',
      '/assets/kho-hang-xuat-khau.webp',
    ],
  },
  en: {
    eyebrow: 'Warehouse & logistics',
    title: 'Ready to ship — on time, to spec.',
    images: [
      '/assets/kho-hang.webp',
      '/assets/kho-hang-2.webp',
      '/assets/kho-da-nguyen-lieu.webp',
      '/assets/kho-hang-xuat-khau.webp',
    ],
  },
  zh: {
    eyebrow: '仓储与物流',
    title: '准备发货 — 按期、按规格。',
    images: [
      '/assets/kho-hang.webp',
      '/assets/kho-hang-2.webp',
      '/assets/kho-da-nguyen-lieu.webp',
      '/assets/kho-hang-xuat-khau.webp',
    ],
  },
};

const CERTS: Record<Locale, AboutCertsSection> = {
  vi: {
    title: 'Đạt chuẩn quốc tế',
    sub: 'Tất cả lô sản phẩm đều được kiểm tra COA, MSDS và đáp ứng yêu cầu khắt khe nhất từ thị trường Hàn Quốc, Nhật Bản, Ấn Độ và Trung Đông.',
    items: [
      { name: 'ISO 9001:2015', enabled: true },
      { name: 'REACH', enabled: true },
      { name: 'SGS', enabled: true },
      { name: 'MSDS', enabled: true },
    ],
  },
  en: {
    title: 'International standards',
    sub: 'Every batch ships with COA + MSDS and meets the strictest acceptance criteria from Korea, Japan, India and the Middle East.',
    items: [
      { name: 'ISO 9001:2015', enabled: true },
      { name: 'REACH', enabled: true },
      { name: 'SGS', enabled: true },
      { name: 'MSDS', enabled: true },
    ],
  },
  zh: {
    title: '国际标准',
    sub: '每批产品都附带COA和MSDS,符合韩国、日本、印度和中东市场最严格的验收标准。',
    items: [
      { name: 'ISO 9001:2015', enabled: true },
      { name: 'REACH', enabled: true },
      { name: 'SGS', enabled: true },
      { name: 'MSDS', enabled: true },
    ],
  },
};

const CTA: Record<Locale, AboutCtaSection> = {
  vi: {
    title: 'Hãy bắt đầu từ một câu hỏi.',
    sub: 'Đội ngũ kinh doanh phản hồi trong 24h làm việc — kèm spec, COA và báo giá FOB.',
    primaryLabel: 'Xem sản phẩm',
    primaryHref: '/products',
    secondaryLabel: 'Liên hệ ngay',
    secondaryHref: '/contact',
  },
  en: {
    title: 'Start with a question.',
    sub: 'Our sales team replies within 24 business hours — with spec sheet, COA and FOB quote.',
    primaryLabel: 'View products',
    primaryHref: '/products',
    secondaryLabel: 'Contact now',
    secondaryHref: '/contact',
  },
  zh: {
    title: '从一个问题开始。',
    sub: '销售团队在24个工作小时内回复 — 附规格表、COA和FOB报价。',
    primaryLabel: '查看产品',
    primaryHref: '/products',
    secondaryLabel: '立即联系',
    secondaryHref: '/contact',
  },
};

export function aboutDefaults(locale: Locale): AboutSectionsLocale {
  return {
    header: HEADER[locale],
    story: STORY[locale],
    timeline: TIMELINE[locale],
    values: VALUES[locale],
    caps: CAPS[locale],
    warehouse: WAREHOUSE[locale],
    certs: CERTS[locale],
    cta: CTA[locale],
  };
}
