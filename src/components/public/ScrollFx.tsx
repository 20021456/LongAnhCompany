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
    // ── Smooth inertia scroll + flick-to-page ──────────────────────
    //   Lenis-style smoothing: the wheel feeds a `target` scroll position
    //   and each frame the real scroll eases toward it (lerp), giving the
    //   weighty, gliding feel of premium sites. On frame pages a fast
    //   flick (several notches spun quickly) retargets to the next
    //   [data-snap] frame instead. Mouse only; native for touch/keyboard/
    //   scrollbar (target re-syncs whenever the engine is idle).
    const fine = window.matchMedia('(pointer: fine)').matches;
    const snapEls = Array.from(document.querySelectorAll<HTMLElement>('[data-snap]'));
    const paged = fine && snapEls.length >= 3;

    // Sections that scrub internally (e.g. the pinned capability deck): while
    // the gesture is inside their scroll span, a hard flick must NOT page to
    // the next frame — otherwise a fast spin teleports past all the cards.
    // Inside these, we let the wheel scrub naturally.
    const noFlickEls = Array.from(document.querySelectorAll<HTMLElement>('[data-noflick]'));
    const inNoFlick = (y: number) => {
      const vh = window.innerHeight;
      return noFlickEls.some((el) => {
        const top = el.getBoundingClientRect().top + window.scrollY;
        return y >= top - 4 && y <= top + el.offsetHeight - vh + 4;
      });
    };

    const LERP = 0.11; // 0..1 — lower = heavier glide
    const FLICK = 380; // accumulated |deltaY| that counts as a flick (a real hard spin)
    const PEAK = 90; // a single event must reach this (mouse notch, not trackpad drift)
    const GAP = 180; // ms of wheel silence that ends a gesture
    const BURST = 280; // a flick's events all land within this window

    let target = window.scrollY;
    let current = window.scrollY;
    let smoothing = false;
    let accum = 0;
    let peak = 0;
    let lastT = 0;
    let burstStart = 0;
    let burstFromY = 0;
    let flickTimer = 0;

    const maxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const loop = () => {
      const diff = target - current;
      if (Math.abs(diff) < 0.4) {
        current = target;
        window.scrollTo({ top: current, behavior: 'instant' as ScrollBehavior });
        smoothing = false;
        return;
      }
      current += diff * LERP;
      window.scrollTo({ top: current, behavior: 'instant' as ScrollBehavior });
      requestAnimationFrame(loop);
    };
    const startLoop = () => {
      if (!smoothing) {
        smoothing = true;
        requestAnimationFrame(loop);
      }
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
      if (!fine || e.ctrlKey || e.deltaY === 0) return;
      e.preventDefault();
      const now = performance.now();
      // Re-sync to the real position if the engine was idle (scrollbar/keys)
      if (!smoothing) {
        current = window.scrollY;
        target = window.scrollY;
      }
      // Gesture bookkeeping (reset on a pause or a reversal)
      if (now - lastT > GAP || (accum !== 0 && Math.sign(e.deltaY) !== Math.sign(accum))) {
        accum = 0;
        peak = 0;
      }
      if (accum === 0) {
        burstStart = now;
        burstFromY = target;
      }
      lastT = now;
      accum += e.deltaY;
      peak = Math.max(peak, Math.abs(e.deltaY));

      // Every event scrolls smoothly — input is never frozen, so continuous
      // rolling stays perfectly fluid.
      target = Math.max(0, Math.min(maxScroll(), target + e.deltaY));
      startLoop();

      // Frame pages: decide about paging only once the wheel goes quiet.
      // A short, strong burst (a flick) glides on to the next frame; a
      // sustained roll never pages.
      if (paged) {
        window.clearTimeout(flickTimer);
        flickTimer = window.setTimeout(() => {
          const quickBurst = lastT - burstStart <= BURST;
          if (quickBurst && Math.abs(accum) >= FLICK && peak >= PEAK && !inNoFlick(burstFromY)) {
            const dir = accum > 0 ? 1 : -1;
            const stop = adjacentStop(dir, burstFromY);
            // Never pull noticeably backwards against the flick direction
            if (stop != null && (stop - target) * dir > -window.innerHeight * 0.2) {
              target = stop;
              startLoop();
            }
          }
          accum = 0;
          peak = 0;
        }, GAP);
      }
    };
    const onScrollSync = () => {
      onScroll();
      if (!smoothing) {
        current = window.scrollY;
        target = window.scrollY;
      }
    };

    onScroll();
    window.addEventListener('scroll', onScrollSync, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    if (fine) window.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      io.disconnect();
      ioCu.disconnect();
      window.removeEventListener('scroll', onScrollSync);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.clearTimeout(flickTimer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}
