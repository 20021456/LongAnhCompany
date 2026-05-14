/**
 * Seed script — `npm run prisma:seed`
 *
 * Phase 3: populates the database from the structured data files in
 * `src/data/*` (already validated by the public site UI). Re-runnable —
 * uses upserts on natural keys and delete-then-recreate for child rows.
 *
 * Coverage: languages, roles, super-admin user, settings, product
 * categories + products (+ variants/applications/packagings/specs),
 * departments + jobs, news categories + articles, timeline events,
 * certifications, core values, stats, header/footer menus.
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { DEFAULT_ROLE_PERMISSIONS } from '../src/lib/permissions';
import { COPY } from '../src/data/copy';
import { PRODUCTS } from '../src/data/products';
import { JOBS } from '../src/data/jobs';
import { NEWS } from '../src/data/news';

const db = new PrismaClient();

type L3 = { vi: string; en: string; zh: string };

/** Variant labels are either a plain string or an i18n object. */
function vlabel(label: string | Record<string, string>): L3 {
  if (typeof label === 'string') return { vi: label, en: label, zh: label };
  return { vi: label.vi, en: label.en ?? label.vi, zh: label.zh ?? label.vi };
}

/** "30/06/2026" → Date */
function parseDeadline(d: string): Date | null {
  const m = d.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!m) return null;
  return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
}

/** "18 – 30 triệu VND" → { min: 18000000, max: 30000000 } */
function parseSalary(s: string): { min: number | null; max: number | null } {
  const m = s.match(/(\d+)\s*[–-]\s*(\d+)/);
  if (!m) return { min: null, max: null };
  return { min: Number(m[1]) * 1_000_000, max: Number(m[2]) * 1_000_000 };
}

const SPEC_LABELS: Record<string, L3> = {
  caco3: { vi: 'Hàm lượng CaCO₃', en: 'CaCO₃ content', zh: '碳酸钙含量' },
  white: { vi: 'Độ trắng', en: 'Whiteness', zh: '白度' },
  moist: { vi: 'Độ ẩm', en: 'Moisture', zh: '水分' },
  density: { vi: 'Tỷ trọng đổ đống', en: 'Bulk density', zh: '堆积密度' },
  stearic: { vi: 'Hàm lượng Stearic', en: 'Stearic content', zh: '硬脂酸含量' },
  d50: { vi: 'Cỡ hạt D50', en: 'Particle size D50', zh: '粒径D50' },
  format: { vi: 'Quy cách', en: 'Format', zh: '规格' },
  thickness: { vi: 'Độ dày', en: 'Thickness', zh: '厚度' },
  finish: { vi: 'Hoàn thiện', en: 'Finish', zh: '表面处理' },
};

const NEWS_CATEGORIES: { slug: string; name: L3; color: string }[] = [
  { slug: 'business', name: { vi: 'Kinh doanh', en: 'Business', zh: '商业' }, color: '#0F3D7A' },
  { slug: 'milestone', name: { vi: 'Cột mốc', en: 'Milestone', zh: '里程碑' }, color: '#F08023' },
  { slug: 'tech', name: { vi: 'Công nghệ', en: 'Technology', zh: '技术' }, color: '#1d5499' },
  { slug: 'product', name: { vi: 'Sản phẩm', en: 'Products', zh: '产品' }, color: '#15803D' },
  { slug: 'event', name: { vi: 'Sự kiện', en: 'Events', zh: '活动' }, color: '#7c2d12' },
  { slug: 'csr', name: { vi: 'CSR', en: 'CSR', zh: 'CSR' }, color: '#5b6573' },
];

const TIMELINE: { year: number; title: L3; body: L3 }[] = [
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
    title: { vi: 'Nhà máy đầu', en: 'First plant', zh: '首个工厂' },
    body: {
      vi: 'Lắp đặt dây chuyền nghiền khô đầu tiên, công suất 80,000 tấn/năm.',
      en: 'Installed our first dry-grinding line at 80,000 tons/year capacity.',
      zh: '安装首条干法研磨生产线,年产能8万吨。',
    },
  },
  {
    year: 2017,
    title: { vi: 'Phủ Stearic', en: 'Coating line', zh: '涂层生产线' },
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
    title: { vi: 'Mở rộng', en: 'Expansion', zh: '扩张' },
    body: {
      vi: 'Khánh thành xưởng đá Slab 1.6×2.4m. Tổng công suất đạt 350,000 tấn/năm.',
      en: 'Opened our 1.6×2.4m Slab workshop. Total capacity reached 350,000 t/y.',
      zh: '开设1.6×2.4米大板工坊。总产能达到35万吨/年。',
    },
  },
];

const CERTIFICATIONS: {
  code: string;
  name: string;
  badge: string;
  desc: L3;
}[] = [
  {
    code: 'iso',
    name: 'ISO 9001:2015',
    badge: '/assets/cert-iso-9001.svg',
    desc: {
      vi: 'Hệ thống quản lý chất lượng',
      en: 'Quality Management System',
      zh: '质量管理体系',
    },
  },
  {
    code: 'reach',
    name: 'REACH',
    badge: '/assets/cert-reach.svg',
    desc: {
      vi: 'Tuân thủ hóa chất Châu Âu',
      en: 'EU Chemical Compliance',
      zh: '欧盟化学品合规',
    },
  },
  {
    code: 'sgs',
    name: 'SGS',
    badge: '/assets/cert-sgs.svg',
    desc: {
      vi: 'Kiểm định độc lập độ trắng & cỡ hạt',
      en: 'Independent test for whiteness & particle size',
      zh: '独立白度和粒径检测',
    },
  },
  {
    code: 'msds',
    name: 'MSDS',
    badge: '/assets/cert-msds.svg',
    desc: {
      vi: 'Phiếu an toàn hóa chất sản phẩm',
      en: 'Material safety data sheet',
      zh: '材料安全数据表',
    },
  },
];

const CORE_VALUES: { scope: string; icon: string; title: L3; body: L3 }[] = [
  // About page — 3 core values
  {
    scope: 'about',
    icon: 'drop',
    title: { vi: 'Chất lượng nguyên sinh', en: 'Pure raw material', zh: '纯原料' },
    body: {
      vi: 'Mỏ riêng tại Quỳ Hợp với độ trắng > 98% và CaCO₃ > 98.5% — kiểm soát từ gốc.',
      en: 'Owned quarry in Quy Hop · whiteness >98%, CaCO₃ >98.5% — controlled at the source.',
      zh: '归合自有矿场 · 白度>98%、碳酸钙>98.5% — 从源头控制。',
    },
  },
  {
    scope: 'about',
    icon: 'spark',
    title: { vi: 'Công nghệ chính xác', en: 'Precision technology', zh: '精密技术' },
    body: {
      vi: 'Dây chuyền nghiền và phủ Stearic Acid theo công nghệ Châu Âu, kiểm tra từng lô.',
      en: 'EU-spec grinding and stearic-acid coating lines · per-batch QC.',
      zh: '欧洲标准研磨和硬脂酸涂层生产线 · 每批次QC。',
    },
  },
  {
    scope: 'about',
    icon: 'ship',
    title: { vi: 'Cam kết giao hàng', en: 'On-time delivery', zh: '准时交付' },
    body: {
      vi: 'Cảng Cửa Lò & Hải Phòng — đóng gói linh hoạt, lịch giao đúng hẹn.',
      en: 'Cua Lo & Hai Phong ports · flexible packaging, schedules we keep.',
      zh: '窗碧港和海防港 · 灵活包装,按期履约。',
    },
  },
  // Career page — 6 culture values
  {
    scope: 'career',
    icon: 'drop',
    title: { vi: 'Chính trực & Minh bạch', en: 'Integrity & Transparency', zh: '正直与透明' },
    body: {
      vi: 'Mọi quyết định đều dựa trên dữ liệu và sự thật. Chúng tôi đối thoại cởi mở và nhận trách nhiệm về kết quả.',
      en: 'Every decision is based on data and truth. We communicate openly and take responsibility for outcomes.',
      zh: '所有决策均基于数据和事实。我们开放沟通,对结果负责。',
    },
  },
  {
    scope: 'career',
    icon: 'globe',
    title: { vi: 'Tinh thần đồng đội', en: 'Team spirit', zh: '团队精神' },
    body: {
      vi: 'Thành công là kết quả của tập thể. Chúng tôi đặt lợi ích chung lên trên và hỗ trợ nhau phát triển mỗi ngày.',
      en: "Success is a collective result. We put common interests first and support each other's growth every day.",
      zh: '成功是集体的结果。我们将共同利益放在首位,每天互相支持成长。',
    },
  },
  {
    scope: 'career',
    icon: 'spark',
    title: { vi: 'Đổi mới liên tục', en: 'Continuous innovation', zh: '持续创新' },
    body: {
      vi: 'Chúng tôi liên tục cải tiến quy trình, nâng cấp công nghệ và tìm kiếm các giải pháp sáng tạo để dẫn đầu ngành.',
      en: 'We continuously improve processes, upgrade technology and seek creative solutions to stay ahead.',
      zh: '我们不断改进流程、升级技术,寻求创造性解决方案以保持领先。',
    },
  },
  {
    scope: 'career',
    icon: 'check',
    title: { vi: 'Chất lượng là cốt lõi', en: 'Quality at the core', zh: '质量为核心' },
    body: {
      vi: 'Từ nguyên liệu đầu vào đến sản phẩm đầu ra, tiêu chuẩn ISO 9001 không phải là đích đến — mà là nền tảng tối thiểu.',
      en: 'From raw material to finished product, ISO 9001 is not the destination — it is the minimum baseline.',
      zh: '从原料到成品,ISO 9001不是终点 — 而是最低基线。',
    },
  },
  {
    scope: 'career',
    icon: 'leaf',
    title: { vi: 'Phát triển bền vững', en: 'Sustainable development', zh: '可持续发展' },
    body: {
      vi: 'Chúng tôi khai thác và sản xuất có trách nhiệm với môi trường và cộng đồng địa phương — vì một tương lai lâu dài.',
      en: 'We mine and produce responsibly toward the environment and local community — for the long term.',
      zh: '我们对环境和当地社区负责任地开采和生产 — 为了长远未来。',
    },
  },
  {
    scope: 'career',
    icon: 'box',
    title: { vi: 'Hướng ra thị trường quốc tế', en: 'Global market orientation', zh: '面向国际市场' },
    body: {
      vi: 'Với 12 thị trường xuất khẩu, nhân viên Long Anh được tiếp xúc với tư duy và tiêu chuẩn toàn cầu ngay tại Nghệ An.',
      en: 'With 12 export markets, Long Anh employees engage with global thinking and standards right in Nghe An.',
      zh: '拥有12个出口市场,龙英员工在义安省即可接触全球思维和标准。',
    },
  },
];

async function main() {
  console.log('🌱 Seeding Long Anh database...\n');

  // ─── 1. Languages ──────────────────────────────────────────────────────
  await db.language.createMany({
    data: [
      { code: 'vi', name: 'Tiếng Việt', flagEmoji: '🇻🇳', isDefault: true, sortOrder: 1 },
      { code: 'en', name: 'English', flagEmoji: '🇬🇧', sortOrder: 2 },
      { code: 'zh', name: '中文', flagEmoji: '🇨🇳', sortOrder: 3 },
    ],
    skipDuplicates: true,
  });
  console.log('  ✓ languages');

  // ─── 2. Roles + super-admin ────────────────────────────────────────────
  for (const [name, permissions] of Object.entries(DEFAULT_ROLE_PERMISSIONS)) {
    await db.role.upsert({
      where: { name },
      update: { permissions },
      create: { name, description: `Default ${name} role`, permissions },
    });
  }
  const superAdminRole = await db.role.findUniqueOrThrow({ where: { name: 'super_admin' } });
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? '[email protected]';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';
  await db.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      fullName: 'Long Anh Admin',
      roleId: superAdminRole.id,
    },
  });
  console.log(`  ✓ roles + admin (${adminEmail} / ${adminPassword})`);

  // ─── 3. Settings ───────────────────────────────────────────────────────
  const vi = COPY.vi;
  const en = COPY.en;
  const zh = COPY.zh;
  const settings: {
    key: string;
    valueVi: string;
    valueEn: string;
    valueZh: string;
    group: string;
  }[] = [
    { key: 'site.brand_short', valueVi: vi.short, valueEn: en.short, valueZh: zh.short, group: 'brand' },
    { key: 'site.company_full', valueVi: vi.company, valueEn: en.company, valueZh: zh.company, group: 'brand' },
    { key: 'site.tagline', valueVi: vi.tagline, valueEn: en.tagline, valueZh: zh.tagline, group: 'brand' },
    { key: 'site.footnote', valueVi: vi.footnote, valueEn: en.footnote, valueZh: zh.footnote, group: 'brand' },
    { key: 'contact.phone_main', valueVi: vi.phone[0], valueEn: en.phone[0], valueZh: zh.phone[0], group: 'contact' },
    { key: 'contact.phone_secondary', valueVi: vi.phone[1], valueEn: en.phone[1], valueZh: zh.phone[1], group: 'contact' },
    { key: 'contact.email_main', valueVi: vi.email, valueEn: en.email, valueZh: zh.email, group: 'contact' },
    { key: 'contact.email_hr', valueVi: '[email protected]', valueEn: '[email protected]', valueZh: '[email protected]', group: 'contact' },
    { key: 'contact.address', valueVi: vi.addr, valueEn: en.addr, valueZh: zh.addr, group: 'contact' },
    { key: 'social.facebook', valueVi: 'https://www.facebook.com/longanhcorp', valueEn: 'https://www.facebook.com/longanhcorp', valueZh: 'https://www.facebook.com/longanhcorp', group: 'social' },
    { key: 'social.linkedin', valueVi: 'https://www.linkedin.com/company/longanhcorp', valueEn: 'https://www.linkedin.com/company/longanhcorp', valueZh: 'https://www.linkedin.com/company/longanhcorp', group: 'social' },
    { key: 'social.zalo', valueVi: 'https://zalo.me/longanhcorp', valueEn: 'https://zalo.me/longanhcorp', valueZh: 'https://zalo.me/longanhcorp', group: 'social' },
  ];
  for (const s of settings) {
    await db.setting.upsert({
      where: { key: s.key },
      update: { valueVi: s.valueVi, valueEn: s.valueEn, valueZh: s.valueZh, group: s.group },
      create: s,
    });
  }
  console.log(`  ✓ settings (${settings.length})`);

  // ─── 4. Product categories ─────────────────────────────────────────────
  const catData = [
    {
      slug: 'caco3-powder',
      nameVi: 'Bột đá CaCO₃',
      nameEn: 'CaCO₃ powder',
      nameZh: '碳酸钙粉',
      descriptionVi: 'Coated · Uncoated · 3–20 µm — phụ gia cho nhựa, sơn, giấy, thức ăn chăn nuôi.',
      descriptionEn: 'Coated · Uncoated · 3–20 µm — additive for plastics, paint, paper, animal feed.',
      descriptionZh: '涂层 · 未涂层 · 3–20 µm — 用于塑料、涂料、纸张、动物饲料的添加剂。',
      coverImageUrl: '/assets/bot-caco3-sieu-min.webp',
      sortOrder: 1,
    },
    {
      slug: 'natural-stone',
      nameVi: 'Đá ốp lát tự nhiên',
      nameEn: 'Natural cladding stone',
      nameZh: '天然石材饰面',
      descriptionVi: 'Slab · Đá xẻ · Đá trang trí — cho công trình và không gian sống cao cấp.',
      descriptionEn: 'Slab · Cut tile · Decorative — for premium architecture and living spaces.',
      descriptionZh: '大板 · 定制石材 · 装饰石材 — 用于高端建筑和生活空间。',
      coverImageUrl: '/assets/da-slab-sieu-trang.webp',
      sortOrder: 2,
    },
  ];
  const catBySlug: Record<number, string> = {};
  for (const c of catData) {
    const cat = await db.productCategory.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
    catBySlug[c.slug === 'caco3-powder' ? 0 : 1] = cat.id;
  }
  console.log('  ✓ product categories (2)');

  // ─── 5. Products + variants/applications/packagings/specs ──────────────
  let productCount = 0;
  for (const [code, p] of Object.entries(PRODUCTS)) {
    const slug = code.toLowerCase();
    const productData = {
      slug,
      categoryId: catBySlug[p.cat],
      nameVi: p.name.vi,
      nameEn: p.name.en,
      nameZh: p.name.zh,
      summaryVi: p.meta.vi,
      summaryEn: p.meta.en,
      summaryZh: p.meta.zh,
      shortDescVi: p.desc.vi,
      shortDescEn: p.desc.en,
      shortDescZh: p.desc.zh,
      longDescVi: p.longDesc.vi,
      longDescEn: p.longDesc.en,
      longDescZh: p.longDesc.zh,
      coverImageUrl: p.images[0],
      gallery: p.images,
      unitVi: p.unit.vi,
      unitEn: p.unit.en,
      unitZh: p.unit.zh,
      moq: p.moq.vi,
      moqEn: p.moq.en,
      moqZh: p.moq.zh,
      moqUnit: p.unit.vi,
      productionTime: p.leadTime.vi,
      productionTimeEn: p.leadTime.en,
      productionTimeZh: p.leadTime.zh,
      tags: p.tags,
      features: p.features,
      isFeatured: code === 'P-01' || code === 'P-02',
      isActive: true,
      sortOrder: Number(code.slice(2)),
    };
    const product = await db.product.upsert({
      where: { code },
      update: productData,
      create: { code, ...productData },
    });

    // Children: clear then recreate (idempotent)
    await db.productVariant.deleteMany({ where: { productId: product.id } });
    await db.productApplication.deleteMany({ where: { productId: product.id } });
    await db.productPackaging.deleteMany({ where: { productId: product.id } });
    await db.productSpec.deleteMany({ where: { productId: product.id } });

    await db.productVariant.createMany({
      data: p.variants.map((v, i) => {
        const lbl = vlabel(v.label);
        return {
          productId: product.id,
          variantCode: v.id,
          labelVi: lbl.vi,
          labelEn: lbl.en,
          labelZh: lbl.zh,
          price: v.vnd,
          currency: 'VND',
          unit: p.unit.vi,
          stock: v.stock,
          isPopular: v.popular ?? false,
          sortOrder: i,
        };
      }),
    });

    await db.productApplication.createMany({
      data: p.applications.map((a, i) => ({
        productId: product.id,
        nameVi: a.vi,
        nameEn: a.en,
        nameZh: a.zh,
        icon: a.icon,
        sortOrder: i,
      })),
    });

    await db.productPackaging.createMany({
      data: p.packaging.map((pk, i) => ({
        productId: product.id,
        nameVi: pk.vi,
        nameEn: pk.en,
        nameZh: pk.zh,
        sortOrder: i,
      })),
    });

    await db.productSpec.createMany({
      data: p.specs.map((sp, i) => {
        const label = SPEC_LABELS[sp.key] ?? { vi: sp.key, en: sp.key, zh: sp.key };
        return {
          productId: product.id,
          specKey: sp.key,
          labelVi: label.vi,
          labelEn: label.en,
          labelZh: label.zh,
          valueVi: sp.val,
          valueEn: sp.val,
          valueZh: sp.val,
          unitText: sp.unit ?? null,
          sortOrder: i,
        };
      }),
    });
    productCount++;
  }
  console.log(`  ✓ products + variants/applications/packagings/specs (${productCount})`);

  // ─── 6. Departments + jobs ─────────────────────────────────────────────
  const deptByCode: Record<string, string> = {};
  const seenDepts = new Set<string>();
  for (const job of Object.values(JOBS)) {
    if (seenDepts.has(job.dept)) continue;
    seenDepts.add(job.dept);
    const dept = await db.department.upsert({
      where: { code: job.dept },
      update: { nameVi: job.deptLabel.vi, nameEn: job.deptLabel.en, nameZh: job.deptLabel.zh },
      create: {
        code: job.dept,
        nameVi: job.deptLabel.vi,
        nameEn: job.deptLabel.en,
        nameZh: job.deptLabel.zh,
      },
    });
    deptByCode[job.dept] = dept.id;
  }
  console.log(`  ✓ departments (${seenDepts.size})`);

  let jobCount = 0;
  for (const job of Object.values(JOBS)) {
    const salary = parseSalary(job.salary.vi);
    const jobData = {
      departmentId: deptByCode[job.dept],
      titleVi: job.title.vi,
      titleEn: job.title.en,
      titleZh: job.title.zh,
      location: job.loc.vi,
      salaryMin: salary.min,
      salaryMax: salary.max,
      salaryTextVi: job.salary.vi,
      salaryTextEn: job.salary.en,
      salaryTextZh: job.salary.zh,
      experienceVi: job.exp.vi,
      experienceEn: job.exp.en,
      experienceZh: job.exp.zh,
      levelVi: job.level.vi,
      levelEn: job.level.en,
      levelZh: job.level.zh,
      typeVi: job.type.vi,
      typeEn: job.type.en,
      typeZh: job.type.zh,
      tags: job.tags,
      descriptionVi: job.overview.vi,
      descriptionEn: job.overview.en,
      descriptionZh: job.overview.zh,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      benefits: job.benefits,
      deadline: parseDeadline(job.deadline),
      deadlineText: job.deadline,
      slots: Number(job.headcount) || 1,
      isActive: true,
    };
    await db.job.upsert({
      where: { slug: job.id },
      update: jobData,
      create: { slug: job.id, ...jobData },
    });
    jobCount++;
  }
  console.log(`  ✓ jobs (${jobCount})`);

  // ─── 7. News categories + articles ─────────────────────────────────────
  const newsCatBySlug: Record<string, string> = {};
  for (const c of NEWS_CATEGORIES) {
    const cat = await db.newsCategory.upsert({
      where: { slug: c.slug },
      update: { nameVi: c.name.vi, nameEn: c.name.en, nameZh: c.name.zh, color: c.color },
      create: {
        slug: c.slug,
        nameVi: c.name.vi,
        nameEn: c.name.en,
        nameZh: c.name.zh,
        color: c.color,
      },
    });
    newsCatBySlug[c.slug] = cat.id;
  }
  console.log(`  ✓ news categories (${NEWS_CATEGORIES.length})`);

  let articleCount = 0;
  for (const n of NEWS) {
    const slug = String(n.id);
    const articleData = {
      categoryId: newsCatBySlug[n.cat] ?? null,
      titleVi: n.title.vi,
      titleEn: n.title.en,
      titleZh: n.title.zh,
      excerptVi: n.excerpt.vi,
      excerptEn: n.excerpt.en,
      excerptZh: n.excerpt.zh,
      coverImageUrl: n.img,
      views: n.views,
      commentCount: n.comments,
      readTimeMin: n.readMin,
      isFeatured: n.id === 1,
      status: 'published',
      publishedAt: new Date(n.date),
    };
    await db.article.upsert({
      where: { slug },
      update: articleData,
      create: { slug, ...articleData },
    });
    articleCount++;
  }
  console.log(`  ✓ articles (${articleCount})`);

  // ─── 8. Timeline events ────────────────────────────────────────────────
  await db.timelineEvent.deleteMany({});
  await db.timelineEvent.createMany({
    data: TIMELINE.map((tl, i) => ({
      year: tl.year,
      titleVi: tl.title.vi,
      titleEn: tl.title.en,
      titleZh: tl.title.zh,
      bodyVi: tl.body.vi,
      bodyEn: tl.body.en,
      bodyZh: tl.body.zh,
      sortOrder: i,
    })),
  });
  console.log(`  ✓ timeline events (${TIMELINE.length})`);

  // ─── 9. Certifications ─────────────────────────────────────────────────
  for (const [i, c] of CERTIFICATIONS.entries()) {
    await db.certification.upsert({
      where: { code: c.code },
      update: {
        name: c.name,
        badgeImageUrl: c.badge,
        descriptionVi: c.desc.vi,
        descriptionEn: c.desc.en,
        descriptionZh: c.desc.zh,
        sortOrder: i,
      },
      create: {
        code: c.code,
        name: c.name,
        badgeImageUrl: c.badge,
        descriptionVi: c.desc.vi,
        descriptionEn: c.desc.en,
        descriptionZh: c.desc.zh,
        sortOrder: i,
      },
    });
  }
  console.log(`  ✓ certifications (${CERTIFICATIONS.length})`);

  // ─── 10. Core values ───────────────────────────────────────────────────
  await db.coreValue.deleteMany({});
  await db.coreValue.createMany({
    data: CORE_VALUES.map((cv, i) => ({
      scope: cv.scope,
      icon: cv.icon,
      titleVi: cv.title.vi,
      titleEn: cv.title.en,
      titleZh: cv.title.zh,
      bodyVi: cv.body.vi,
      bodyEn: cv.body.en,
      bodyZh: cv.body.zh,
      sortOrder: i,
    })),
  });
  console.log(`  ✓ core values (${CORE_VALUES.length})`);

  // ─── 11. Stats (home page) ─────────────────────────────────────────────
  await db.stat.deleteMany({});
  const statKeys = ['years', 'capacity', 'countries', 'quarries'];
  const statIcons = ['shield', 'factory', 'globe', 'box'];
  await db.stat.createMany({
    data: vi.statVals.map((value: string, i: number) => ({
      key: statKeys[i] ?? `stat_${i}`,
      value,
      labelVi: vi.statLabels[i],
      labelEn: en.statLabels[i],
      labelZh: zh.statLabels[i],
      icon: statIcons[i],
      scope: 'home',
      sortOrder: i,
    })),
  });
  console.log(`  ✓ stats (${vi.statVals.length})`);

  // ─── 12. Menus (header + footer) ───────────────────────────────────────
  const navSlugs = ['', 'about', 'products', 'career', 'news', 'contact'];
  for (const location of ['header', 'footer'] as const) {
    const menu = await db.menu.upsert({
      where: { location },
      update: { name: `${location} menu` },
      create: { location, name: `${location} menu` },
    });
    await db.menuItem.deleteMany({ where: { menuId: menu.id } });
    await db.menuItem.createMany({
      data: vi.nav.map((label: string, i: number) => ({
        menuId: menu.id,
        labelVi: label,
        labelEn: en.nav[i],
        labelZh: zh.nav[i],
        url: navSlugs[i] ? `/${navSlugs[i]}` : '/',
        sortOrder: i,
      })),
    });
  }
  console.log('  ✓ menus (header + footer)');

  console.log('\n✅ Seed complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
