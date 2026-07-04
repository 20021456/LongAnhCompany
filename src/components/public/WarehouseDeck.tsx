'use client';

import { useEffect, useRef, useState } from 'react';
import { SmartImage } from '@/components/ui/SmartImage';

interface Slide {
  src: string;
  title: string;
  sub: string;
}

interface Props {
  slides: Slide[];
}

/**
 * Kettal-style scroll-driven image deck. On desktop the section pins to a
 * full-screen stage and, as you scroll, the next PHOTO is pulled down over the
 * previous one (scrubbed clip-path — decoration only). The caption (number +
 * title + sub) never moves or clips: it simply crossfades to the active slide,
 * so text always sits fully in view when you stop. On mobile / reduced-motion
 * the effect drops to a plain stacked list (no pinning, nothing cut).
 */
export function WarehouseDeck({ slides }: Props) {
  const secRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const n = slides.length;

  useEffect(() => {
    if (n < 2) return;
    const sec = secRef.current;
    if (!sec) return;
    const mqDesktop = window.matchMedia('(min-width: 981px)');
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const imgs = () => Array.from(sec.querySelectorAll<HTMLElement>('.va-whdeck-media'));

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!mqDesktop.matches || mqReduce.matches) {
          imgs().forEach((m) => (m.style.clipPath = ''));
          return;
        }
        const vh = window.innerHeight;
        const total = sec.offsetHeight - vh || 1;
        const p = Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / total));
        const f = p * (n - 1);
        const ms = imgs();
        for (let i = 1; i < n; i++) {
          const local = Math.min(1, Math.max(0, f - (i - 1)));
          if (ms[i]) ms[i].style.clipPath = `inset(0 0 ${((1 - local) * 100).toFixed(2)}% 0)`;
        }
        if (ms[0]) ms[0].style.clipPath = 'inset(0 0 0 0)';
        setActive(Math.round(f));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n]);

  if (n === 0) return null;

  return (
    <div className="va-whdeck" ref={secRef} style={{ ['--deck-n' as string]: n }}>
      <div className="va-whdeck-sticky">
        {slides.map((s, i) => (
          <div
            key={i}
            className={'va-whdeck-slide' + (i === active ? ' on' : '')}
            style={{ zIndex: i + 1 }}
          >
            <div className="va-whdeck-media">
              <SmartImage src={s.src} alt={s.title} width={2000} height={1300} sizes="100vw" />
              <div className="va-whdeck-shade" />
            </div>
            <div className="va-whdeck-cap">
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <b>{s.title}</b>
              <span className="sub">{s.sub}</span>
            </div>
          </div>
        ))}
        <div className="va-whdeck-count">
          <span>{String(active + 1).padStart(2, '0')}</span> / {String(n).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}
