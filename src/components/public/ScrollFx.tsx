'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Site-wide scroll effects, mounted once in the locale layout.
 * Server components opt in via data attributes — no wrappers needed:
 *
 *   data-reveal            fade-up on enter (variants: "left" | "scale" | "fade")
 *   data-reveal-delay="2"  stagger step (1–6, ~90ms each)
 *   data-countup           animate the numeric part of the text when visible
 *   data-parallax="0.12"   subtle translateY tied to scroll position
 *
 * CSS lives in globals.css under "V2 redesign". Reveal styles only apply
 * under `html.fx` (set here on mount) so content stays visible without JS.
 * `prefers-reduced-motion` disables everything.
 */

function animateCount(el: HTMLElement) {
  const original = el.textContent ?? '';
  const m = original.match(/^([^\d]*)([\d.,]*\d)(.*)$/);
  if (!m) return;
  const [, prefix, num, suffix] = m;
  const grouped = num.includes(',');
  const decimals = num.includes('.') ? num.split('.')[1].length : 0;
  const target = parseFloat(num.replace(/,/g, ''));
  if (!isFinite(target)) return;
  const padded = /^0\d/.test(num) ? num.length : 0;

  const dur = 1400;
  const t0 = performance.now();
  const fmt = (v: number) => {
    let s = grouped
      ? Math.round(v).toLocaleString('en-US')
      : v.toFixed(decimals);
    if (padded) s = s.padStart(padded, '0');
    return prefix + s + suffix;
  };
  const tick = (t: number) => {
    const p = Math.min(1, (t - t0) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(target * eased);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = original;
  };
  requestAnimationFrame(tick);
}

export function ScrollFx() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('fx');
    if (reduced) return;

    // ── Scroll reveal ──────────────────────────────────────────────
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.in)'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add('in');
          if (el.hasAttribute('data-countup')) animateCount(el);
          el.querySelectorAll<HTMLElement>('[data-countup]').forEach(animateCount);
          io.unobserve(el);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    revealEls.forEach((el) => io.observe(el));

    // Standalone countups not inside a reveal
    const cuEls = Array.from(
      document.querySelectorAll<HTMLElement>('[data-countup]')
    ).filter((el) => !el.closest('[data-reveal]'));
    const ioCu = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          animateCount(e.target as HTMLElement);
          ioCu.unobserve(e.target);
        }
      },
      { threshold: 0.4 }
    );
    cuEls.forEach((el) => ioCu.observe(el));

    // ── Header shadow + parallax ───────────────────────────────────
    const header = document.querySelector<HTMLElement>('.va-hd');
    const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        header?.classList.toggle('is-scrolled', window.scrollY > 8);
        const vh = window.innerHeight;
        for (const el of parallaxEls) {
          const f = parseFloat(el.dataset.parallax || '0.1');
          const r = el.getBoundingClientRect();
          const delta = (r.top + r.height / 2 - vh / 2) * -f;
          el.style.transform = `translate3d(0, ${delta.toFixed(1)}px, 0)`;
        }
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      io.disconnect();
      ioCu.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}
