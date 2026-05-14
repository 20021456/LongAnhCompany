import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Icon, type IconName } from '@/components/ui/Icon';
import { getJobs } from '@/lib/queries';

const VALUES: Record<Locale, [IconName, string, string][]> = {
  vi: [
    [
      'drop',
      'Chính trực & Minh bạch',
      'Mọi quyết định đều dựa trên dữ liệu và sự thật. Chúng tôi đối thoại cởi mở và nhận trách nhiệm về kết quả.',
    ],
    [
      'globe',
      'Tinh thần đồng đội',
      'Thành công là kết quả của tập thể. Chúng tôi đặt lợi ích chung lên trên và hỗ trợ nhau phát triển mỗi ngày.',
    ],
    [
      'spark',
      'Đổi mới liên tục',
      'Chúng tôi liên tục cải tiến quy trình, nâng cấp công nghệ và tìm kiếm các giải pháp sáng tạo để dẫn đầu ngành.',
    ],
    [
      'check',
      'Chất lượng là cốt lõi',
      'Từ nguyên liệu đầu vào đến sản phẩm đầu ra, tiêu chuẩn ISO 9001 không phải là đích đến — mà là nền tảng tối thiểu.',
    ],
    [
      'leaf',
      'Phát triển bền vững',
      'Chúng tôi khai thác và sản xuất có trách nhiệm với môi trường và cộng đồng địa phương — vì một tương lai lâu dài.',
    ],
    [
      'box',
      'Hướng ra thị trường quốc tế',
      'Với 12 thị trường xuất khẩu, nhân viên Long Anh được tiếp xúc với tư duy và tiêu chuẩn toàn cầu ngay tại Nghệ An.',
    ],
  ],
  en: [
    [
      'drop',
      'Integrity & Transparency',
      'Every decision is based on data and truth. We communicate openly and take responsibility for outcomes.',
    ],
    [
      'globe',
      'Team spirit',
      "Success is a collective result. We put common interests first and support each other's growth every day.",
    ],
    [
      'spark',
      'Continuous innovation',
      'We continuously improve processes, upgrade technology and seek creative solutions to stay ahead.',
    ],
    [
      'check',
      'Quality at the core',
      'From raw material to finished product, ISO 9001 is not the destination — it is the minimum baseline.',
    ],
    [
      'leaf',
      'Sustainable development',
      'We mine and produce responsibly toward the environment and local community — for the long term.',
    ],
    [
      'box',
      'Global market orientation',
      'With 12 export markets, Long Anh employees engage with global thinking and standards right in Nghe An.',
    ],
  ],
  zh: [
    ['drop', '正直与透明', '所有决策均基于数据和事实。我们开放沟通,对结果负责。'],
    ['globe', '团队精神', '成功是集体的结果。我们将共同利益放在首位,每天互相支持成长。'],
    ['spark', '持续创新', '我们不断改进流程、升级技术,寻求创造性解决方案以保持领先。'],
    ['check', '质量为核心', '从原料到成品,ISO 9001不是终点 — 而是最低基线。'],
    ['leaf', '可持续发展', '我们对环境和当地社区负责任地开采和生产 — 为了长远未来。'],
    ['box', '面向国际市场', '拥有12个出口市场,龙英员工在义安省即可接触全球思维和标准。'],
  ],
};

const BENEFITS: Record<Locale, [string, string][]> = {
  vi: [
    [
      'Lương & Thưởng cạnh tranh',
      'Mức lương theo năng lực, xét tăng lương 2 lần/năm. Thưởng hiệu suất hàng quý và thưởng cuối năm theo kết quả kinh doanh.',
    ],
    [
      'Bảo hiểm toàn diện',
      'BHXH, BHYT, BHTN theo đúng quy định. Bảo hiểm sức khỏe bổ sung cho nhân viên và gia đình với hạn mức cao.',
    ],
    [
      'Đào tạo & Phát triển',
      'Chương trình đào tạo nội bộ định kỳ, hỗ trợ học phí các khóa chuyên môn, cử nhân viên tiêu biểu tham gia hội thảo quốc tế.',
    ],
    [
      'Môi trường làm việc hiện đại',
      'Văn phòng và nhà máy được trang bị đầy đủ thiết bị bảo hộ lao động tiêu chuẩn. Trang bị laptop và công cụ làm việc đầy đủ.',
    ],
    [
      'Nghỉ phép & Lễ tết',
      '12 ngày nghỉ phép có lương/năm. Nghỉ lễ theo quy định nhà nước cộng thêm các ngày nghỉ đặc biệt của công ty.',
    ],
    [
      'Hoạt động tập thể',
      'Team building hàng năm, du lịch công ty, các giải thể thao nội bộ và sự kiện văn hóa gắn kết đội ngũ.',
    ],
  ],
  en: [
    [
      'Competitive salary & bonus',
      'Performance-based pay, twice-yearly reviews. Quarterly performance bonus and year-end bonus tied to business results.',
    ],
    [
      'Comprehensive insurance',
      'Full social, health and unemployment insurance. Supplementary health insurance for employees and family with high coverage.',
    ],
    [
      'Training & Development',
      'Regular internal training programs, tuition support for professional courses, top employees sent to international conferences.',
    ],
    [
      'Modern working environment',
      'Offices and plants fully equipped with standard PPE. Laptop and full working tools provided.',
    ],
    [
      'Leave & Holidays',
      '12 paid annual leave days. Public holidays per regulations plus additional company-specific days off.',
    ],
    [
      'Team activities',
      'Annual team building, company trips, internal sports competitions and cultural events that build team bonds.',
    ],
  ],
  zh: [
    ['有竞争力的薪酬与奖金', '按能力定薪,每年两次调薪。季度绩效奖金和与业绩挂钩的年终奖金。'],
    ['全面保险', '足额社保、医保、失业保险。为员工及家属提供高额补充健康保险。'],
    ['培训与发展', '定期内部培训计划,专业课程学费支持,优秀员工参加国际会议。'],
    ['现代化工作环境', '办公室和工厂配备齐全的标准劳保设备。提供笔记本电脑和完整工作工具。'],
    ['休假与节假日', '每年12天带薪年假。法定节假日加上公司特别休息日。'],
    ['团队活动', '年度团建、公司旅游、内部体育比赛和增进团队凝聚力的文化活动。'],
  ],
};

const PROCESS: Record<Locale, [string, string][]> = {
  vi: [
    [
      'Nộp hồ sơ',
      'Gửi CV qua form online hoặc email hr@longanhcorp.com. Phản hồi trong vòng 3 ngày làm việc.',
    ],
    [
      'Phỏng vấn sơ bộ',
      'Trao đổi qua điện thoại hoặc video call để hiểu về kinh nghiệm và mong muốn của ứng viên.',
    ],
    [
      'Phỏng vấn chuyên sâu',
      'Gặp trực tiếp với quản lý bộ phận. Có thể bao gồm bài kiểm tra kỹ năng thực tế tùy vị trí.',
    ],
    [
      'Nhận offer & Onboarding',
      'Thư đề nghị làm việc trong vòng 5 ngày sau phỏng vấn cuối. Chương trình hội nhập 30 ngày đầu tiên.',
    ],
  ],
  en: [
    [
      'Submit application',
      'Send CV via online form or email hr@longanhcorp.com. Response within 3 business days.',
    ],
    [
      'Initial interview',
      "Phone or video call to understand the candidate's experience and aspirations.",
    ],
    [
      'In-depth interview',
      'Meet in person with department manager. May include a practical skills test depending on the role.',
    ],
    [
      'Offer & Onboarding',
      'Job offer letter within 5 days of final interview. 30-day onboarding program for new joiners.',
    ],
  ],
  zh: [
    ['提交申请', '通过在线表格或邮件 hr@longanhcorp.com 发送简历。3个工作日内回复。'],
    ['初步面试', '通过电话或视频通话了解候选人的经验和期望。'],
    ['深度面试', '与部门经理面对面会谈。根据职位可能包括实操技能测试。'],
    ['录用与入职', '最终面试后5天内发出录用通知书。新员工30天入职培训计划。'],
  ],
};

export default async function CareerPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const loc = locale as Locale;
  const C = COPY[loc];

  // Phase 4: job listings come from the database
  const jobMap = await getJobs();
  const jobs = Object.values(jobMap).map((j) => ({
    id: j.id,
    dept: j.deptLabel[loc],
    title: j.title[loc],
    loc: j.loc[loc],
    type: j.type[loc],
    exp: j.exp[loc],
    tags: j.tags,
  }));

  return (
    <div className="cr">
      {/* HERO */}
      <section className="cr-hero">
        <div className="va-wrap">
          <div className="cr-bcrumb">
            <Link href={`/${loc}`}>
              {loc === 'zh' ? '首页' : loc === 'en' ? 'Home' : 'Trang chủ'}
            </Link>
            <Icon name="chevron" size={11} />
            <span>{C.nav[3]}</span>
          </div>
          <div className="va-eyebrow" style={{ color: '#F08023' }}>
            {loc === 'zh'
              ? '职业机会'
              : loc === 'en'
                ? 'Career Opportunities'
                : 'Cơ hội nghề nghiệp'}
          </div>
          <h1>
            {loc === 'zh' ? (
              <>
                加入 <span>龙英</span> 团队 —<br />
                让人才得以成长。
              </>
            ) : loc === 'en' ? (
              <>
                Join the <span>Long Anh</span> team —<br />
                where talent grows.
              </>
            ) : (
              <>
                Gia nhập đội ngũ <span>Long Anh</span> —<br />
                nơi tài năng được phát triển.
              </>
            )}
          </h1>
          <p>
            {loc === 'zh'
              ? '我们打造专业、活力、透明的工作环境,每个人都有机会贡献并与公司共同成长。'
              : loc === 'en'
                ? 'We build a professional, dynamic and transparent working environment where every individual has the opportunity to contribute and grow alongside the company.'
                : 'Chúng tôi xây dựng một môi trường làm việc chuyên nghiệp, năng động và minh bạch, nơi mỗi cá nhân đều có cơ hội đóng góp và trưởng thành cùng doanh nghiệp.'}
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a className="va-btn va-btn-p" href="#jobs">
              {loc === 'zh'
                ? '查看招聘职位'
                : loc === 'en'
                  ? 'View open positions'
                  : 'Xem vị trí tuyển dụng'}{' '}
              <Icon name="arrow" size={15} />
            </a>
            <Link className="cr-btn-w" href={`/${loc}/contact`}>
              {loc === 'zh'
                ? '直接联系'
                : loc === 'en'
                  ? 'Contact us directly'
                  : 'Liên hệ trực tiếp'}
            </Link>
          </div>
        </div>
      </section>

      {/* JOBS */}
      <section className="cr-section" id="jobs">
        <div className="va-wrap">
          <div className="cr-shead">
            <div>
              <div className="va-eyebrow">
                {loc === 'zh' ? '招聘职位' : loc === 'en' ? 'Open positions' : 'Vị trí đang tuyển'}
              </div>
              <h2>
                {loc === 'zh'
                  ? '当前工作机会'
                  : loc === 'en'
                    ? 'Current job opportunities'
                    : 'Cơ hội việc làm hiện tại'}
              </h2>
            </div>
            <p>
              {loc === 'zh'
                ? '所有职位向有能力和学习精神的候选人开放 — 矿产行业经验是加分项。'
                : loc === 'en'
                  ? 'All positions are open to motivated candidates — experience in the minerals industry is an advantage.'
                  : 'Tất cả các vị trí đều mở cửa cho ứng viên có năng lực và tinh thần học hỏi — kinh nghiệm ngành khoáng sản là lợi thế.'}
            </p>
          </div>
          <div className="cr-jobs-grid">
            {jobs.map((j) => (
              <Link key={j.id} href={`/${loc}/career/${j.id}`} className="cr-job-card">
                <div>
                  <div className="cr-job-dept">{j.dept}</div>
                  <div className="cr-job-title">{j.title}</div>
                  <div className="cr-job-meta">
                    <span className="cr-job-meta-item">
                      <Icon name="pin" size={13} /> {j.loc}
                    </span>
                    <span className="cr-job-meta-item">
                      <Icon name="check" size={13} /> {j.type}
                    </span>
                    <span className="cr-job-meta-item">
                      <Icon name="spark" size={13} /> {j.exp}
                    </span>
                  </div>
                  <div className="cr-job-tags">
                    {j.tags.map((tag, i) => (
                      <span key={i}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="cr-job-arrow">
                  {loc === 'zh' ? '立即申请' : loc === 'en' ? 'Apply now' : 'Ứng tuyển ngay'}
                  <Icon name="arrow" size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="cr-section tight" style={{ background: 'var(--va-bg-alt)' }}>
        <div className="va-wrap">
          <div className="cr-shead">
            <div>
              <div className="va-eyebrow">
                {loc === 'zh'
                  ? '企业文化'
                  : loc === 'en'
                    ? 'Company culture'
                    : 'Văn hóa doanh nghiệp'}
              </div>
              <h2>
                {loc === 'zh'
                  ? '龙英的特色'
                  : loc === 'en'
                    ? 'What makes Long Anh'
                    : 'Điều làm nên Long Anh'}
              </h2>
            </div>
            <p>
              {loc === 'zh'
                ? '我们不仅生产矿产 — 我们打造具有持久价值的人才和组织。'
                : loc === 'en'
                  ? 'We do not just produce minerals — we build people and organizations with lasting value.'
                  : 'Chúng tôi không chỉ sản xuất khoáng sản — chúng tôi xây dựng con người và tổ chức có giá trị lâu bền.'}
            </p>
          </div>
          <div className="cr-values-grid">
            {VALUES[loc].map(([icon, h, p], i) => (
              <div key={i} className="cr-value-card">
                <div className="cr-value-icon">
                  <Icon name={icon} size={22} />
                </div>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="cr-section">
        <div className="va-wrap">
          <div className="cr-shead">
            <div>
              <div className="va-eyebrow">
                {loc === 'zh' ? '福利' : loc === 'en' ? 'Benefits' : 'Phúc lợi'}
              </div>
              <h2>
                {loc === 'zh'
                  ? '我们关心你'
                  : loc === 'en'
                    ? 'We take care of you'
                    : 'Chúng tôi chăm lo cho bạn'}
              </h2>
            </div>
            <p>
              {loc === 'zh'
                ? '除了有竞争力的薪酬,龙英还提供全面的福利,支持健康、发展和工作生活平衡。'
                : loc === 'en'
                  ? 'Alongside competitive salary, Long Anh provides comprehensive benefits supporting health, development and work-life balance.'
                  : 'Bên cạnh mức lương cạnh tranh, Long Anh cung cấp chế độ đãi ngộ toàn diện hỗ trợ sức khoẻ, sự phát triển và cuộc sống cân bằng.'}
            </p>
          </div>
          <div className="cr-benefits-grid">
            {BENEFITS[loc].map(([h, p], i) => (
              <div key={i} className="cr-benefit">
                <div className="cr-benefit-num">0{i + 1}</div>
                <h4>{h}</h4>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="cr-section tight" style={{ background: 'var(--va-bg-alt)' }}>
        <div className="va-wrap">
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 56px' }}>
            <div className="va-eyebrow">
              {loc === 'zh' ? '招聘流程' : loc === 'en' ? 'Hiring process' : 'Quy trình tuyển dụng'}
            </div>
            <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', marginTop: 12 }}>
              {loc === 'zh'
                ? '简单。透明。快速。'
                : loc === 'en'
                  ? 'Simple. Transparent. Fast.'
                  : 'Đơn giản. Minh bạch. Nhanh chóng.'}
            </h2>
          </div>
          <div className="cr-process-steps">
            {PROCESS[loc].map(([h, p], i) => (
              <div key={i} className="cr-process-step">
                <div className="cr-step-num">0{i + 1}</div>
                <h4>{h}</h4>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cr-section tight">
        <div className="va-wrap">
          <div className="cr-cta-banner">
            <div>
              <div className="va-eyebrow">
                {loc === 'zh'
                  ? '找不到合适的职位?'
                  : loc === 'en'
                    ? 'Cannot find a suitable position?'
                    : 'Không tìm thấy vị trí phù hợp?'}
              </div>
              <h2>
                {loc === 'zh'
                  ? '提交自由申请'
                  : loc === 'en'
                    ? 'Submit an open application'
                    : 'Gửi hồ sơ ứng tuyển tự do'}
              </h2>
              <p>
                {loc === 'zh'
                  ? '如果您相信自己能为龙英做出贡献,请给我们发送简历。无论目前是否招聘,我们始终在寻找优秀人才。'
                  : loc === 'en'
                    ? 'If you believe you can contribute to Long Anh, send us your CV. We are always looking for outstanding talent regardless of open positions.'
                    : 'Nếu bạn tin rằng mình có thể đóng góp cho Long Anh, hãy gửi CV cho chúng tôi. Chúng tôi luôn tìm kiếm những tài năng xuất sắc bất kể vị trí đang tuyển.'}
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                alignItems: 'flex-start',
              }}
            >
              <a className="va-btn va-btn-p" href="mailto:hr@longanhcorp.com">
                {loc === 'zh'
                  ? '通过邮件发送简历'
                  : loc === 'en'
                    ? 'Send CV by Email'
                    : 'Gửi CV qua Email'}{' '}
                <Icon name="arrow" size={15} />
              </a>
              <Link className="cr-btn-ghost" href={`/${loc}/contact`}>
                {loc === 'zh'
                  ? '联系人力资源部'
                  : loc === 'en'
                    ? 'Contact HR'
                    : 'Liên hệ bộ phận HR'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
