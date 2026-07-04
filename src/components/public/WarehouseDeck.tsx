'use client';

import { useEffect, useRef } from 'react';
import { SmartImage } from '@/components/ui/SmartImage';

interface Slide {
  src: string;
  title: string;
  sub: string;
}

interface Props {
  slides: Slide[];
}

/** Scroll length allotted to each pull, in viewport heights. */
const PER_VH = 85;

/**
 * Kettal-style scroll-driven image deck. The section pins to a full-screen
 * stage; as you scroll, the next photo is pulled down from the top over the
 * previous one (scrubbed clip-path + a slight settle of the image), each
 * slide carrying its own caption. Pure scroll-position work — no hijacking —
 * so it rides on the site's smooth-scroll engine and works on touch.
 */
export function WarehouseDeck({ slides }: Props) {
  const secRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const n = slides.length;

  useEffect(() => {
    if (n < 2) return;
    const sec = secRef.current;
    const sticky = stickyRef.current;
    if (!sec || !sticky) return;
    const slideEls = Array.from(sticky.querySelectorAll<HTMLElement>('.va-whdeck-slide'));
    const mediaEls = slideEls.map((el) => el.querySelector<HTMLElement>('.va-whdeck-media'));

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const vh = window.innerHeight;
        const total = sec.offsetHeight - vh || 1;
        const p = Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / total));
        const f = p * (n - 1);
        for (let i = 1; i < n; i++) {
          const el = slideEls[i];
          if (!el) continue;
          const local = Math.min(1, Math.max(0, f - (i - 1)));
          el.style.clipPath = `inset(0 0 ${((1 - local) * 100).toFixed(2)}% 0)`;
          const media = mediaEls[i];
          if (media) media.style.transform = `translate3d(0, ${((1 - local) * -8).toFixed(2)}%, 0)`;
        }
        if (countRef.current) {
          countRef.current.textContent = String(Math.round(f) + 1).padStart(2, '0');
        }
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
    <div
      className="va-whdeck"
      ref={secRef}
      style={{ height: n > 1 ? `${(n - 1) * PER_VH + 100}vh` : '100vh' }}
    >
      <div className="va-whdeck-sticky" ref={stickyRef}>
        {slides.map((s, i) => (
          <div
            key={i}
            className="va-whdeck-slide"
            style={i > 0 ? { clipPath: 'inset(0 0 100% 0)' } : undefined}
          >
            <div className="va-whdeck-media">
              <SmartImage src={s.src} alt={s.title} width={2000} height={1300} sizes="100vw" />
            </div>
            <div className="va-whdeck-shade" />
            <div className="va-whdeck-cap">
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <b>{s.title}</b>
              <span className="sub">{s.sub}</span>
            </div>
          </div>
        ))}
        <div className="va-whdeck-count">
          <span ref={countRef}>01</span> / {String(n).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}
