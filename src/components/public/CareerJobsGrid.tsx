'use client';

/**
 * gpt-taste job listing grid (light) — the one part of the career concept that
 * is kept. Real jobs, hover physics + scroll-rise via GSAP. Everything else on
 * the career-concept page reuses the original /career layout.
 */

import { useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { Locale } from '@/lib/i18n/config';
import { Icon } from '@/components/ui/Icon';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Job {
  id: string;
  dept: string;
  title: string;
  loc: string;
  type: string;
  exp: string;
  tags: string[];
}

interface Props {
  locale: Locale;
  jobs: Job[];
  email: string;
}

export function CareerJobsGrid({ locale, jobs, email }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const loc = locale;
  const t = (vi: string, en: string, zh: string) => (loc === 'zh' ? zh : loc === 'en' ? en : vi);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-cx-rise]').forEach((el) => {
          gsap.from(el, {
            y: 34,
            opacity: 0,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%' },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="cx font-display w-full max-w-full overflow-x-hidden">
      <section id="jobs" className="mx-auto max-w-[1400px] px-6 py-24 md:py-32">
        <div data-cx-rise className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-semibold leading-[1.05] tracking-tight text-navy-900 [font-size:clamp(1.9rem,3.2vw,3rem)]">
            {t('Vị trí đang tuyển', 'Open positions', '招聘职位')}
          </h2>
          <span className="text-sm text-slate-400">
            {jobs.length} {t('vị trí', 'roles', '个职位')}
          </span>
        </div>

        {jobs.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {jobs.map((j) => (
              <Link
                key={j.id}
                href={`/${loc}/career/${j.id}`}
                data-cx-rise
                className="group flex flex-col justify-between rounded-2xl border border-[var(--va-line)] bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_54px_-28px_rgba(15,61,122,0.35)]"
              >
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-brand-500">
                    {j.dept}
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold leading-snug text-navy-900">{j.title}</h3>
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="pin" size={14} /> {j.loc}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="check" size={14} /> {j.type}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="spark" size={14} /> {j.exp}
                    </span>
                  </div>
                  {j.tags.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {j.tags.slice(0, 4).map((tag, i) => (
                        <span key={i} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-500 transition-transform duration-300 group-hover:translate-x-1">
                  {t('Ứng tuyển ngay', 'Apply now', '立即申请')}
                  <Icon name="arrow" size={15} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div
            data-cx-rise
            className="rounded-2xl border border-dashed border-[var(--va-line)] bg-[var(--va-bg-alt)] px-8 py-16 text-center"
          >
            <h3 className="text-xl font-semibold text-navy-900">
              {t('Hiện chưa có vị trí mở', 'No open roles right now', '暂无空缺职位')}
            </h3>
            <p className="mx-auto mt-3 max-w-md text-slate-500">
              {t(
                'Gửi CV để chúng tôi liên hệ khi có vị trí phù hợp.',
                'Send your CV and we will reach out when a role opens.',
                '发送简历,有合适职位时我们会联系您。',
              )}
            </p>
            <a
              href={`mailto:${email}`}
              className="mt-6 inline-block rounded-full bg-brand-500 px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              {t('Gửi CV qua Email', 'Send CV by email', '通过邮件发送简历')}
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
