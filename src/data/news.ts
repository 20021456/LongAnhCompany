/**
 * News articles — ported verbatim from LongAnhCorp prototype news.html.
 * Phase 3 will move this into the `articles` table.
 */

export interface NewsItem {
  id: number;
  views: number;
  comments: number;
  cat: string;
  date: string;
  readMin: number;
  img: string;
  title: { vi: string; en: string; zh: string };
  excerpt: { vi: string; en: string; zh: string };
  /** Full article body, stored as HTML (from the Tiptap editor). */
  content?: { vi: string; en: string; zh: string };
}

export const NEWS: NewsItem[] = [
  {
    id: 1,
    views: 4280,
    comments: 23,
    cat: 'business',
    date: '2026-05-06',
    readMin: 4,
    img: '/assets/kho-hang-xuat-khau.webp',
    title: {
      vi: 'Long Anh ký hợp đồng xuất khẩu 12,000 tấn bột đá CaCO₃ sang Ấn Độ',
      en: 'Long Anh signs 12,000-ton CaCO₃ export contract with India',
      zh: '龙英与印度签订12,000吨碳酸钙粉出口合同',
    },
    excerpt: {
      vi: 'Hợp đồng kéo dài 18 tháng với 3 đối tác công nghiệp lớn tại Mumbai và Delhi, đánh dấu cột mốc mới cho thị trường Nam Á của Long Anh.',
      en: '18-month contract with 3 major industrial partners in Mumbai and Delhi marks a new milestone for Long Anh in the South Asia market.',
      zh: '与孟买和德里的3个主要工业合作伙伴签订18个月合同,标志着龙英在南亚市场的新里程碑。',
    },
  },
  {
    id: 2,
    views: 2156,
    comments: 8,
    cat: 'milestone',
    date: '2026-05-02',
    readMin: 3,
    img: '/assets/nha-may-bot-sieu-min-3.webp',
    title: {
      vi: 'Khánh thành dây chuyền nghiền bột siêu mịn số 4 tại Quỳ Hợp',
      en: 'Long Anh opens 4th ultra-fine grinding line at Quy Hop',
      zh: '龙英归合超细研磨生产线#4开工',
    },
    excerpt: {
      vi: 'Dây chuyền số 4 nâng tổng công suất nhà máy lên 350,000 tấn/năm, áp dụng công nghệ Đức tiên tiến nhất cho cỡ hạt 3 µm.',
      en: 'Line #4 raises total plant capacity to 350,000 tons/year, using the latest German technology for 3 µm particle sizes.',
      zh: '4号线将工厂总产能提升至35万吨/年,采用最新德国技术生产3微米粒径。',
    },
  },
  {
    id: 3,
    views: 1820,
    comments: 12,
    cat: 'tech',
    date: '2026-04-28',
    readMin: 5,
    img: '/assets/kiem-dinh.jpg',
    title: {
      vi: 'Đạt chứng nhận ISO 9001:2015 cho toàn bộ 5 nhà máy',
      en: 'ISO 9001:2015 certified across all 5 plants',
      zh: '全部5家工厂获得ISO 9001:2015认证',
    },
    excerpt: {
      vi: 'BSI Việt Nam cấp chứng nhận ISO 9001:2015 mở rộng cho tất cả nhà máy của Long Anh sau 18 tháng triển khai hệ thống quản lý chất lượng.',
      en: 'BSI Vietnam grants extended ISO 9001:2015 certification to all Long Anh plants after 18 months of quality management implementation.',
      zh: 'BSI越南在18个月质量管理实施后,为所有龙英工厂颁发扩展的ISO 9001:2015认证。',
    },
  },
  {
    id: 4,
    views: 1490,
    comments: 5,
    cat: 'product',
    date: '2026-04-25',
    readMin: 3,
    img: '/assets/da-slab-sieu-trang.webp',
    title: {
      vi: 'Báo giá tháng 5: Đá Slab 1.6×2.4m và bảng giá xuất khẩu CaCO₃',
      en: 'May pricing: Slab 1.6×2.4m and export CaCO₃ price list',
      zh: '5月报价:1.6×2.4米大板和出口碳酸钙价目表',
    },
    excerpt: {
      vi: 'Cập nhật giá FOB tháng 5/2026 cho đá Slab tấm lớn và bột đá CaCO₃ uncoated/coated với 7 cỡ hạt từ 3 đến 20 µm.',
      en: 'May 2026 FOB pricing update for large-format Slab and uncoated/coated CaCO₃ powder in 7 particle sizes from 3 to 20 µm.',
      zh: '2026年5月大板和未涂层/涂层碳酸钙粉的FOB报价更新,3至20微米共7种粒径。',
    },
  },
  {
    id: 5,
    views: 982,
    comments: 3,
    cat: 'event',
    date: '2026-04-15',
    readMin: 4,
    img: '/assets/co-so-ha-tang.jpg',
    title: {
      vi: 'Long Anh tham gia triển lãm Vietbuild Hà Nội 2026',
      en: 'Long Anh exhibits at Vietbuild Hanoi 2026',
      zh: '龙英参加2026年河内国际建筑展',
    },
    excerpt: {
      vi: 'Gian hàng B-204 trưng bày toàn bộ dòng sản phẩm bột đá và đá tự nhiên, kèm chương trình demo trực tiếp công nghệ phủ Stearic Acid.',
      en: 'Booth B-204 showcases the full powder and natural stone range, with live demo of stearic-acid coating technology.',
      zh: 'B-204展位展示完整的粉末和天然石材系列,并现场演示硬脂酸涂层技术。',
    },
  },
  {
    id: 6,
    views: 1670,
    comments: 7,
    cat: 'business',
    date: '2026-04-08',
    readMin: 4,
    img: '/assets/nha-may-bot-sieu-min.webp',
    title: {
      vi: 'Mở rộng thị trường Trung Đông: 3 hợp đồng mới tại UAE và Ai Cập',
      en: 'Middle East expansion: 3 new contracts in UAE and Egypt',
      zh: '中东扩张:阿联酋和埃及的3个新合同',
    },
    excerpt: {
      vi: 'Tổng giá trị hợp đồng đạt 4,2 triệu USD, đưa Trung Đông trở thành khu vực xuất khẩu lớn thứ 3 của Long Anh sau Đông Á và Nam Á.',
      en: "Total contract value reaches $4.2M, making the Middle East Long Anh's 3rd-largest export region after East and South Asia.",
      zh: '合同总价值达420万美元,使中东成为龙英第三大出口区域,仅次于东亚和南亚。',
    },
  },
  {
    id: 7,
    views: 3540,
    comments: 41,
    cat: 'milestone',
    date: '2026-03-22',
    readMin: 6,
    img: '/assets/kho-hang.webp',
    title: {
      vi: 'Lễ kỷ niệm 20 năm thành lập KS Long Anh (2006-2026)',
      en: 'KS Long Anh celebrates 20th anniversary (2006-2026)',
      zh: '龙英矿业20周年庆典 (2006-2026)',
    },
    excerpt: {
      vi: 'Từ một mỏ đá vôi trắng đến nhà sản xuất bột đá hàng đầu Bắc Trung Bộ với 350,000 tấn/năm và 12 thị trường xuất khẩu — hành trình 20 năm.',
      en: "From a single white limestone quarry to North-Central Vietnam's leading powder manufacturer with 350,000 t/y and 12 export markets — a 20-year journey.",
      zh: '从一个白石灰岩矿场到越南北中部领先的粉末制造商,年产能35万吨,12个出口市场 — 20年历程。',
    },
  },
  {
    id: 8,
    views: 740,
    comments: 18,
    cat: 'csr',
    date: '2026-03-10',
    readMin: 3,
    img: '/assets/kho-da-nguyen-lieu.webp',
    title: {
      vi: 'Long Anh tài trợ chương trình học bổng cho học sinh Quỳ Hợp',
      en: 'Long Anh sponsors scholarship program for Quy Hop students',
      zh: '龙英赞助归合学生奖学金项目',
    },
    excerpt: {
      vi: 'Quỹ học bổng 500 triệu đồng dành cho 50 học sinh xuất sắc tại 5 trường cấp 2 và cấp 3 trên địa bàn huyện Quỳ Hợp năm học 2026-2027.',
      en: '500 million VND scholarship fund for 50 outstanding students at 5 secondary schools in Quy Hop district for the 2026-2027 academic year.',
      zh: '5亿越南盾奖学金基金,用于2026-2027学年归合县5所中学的50名优秀学生。',
    },
  },
  {
    id: 9,
    views: 1280,
    comments: 6,
    cat: 'product',
    date: '2026-03-02',
    readMin: 3,
    img: '/assets/bot-caco3-sieu-min.webp',
    title: {
      vi: 'Ra mắt dòng bột CaCO₃ siêu mịn 3 µm cho compound nhựa PVC cao cấp',
      en: 'New 3 µm ultra-fine CaCO₃ powder for premium PVC compounds',
      zh: '推出适用于高端PVC复合材料的3 µm超细碳酸钙粉',
    },
    excerpt: {
      vi: 'Sản phẩm bột CaCO₃ phủ Stearic 3 µm cải thiện độ phân tán 25% so với dòng 5 µm — đáp ứng yêu cầu khắt khe nhất của masterbatch xuất khẩu.',
      en: 'New 3 µm stearic-coated CaCO₃ improves dispersion by 25% over 5 µm — meeting the toughest demands of export masterbatch.',
      zh: '新3 µm硬脂酸涂层碳酸钙比5 µm分散性提高25% — 满足出口母粒最严苛的要求。',
    },
  },
  {
    id: 10,
    views: 856,
    comments: 4,
    cat: 'event',
    date: '2026-02-18',
    readMin: 5,
    img: '/assets/nha-may-bot-sieu-min-1.webp',
    title: {
      vi: 'Long Anh đón đoàn khách Nhật Bản tham quan nhà máy Quỳ Hợp',
      en: 'Long Anh welcomes Japanese delegation to Quy Hop facility',
      zh: '龙英在归合工厂接待日本代表团',
    },
    excerpt: {
      vi: 'Đoàn 15 đại diện từ 5 công ty nhập khẩu Nhật Bản tham quan toàn bộ chuỗi sản xuất — từ khai thác đá đến đóng gói thành phẩm.',
      en: '15 representatives from 5 Japanese importers toured the full production chain — from quarry to finished-goods packaging.',
      zh: '5家日本进口商的15名代表参观了从采石场到成品包装的完整生产链。',
    },
  },
  {
    id: 11,
    views: 2105,
    comments: 14,
    cat: 'tech',
    date: '2026-02-05',
    readMin: 4,
    img: '/assets/co-so-ha-tang.jpg',
    title: {
      vi: 'Đầu tư 80 tỷ đồng nâng cấp dây chuyền phủ Stearic Acid thế hệ mới',
      en: '80 billion VND invested in new-generation Stearic Acid coating line',
      zh: '投资800亿越南盾升级新一代硬脂酸涂层生产线',
    },
    excerpt: {
      vi: 'Dây chuyền Đức mới giúp nâng tỷ lệ phủ stearic đồng đều lên 99.5%, giảm tiêu hao năng lượng 18% và tăng công suất 30% so với hệ thống cũ.',
      en: 'The new German line raises stearic coating uniformity to 99.5%, cuts energy consumption by 18% and increases capacity by 30%.',
      zh: '新德国生产线将硬脂酸涂层均匀度提升至99.5%,降低能耗18%,产能提升30%。',
    },
  },
  {
    id: 12,
    views: 1340,
    comments: 9,
    cat: 'business',
    date: '2026-01-22',
    readMin: 4,
    img: '/assets/da-nguyen-lieu-cao-cap2.webp',
    title: {
      vi: 'Tổng kết 2025: Doanh thu xuất khẩu tăng 32%, mở thêm 2 thị trường mới',
      en: '2025 review: Export revenue up 32%, 2 new markets opened',
      zh: '2025年总结:出口收入增长32%,开拓2个新市场',
    },
    excerpt: {
      vi: 'Năm 2025 Long Anh đạt 280 tỷ doanh thu xuất khẩu, tăng trưởng 32% YoY với 2 thị trường mới: Bangladesh và Sri Lanka. Kế hoạch 2026 hướng tới 350 tỷ.',
      en: 'In 2025, Long Anh achieved 280 billion VND in export revenue (+32% YoY) and opened 2 new markets: Bangladesh and Sri Lanka. 2026 target: 350 billion.',
      zh: '2025年,龙英实现280亿越南盾出口收入(同比增长32%),并开拓2个新市场:孟加拉国和斯里兰卡。2026年目标:350亿。',
    },
  },
];
