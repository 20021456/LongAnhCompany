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
  if (el.dataset.counting) return;
  el.dataset.counting = '1';
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
    if (p < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = original;
      delete el.dataset.counting;
    }
  };
  requestAnimationFrame(tick);
}

export function ScrollFx() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('fx');
    if (reduced) return;

    // ── Scroll reveal (replays: .in toggles off once fully out of view,
    //    so the animation runs again on every re-entry from either side) ──
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) {
            el.classList.add('in');
            if (el.hasAttribute('data-countup')) animateCount(el);
            el.querySelectorAll<HTMLElement>('[data-countup]').forEach(animateCount);
          } else {
            el.classList.remove('in');
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 }
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
        }
      },
      { threshold: 0.4 }
    );
    cuEls.forEach((el) => ioCu.observe(el));

    // ── Header shadow/hide + parallax + scroll-linked grow ─────────
    const header = document.querySelector<HTMLElement>('.va-hd');
    const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    const growEls = Array.from(document.querySelectorAll<HTMLElement>('[data-grow]'));
    let raf = 0;
    let lastY = window.scrollY;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        if (header) {
          header.classList.toggle('is-scrolled', y > 8);
          // Hide on scroll down, reveal on scroll up
          if (y > 180 && y > lastY + 2) header.classList.add('is-hidden');
          else if (y < lastY - 2 || y <= 180) header.classList.remove('is-hidden');
        }
        lastY = y;
        const vh = window.innerHeight;
        for (const el of parallaxEls) {
          const f = parseFloat(el.dataset.parallax || '0.1');
          const r = el.getBoundingClientRect();
          const delta = (r.top + r.height / 2 - vh / 2) * -f;
          el.style.transform = `translate3d(0, ${delta.toFixed(1)}px, 0)`;
        }
        for (const el of growEls) {
          // 0 → framed inside the page gutter; 1 → full-bleed. Progress runs
          // while the element travels from 92% to ~37% of the viewport.
          const r = el.getBoundingClientRect();
          const p = Math.min(1, Math.max(0, (vh * 0.92 - r.top) / (vh * 0.55)));
          el.style.setProperty('--grow', p.toFixed(3));
        }
      });
    };
    // ── Flick-to-page (frame pages) ────────────────────────────────
    //   Gentle wheeling scrolls normally. Only a fast "flick" — several
    //   notches spun in quick succession — pages to the next [data-snap]
    //   frame with a custom ease. Detected by accumulating deltaY within
    //   a short window (reset on a pause or direction change) and gated
    //   by a mouse-like peak delta so trackpad drifting stays native.
    //   Only on frame pages (home: 6 frames; content pages: none).
    const snapEls = Array.from(document.querySelectorAll<HTMLElement>('[data-snap]'));
    const paged = window.matchMedia('(pointer: fine)').matches && snapEls.length >= 3;

    const FLICK = 200; // accumulated |deltaY| that counts as a flick
    const PEAK = 60; // a single event must reach this (mouse notch, not trackpad drift)
    const GAP = 200; // ms of quiet that resets the accumulator

    let animating = false;
    let cooldownUntil = 0;
    let accum = 0;
    let peak = 0;
    let lastT = 0;
    const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
    const glide = (toY: number) => {
      animating = true;
      const fromY = window.scrollY;
      const dist = toY - fromY;
      const dur = Math.min(760, Math.max(360, Math.abs(dist) * 0.5));
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        window.scrollTo({ top: fromY + dist * easeInOut(p), behavior: 'auto' });
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          animating = false;
          cooldownUntil = performance.now() + 140;
        }
      };
      requestAnimationFrame(step);
    };
    const adjacentStop = (dir: number, y: number): number | null => {
      const vh = window.innerHeight;
      const set = new Set<number>();
      for (const el of snapEls) {
        const r = el.getBoundingClientRect();
        const top = Math.max(0, Math.round(r.top + window.scrollY));
        set.add(top);
        if (r.height > vh + 40) set.add(Math.round(top + r.height - vh));
      }
      const stops = Array.from(set).sort((a, b) => a - b);
      if (dir > 0) return stops.find((s) => s > y + 8) ?? null;
      for (let i = stops.length - 1; i >= 0; i--) if (stops[i] < y - 8) return stops[i];
      return null;
    };
    const onWheel = (e: WheelEvent) => {
      if (!paged || e.ctrlKey || e.deltaY === 0) return;
      const now = performance.now();
      // Mid-glide (and its brief cooldown): swallow the flick's tail so it
      // doesn't stack, but let ordinary scrolling through otherwise.
      if (animating || now < cooldownUntil) {
        e.preventDefault();
        return;
      }
      // Accumulate within the burst; reset on a pause or a reversal
      if (now - lastT > GAP || (accum !== 0 && Math.sign(e.deltaY) !== Math.sign(accum))) {
        accum = 0;
        peak = 0;
      }
      lastT = now;
      accum += e.deltaY;
      peak = Math.max(peak, Math.abs(e.deltaY));
      if (Math.abs(accum) >= FLICK && peak >= PEAK) {
        const dir = accum > 0 ? 1 : -1;
        const target = adjacentStop(dir, window.scrollY);
        accum = 0;
        peak = 0;
        if (target != null) {
          e.preventDefault();
          glide(target);
        }
        // no frame that way → let the native scroll of this flick stand
      }
      // below threshold → do nothing, gentle native scrolling continues
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    if (paged) window.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      io.disconnect();
      ioCu.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('wheel', onWheel);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}
