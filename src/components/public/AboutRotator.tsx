'use client';

import { useEffect, useRef, useState } from 'react';
import { SmartImage } from '@/components/ui/SmartImage';

interface Card {
  name: string;
  body: string;
  imageUrl: string;
  facts?: { label: string; value: string }[];
}

interface Props {
  cards: Card[];
}

/**
 * Scroll-pinned capability deck. The split (photo left, warm text panel right)
 * pins to a full screen; scrolling steps through the cards. Each new PHOTO is
 * wiped in from the left edge rightward (scrubbed with scroll position), while
 * the TEXT crossfades to the active card — text never clips, so the title +
 * body always sit fully in view when you stop. On mobile / reduced-motion it
 * drops to a plain stacked list. The segmented nav doubles as a position
 * indicator and jumps to a card.
 */
export function AboutRotator({ cards }: Props) {
  const secRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const n = cards.length;

  useEffect(() => {
    if (n < 2) return;
    const sec = secRef.current;
    if (!sec) return;
    const slides = Array.from(sec.querySelectorAll<HTMLElement>('.va-abrot-slide'));

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const vh = window.innerHeight;
        const total = sec.offsetHeight - vh || 1;
        const p = Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / total));
        const f = p * (n - 1);
        // Photo: each card above the first is wiped in from the left edge
        // rightward as its slice of the scroll passes (clip the right side).
        for (let i = 1; i < n; i++) {
          const el = slides[i];
          if (!el) continue;
          const local = Math.min(1, Math.max(0, f - (i - 1)));
          el.style.clipPath = `inset(0 ${((1 - local) * 100).toFixed(2)}% 0 0)`;
        }
        // Text + nav crossfade to the nearest card.
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

  const jumpTo = (i: number) => {
    const sec = secRef.current;
    if (!sec || n < 2) return;
    const total = sec.offsetHeight - window.innerHeight;
    const y = window.scrollY + sec.getBoundingClientRect().top + (i / (n - 1)) * total;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  if (n === 0) return null;

  return (
    <div className="va-abrot-deck" ref={secRef} style={{ ['--deck-n' as string]: n }}>
      <div className="va-abrot">
        <div className="va-abrot-media">
          {cards.map((it, i) => (
            <div
              key={i}
              className="va-abrot-slide"
              style={{ zIndex: i + 1, ...(i > 0 ? { clipPath: 'inset(0 100% 0 0)' } : null) }}
            >
              <SmartImage src={it.imageUrl} alt={it.name} width={1400} height={1200} sizes="55vw" />
            </div>
          ))}
        </div>

        <div className="va-abrot-panel">
          <div className="va-abrot-stack">
            {cards.map((it, i) => (
              <div key={i} className={'va-abrot-story' + (i === active ? ' on' : '')}>
                <h3>{it.name}</h3>
                <p>{it.body}</p>
                {it.facts && it.facts.length > 0 ? (
                  <div className="va-abrot-facts">
                    {it.facts.map((f, j) => (
                      <div key={j} className="va-abrot-fact">
                        <span>{f.label}</span>
                        <b>{f.value}</b>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="va-abrot-nav" role="tablist">
            {cards.map((it, i) => (
              <button
                key={i}
                className={i === active ? 'on' : ''}
                onClick={() => jumpTo(i)}
                aria-label={it.name}
                aria-current={i === active}
              >
                <span className="seg" />
                <span className="tag">{it.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
