/**
 * Product catalogue — ported verbatim from LongAnhCorp prototype product.html.
 * Phase 3 will move this into the products/product_variants tables.
 */

export interface ProductVariant {
  id: string;
  /** Either a locale-neutral string ('3 µm') or an i18n object ({ vi, en, zh }). */
  label: string | Record<string, string>;
  vnd: number;
  stock: number;
  popular?: boolean;
}
export interface ProductSpec {
  key: string;
  val: string;
  unit?: string;
}
export interface ProductDetail {
  code: string;
  cat: number;
  name: Record<string, string>;
  meta: Record<string, string>;
  desc: Record<string, string>;
  longDesc: Record<string, string>;
  images: string[];
  /** Powder products use numeric µm sizes; stone products use string labels. */
  sizes?: (number | string)[];
  sizesUnit?: string;
  specs: ProductSpec[];
  applications: { icon: string; vi: string; en: string; zh: string }[];
  packaging: { vi: string; en: string; zh: string }[];
  features: Record<string, string[]>;
  tags: Record<string, string[]>;
  moq: Record<string, string>;
  leadTime: Record<string, string>;
  unit: Record<string, string>;
  variants: ProductVariant[];
}

export const PRODUCTS: Record<string, ProductDetail> = {
  'P-01': {
    code: 'P-01',
    cat: 0,
    name: { vi: 'Bột đá CaCO₃ không phủ', en: 'Uncoated CaCO₃ powder', zh: '未涂层碳酸钙粉' },
    meta: { vi: 'Uncoated · 4–20 µm', en: 'Uncoated · 4–20 µm', zh: '未涂层 · 4–20 µm' },
    desc: {
      vi: 'Bột đá nghiền khô độ trắng cao, đa dạng cỡ hạt — dùng cho sơn, bột bả, keo dán, phụ gia thức ăn chăn nuôi và masterbatch.',
      en: 'Dry-ground GCC with high whiteness in multiple particle sizes — for paint, putty, adhesives, animal-feed additives and masterbatch.',
      zh: '高白度干法研磨碳酸钙粉,多种粒径 — 用于涂料、腻子、胶粘剂、动物饲料添加剂和母粒。',
    },
    longDesc: {
      vi: 'Sản phẩm bột đá CaCO₃ không phủ được nghiền khô từ nguồn đá vôi trắng nguyên sinh tại mỏ Quỳ Hợp – Nghệ An. Với hàm lượng CaCO₃ vượt 98.5% và độ trắng trên 98%, sản phẩm đáp ứng các tiêu chuẩn khắt khe nhất cho ngành công nghiệp sơn nước, bột bả, keo dán, sản xuất nhựa và phụ gia thức ăn chăn nuôi. Cỡ hạt từ 4 đến 20 µm được kiểm soát chặt chẽ qua hệ thống nghiền và phân loại hiện đại theo công nghệ Châu Âu.',
      en: 'Our uncoated CaCO₃ powder is dry-ground from pristine white limestone at Quy Hop quarry in Nghe An. With CaCO₃ content above 98.5% and whiteness above 98%, the product meets the toughest standards for water-based paints, putty, adhesives, plastics manufacturing and animal feed additives. Particle sizes from 4 to 20 µm are tightly controlled through European-spec milling and classification systems.',
      zh: '我们的未涂层碳酸钙粉是从义安省归合矿场的原始白石灰岩干法研磨而成。碳酸钙含量超过98.5%,白度超过98%,符合水性涂料、腻子、胶粘剂、塑料制造和动物饲料添加剂的最严格标准。粒径范围4至20微米,通过欧洲标准的研磨和分类系统严格控制。',
    },
    images: [
      '/assets/bot-caco3-sieu-min.webp',
      '/assets/bot-sieu-min.webp',
      '/assets/nha-may-bot-sieu-min.webp',
      '/assets/bao-bi-sieu-trang.jpg',
    ],
    sizes: [3, 8, 10, 12, 15, 17, 18, 20],
    sizesUnit: 'µm',
    specs: [
      { key: 'caco3', val: '≥ 98.5', unit: '%' },
      { key: 'white', val: '≥ 98', unit: '%' },
      { key: 'moist', val: '≤ 0.3', unit: '%' },
      { key: 'density', val: '0.9 – 1.1', unit: 'g/cm³' },
      { key: 'd50', val: '3 – 20', unit: 'µm' },
    ],
    applications: [
      {
        icon: 'spark',
        vi: 'Sơn nước & sơn dầu',
        en: 'Water & oil-based paint',
        zh: '水性和油性涂料',
      },
      { icon: 'box', vi: 'Bột bả tường', en: 'Wall putty', zh: '墙面腻子' },
      { icon: 'drop', vi: 'Keo dán công nghiệp', en: 'Industrial adhesives', zh: '工业胶粘剂' },
      { icon: 'leaf', vi: 'Thức ăn chăn nuôi', en: 'Animal feed', zh: '动物饲料' },
      { icon: 'grid', vi: 'Masterbatch nhựa', en: 'Plastic masterbatch', zh: '塑料母粒' },
      { icon: 'factory', vi: 'Giấy & cao su', en: 'Paper & rubber', zh: '纸张和橡胶' },
    ],
    packaging: [
      { vi: 'Bao PP 25kg', en: 'PP bag 25kg', zh: 'PP袋 25公斤' },
      { vi: 'Bao PP 50kg', en: 'PP bag 50kg', zh: 'PP袋 50公斤' },
      { vi: 'Jumbo bag 1 tấn', en: '1T jumbo bag', zh: '吨袋 1吨' },
      { vi: 'Container rời (bulk)', en: 'Bulk container', zh: '散装集装箱' },
    ],
    features: {
      vi: [
        'Độ trắng > 98%, CaCO₃ > 98.5%',
        'Cỡ hạt đồng đều, kiểm soát chặt',
        'Phù hợp đa ứng dụng công nghiệp',
        'Đạt ISO 9001:2015, có COA và MSDS',
      ],
      en: [
        'Whiteness > 98%, CaCO₃ > 98.5%',
        'Uniform particle size, tightly controlled',
        'Multi-purpose industrial use',
        'ISO 9001:2015 certified, with COA and MSDS',
      ],
      zh: [
        '白度>98%,碳酸钙>98.5%',
        '粒径均匀,严格控制',
        '多种工业用途',
        'ISO 9001:2015认证,提供COA和MSDS',
      ],
    },
    tags: {
      vi: ['Sơn', 'Keo', 'Bột bả', 'Thức ăn', 'Nhựa'],
      en: ['Paint', 'Adhesive', 'Putty', 'Feed', 'Plastic'],
      zh: ['涂料', '胶粘剂', '腻子', '饲料', '塑料'],
    },
    moq: { vi: '25 tấn', en: '25 tons', zh: '25吨' },
    leadTime: { vi: '7–14 ngày', en: '7–14 days', zh: '7–14天' },
    unit: { vi: 'tấn', en: 'ton', zh: '吨' },
    variants: [
      { id: '3um', label: '3 µm', vnd: 4500000, stock: 250, popular: true },
      { id: '8um', label: '8 µm', vnd: 4200000, stock: 320 },
      { id: '10um', label: '10 µm', vnd: 3900000, stock: 450 },
      { id: '12um', label: '12 µm', vnd: 3700000, stock: 380 },
      { id: '15um', label: '15 µm', vnd: 3500000, stock: 600 },
      { id: '17um', label: '17 µm', vnd: 3300000, stock: 280 },
      { id: '18um', label: '18 µm', vnd: 3200000, stock: 220 },
      { id: '20um', label: '20 µm', vnd: 3000000, stock: 580 },
    ],
  },

  'P-02': {
    code: 'P-02',
    cat: 0,
    name: {
      vi: 'Bột đá CaCO₃ phủ Stearic Acid',
      en: 'Stearic-acid coated CaCO₃',
      zh: '硬脂酸涂层碳酸钙',
    },
    meta: { vi: 'Coated · 4–20 µm', en: 'Coated · 4–20 µm', zh: '涂层 · 4–20 µm' },
    desc: {
      vi: 'Phủ acid stearic cải thiện độ phân tán, giảm hút ẩm — lý tưởng cho compound nhựa PVC, PE, PP và masterbatch cao cấp.',
      en: 'Stearic-acid coating improves dispersion and reduces moisture pickup — ideal for PVC, PE, PP compounds and premium masterbatch.',
      zh: '硬脂酸涂层提高分散性,降低吸湿性 — 适用于PVC、PE、PP复合材料和高端母粒。',
    },
    longDesc: {
      vi: 'Bột đá CaCO₃ phủ stearic acid được sản xuất trên dây chuyền phủ chuyên dụng theo công nghệ Châu Âu. Lớp phủ stearic 1.0–1.5% bao phủ đều bề mặt hạt, giúp cải thiện khả năng phân tán trong nền polymer, giảm độ hút ẩm và tăng độ bóng cho sản phẩm cuối. Sản phẩm đặc biệt phù hợp cho compound PVC cứng/dẻo, ống nhựa, màng PE/PP, masterbatch cao cấp và các ứng dụng yêu cầu kỹ thuật cao.',
      en: 'Our stearic-coated CaCO₃ is produced on a dedicated EU-spec coating line. The 1.0–1.5% stearic acid coating uniformly covers particle surfaces, improving polymer-matrix dispersion, reducing moisture absorption and enhancing surface gloss in finished products. The product is especially suited for rigid/flexible PVC compounds, plastic pipes, PE/PP films, premium masterbatch and other technically demanding applications.',
      zh: '我们的硬脂酸涂层碳酸钙在欧洲标准的专用涂层生产线上生产。1.0–1.5%的硬脂酸涂层均匀包覆颗粒表面,提高在聚合物基体中的分散性,降低吸湿性,提升成品光泽度。该产品特别适用于硬质/软质PVC复合材料、塑料管材、PE/PP薄膜、高端母粒和其他技术要求高的应用。',
    },
    images: [
      '/assets/bot-sieu-min.webp',
      '/assets/bot-caco3-sieu-min.webp',
      '/assets/nha-may-bot-sieu-min-3.webp',
      '/assets/bao-bi-sieu-trang.jpg',
    ],
    sizes: [3, 10, 12, 15, 17, 18, 20],
    sizesUnit: 'µm',
    specs: [
      { key: 'caco3', val: '≥ 98.5', unit: '%' },
      { key: 'white', val: '≥ 98', unit: '%' },
      { key: 'moist', val: '≤ 0.2', unit: '%' },
      { key: 'density', val: '0.7 – 0.9', unit: 'g/cm³' },
      { key: 'stearic', val: '1.0 – 1.5', unit: '%' },
      { key: 'd50', val: '3 – 20', unit: 'µm' },
    ],
    applications: [
      { icon: 'grid', vi: 'PVC cứng & dẻo', en: 'Rigid & flexible PVC', zh: '硬质和软质PVC' },
      { icon: 'box', vi: 'Ống nhựa & profile', en: 'Pipes & profiles', zh: '管材和型材' },
      { icon: 'drop', vi: 'Màng PE / PP', en: 'PE / PP film', zh: 'PE / PP 薄膜' },
      { icon: 'spark', vi: 'Masterbatch cao cấp', en: 'Premium masterbatch', zh: '高端母粒' },
      { icon: 'factory', vi: 'Compound kỹ thuật', en: 'Technical compounds', zh: '技术复合材料' },
      { icon: 'leaf', vi: 'Cáp & dây điện', en: 'Cable & wire', zh: '电缆和电线' },
    ],
    packaging: [
      { vi: 'Bao PP 25kg', en: 'PP bag 25kg', zh: 'PP袋 25公斤' },
      { vi: 'Jumbo bag 500kg / 1 tấn', en: '500kg / 1T jumbo', zh: '吨袋 500公斤 / 1吨' },
      { vi: 'Container rời (bulk)', en: 'Bulk container', zh: '散装集装箱' },
    ],
    features: {
      vi: [
        'Phủ stearic 1.0–1.5%, bám đều',
        'Độ phân tán cao, dispersion tốt',
        'Giảm hút ẩm, ổn định kích thước',
        'Tăng độ bóng và độ bền sản phẩm',
      ],
      en: [
        'Stearic coating 1.0–1.5%, uniform coverage',
        'High dispersibility',
        'Reduced moisture pickup, dimensional stability',
        'Improved gloss and product durability',
      ],
      zh: [
        '硬脂酸涂层1.0–1.5%,均匀覆盖',
        '高分散性',
        '降低吸湿性,尺寸稳定',
        '提升光泽度和产品耐久性',
      ],
    },
    tags: {
      vi: ['Nhựa', 'PVC', 'PE/PP', 'Masterbatch', 'Cao cấp'],
      en: ['Plastic', 'PVC', 'PE/PP', 'Masterbatch', 'Premium'],
      zh: ['塑料', 'PVC', 'PE/PP', '母粒', '高端'],
    },
    moq: { vi: '25 tấn', en: '25 tons', zh: '25吨' },
    leadTime: { vi: '10–14 ngày', en: '10–14 days', zh: '10–14天' },
    unit: { vi: 'tấn', en: 'ton', zh: '吨' },
    variants: [
      { id: '3um', label: '3 µm', vnd: 6500000, stock: 180, popular: true },
      { id: '10um', label: '10 µm', vnd: 5800000, stock: 240 },
      { id: '12um', label: '12 µm', vnd: 5500000, stock: 300 },
      { id: '15um', label: '15 µm', vnd: 5200000, stock: 420 },
      { id: '17um', label: '17 µm', vnd: 4900000, stock: 200 },
      { id: '18um', label: '18 µm', vnd: 4700000, stock: 180 },
      { id: '20um', label: '20 µm', vnd: 4500000, stock: 380 },
    ],
  },

  'P-03': {
    code: 'P-03',
    cat: 1,
    name: { vi: 'Đá Slab', en: 'Slab stone', zh: '大板石材' },
    meta: { vi: 'Tấm lớn · 1.6 × 2.4 m', en: 'Large slab · 1.6 × 2.4 m', zh: '大板 · 1.6 × 2.4 m' },
    desc: {
      vi: 'Đá tự nhiên dạng tấm, vân tự nhiên, mài bóng — dành cho mặt bàn, ốp tường nội thất cao cấp và showroom.',
      en: 'Polished natural-vein slab — for premium countertops, interior wall cladding and showroom installations.',
      zh: '抛光天然纹理板材 — 用于高端台面、室内墙面饰面和展厅安装。',
    },
    longDesc: {
      vi: 'Đá Slab tấm lớn 1.6×2.4m được khai thác và xẻ trực tiếp tại mỏ Long Anh – Nghệ An. Mỗi tấm đá có vân tự nhiên độc đáo, được mài bóng cao cấp đáp ứng tiêu chuẩn nội thất cao cấp. Phù hợp cho mặt bàn bếp, ốp tường phòng khách, sảnh khách sạn, showroom và các công trình thương mại đẳng cấp. Đa dạng hoàn thiện: bóng gương, mờ tự nhiên, brushed antique.',
      en: 'Large 1.6×2.4m slab stone is quarried and cut directly at the Long Anh quarry in Nghe An. Each slab has unique natural veining, polished to premium interior standards. Suitable for kitchen countertops, living room cladding, hotel lobbies, showrooms and high-end commercial projects. Multiple finishes: high-gloss, honed matte, brushed antique.',
      zh: '1.6×2.4米大板石材在义安省龙英矿场直接开采和切割。每块板材都有独特的天然纹理,抛光达到高端室内标准。适用于厨房台面、客厅墙面饰面、酒店大堂、展厅和高端商业项目。多种饰面:高光、哑光、拉丝古典。',
    },
    images: [
      '/assets/da-slab-sieu-trang.webp',
      '/assets/da-be-boi-biet-thu-1.webp',
      '/assets/da-be-boi-biet-thu-2.webp',
      '/assets/da-nguyen-lieu-cao-cap.webp',
    ],
    sizes: ['1.6 × 2.4 m', '1.4 × 2.0 m', '1.0 × 2.0 m'],
    sizesUnit: '',
    specs: [
      { key: 'spec_format', val: '1.6 × 2.4 m', unit: '' },
      { key: 'spec_thickness', val: '18 / 20 / 30', unit: 'mm' },
      { key: 'spec_finish', val: 'Polished / Honed / Brushed', unit: '' },
      { key: 'white', val: '90 – 95', unit: '%' },
      { key: 'density', val: '2.65 – 2.75', unit: 'g/cm³' },
    ],
    applications: [
      { icon: 'box', vi: 'Mặt bàn bếp & quầy bar', en: 'Kitchen countertops', zh: '厨房台面' },
      { icon: 'grid', vi: 'Ốp tường nội thất', en: 'Interior wall cladding', zh: '室内墙面饰面' },
      { icon: 'spark', vi: 'Sảnh khách sạn', en: 'Hotel lobbies', zh: '酒店大堂' },
      { icon: 'pin', vi: 'Showroom thương mại', en: 'Commercial showroom', zh: '商业展厅' },
      { icon: 'factory', vi: 'Mặt tiền cao cấp', en: 'Premium façade', zh: '高端外墙' },
    ],
    packaging: [
      { vi: 'Khung gỗ A-frame', en: 'A-frame wooden crate', zh: 'A型木架' },
      { vi: 'Bundle 5–8 tấm', en: 'Bundle 5–8 slabs', zh: '5-8块捆装' },
      { vi: 'Container 20ft / 40ft', en: '20ft / 40ft container', zh: '20英尺/40英尺集装箱' },
    ],
    features: {
      vi: [
        'Vân tự nhiên 100%, độc bản',
        'Mài bóng cao cấp, đa hoàn thiện',
        'Khai thác trực tiếp tại mỏ riêng',
        'Kích thước lớn, ít mối nối',
      ],
      en: [
        '100% natural unique veining',
        'High-quality polish, multiple finishes',
        'Mined directly from owned quarry',
        'Large format, fewer joints',
      ],
      zh: ['100%天然独特纹理', '高品质抛光,多种饰面', '自有矿场直接开采', '大尺寸,接缝少'],
    },
    tags: {
      vi: ['Nội thất', 'Mặt bàn', 'Ốp tường', 'Cao cấp'],
      en: ['Interior', 'Countertop', 'Cladding', 'Premium'],
      zh: ['室内', '台面', '饰面', '高端'],
    },
    moq: { vi: '01 container 20ft', en: '1 × 20ft container', zh: '1个20英尺集装箱' },
    leadTime: { vi: '14–21 ngày', en: '14–21 days', zh: '14–21天' },
    unit: { vi: 'tấm', en: 'slab', zh: '块' },
    variants: [
      { id: '1.6x2.4x18', label: '1.6 × 2.4 m · 18mm', vnd: 6800000, stock: 48, popular: true },
      { id: '1.6x2.4x20', label: '1.6 × 2.4 m · 20mm', vnd: 7500000, stock: 65 },
      { id: '1.6x2.4x30', label: '1.6 × 2.4 m · 30mm', vnd: 9800000, stock: 32 },
      { id: '1.4x2.0x20', label: '1.4 × 2.0 m · 20mm', vnd: 5400000, stock: 40 },
      { id: '1.0x2.0x20', label: '1.0 × 2.0 m · 20mm', vnd: 3900000, stock: 55 },
    ],
  },

  'P-04': {
    code: 'P-04',
    cat: 1,
    name: { vi: 'Đá xẻ quy cách', en: 'Cut-to-size tile', zh: '定制规格石材' },
    meta: {
      vi: '60×30, 40×60, 80×40 cm · dày 2cm',
      en: '60×30, 40×60, 80×40 cm · 2cm thick',
      zh: '60×30, 40×60, 80×40 cm · 厚2cm',
    },
    desc: {
      vi: 'Đá xẻ theo kích thước tiêu chuẩn hoặc tùy chỉnh, hoàn thiện đa dạng — phù hợp ốp lát sàn, tường, mặt tiền công trình.',
      en: 'Standard or custom-cut natural stone tile with multiple finishes — for floors, walls and façade applications.',
      zh: '标准或定制切割天然石材,多种饰面 — 适用于地板、墙面和外墙应用。',
    },
    longDesc: {
      vi: 'Đá xẻ quy cách Long Anh được sản xuất theo các kích thước tiêu chuẩn (60×30×2, 40×60×2, 80×40×2 cm) hoặc tùy chỉnh theo yêu cầu khách hàng. Sản phẩm phù hợp cho ốp lát sàn nội ngoại thất, ốp tường, mặt tiền công trình thương mại và dân dụng. Đa dạng hoàn thiện bề mặt: bóng gương cho sảnh sang trọng, mờ honed cho phòng khách, brushed antique cho không gian cổ điển, flamed cho lát sàn ngoài trời chống trượt.',
      en: 'Long Anh cut-to-size tiles come in standard sizes (60×30×2, 40×60×2, 80×40×2 cm) or custom dimensions on request. Suitable for indoor and outdoor floor cladding, wall facing, commercial and residential façades. Multiple surface finishes: high-gloss for premium lobbies, honed matte for living rooms, brushed antique for classic spaces, flamed for anti-slip outdoor flooring.',
      zh: '龙英定制规格石材按标准尺寸(60×30×2、40×60×2、80×40×2 cm)或客户要求的定制尺寸生产。适用于室内外地板饰面、墙面饰面、商业和住宅外墙。多种表面饰面:高端大堂的高光、客厅的哑光、古典空间的拉丝古典、户外防滑地板的火烧面。',
    },
    images: [
      '/assets/da-xe-quy-cach-1.webp',
      '/assets/da-xe-quy-cach-4.webp',
      '/assets/da-xe-quy-cach-3.webp',
      '/assets/da-xe-quy-cach-5.webp',
    ],
    sizes: ['60×30 cm', '40×60 cm', '80×40 cm', 'Custom'],
    sizesUnit: '',
    specs: [
      { key: 'spec_format', val: '60×30 / 40×60 / 80×40', unit: 'cm' },
      { key: 'spec_thickness', val: '15 / 20 / 25 / 30', unit: 'mm' },
      { key: 'spec_finish', val: 'Polished · Honed · Brushed · Flamed', unit: '' },
      { key: 'white', val: '90 – 95', unit: '%' },
      { key: 'density', val: '2.65 – 2.75', unit: 'g/cm³' },
    ],
    applications: [
      { icon: 'grid', vi: 'Lát sàn nội thất', en: 'Interior flooring', zh: '室内地板' },
      { icon: 'box', vi: 'Ốp tường', en: 'Wall cladding', zh: '墙面饰面' },
      { icon: 'factory', vi: 'Mặt tiền tòa nhà', en: 'Building façade', zh: '建筑外墙' },
      { icon: 'pin', vi: 'Lát sàn ngoài trời', en: 'Outdoor flooring', zh: '户外地板' },
      { icon: 'spark', vi: 'Khu công cộng', en: 'Public spaces', zh: '公共空间' },
    ],
    packaging: [
      { vi: 'Pallet gỗ + foam bảo vệ', en: 'Wooden pallet + foam', zh: '木托盘+泡沫保护' },
      { vi: 'Container 20ft / 40ft', en: '20ft / 40ft container', zh: '20英尺/40英尺集装箱' },
    ],
    features: {
      vi: [
        'Cắt chính xác theo yêu cầu',
        '4 hoàn thiện: bóng/mờ/brushed/flamed',
        'Đá tự nhiên 100%',
        'Phù hợp cả nội và ngoại thất',
      ],
      en: [
        'Precise cuts to specification',
        '4 finishes: polished/honed/brushed/flamed',
        '100% natural stone',
        'Suitable for indoor and outdoor',
      ],
      zh: ['精确按规格切割', '4种饰面:抛光/哑光/拉丝/火烧', '100%天然石材', '适用于室内和室外'],
    },
    tags: {
      vi: ['Sàn', 'Tường', 'Mặt tiền', 'Ngoại thất'],
      en: ['Floor', 'Wall', 'Façade', 'Outdoor'],
      zh: ['地板', '墙面', '外墙', '户外'],
    },
    moq: { vi: '500 m²', en: '500 m²', zh: '500平方米' },
    leadTime: { vi: '14–21 ngày', en: '14–21 days', zh: '14–21天' },
    unit: { vi: 'm²', en: 'm²', zh: 'm²' },
    variants: [
      { id: '60x30x20', label: '60×30 cm · 20mm', vnd: 380000, stock: 1200, popular: true },
      { id: '40x60x20', label: '40×60 cm · 20mm', vnd: 420000, stock: 850 },
      { id: '80x40x20', label: '80×40 cm · 20mm', vnd: 480000, stock: 680 },
      { id: '60x30x30', label: '60×30 cm · 30mm', vnd: 520000, stock: 540 },
      { id: '40x60x30', label: '40×60 cm · 30mm', vnd: 580000, stock: 420 },
    ],
  },

  'P-05': {
    code: 'P-05',
    cat: 1,
    name: { vi: 'Đá trang trí', en: 'Decorative stone', zh: '装饰石材' },
    meta: {
      vi: 'Sân vườn · Bể bơi · Lối đi',
      en: 'Garden · Pool · Pathway',
      zh: '花园 · 泳池 · 步道',
    },
    desc: {
      vi: 'Đá trang trí cảnh quan ngoại thất — viền sân vườn, ốp bể bơi, lối đi đá tự nhiên với bề mặt chống trượt.',
      en: 'Landscape decorative stone — garden borders, pool coping, natural-stone pathways with anti-slip finish.',
      zh: '景观装饰石材 — 花园边缘、泳池压顶、防滑表面的天然石材步道。',
    },
    longDesc: {
      vi: 'Đá trang trí Long Anh dành cho không gian ngoại thất, cảnh quan sân vườn, hồ bơi và khu vực công cộng. Sản phẩm bao gồm đá viền hồ bơi (pool coping) chống trượt, đá lát lối đi vườn, đá trang trí non bộ và đá ốp tường rào. Bề mặt được xử lý chống trượt (flamed/sandblasted), chịu được thời tiết khắc nghiệt và bền màu theo thời gian. Phù hợp cho biệt thự, khu nghỉ dưỡng, khách sạn và khu đô thị cao cấp.',
      en: 'Long Anh decorative stones are designed for outdoor spaces, garden landscapes, swimming pools and public areas. The range includes anti-slip pool coping stones, garden pathway tiles, rockery decoration and wall stones. Surface treatments include flamed and sandblasted finishes for anti-slip safety, weather-resistant and color-stable over time. Suitable for villas, resorts, hotels and premium urban developments.',
      zh: '龙英装饰石材适用于户外空间、花园景观、游泳池和公共区域。产品包括防滑泳池压顶、花园步道砖、假山装饰和墙面石材。表面处理包括火烧和喷砂饰面以确保防滑安全,耐候性强,长期保色。适用于别墅、度假村、酒店和高端城市开发。',
    },
    images: [
      '/assets/da-che-den2.webp',
      '/assets/da-che-den3.webp',
      '/assets/da-che-den1.webp',
      '/assets/da-cuoi-trang.jpeg',
    ],
    sizes: ['Pool coping', 'Garden tile', 'Step stone', 'Wall facing'],
    sizesUnit: '',
    specs: [
      { key: 'spec_format', val: '30×30 / 50×50 / Custom', unit: 'cm' },
      { key: 'spec_thickness', val: '25 / 30 / 50', unit: 'mm' },
      { key: 'spec_finish', val: 'Flamed · Sandblasted · Brushed', unit: '' },
      { key: 'density', val: '2.65 – 2.75', unit: 'g/cm³' },
    ],
    applications: [
      { icon: 'leaf', vi: 'Sân vườn cảnh quan', en: 'Landscape garden', zh: '景观花园' },
      { icon: 'drop', vi: 'Hồ bơi & spa', en: 'Swimming pool & spa', zh: '游泳池和水疗' },
      { icon: 'pin', vi: 'Lối đi tự nhiên', en: 'Natural pathways', zh: '天然步道' },
      { icon: 'factory', vi: 'Mặt tiền biệt thự', en: 'Villa façade', zh: '别墅外墙' },
      { icon: 'spark', vi: 'Khu nghỉ dưỡng', en: 'Resort & hotel', zh: '度假村和酒店' },
    ],
    packaging: [
      { vi: 'Pallet gỗ + dây buộc', en: 'Wooden pallet + strapping', zh: '木托盘+捆扎带' },
      { vi: 'Container 20ft / 40ft', en: '20ft / 40ft container', zh: '20英尺/40英尺集装箱' },
    ],
    features: {
      vi: [
        'Bề mặt chống trượt, an toàn',
        'Chịu thời tiết, bền màu',
        'Đa dạng hình dạng và kích thước',
        'Phù hợp khu cao cấp',
      ],
      en: [
        'Anti-slip surface, safe',
        'Weather-resistant, color-stable',
        'Various shapes and sizes',
        'Premium development suitable',
      ],
      zh: ['防滑表面,安全', '耐候性强,保色', '形状和尺寸多样', '适合高端开发项目'],
    },
    tags: {
      vi: ['Sân vườn', 'Bể bơi', 'Cảnh quan', 'Ngoại thất'],
      en: ['Garden', 'Pool', 'Landscape', 'Outdoor'],
      zh: ['花园', '泳池', '景观', '户外'],
    },
    moq: { vi: '200 m²', en: '200 m²', zh: '200平方米' },
    leadTime: { vi: '14–21 ngày', en: '14–21 days', zh: '14–21天' },
    unit: { vi: 'm²', en: 'm²', zh: 'm²' },
    variants: [
      {
        id: 'pool-coping',
        label: { vi: 'Đá viền hồ bơi', en: 'Pool coping', zh: '泳池压顶' },
        vnd: 680000,
        stock: 420,
        popular: true,
      },
      {
        id: 'garden-tile',
        label: { vi: 'Đá lát sân vườn 30×30', en: 'Garden tile 30×30', zh: '花园砖 30×30' },
        vnd: 450000,
        stock: 680,
      },
      {
        id: 'step-stone',
        label: { vi: 'Đá bước đi 50×50', en: 'Step stone 50×50', zh: '踏脚石 50×50' },
        vnd: 520000,
        stock: 380,
      },
      {
        id: 'wall-facing',
        label: { vi: 'Đá ốp tường rào', en: 'Wall facing', zh: '围墙石材' },
        vnd: 380000,
        stock: 540,
      },
    ],
  },
};
