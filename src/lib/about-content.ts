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
  /** Hero banner background photo. */
  imageUrl?: string;
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
  /** Caption (title + sub) for each image card, in image order. */
  captions?: { title: string; sub: string }[];
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
    imageUrl: '/assets/da-nguyen-lieu-cao-cap.webp',
  },
  en: {
    eyebrow: 'About us',
    title: 'Pure mineral stone from Nghe An',
    sub: 'Over 20 years of mining and processing — we build every relationship one on-time container at a time.',
    imageUrl: '/assets/da-nguyen-lieu-cao-cap.webp',
  },
  zh: {
    eyebrow: '关于我们',
    title: '来自义安省的原生矿石',
    sub: '20多年的开采和加工经验 — 我们通过每个按时交付的集装箱建立每段合作关系。',
    imageUrl: '/assets/da-nguyen-lieu-cao-cap.webp',
  },
};

const STORY: Record<Locale, AboutStorySection> = {
  vi: {
    eyebrow: 'Câu chuyện',
    title: 'Làm chủ trọn chuỗi giá trị.',
    paragraph1:
      'Long Anh trực tiếp khai thác và chế biến đá vôi trắng nguyên sinh từ 05 mỏ riêng tại Quỳ Hợp – Nghệ An — độ trắng vượt 98%, hàm lượng CaCO₃ trên 98,5%.',
    paragraph2:
      'Hệ thống 05 nhà máy trên 12 ha vận hành 06 dây chuyền nghiền khô và 02 dây chuyền phủ Stearic Acid theo công nghệ Châu Âu — tổng công suất trên 350.000 tấn/năm.',
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
    title: 'Owning every step of the chain.',
    paragraph1:
      'Long Anh directly mines and processes pristine white limestone from 5 owned quarries in Quy Hop, Nghe An — whiteness above 98%, CaCO₃ above 98.5%.',
    paragraph2:
      'Five plants on 12 ha run 6 dry-grinding lines and 2 stearic-acid coating lines built to European spec — total capacity above 350,000 tons/year.',
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
    title: '掌控价值链每一环。',
    paragraph1:
      '龙英在义安省归合县直接开采和加工5座自有矿山的原生白色石灰岩 — 白度超过98%,碳酸钙含量超过98.5%。',
    paragraph2:
      '5座工厂占地12公顷,运行6条干法研磨线和2条欧洲标准硬脂酸涂层线 — 总产能超过35万吨/年。',
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
        body: 'Thành lập tại Quỳ Hợp, Nghệ An với mỏ đá vôi trắng đầu tiên — đặt nền móng cho chuỗi khai thác – chế biến khép kín hôm nay.',
      },
      {
        year: '2013',
        title: 'Nhà máy đầu',
        body: 'Lắp đặt dây chuyền nghiền khô đầu tiên công suất 80.000 tấn/năm — đưa Long Anh từ khai thác thô sang chế biến sâu.',
      },
      {
        year: '2017',
        title: 'Phủ Stearic',
        body: 'Vận hành dây chuyền phủ Stearic Acid theo công nghệ Châu Âu — mở cửa vào thị trường compound nhựa PVC, PE, PP.',
      },
      {
        year: '2020',
        title: 'ISO 9001',
        body: 'Đạt chứng nhận ISO 9001:2015 cho hệ thống quản lý chất lượng; những container đầu tiên xuất sang Hàn Quốc và Nhật Bản.',
      },
      {
        year: '2024',
        title: 'Mở rộng',
        body: 'Khánh thành xưởng đá Slab khổ 1.6 × 2.4 m; tổng công suất toàn hệ thống đạt 350.000 tấn/năm, xuất khẩu 12 quốc gia.',
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
        body: 'Founded in Quy Hop, Nghe An with our first white limestone quarry — the base of today’s closed mining-to-processing chain.',
      },
      {
        year: '2013',
        title: 'First plant',
        body: 'Installed our first dry-grinding line at 80,000 tons/year — moving Long Anh from raw extraction into deep processing.',
      },
      {
        year: '2017',
        title: 'Coating line',
        body: 'Commissioned a European-spec stearic-acid coating line — opening the door to PVC, PE and PP compound markets.',
      },
      {
        year: '2020',
        title: 'ISO 9001',
        body: 'Certified ISO 9001:2015 for quality management; the first containers shipped to Korea and Japan.',
      },
      {
        year: '2024',
        title: 'Expansion',
        body: 'Opened the 1.6 × 2.4 m Slab workshop; system-wide capacity reached 350,000 t/year across 12 export countries.',
      },
    ],
  },
  zh: {
    eyebrow: '历程',
    title: '20年 — 一脉石矿',
    items: [
      {
        year: '2008',
        title: '创立',
        body: '在义安省归合县创立,拥有首座白石灰岩矿山 — 奠定今日开采–加工一体化链条的基础。',
      },
      {
        year: '2013',
        title: '首个工厂',
        body: '安装首条干法研磨生产线,年产能8万吨 — 从原石开采迈入深加工。',
      },
      {
        year: '2017',
        title: '涂层生产线',
        body: '投产欧洲标准硬脂酸涂层生产线 — 打开PVC、PE、PP塑料复合材料市场。',
      },
      {
        year: '2020',
        title: 'ISO 9001',
        body: '质量管理体系获ISO 9001:2015认证;首批集装箱出口韩国和日本。',
      },
      {
        year: '2024',
        title: '扩张',
        body: '开设1.6×2.4米大板工坊;全系统总产能达35万吨/年,出口12个国家。',
      },
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
        body: 'Chỉ dùng đá từ 05 mỏ riêng tại Quỳ Hợp — độ trắng vượt 98%, CaCO₃ trên 98,5%. Chất lượng được kiểm soát từ khâu khai thác, không phụ thuộc nguyên liệu trôi nổi.',
        icon: 'drop',
      },
      {
        name: 'Công nghệ chính xác',
        body: 'Dây chuyền nghiền và phủ Stearic Acid theo công nghệ Châu Âu, cỡ hạt D50 kiểm soát trong dải 4–20 µm. Mỗi lô qua đủ bốn chỉ tiêu QC trước khi xuất xưởng.',
        icon: 'spark',
      },
      {
        name: 'Cam kết giao hàng',
        body: 'Giao FOB qua cảng Cửa Lò và Hải Phòng, mỗi lô kèm COA và MSDS đầy đủ. Quy cách đóng gói linh hoạt theo từng thị trường — lịch giao đã chốt là giữ.',
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
        body: 'Stone comes only from our 5 owned quarries in Quy Hop — whiteness above 98%, CaCO₃ above 98.5%. Quality is controlled from extraction, never from spot-market feedstock.',
        icon: 'drop',
      },
      {
        name: 'Precision technology',
        body: 'European-spec grinding and stearic-acid coating lines hold D50 particle size within 4–20 µm. Every batch passes four QC criteria before leaving the plant.',
        icon: 'spark',
      },
      {
        name: 'On-time delivery',
        body: 'FOB via Cua Lo and Hai Phong ports, every batch with full COA and MSDS. Packaging flexes by market — a confirmed schedule is a kept schedule.',
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
        body: '石料仅来自归合5座自有矿山 — 白度超过98%,碳酸钙超过98.5%。质量从开采环节即受控,绝不依赖市场散料。',
        icon: 'drop',
      },
      {
        name: '精密技术',
        body: '欧洲标准研磨与硬脂酸涂层生产线,D50粒径控制在4–20 µm。每批次出厂前通过四项QC指标。',
        icon: 'spark',
      },
      {
        name: '准时交付',
        body: '经炉门港和海防港FOB交货,每批附完整COA与MSDS。包装按市场灵活调整 — 确认的交期就是履行的交期。',
        icon: 'ship',
      },
    ],
  },
};

const CAPS: Record<Locale, AboutCapsSection> = {
  vi: {
    eyebrow: 'Năng lực sản xuất',
    title: 'Hệ thống nhà máy. Đo bằng con số.',
    sub: '05 nhà máy trên 12 ha tại Quỳ Hợp vận hành 06 dây chuyền nghiền khô và 02 dây chuyền phủ Stearic — sản xuất ổn định 350.000 tấn/năm, linh hoạt theo từng đơn hàng B2B.',
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
    sub: 'Five plants on 12 ha in Quy Hop run 6 dry-grinding and 2 stearic-coating lines — a steady 350,000 tons/year with order-by-order flexibility for B2B customers.',
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
    sub: '归合5座工厂占地12公顷,运行6条干法研磨线和2条硬脂酸涂层线 — 年产35万吨稳定输出,并按B2B订单灵活调整。',
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
    captions: [
      {
        title: 'Kho thành phẩm',
        sub: 'Thành phẩm đóng pallet, phân lô theo mã sản phẩm trước khi xuất.',
      },
      {
        title: 'Bãi nguyên liệu',
        sub: 'Đá nguyên khai tập kết theo phân vùng, sẵn sàng cho dây chuyền.',
      },
      {
        title: 'Bốc xếp & vận chuyển',
        sub: 'Thiết bị nâng hạ và đội xe vận hành liên tục trong ngày.',
      },
      {
        title: 'Sẵn sàng xuất khẩu',
        sub: 'Container niêm phong cùng chứng từ đầy đủ trước khi rời nhà máy.',
      },
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
    captions: [
      {
        title: 'Finished-goods warehouse',
        sub: 'Palletised lots staged by product code before dispatch.',
      },
      { title: 'Raw-material yard', sub: 'Quarried stone staged by zone, ready for the lines.' },
      {
        title: 'Loading & transport',
        sub: 'Lifting equipment and trucks running throughout the day.',
      },
      {
        title: 'Export-ready',
        sub: 'Sealed containers with full documentation before leaving the plant.',
      },
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
    captions: [
      { title: '成品仓库', sub: '成品按产品编码分批打托,待发货。' },
      { title: '原料堆场', sub: '原石分区堆放,随时供应生产线。' },
      { title: '装卸与运输', sub: '装卸设备与车队全天候运转。' },
      { title: '出口就绪', sub: '集装箱封箱,单证齐备后出厂。' },
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
