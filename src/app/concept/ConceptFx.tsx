'use client';

import { useEffect } from 'react';

/**
 * Concept-page motion: ONE language only — elements tagged [data-cr]
 * fade-up ONCE when they enter the viewport, then stay. No replay,
 * no countup, no parallax, no scroll hijack. Honors reduced motion.
 */
export function ConceptFx() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-cr]'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    );
    // Above-the-fold content shows immediately; the rest reveals on scroll.
    for (const el of els) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
      else io.observe(el);
    }
    return () => io.disconnect();
  }, []);
  return null;
}
