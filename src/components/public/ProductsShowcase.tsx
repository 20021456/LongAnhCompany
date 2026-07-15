'use client';

/**
 * Products page content, gpt-taste layout re-themed to the site's LIGHT theme.
 * This is the production /products body (approach A adopting B's design):
 * real SKU grid grouped by category, a pinned process section, a scrubbed
 * statement reveal and a CTA. No hero (the page keeps the shared PageHero
 * banner) and no mid-page stat strip. Motion is GSAP, motion-safe.
 */

import { useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { Locale } from '@/lib/i18n/config';
import type { ProductsProcessSection, ProductsCtaSection } from '@/lib/products-page-content';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Product {
  code: string;
  slug: string;
  cat: number;
  img: string;
  name: string;
  meta: string;
  desc: string;
  tags: string[];
}

interface Props {
  locale: Locale;
  products: Product[];
  cats: string[];
  /** CMS-driven process section (eyebrow, title, statement, 4 steps). */
  process: ProductsProcessSection;
  /** CMS-driven closing CTA band. */
  cta: ProductsCtaSection;
}

export function ProductsShowcase({ locale, products, cats, process, cta }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const loc = locale;

  const groups = cats
    .map((title, ci) => ({ ci, title, items: products.filter((p) => p.cat === ci) }))
    .filter((g) => g.items.length > 0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        ScrollTrigger.create({
          trigger: '.ps-desire',
          start: 'top top',
          end: 'bottom bottom',
          pin: '.ps-desire-title',
          pinSpacing: false,
        });
        gsap.utils.toArray<HTMLElement>('.ps-scale-img').forEach((el) => {
          gsap.fromTo(
            el,
            { scale: 1.1 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 40%', scrub: true },
            },
          );
        });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-ps-rise]').forEach((el) => {
          gsap.from(el, {
            y: 36,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%' },
          });
        });
        const words = gsap.utils.toArray<HTMLElement>('.ps-reveal-word');
        gsap.fromTo(
          words,
          { opacity: 0.15 },
          {
            opacity: 1,
            stagger: 0.5,
            ease: 'none',
            scrollTrigger: { trigger: '.ps-reveal', start: 'top 78%', end: 'bottom 62%', scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="ps w-full max-w-full overflow-x-hidden">
      {/* Products for sale, grouped by category */}
      <section id="products" className="mx-auto max-w-[1400px] px-6 py-24 md:py-32">
        {groups.map((g) => (
          <div key={g.ci} className="mb-24 last:mb-0">
            <div data-ps-rise className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display font-normal leading-[1.12] tracking-[-0.015em] text-navy-900 [font-size:clamp(1.9rem,3.2vw,3rem)]">
                {g.title}
              </h2>
              <span className="text-sm text-slate-400">{g.items.length} sản phẩm</span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((p) => (
                <Link
                  key={p.code}
                  href={`/${loc}/products/${p.slug}`}
                  data-ps-rise
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--va-line)] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_54px_-28px_rgba(15,61,122,0.35)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {p.img ? (
                      <img
                        src={p.img}
                        alt={p.name}
                        className="ps-scale-img h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-slate-100" />
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-navy-900 shadow-sm backdrop-blur">
                      {cats[p.cat]}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-xl font-medium leading-snug text-navy-900">{p.name}</h3>
                    {p.meta ? <p className="mt-1 text-sm font-medium text-brand-500">{p.meta}</p> : null}
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500">{p.desc}</p>
                    {p.tags.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {p.tags.slice(0, 3).map((t, j) => (
                          <span
                            key={j}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div>
                        <div className="text-[11px] uppercase tracking-wide text-slate-400">Độ trắng</div>
                        <div className="text-sm font-semibold text-navy-900">
                          {p.cat === 0 ? '≥ 98%' : '90-95%'}
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-brand-500 transition-transform duration-300 group-hover:translate-x-1">
                        Xem chi tiết →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Process — pinned title + scrolling steps */}
      <section className="ps-desire relative mx-auto grid max-w-[1400px] grid-cols-1 gap-12 border-t border-[var(--va-line)] px-6 py-24 md:grid-cols-2 md:py-32">
        <div className="ps-desire-title md:h-[100dvh] md:self-start md:pt-24">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-brand-500">
            {process.eyebrow}
          </p>
          <h2 className="mt-4 font-display font-normal leading-[1.12] tracking-[-0.015em] text-navy-900 [font-size:clamp(2rem,3.2vw,3.2rem)]">
            {process.title}
          </h2>
        </div>
        {/* Borderless step list (myhealthprac-style): number + text, air instead of boxes */}
        <div className="flex flex-col">
          {process.steps.map((s, i) => (
            <article
              key={s.k}
              className={
                'grid grid-cols-[56px_1fr] gap-6 py-10 md:py-12' + (i === 0 ? ' pt-2 md:pt-2' : '')
              }
            >
              <div className="pt-1 text-sm font-medium text-brand-500">{s.k}</div>
              <div>
                <h3 className="font-display text-2xl font-medium text-navy-900">{s.t}</h3>
                <p className="mt-2 max-w-md leading-relaxed text-slate-500">{s.d}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Scrubbed statement reveal */}
      <section className="ps-reveal mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
        <p className="font-display font-normal leading-[1.25] tracking-[-0.015em] text-navy-900 [font-size:clamp(1.6rem,3vw,2.8rem)]">
          {process.statement.split(' ').map((w, i) => (
            <span key={i} className="ps-reveal-word inline-block">
              {w}&nbsp;
            </span>
          ))}
        </p>
      </section>

      {/* CTA — same framed full-photo closing band as the other pages */}
      <div className="va-wrap">
        <div className="ab-cta" data-grow>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '.16em',
                textTransform: 'uppercase',
                color: '#F08023',
                marginBottom: 14,
              }}
            >
              {cta.kicker}
            </div>
            <h2>{cta.title}</h2>
            <p>{cta.sub}</p>
          </div>
          <div className="ab-cta-btns">
            <Link
              className="ab-btn ab-btn-p"
              href={cta.primaryHref.startsWith('/') ? `/${loc}${cta.primaryHref}` : cta.primaryHref}
            >
              {cta.primaryLabel} →
            </Link>
            {cta.phone ? (
              <a className="ab-btn ab-btn-g" href={`tel:${cta.phone.replace(/[^\d+]/g, '')}`}>
                {cta.phone}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
