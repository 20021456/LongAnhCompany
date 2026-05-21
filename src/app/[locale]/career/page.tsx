import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Icon, type IconName } from '@/components/ui/Icon';
import { getJobs, getCareersPageSections } from '@/lib/queries';
import { buildPageMetadata } from '@/lib/page-metadata';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildPageMetadata({
    pageKey: 'career',
    locale: locale as Locale,
    pathStripped: '/career',
    fallbackTitle: 'Tuyển dụng · KS Long Anh',
    fallbackDescription:
      'Gia nhập đội ngũ Long Anh — môi trường chuyên nghiệp, năng động, minh bạch. Cơ hội phát triển cùng doanh nghiệp khoáng sản hàng đầu Bắc Trung Bộ.',
    fallbackOgImage: '/assets/nha-may-bot-sieu-min-3.webp',
  });
}

export default async function CareerPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const loc = locale as Locale;
  const C = COPY[loc];

  // Job listings from the catalogue, page copy from page_sections.
  const [jobMap, S] = await Promise.all([getJobs(), getCareersPageSections(loc)]);
  const allJobs = Object.values(jobMap).map((j) => ({
    id: j.id,
    dept: j.deptLabel[loc],
    title: j.title[loc],
    loc: j.loc[loc],
    type: j.type[loc],
    exp: j.exp[loc],
    tags: j.tags,
  }));
  const jobs = S.jobs.jobSlugs.length
    ? (S.jobs.jobSlugs
        .map((slug) => allJobs.find((j) => j.id === slug))
        .filter(Boolean) as typeof allJobs)
    : allJobs;

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
            {S.hero.eyebrow}
          </div>
          <h1>{S.hero.title}</h1>
          <p>{S.hero.sub}</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a className="va-btn va-btn-p" href="#jobs">
              {S.hero.ctaLabel} <Icon name="arrow" size={15} />
            </a>
            <Link className="cr-btn-w" href={`/${loc}/contact`}>
              {loc === 'zh'
                ? '直接联系'
                : loc === 'en'
                  ? 'Contact us directly'
                  : 'Liên hệ trực tiếp'}
            </Link>
          </div>
          {S.hero.stats.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${S.hero.stats.length}, 1fr)`,
                gap: 32,
                marginTop: 36,
              }}
            >
              {S.hero.stats.map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.7 }}>{s.label}</div>
                </div>
              ))}
            </div>
          ) : null}
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
              <h2>{S.jobs.title}</h2>
            </div>
            <p>{S.jobs.sub}</p>
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
              <div className="va-eyebrow">{S.values.eyebrow}</div>
              <h2>{S.values.title}</h2>
            </div>
            <p>{S.values.sub}</p>
          </div>
          <div className="cr-values-grid">
            {S.values.items.map((v, i) => (
              <div key={i} className="cr-value-card">
                <div className="cr-value-icon">
                  <Icon name={(v.icon || 'check') as IconName} size={22} />
                </div>
                <h3>{v.name}</h3>
                <p>{v.body}</p>
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
              <div className="va-eyebrow">{S.benefits.eyebrow}</div>
              <h2>{S.benefits.title}</h2>
            </div>
          </div>
          <div className="cr-benefits-grid">
            {S.benefits.items.map((b, i) => (
              <div key={i} className="cr-benefit">
                <div className="cr-benefit-num">{String(i + 1).padStart(2, '0')}</div>
                <h4>{b.label}</h4>
                <p>{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="cr-section tight" style={{ background: 'var(--va-bg-alt)' }}>
        <div className="va-wrap">
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 56px' }}>
            <div className="va-eyebrow">{S.process.eyebrow}</div>
            <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', marginTop: 12 }}>{S.process.title}</h2>
          </div>
          <div className="cr-process-steps">
            {S.process.items.map((s, i) => (
              <div key={i} className="cr-process-step">
                <div className="cr-step-num">{String(i + 1).padStart(2, '0')}</div>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
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
              <h2>{S.cta.title}</h2>
              <p>{S.cta.sub}</p>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                alignItems: 'flex-start',
              }}
            >
              <a className="va-btn va-btn-p" href={`mailto:${S.cta.email || 'hr@longanhcorp.com'}`}>
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
