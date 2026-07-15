/**
 * Careers page section content — the editable CMS model for
 * `/admin/pages/career`. Mirrors the home / about / products page editors
 * so all four share the `page_sections` persistence shape
 * (`{ vi, en, zh }` JSON per sectionKey).
 *
 * 6 sections, matching admin/page-edit-careers.html in the prototype:
 *   hero      — eyebrow + main title + sub + CTA label + 4 stats
 *   jobs      — section title/email/sub + dept filter chips + selected
 *               job slugs (rendered from the catalog)
 *   values    — eyebrow + title + sub + N value cards
 *   benefits  — eyebrow + title + N benefit rows
 *   process   — eyebrow + title + N step rows
 *   cta       — title + receiving email + description
 *
 * (SEO is handled by the page-level meta fields, not a section.)
 */

import type { Locale } from './i18n/config';

// ─── Per-section shapes ───────────────────────────────────────────────────

export interface CareersStatItem {
  value: string;
  label: string;
}
export interface CareersHeroSection {
  eyebrow: string;
  title: string;
  sub: string;
  ctaLabel: string;
  stats: CareersStatItem[];
  /** Hero banner background photo. */
  imageUrl?: string;
}

export interface CareersJobsSection {
  title: string;
  sub: string;
  /** Email shown as the receiving address for applications. */
  email: string;
  /** Department filter chips. */
  departments: string[];
  /** Catalog job slugs that should appear on the public page (ordered). */
  jobSlugs: string[];
}

export interface CareersValueCard {
  name: string;
  body: string;
  icon: string;
}
export interface CareersValuesSection {
  eyebrow: string;
  title: string;
  sub: string;
  items: CareersValueCard[];
}

export interface CareersBenefitRow {
  label: string;
  body: string;
}
export interface CareersBenefitsSection {
  eyebrow: string;
  title: string;
  items: CareersBenefitRow[];
}

export interface CareersStepRow {
  title: string;
  body: string;
}
export interface CareersProcessSection {
  eyebrow: string;
  title: string;
  items: CareersStepRow[];
}

export interface CareersCtaSection {
  title: string;
  email: string;
  sub: string;
}

export interface CareersPageSectionsLocale {
  hero: CareersHeroSection;
  jobs: CareersJobsSection;
  values: CareersValuesSection;
  benefits: CareersBenefitsSection;
  process: CareersProcessSection;
  cta: CareersCtaSection;
}

export type CareersPageSections = Record<Locale, CareersPageSectionsLocale>;

export const CAREERS_PAGE_SECTION_KEYS = [
  'hero',
  'jobs',
  'values',
  'benefits',
  'process',
  'cta',
] as const;
export type CareersPageSectionKey = (typeof CAREERS_PAGE_SECTION_KEYS)[number];

// ─── Default content (per locale) ─────────────────────────────────────────

const HERO: Record<Locale, CareersHeroSection> = {
  vi: {
    eyebrow: 'Cơ hội nghề nghiệp',
    title: 'Gia nhập đội ngũ Long Anh.',
    sub: 'Hơn 150 nhân sự tại 5 nhà máy và văn phòng ở Quỳ Hợp – TP. Vinh, vận hành chuỗi khai thác – chế biến – xuất khẩu đi 12 quốc gia. Chúng tôi tuyển người làm được việc, và giữ người bằng lộ trình phát triển rõ ràng.',
    ctaLabel: 'Xem vị trí tuyển dụng',
    imageUrl: '/assets/nha-may-bot-sieu-min-3.webp',
    stats: [
      { value: '20+', label: 'Năm kinh nghiệm' },
      { value: '150+', label: 'Cán bộ nhân viên' },
      { value: '5', label: 'Nhà máy & chi nhánh' },
      { value: '12', label: 'Thị trường xuất khẩu' },
    ],
  },
  en: {
    eyebrow: 'Career opportunities',
    title: 'Join the Long Anh team.',
    sub: 'Over 150 people across 5 plants and offices in Quy Hop and Vinh, running a mining–processing–export chain that ships to 12 countries. We hire for capability — and keep people with a clear growth path.',
    ctaLabel: 'See open positions',
    imageUrl: '/assets/nha-may-bot-sieu-min-3.webp',
    stats: [
      { value: '20+', label: 'Years of experience' },
      { value: '150+', label: 'Team members' },
      { value: '5', label: 'Plants & offices' },
      { value: '12', label: 'Export markets' },
    ],
  },
  zh: {
    eyebrow: '职业机会',
    title: '加入龙英团队。',
    sub: '150多名员工分布于归合与荣市的5个工厂和办公室,运营面向12个国家的开采–加工–出口链条。我们以能力选人,以清晰的发展路径留人。',
    ctaLabel: '查看招聘职位',
    imageUrl: '/assets/nha-may-bot-sieu-min-3.webp',
    stats: [
      { value: '20+', label: '年经验' },
      { value: '150+', label: '员工' },
      { value: '5', label: '工厂和办公室' },
      { value: '12', label: '出口市场' },
    ],
  },
};

const JOBS: Record<Locale, CareersJobsSection> = {
  vi: {
    title: 'Cơ hội việc làm hiện tại',
    sub: 'Tất cả các vị trí đều mở cửa cho ứng viên có năng lực và tinh thần học hỏi — kinh nghiệm ngành khoáng sản là lợi thế.',
    email: 'hr@longanhcorp.com',
    departments: ['Sản xuất', 'Kinh doanh', 'Kỹ thuật', 'Chất lượng', 'Hành chính'],
    jobSlugs: ['1', '2', '3', '4', '5', '6', '7', '8'],
  },
  en: {
    title: 'Current openings',
    sub: 'Every role is open to candidates with the skills and the curiosity — mining-industry experience is a plus, not a requirement.',
    email: 'hr@longanhcorp.com',
    departments: ['Manufacturing', 'Sales', 'Engineering', 'Quality', 'Admin'],
    jobSlugs: ['1', '2', '3', '4', '5', '6', '7', '8'],
  },
  zh: {
    title: '当前职位',
    sub: '所有职位都向有能力且乐于学习的候选人开放 — 矿业经验是加分项。',
    email: 'hr@longanhcorp.com',
    departments: ['生产', '销售', '工程', '质量', '行政'],
    jobSlugs: ['1', '2', '3', '4', '5', '6', '7', '8'],
  },
};

const VALUES: Record<Locale, CareersValuesSection> = {
  vi: {
    eyebrow: 'Văn hóa doanh nghiệp',
    title: 'Điều làm nên Long Anh',
    sub: 'Chúng tôi không chỉ sản xuất khoáng sản — chúng tôi xây dựng con người và tổ chức có giá trị lâu bền.',
    items: [
      {
        name: 'Chính trực & Minh bạch',
        body: 'Mọi quyết định đều dựa trên dữ liệu và sự thật. Chúng tôi đối thoại cởi mở và nhận trách nhiệm về kết quả.',
        icon: 'drop',
      },
      {
        name: 'Tinh thần đồng đội',
        body: 'Thành công là kết quả của tập thể. Chúng tôi đặt lợi ích chung lên trên và hỗ trợ nhau phát triển mỗi ngày.',
        icon: 'globe',
      },
      {
        name: 'Đổi mới liên tục',
        body: 'Chúng tôi liên tục cải tiến quy trình, nâng cấp công nghệ và tìm kiếm các giải pháp sáng tạo để dẫn đầu ngành.',
        icon: 'spark',
      },
      {
        name: 'Chất lượng là cốt lõi',
        body: 'Từ nguyên liệu đầu vào đến sản phẩm đầu ra, tiêu chuẩn ISO 9001 không phải là đích đến — mà là nền tảng tối thiểu.',
        icon: 'check',
      },
      {
        name: 'Phát triển bền vững',
        body: 'Chúng tôi khai thác và sản xuất có trách nhiệm với môi trường và cộng đồng địa phương — vì một tương lai lâu dài.',
        icon: 'leaf',
      },
      {
        name: 'Hướng ra quốc tế',
        body: 'Với 12 thị trường xuất khẩu, nhân viên Long Anh được tiếp xúc với tư duy và tiêu chuẩn toàn cầu ngay tại Nghệ An.',
        icon: 'box',
      },
    ],
  },
  en: {
    eyebrow: 'Company culture',
    title: 'What makes Long Anh',
    sub: 'We do more than produce minerals — we build people and organisations that last.',
    items: [
      {
        name: 'Integrity & Transparency',
        body: 'Every decision rests on data and truth. We talk openly and own outcomes.',
        icon: 'drop',
      },
      {
        name: 'Team spirit',
        body: 'Success is collective. We put the common good first and lift each other up every day.',
        icon: 'globe',
      },
      {
        name: 'Continuous improvement',
        body: 'We refine processes, upgrade technology, and chase creative answers to lead the industry.',
        icon: 'spark',
      },
      {
        name: 'Quality is core',
        body: 'From raw input to finished output, ISO 9001 is the floor — not the ceiling.',
        icon: 'check',
      },
      {
        name: 'Sustainable growth',
        body: 'We mine and produce responsibly toward the environment and the local community — for the long run.',
        icon: 'leaf',
      },
      {
        name: 'Global outlook',
        body: 'With 12 export markets, the Long Anh team works to global standards from day one in Nghe An.',
        icon: 'box',
      },
    ],
  },
  zh: {
    eyebrow: '企业文化',
    title: '龙英之所以是龙英',
    sub: '我们不仅生产矿产 — 我们建设具有长期价值的人才和组织。',
    items: [
      {
        name: '正直与透明',
        body: '所有决策都基于数据和事实。我们开放沟通,对结果负责。',
        icon: 'drop',
      },
      {
        name: '团队精神',
        body: '成功来自集体。我们把共同利益放在首位,每天彼此扶持成长。',
        icon: 'globe',
      },
      {
        name: '持续创新',
        body: '我们持续优化流程、升级技术、寻找创新方案以引领行业。',
        icon: 'spark',
      },
      { name: '质量至上', body: '从原料到成品,ISO 9001 不是终点 — 而是最低基础。', icon: 'check' },
      {
        name: '可持续发展',
        body: '我们对环境和当地社区负责地开采和生产 — 着眼长远。',
        icon: 'leaf',
      },
      {
        name: '国际化视野',
        body: '凭借12个出口市场,龙英员工在义安省就能接触全球思维与标准。',
        icon: 'box',
      },
    ],
  },
};

const BENEFITS: Record<Locale, CareersBenefitsSection> = {
  vi: {
    eyebrow: 'Phúc lợi',
    title: 'Chúng tôi chăm lo cho bạn',
    items: [
      {
        label: 'Lương & Thưởng cạnh tranh',
        body: 'Mức lương theo năng lực, xét tăng lương 2 lần/năm. Thưởng hiệu suất hàng quý.',
      },
      {
        label: 'Bảo hiểm toàn diện',
        body: 'BHXH, BHYT, BHTN theo quy định. Bảo hiểm sức khỏe bổ sung cho nhân viên và gia đình.',
      },
      {
        label: 'Đào tạo & Phát triển',
        body: 'Đào tạo nội bộ định kỳ, hỗ trợ học phí, cử nhân viên tham gia hội thảo quốc tế.',
      },
      {
        label: 'Môi trường hiện đại',
        body: 'Văn phòng và nhà máy được trang bị đầy đủ thiết bị bảo hộ tiêu chuẩn.',
      },
      {
        label: 'Nghỉ phép & Lễ tết',
        body: '12 ngày phép có lương/năm. Nghỉ lễ theo nhà nước cộng các ngày đặc biệt của công ty.',
      },
      {
        label: 'Hoạt động tập thể',
        body: 'Team building hàng năm, du lịch công ty, các giải thể thao nội bộ.',
      },
    ],
  },
  en: {
    eyebrow: 'Benefits',
    title: 'We look after you',
    items: [
      {
        label: 'Competitive pay & bonus',
        body: 'Pay reflects ability with two reviews per year. Quarterly performance bonus.',
      },
      {
        label: 'Full insurance',
        body: 'Statutory social/health/unemployment insurance plus supplementary health cover for employees and families.',
      },
      {
        label: 'Training & growth',
        body: 'Regular in-house training, tuition support, and sponsored international conference attendance.',
      },
      {
        label: 'Modern environment',
        body: 'Offices and plants are fully equipped with standard safety gear.',
      },
      {
        label: 'Leave & holidays',
        body: '12 paid leave days per year. Public holidays plus company-specific dates off.',
      },
      {
        label: 'Team activities',
        body: 'Annual team building, company trips, and internal sports tournaments.',
      },
    ],
  },
  zh: {
    eyebrow: '福利',
    title: '我们关爱您',
    items: [
      { label: '具竞争力的薪酬+奖金', body: '薪酬随能力调整,每年评估两次。季度绩效奖金。' },
      { label: '全面保险', body: '法定社保/医保/失业保险,以及为员工和家人提供的补充健康保险。' },
      { label: '培训与发展', body: '定期内部培训、学费支持以及国际研讨会的赞助参与。' },
      { label: '现代化环境', body: '办公室和工厂配备标准安全装备。' },
      { label: '假期与节日', body: '每年12天带薪休假。法定节假日加公司特别休息日。' },
      { label: '团队活动', body: '年度团建、公司旅行和内部体育比赛。' },
    ],
  },
};

const PROCESS: Record<Locale, CareersProcessSection> = {
  vi: {
    eyebrow: 'Quy trình tuyển dụng',
    title: 'Đơn giản. Minh bạch. Nhanh chóng.',
    items: [
      {
        title: 'Nộp hồ sơ',
        body: 'Gửi CV qua form online hoặc email hr@longanhcorp.com. Phản hồi trong 3 ngày làm việc.',
      },
      {
        title: 'Phỏng vấn sơ bộ',
        body: 'Trao đổi qua điện thoại hoặc video call để hiểu về kinh nghiệm và mong muốn.',
      },
      {
        title: 'Phỏng vấn chuyên sâu',
        body: 'Gặp trực tiếp với quản lý bộ phận. Có thể bao gồm bài kiểm tra kỹ năng tùy vị trí.',
      },
      {
        title: 'Nhận offer & Onboarding',
        body: 'Thư đề nghị làm việc trong 5 ngày sau phỏng vấn cuối. Hội nhập 30 ngày đầu.',
      },
    ],
  },
  en: {
    eyebrow: 'Hiring process',
    title: 'Simple. Transparent. Quick.',
    items: [
      {
        title: 'Apply',
        body: 'Submit your CV via the online form or hr@longanhcorp.com. We reply within 3 business days.',
      },
      {
        title: 'Phone screen',
        body: 'A phone or video call to learn about your experience and goals.',
      },
      {
        title: 'On-site interview',
        body: 'Meet the hiring manager in person — may include a skills test depending on the role.',
      },
      {
        title: 'Offer & onboarding',
        body: 'Offer letter within 5 days of the final interview. 30-day structured onboarding.',
      },
    ],
  },
  zh: {
    eyebrow: '招聘流程',
    title: '简单。透明。快速。',
    items: [
      {
        title: '申请',
        body: '通过在线表单或邮箱 hr@longanhcorp.com 提交简历。我们将在3个工作日内回复。',
      },
      { title: '电话沟通', body: '通过电话或视频通话了解您的经验和目标。' },
      { title: '现场面试', body: '与招聘经理面对面会谈 — 视职位可能包括技能测试。' },
      { title: '入职邀约', body: '最终面试后5天内发出录用通知。30天结构化入职流程。' },
    ],
  },
};

const CTA: Record<Locale, CareersCtaSection> = {
  vi: {
    title: 'Gửi hồ sơ ứng tuyển tự do',
    email: 'hr@longanhcorp.com',
    sub: 'Chưa thấy vị trí phù hợp? Chúng tôi vẫn luôn sẵn sàng đón nhận tài năng mới — gửi CV và Long Anh sẽ liên hệ khi có cơ hội phù hợp.',
  },
  en: {
    title: 'Open application',
    email: 'hr@longanhcorp.com',
    sub: 'Don’t see a fit? We always welcome new talent — send your CV and we’ll reach out when the right opening comes up.',
  },
  zh: {
    title: '开放申请',
    email: 'hr@longanhcorp.com',
    sub: '没有找到合适的职位? 我们始终欢迎新人才 — 发送您的简历,合适的机会出现时我们会联系您。',
  },
};

export function careersPageDefaults(locale: Locale): CareersPageSectionsLocale {
  return {
    hero: HERO[locale],
    jobs: JOBS[locale],
    values: VALUES[locale],
    benefits: BENEFITS[locale],
    process: PROCESS[locale],
    cta: CTA[locale],
  };
}
