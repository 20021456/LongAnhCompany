/**
 * Placeholder data for Phase 2 UI build-out.
 *
 * Phase 4 will replace this with database queries (via `src/lib/db.ts`).
 * The shape mirrors what the DB will return, so swapping is trivial.
 */

import type { Locale } from '@/lib/i18n/config';

export type I18nString = Record<Locale, string>;

export const placeholderStats: Array<{
  key: string;
  value: string;
  label: I18nString;
  icon: 'factory' | 'box' | 'globe' | 'shield';
}> = [
  {
    key: 'years',
    value: '20+',
    label: { vi: 'Năm kinh nghiệm', en: 'Years of experience', zh: '年经验' },
    icon: 'shield',
  },
  {
    key: 'capacity',
    value: '350,000',
    label: { vi: 'Tấn / năm', en: 'Tons / year', zh: '吨/年' },
    icon: 'factory',
  },
  {
    key: 'countries',
    value: '12',
    label: { vi: 'Quốc gia xuất khẩu', en: 'Export countries', zh: '出口国家' },
    icon: 'globe',
  },
  {
    key: 'quarries',
    value: '05',
    label: { vi: 'Mỏ đá vận hành', en: 'Quarries operated', zh: '运营矿场' },
    icon: 'box',
  },
];

export const placeholderProducts: Array<{
  slug: string;
  code: string;
  category: 'powder' | 'stone';
  name: I18nString;
  shortDesc: I18nString;
  tags: string[];
  image: string;
}> = [
  {
    slug: 'bot-caco3-khong-phu',
    code: 'P-01',
    category: 'powder',
    name: {
      vi: 'Bột đá CaCO₃ không phủ',
      en: 'Uncoated CaCO₃ powder',
      zh: '未涂层碳酸钙粉',
    },
    shortDesc: {
      vi: 'Nghiền khô · 3 – 20 µm · Sơn · Bột bả · Cao su · Thức ăn chăn nuôi',
      en: 'Dry-ground · 3 – 20 µm · Paint · Putty · Rubber · Animal feed',
      zh: '干法研磨 · 3 – 20 µm · 涂料 · 腻子 · 橡胶 · 饲料',
    },
    tags: ['Paint', 'Putty', 'Rubber', 'Feed'],
    image: '/images/products/caco3-uncoated.jpg',
  },
  {
    slug: 'bot-caco3-phu-stearic',
    code: 'P-02',
    category: 'powder',
    name: {
      vi: 'Bột đá CaCO₃ phủ Stearic Acid',
      en: 'Stearic-coated CaCO₃ powder',
      zh: '硬脂酸涂层碳酸钙粉',
    },
    shortDesc: {
      vi: 'Coated EU spec · 3 – 18 µm · Masterbatch · Compound nhựa · Cáp · Profile',
      en: 'EU-spec coated · 3 – 18 µm · Masterbatch · Plastic compound · Cable · Profile',
      zh: '欧标涂层 · 3 – 18 µm · 母粒 · 塑料复合材料 · 电缆 · 型材',
    },
    tags: ['Masterbatch', 'PVC', 'Cable'],
    image: '/images/products/caco3-coated.jpg',
  },
  {
    slug: 'da-slab',
    code: 'P-03',
    category: 'stone',
    name: { vi: 'Đá Slab cỡ lớn', en: 'Large-format Slab', zh: '大尺寸石板' },
    shortDesc: {
      vi: '1.6×2.4m · 18–30 mm · Đá trắng siêu trắng · Mặt bàn · Ốp tường',
      en: '1.6×2.4m · 18–30 mm · Super-white · Countertop · Wall cladding',
      zh: '1.6×2.4米 · 18–30毫米 · 超白 · 台面 · 墙面装饰',
    },
    tags: ['Slab', 'Countertop'],
    image: '/images/products/slab.jpg',
  },
  {
    slug: 'da-xe-quy-cach',
    code: 'P-04',
    category: 'stone',
    name: { vi: 'Đá xẻ quy cách', en: 'Cut-to-size tile', zh: '定制石材' },
    shortDesc: {
      vi: '60×30 · 40×60 · 80×40 · Sân vườn · Bậc thang · Lát hồ bơi',
      en: '60×30 · 40×60 · 80×40 · Garden · Steps · Pool deck',
      zh: '60×30 · 40×60 · 80×40 · 花园 · 台阶 · 泳池',
    },
    tags: ['Tile', 'Pool'],
    image: '/images/products/cut-tile.jpg',
  },
  {
    slug: 'da-trang-tri',
    code: 'P-05',
    category: 'stone',
    name: { vi: 'Đá trang trí', en: 'Decorative stone', zh: '装饰石材' },
    shortDesc: {
      vi: 'Đá viền hồ bơi · Sân vườn · Bước đi 50×50 · Tường rào',
      en: 'Pool coping · Garden · Steps 50×50 · Fence cladding',
      zh: '泳池边石 · 花园 · 50×50台阶 · 围墙',
    },
    tags: ['Decorative', 'Garden'],
    image: '/images/products/decorative.jpg',
  },
];

export const placeholderCertifications: Array<{
  code: string;
  name: string;
  desc: I18nString;
  badge: string;
}> = [
  {
    code: 'iso',
    name: 'ISO 9001:2015',
    desc: {
      vi: 'Hệ thống quản lý chất lượng',
      en: 'Quality Management System',
      zh: '质量管理体系',
    },
    badge: '/images/certs/iso.svg',
  },
  {
    code: 'reach',
    name: 'REACH',
    desc: {
      vi: 'Tuân thủ hóa chất Châu Âu',
      en: 'EU Chemical Compliance',
      zh: '欧盟化学品合规',
    },
    badge: '/images/certs/reach.svg',
  },
  {
    code: 'sgs',
    name: 'SGS',
    desc: {
      vi: 'Kiểm định độc lập độ trắng & cỡ hạt',
      en: 'Independent test — whiteness & particle size',
      zh: '独立白度和粒径检测',
    },
    badge: '/images/certs/sgs.svg',
  },
  {
    code: 'msds',
    name: 'MSDS',
    desc: {
      vi: 'Phiếu an toàn hóa chất',
      en: 'Material safety data sheet',
      zh: '材料安全数据表',
    },
    badge: '/images/certs/msds.svg',
  },
];

export const placeholderTimeline: Array<{
  year: number;
  title: I18nString;
  body: I18nString;
}> = [
  {
    year: 2008,
    title: { vi: 'Khởi nguồn', en: 'Founded', zh: '创立' },
    body: {
      vi: 'Thành lập tại Quỳ Hợp, Nghệ An — bắt đầu từ một mỏ đá vôi trắng.',
      en: 'Founded in Quy Hop, Nghe An — starting from a single white limestone quarry.',
      zh: '在义安省归合县创立 — 从一个白石灰岩矿场起步。',
    },
  },
  {
    year: 2013,
    title: { vi: 'Nhà máy đầu', en: 'First plant', zh: '首座工厂' },
    body: {
      vi: 'Lắp đặt dây chuyền nghiền khô đầu tiên, công suất 80,000 tấn/năm.',
      en: 'Installed our first dry-grinding line at 80,000 t/y.',
      zh: '安装首条干法研磨生产线,年产能8万吨。',
    },
  },
  {
    year: 2017,
    title: { vi: 'Phủ Stearic', en: 'Stearic coating', zh: '硬脂酸涂层' },
    body: {
      vi: 'Đưa vào vận hành dây chuyền phủ Stearic Acid theo công nghệ EU.',
      en: 'Commissioned a stearic-acid coating line built to European specs.',
      zh: '投产符合欧洲标准的硬脂酸涂层生产线。',
    },
  },
  {
    year: 2020,
    title: { vi: 'ISO 9001', en: 'ISO 9001', zh: 'ISO 9001' },
    body: {
      vi: 'Đạt chứng nhận ISO 9001:2015. Mở rộng xuất khẩu sang Hàn Quốc, Nhật Bản.',
      en: 'Certified ISO 9001:2015. Began exports to Korea and Japan.',
      zh: '获得ISO 9001:2015认证。开始向韩国、日本出口。',
    },
  },
  {
    year: 2024,
    title: { vi: 'Mở rộng', en: 'Expansion', zh: '扩建' },
    body: {
      vi: 'Khánh thành xưởng đá Slab 1.6×2.4m. Tổng công suất 350,000 t/y.',
      en: 'Opened 1.6×2.4m Slab workshop. Total capacity reached 350,000 t/y.',
      zh: '开设1.6×2.4米大板工坊。总产能达到35万吨/年。',
    },
  },
];

export const placeholderMarkets = [
  'Hàn Quốc',
  'Nhật Bản',
  'Ấn Độ',
  'Bangladesh',
  'Indonesia',
  'UAE',
  'Ai Cập',
  'Thổ Nhĩ Kỳ',
];

export const placeholderCapabilities: Array<{
  key: string;
  title: I18nString;
  body: I18nString;
  icon: 'factory' | 'drop' | 'shield' | 'box' | 'check-circle';
}> = [
  {
    key: 'capacity',
    title: { vi: 'Năng lực sản xuất', en: 'Production capacity', zh: '生产能力' },
    body: {
      vi: '05 nhà máy với tổng diện tích 12ha, dây chuyền hiện đại — công suất trên 350,000 tấn/năm.',
      en: '5 plants over 12ha of modern lines — capacity exceeding 350,000 tons/year.',
      zh: '5座工厂占地12公顷,配备现代化生产线 — 年产能超过35万吨。',
    },
    icon: 'factory',
  },
  {
    key: 'raw',
    title: { vi: 'Nguồn nguyên liệu', en: 'Raw material', zh: '原料来源' },
    body: {
      vi: 'Đá vôi trắng nguyên sinh từ Quỳ Hợp — Nghệ An. Độ trắng > 98%, CaCO₃ > 98.5%.',
      en: 'Pristine white limestone from Quy Hop — whiteness > 98%, CaCO₃ > 98.5%.',
      zh: '源自归合-义安省的原始白石灰岩 · 白度>98%,碳酸钙>98.5%。',
    },
    icon: 'drop',
  },
  {
    key: 'infra',
    title: { vi: 'Cơ sở hạ tầng', en: 'Infrastructure', zh: '基础设施' },
    body: {
      vi: 'Hệ thống dây chuyền nghiền và phủ Stearic Acid theo công nghệ Châu Âu.',
      en: 'EU-spec grinding and stearic-acid coating lines, running in stable synchronization.',
      zh: '欧洲标准的研磨和硬脂酸涂层生产线,稳定同步运行。',
    },
    icon: 'box',
  },
  {
    key: 'qc',
    title: { vi: 'Kiểm định chất lượng', en: 'Quality control', zh: '质量检验' },
    body: {
      vi: 'Phòng QC kiểm tra từng lô — kèm COA và MSDS theo tiêu chuẩn ISO 9001:2015.',
      en: 'Per-batch QC with COA and MSDS to ISO 9001:2015.',
      zh: '每批次QC检测,提供符合ISO 9001:2015的COA和MSDS。',
    },
    icon: 'shield',
  },
  {
    key: 'pack',
    title: { vi: 'Đóng gói sản phẩm', en: 'Packaging', zh: '产品包装' },
    body: {
      vi: 'Đáp ứng mọi quy cách: PP 25kg/50kg, jumbo 250kg/500kg/1000kg và bulk.',
      en: 'PP 25/50kg, jumbo 250/500/1000kg, and bulk to customer requirements.',
      zh: 'PP 25/50公斤、吨袋250/500/1000公斤,以及按客户需求散装。',
    },
    icon: 'check-circle',
  },
];
