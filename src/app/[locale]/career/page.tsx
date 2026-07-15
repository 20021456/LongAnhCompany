import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Icon } from '@/components/ui/Icon';
import { Words } from '@/components/public/Words';
import { PageHero } from '@/components/public/PageHero';
import { CareerJobsGrid } from '@/components/public/CareerJobsGrid';
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
      <PageHero
        eyebrow={S.hero.eyebrow}
        title={S.hero.title}
        sub={S.hero.sub}
        breadcrumb={[
          { label: loc === 'zh' ? '首页' : loc === 'en' ? 'Home' : 'Trang chủ', href: `/${loc}` },
          { label: C.nav[3] },
        ]}
        bgImage={S.hero.imageUrl || '/assets/nha-may-bot-sieu-min-3.webp'}
        stats={S.hero.stats}
        ctas={[
          { label: S.hero.ctaLabel, href: '#jobs', primary: true },
          {
            label:
              loc === 'zh'
                ? '直接联系'
                : loc === 'en'
                  ? 'Contact us directly'
                  : 'Liên hệ trực tiếp',
            href: `/${loc}/contact`,
          },
        ]}
      />

      {/* JOBS — gpt-taste grid */}
      <CareerJobsGrid locale={loc} jobs={jobs} email={S.cta.email || 'hr@longanhcorp.com'} />

      {/* PROCESS */}
      <section className="cr-section tight" style={{ background: 'var(--va-bg-alt)' }}>
        <div className="va-wrap">
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 56px' }}>
            <div className="va-eyebrow" data-reveal>
              {S.process.eyebrow}
            </div>
            <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', marginTop: 12 }} data-reveal="words">
              <Words text={S.process.title} step={100} />
            </h2>
          </div>
          <div className="cr-process-steps">
            {S.process.items.map((s, i) => (
              <div key={i} className="cr-process-step" data-reveal data-reveal-delay={String(i)}>
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
          <div className="cr-cta-banner" data-reveal="scale">
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
