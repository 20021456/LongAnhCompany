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
    // ── Wheel-driven paging (frame pages) ──────────────────────────
    //   Each wheel flick glides to the next [data-snap] frame with a
    //   custom ease; momentum is swallowed so one gesture = one frame.
    //   Only enabled on pages built out of full-height frames (home has
    //   6; content pages have none → native scroll). Tall frames get an
    //   extra mid-stop so their lower half stays reachable. Mouse only.
    const snapEls = Array.from(document.querySelectorAll<HTMLElement>('[data-snap]'));
    const paged = window.matchMedia('(pointer: fine)').matches && snapEls.length >= 3;

    let animating = false;
    let cooldownUntil = 0;
    const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
    const glide = (toY: number) => {
      animating = true;
      const fromY = window.scrollY;
      const dist = toY - fromY;
      const dur = Math.min(820, Math.max(380, Math.abs(dist) * 0.55));
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        window.scrollTo({ top: fromY + dist * easeInOut(p), behavior: 'auto' });
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          animating = false;
          cooldownUntil = performance.now() + 90;
        }
      };
      requestAnimationFrame(step);
    };
    const buildStops = () => {
      const vh = window.innerHeight;
      const set = new Set<number>();
      for (const el of snapEls) {
        const r = el.getBoundingClientRect();
        const top = Math.max(0, Math.round(r.top + window.scrollY));
        set.add(top);
        if (r.height > vh + 40) set.add(Math.round(top + r.height - vh));
      }
      return Array.from(set).sort((a, b) => a - b);
    };
    const onWheel = (e: WheelEvent) => {
      if (!paged || e.ctrlKey) return;
      const dir = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0;
      if (dir === 0) return;
      // Swallow the momentum tail of the gesture that's mid-flight
      if (animating || performance.now() < cooldownUntil) {
        e.preventDefault();
        cooldownUntil = Math.max(cooldownUntil, performance.now() + 90);
        return;
      }
      const y = window.scrollY;
      const vh = window.innerHeight;
      const stops = buildStops();
      let nearest = stops[0];
      let nd = Infinity;
      for (const s of stops) {
        if (Math.abs(s - y) < Math.abs(nd)) {
          nd = s - y;
          nearest = s;
        }
      }
      // Far from any frame boundary (e.g. footer) → let native scroll run
      if (nearest == null || Math.abs(nd) > vh * 0.5) return;
      // Not settled on the frame yet → glide onto it first
      if (Math.abs(nd) > 4) {
        e.preventDefault();
        glide(nearest);
        return;
      }
      const idx = stops.indexOf(nearest);
      const nextIdx = idx + dir;
      if (nextIdx >= 0 && nextIdx < stops.length) {
        e.preventDefault();
        glide(stops[nextIdx]);
      }
      // else: edge frame → allow native scroll to footer / top
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
