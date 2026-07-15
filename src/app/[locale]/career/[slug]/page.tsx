import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { getJobs } from '@/lib/queries';
import { Icon } from '@/components/ui/Icon';
import { hreflangAlternates, siteUrl } from '@/lib/site-url';
import { JsonLd, jobPostingSchema, breadcrumbSchema } from '@/components/seo/JsonLd';
import { db } from '@/lib/db';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const loc = params.locale as Locale;
  let title = params.slug;
  let description = '';
  try {
    const jobs = await getJobs();
    const job = jobs[params.slug];
    if (job) {
      title = job.title[loc] || job.title.vi;
      description = job.overview[loc] || job.overview.vi || '';
    }
  } catch {
    /* DB unavailable */
  }
  const { canonical, languages } = hreflangAlternates(loc, `/career/${params.slug}`);
  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: { title, description, url: canonical, type: 'article' },
    twitter: { title, description },
  };
}

const L = {
  vi: {
    home: 'Trang chủ',
    career: 'Tuyển dụng',
    salary: 'Mức lương',
    department: 'Phòng ban',
    location: 'Địa điểm',
    type: 'Loại hình',
    level: 'Cấp bậc',
    experience: 'Kinh nghiệm',
    headcount: 'Số lượng',
    deadline: 'Hạn nộp',
    jobOverview: 'Mô tả công việc',
    responsibilities: 'Trách nhiệm chính',
    requirements: 'Yêu cầu công việc',
    benefits: 'Quyền lợi & phúc lợi',
    howToApply: 'Hướng dẫn ứng tuyển',
    applyNow: 'Ứng tuyển ngay',
    applyText:
      'Vui lòng gửi CV và thư giới thiệu (tiếng Việt hoặc tiếng Anh) đến email HR. Tiêu đề email: [Mã vị trí] - Họ tên - Vị trí ứng tuyển. Chúng tôi sẽ phản hồi trong vòng 3 ngày làm việc.',
    sendCv: 'Gửi CV qua email',
    contactHr: 'Liên hệ HR',
    relatedJobs: 'Vị trí liên quan',
    viewAll: 'Xem tất cả vị trí',
  },
  en: {
    home: 'Home',
    career: 'Career',
    salary: 'Salary',
    department: 'Department',
    location: 'Location',
    type: 'Type',
    level: 'Level',
    experience: 'Experience',
    headcount: 'Headcount',
    deadline: 'Deadline',
    jobOverview: 'Job overview',
    responsibilities: 'Key responsibilities',
    requirements: 'Requirements',
    benefits: 'Benefits & perks',
    howToApply: 'How to apply',
    applyNow: 'Apply now',
    applyText:
      'Please send your CV and cover letter (Vietnamese or English) to our HR email. Email subject: [Job code] - Full name - Position. We will respond within 3 business days.',
    sendCv: 'Send CV via email',
    contactHr: 'Contact HR',
    relatedJobs: 'Related positions',
    viewAll: 'View all positions',
  },
  zh: {
    home: '首页',
    career: '招聘',
    salary: '薪资',
    department: '部门',
    location: '地点',
    type: '类型',
    level: '级别',
    experience: '经验',
    headcount: '招聘人数',
    deadline: '截止日期',
    jobOverview: '工作描述',
    responsibilities: '主要职责',
    requirements: '工作要求',
    benefits: '福利待遇',
    howToApply: '申请方式',
    applyNow: '立即申请',
    applyText:
      '请将简历和求职信(越南语或英语)发送至HR邮箱。邮件主题:[职位代码] - 姓名 - 应聘职位。我们将在3个工作日内回复。',
    sendCv: '通过邮件发送简历',
    contactHr: '联系HR',
    relatedJobs: '相关职位',
    viewAll: '查看所有职位',
  },
} as const;

function fmtDate(d: string, lang: Locale) {
  if (!d) return '';
  const [day, m, y] = d.split('/');
  if (lang === 'en') {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${months[parseInt(m) - 1]} ${day}, ${y}`;
  }
  if (lang === 'zh') return `${y}年${parseInt(m)}月${parseInt(day)}日`;
  return d;
}

export default async function JobDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(params.locale);
  const loc = params.locale as Locale;
  const t = L[loc];

  // Phase 4: job comes from the database
  const jobs = await getJobs();
  const job = jobs[params.slug];
  if (!job) notFound();

  const title = job.title[loc] || job.title.vi;
  const deptLabel = job.deptLabel[loc];
  const mailto = `mailto:hr@longanhcorp.com?subject=${encodeURIComponent(`[${job.id}] ${title}`)}`;

  // Raw job row for JobPosting schema fields not exposed on the JobDetail
  // shape (datePosted, validThrough, employmentType, salaryMin/Max).
  let rawJob: {
    createdAt: Date;
    deadline: Date | null;
    employmentType: string;
    salaryMin: { toNumber(): number } | null;
    salaryMax: { toNumber(): number } | null;
    salaryCurrency: string;
  } | null = null;
  try {
    rawJob = await db.job.findUnique({
      where: { slug: params.slug },
      select: {
        createdAt: true,
        deadline: true,
        employmentType: true,
        salaryMin: true,
        salaryMax: true,
        salaryCurrency: true,
      },
    });
  } catch {
    /* DB unavailable */
  }

  const related = Object.values(jobs)
    .filter((j) => j.id !== job.id)
    .sort((a, b) => (a.dept === job.dept ? -1 : 1) - (b.dept === job.dept ? -1 : 1))
    .slice(0, 3);

  const jobUrl = `/${loc}/career/${params.slug}`;
  const homeLabel = t.home;
  const careerLabel = t.career;

  return (
    <div className="jd">
      <JsonLd
        data={jobPostingSchema({
          title,
          description: job.overview[loc] || job.overview.vi,
          datePosted: (rawJob?.createdAt ?? new Date()).toISOString(),
          validThrough: rawJob?.deadline ? rawJob.deadline.toISOString() : undefined,
          employmentType: rawJob?.employmentType ?? 'full_time',
          location: job.loc[loc] || job.loc.vi,
          hiringOrgName: 'KS Long Anh',
          hiringOrgUrl: siteUrl(),
          salaryMin: rawJob?.salaryMin ? rawJob.salaryMin.toNumber() : undefined,
          salaryMax: rawJob?.salaryMax ? rawJob.salaryMax.toNumber() : undefined,
          salaryCurrency: rawJob?.salaryCurrency,
          url: jobUrl,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: homeLabel, url: `/${loc}` },
          { name: careerLabel, url: `/${loc}/career` },
          { name: title, url: jobUrl },
        ])}
      />
      {/* HERO */}
      <section className="jd-hero">
        <div className="va-wrap">
          <nav className="jd-bcrumb">
            <Link href={`/${loc}`}>{t.home}</Link>
            <Icon name="chevron" size={12} />
            <Link href={`/${loc}/career`}>{t.career}</Link>
            <Icon name="chevron" size={12} />
            <Link href={`/${loc}/career?dept=${job.dept}`}>{deptLabel}</Link>
            <Icon name="chevron" size={12} />
            <span className="now">{title}</span>
          </nav>

          <div className="jd-hero-inner" style={{ marginTop: 24 }}>
            <div className="jd-hero-l">
              <div className="jd-dept-chip">
                <Icon name="box" size={13} /> {deptLabel}
              </div>
              <h1>{title}</h1>
              <div className="jd-hero-meta">
                <div className="jd-hero-meta-item">
                  <Icon name="pin" size={16} /> <b>{job.loc[loc]}</b>
                </div>
                <div className="jd-hero-meta-item">
                  <Icon name="check" size={16} /> <b>{job.type[loc]}</b>
                </div>
                <div className="jd-hero-meta-item">
                  <Icon name="globe" size={16} /> {job.exp[loc]}
                </div>
                <div className="jd-hero-meta-item">
                  <Icon name="spark" size={16} /> {job.level[loc]}
                </div>
              </div>
              <div className="jd-hero-tags">
                {job.tags.map((tag, i) => (
                  <span key={i}>{tag}</span>
                ))}
              </div>

              {/* Content sections */}
              <div style={{ marginTop: 48 }}>
                <div className="jd-section">
                  <div className="jd-section-head">
                    <div className="ico">
                      <Icon name="grid" size={18} />
                    </div>
                    <h2>{t.jobOverview}</h2>
                  </div>
                  <p>{job.overview[loc]}</p>
                </div>

                <div className="jd-section">
                  <div className="jd-section-head">
                    <div className="ico">
                      <Icon name="check" size={18} />
                    </div>
                    <h2>{t.responsibilities}</h2>
                  </div>
                  <ul>
                    {job.responsibilities[loc].map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="jd-section">
                  <div className="jd-section-head">
                    <div className="ico">
                      <Icon name="globe" size={18} />
                    </div>
                    <h2>{t.requirements}</h2>
                  </div>
                  <ul>
                    {job.requirements[loc].map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="jd-section benefits">
                  <div className="jd-section-head">
                    <div className="ico">
                      <Icon name="spark" size={18} />
                    </div>
                    <h2>{t.benefits}</h2>
                  </div>
                  <ul>
                    {job.benefits[loc].map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>

                <div className="jd-section">
                  <div className="jd-section-head">
                    <div className="ico">
                      <Icon name="mail" size={18} />
                    </div>
                    <h2>{t.howToApply}</h2>
                  </div>
                  <div className="jd-apply">
                    <h3>{t.applyNow}</h3>
                    <p>{t.applyText}</p>
                    <div className="jd-apply-row">
                      <a className="jd-btn jd-btn-p" href={mailto}>
                        <Icon name="mail" size={16} /> {t.sendCv}
                      </a>
                      <a className="jd-btn jd-btn-g" href="mailto:hr@longanhcorp.com">
                        hr@longanhcorp.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky info card */}
            <div className="jd-aside">
              <div className="jd-info-card">
                <div className="jd-info-head">
                  <div className="label">{t.salary}</div>
                  <div className="salary">{job.salary[loc]}</div>
                </div>
                <div className="jd-info-rows">
                  <InfoRow icon="box" label={t.department} value={deptLabel} />
                  <InfoRow icon="pin" label={t.location} value={job.loc[loc]} />
                  <InfoRow icon="check" label={t.type} value={job.type[loc]} />
                  <InfoRow
                    icon="spark"
                    label={`${t.level} · ${t.experience}`}
                    value={`${job.level[loc]} · ${job.exp[loc]}`}
                  />
                  <InfoRow icon="globe" label={t.headcount} value={job.headcount} />
                  <InfoRow icon="mail" label={t.deadline} value={fmtDate(job.deadline, loc)} />
                </div>
                <div className="jd-info-cta">
                  <a className="jd-btn jd-btn-p" href={mailto}>
                    <Icon name="mail" size={16} /> {t.applyNow}
                  </a>
                  <a className="jd-btn jd-btn-g" href="tel:+84942224499">
                    <Icon name="phone" size={16} /> {t.contactHr}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED JOBS */}
      <section className="jd-related">
        <div className="va-wrap">
          <div className="jd-related-head">
            <div className="num">— {t.relatedJobs}</div>
            <h2>{t.relatedJobs}</h2>
          </div>
          <div className="jd-related-grid">
            {related.map((r) => (
              <Link key={r.id} href={`/${loc}/career/${r.id}`} className="jd-related-card">
                <div className="dept">{r.deptLabel[loc]}</div>
                <h4>{r.title[loc]}</h4>
                <div className="meta">
                  <span>
                    <Icon name="pin" size={11} /> {r.loc[loc]}
                  </span>
                  <span>
                    <Icon name="check" size={11} /> {r.type[loc]}
                  </span>
                  <span>
                    <Icon name="spark" size={11} /> {r.salary[loc]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link
              className="jd-btn jd-btn-g"
              href={`/${loc}/career`}
              style={{ display: 'inline-flex' }}
            >
              <Icon name="arrow" size={16} /> {t.viewAll}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: 'box' | 'pin' | 'check' | 'spark' | 'globe' | 'mail';
  label: string;
  value: string;
}) {
  return (
    <div className="jd-info-row">
      <div className="ico">
        <Icon name={icon} size={15} />
      </div>
      <div>
        <div className="lbl">{label}</div>
        <div className="val">{value}</div>
      </div>
    </div>
  );
}
