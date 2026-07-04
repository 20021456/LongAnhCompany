'use client';

import { useEffect, useRef, useState } from 'react';
import { SmartImage } from '@/components/ui/SmartImage';

interface Card {
  name: string;
  body: string;
  imageUrl: string;
}

interface Props {
  cards: Card[];
}

/**
 * Scroll-pinned capability deck. The split (photo left, warm text panel right)
 * pins to a full screen; scrolling through it steps the active card. Photo and
 * text simply crossfade to the active card (with a gentle Ken-Burns settle on
 * the photo) — nothing clips, so the title + body always sit fully in view when
 * you stop, on every screen size. The segmented nav doubles as a position
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

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const vh = window.innerHeight;
        const total = sec.offsetHeight - vh || 1;
        const p = Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / total));
        setActive(Math.round(p * (n - 1)));
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
            <div key={i} className={'va-abrot-slide' + (i === active ? ' on' : '')}>
              <SmartImage src={it.imageUrl} alt={it.name} width={1400} height={1200} sizes="55vw" />
            </div>
          ))}
        </div>

        <div className="va-abrot-panel">
          <div className="va-abrot-stack">
            {cards.map((it, i) => (
              <div key={i} className={'va-abrot-story' + (i === active ? ' on' : '')}>
                <div className="va-abrot-num">{String(i + 1).padStart(2, '0')}</div>
                <h3>{it.name}</h3>
                <p>{it.body}</p>
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
