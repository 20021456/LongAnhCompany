'use client';

import { useEffect, useRef, useState } from 'react';
import { SmartImage } from '@/components/ui/SmartImage';

interface Slide {
  src: string;
  title: string;
  sub: string;
}

interface Props {
  /** Small caps label above the heading row (e.g. "Kho bãi & Logistics"). */
  eyebrow: string;
  /** Section statement shown small on the top row's right side. */
  note?: string;
  slides: Slide[];
}

/**
 * Kettal-collections layout: the caption lives ABOVE the photo — small
 * eyebrow row, then a big item title with its description underneath —
 * and the photo fills nearly the full screen width in a framed panel.
 * On desktop the block pins while scrolling and each step swaps TEXT +
 * PHOTO together (photo wipes in, text crossfades). Mobile /
 * reduced-motion: a plain stacked list, nothing pinned or clipped.
 */
export function WarehouseDeck({ eyebrow, note, slides }: Props) {
  const secRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const n = slides.length;

  useEffect(() => {
    if (n < 2) return;
    const sec = secRef.current;
    if (!sec) return;
    const mqDesktop = window.matchMedia('(min-width: 981px)');
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const imgs = () => Array.from(sec.querySelectorAll<HTMLElement>('.va-whk-media'));

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
        // Each next photo wipes in from the right edge (Kettal-style pull).
        for (let i = 1; i < n; i++) {
          const local = Math.min(1, Math.max(0, f - (i - 1)));
          if (ms[i]) ms[i].style.clipPath = `inset(0 ${((1 - local) * 100).toFixed(2)}% 0 0)`;
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
    <div className="va-whk" ref={secRef} style={{ ['--deck-n' as string]: n }}>
      <div className="va-whk-sticky">
        <div className="va-whk-in">
          {/* Top row — eyebrow left, quiet section statement right */}
          <div className="va-whk-top">
            <span className="va-whk-eyebrow">{eyebrow}</span>
            {note ? <span className="va-whk-note">{note}</span> : null}
          </div>

          {/* Heading — big item title, its description right below */}
          <div className="va-whk-head">
            <div className="va-whk-titles">
              {slides.map((s, i) => (
                <h3 key={i} className={'va-whk-title' + (i === active ? ' on' : '')}>
                  {s.title}
                </h3>
              ))}
            </div>
            <div className="va-whk-subs">
              {slides.map((s, i) => (
                <p key={i} className={'va-whk-sub' + (i === active ? ' on' : '')}>
                  {s.sub}
                </p>
              ))}
            </div>
          </div>

          {/* Near-fullscreen framed photo — swaps with the text while scrolling */}
          <div className="va-whk-frame">
            {slides.map((s, i) => (
              <div key={i} className="va-whk-media" style={{ zIndex: i + 1 }}>
                <SmartImage src={s.src} alt={s.title} width={2000} height={1100} sizes="96vw" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile / reduced-motion: plain stacked list with captions above */}
      <div className="va-whk-stack va-wrap">
        <div className="va-whk-top">
          <span className="va-whk-eyebrow">{eyebrow}</span>
        </div>
        {slides.map((s, i) => (
          <figure key={i} className="va-whk-item">
            <figcaption>
              <b>{s.title}</b>
              <span>{s.sub}</span>
            </figcaption>
            <div className="va-whk-item-img">
              <SmartImage src={s.src} alt={s.title} width={1200} height={800} sizes="94vw" />
            </div>
          </figure>
        ))}
      </div>
    </div>
  );
}
