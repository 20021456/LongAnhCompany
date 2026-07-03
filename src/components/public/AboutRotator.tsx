'use client';

import { useEffect, useState } from 'react';
import { SmartImage } from '@/components/ui/SmartImage';

interface Card {
  name: string;
  body: string;
  imageUrl: string;
}

interface Props {
  cards: Card[];
}

const ROTATE_MS = 8000;

/**
 * Full-screen "about" split (myhealthprac style): capability photo on the
 * left, warm-neutral text panel on the right. Cycles through the five
 * capability cards every few seconds — image crossfades, headline rises
 * through a line mask. Segmented progress bar doubles as navigation.
 */
export function AboutRotator({ cards }: Props) {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const n = cards.length;

  useEffect(() => {
    if (hovering || n < 2) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % n), ROTATE_MS);
    return () => clearTimeout(id);
  }, [active, hovering, n]);

  if (n === 0) return null;
  const c = cards[active];

  return (
    <div
      className="va-abrot"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="va-abrot-media">
        {cards.map((it, i) => (
          <div
            key={i}
            className={'va-abrot-slide ' + (i === active ? 'on' : '')}
            aria-hidden={i !== active}
          >
            <SmartImage src={it.imageUrl} alt={it.name} width={1400} height={1200} sizes="55vw" />
          </div>
        ))}
      </div>

      <div className="va-abrot-panel">
        <div className="va-abrot-story" key={active}>
          <div className="va-abrot-num">{String(active + 1).padStart(2, '0')}</div>
          <h3>
            <span className="ln">
              <span>{c.name}</span>
            </span>
          </h3>
          <p>{c.body}</p>
        </div>

        <div className="va-abrot-nav" role="tablist">
          {cards.map((it, i) => (
            <button
              key={i}
              className={i === active ? 'on' : ''}
              onClick={() => setActive(i)}
              aria-label={it.name}
              aria-current={i === active}
            >
              <span className="seg">
                {i === active && !hovering && n > 1 ? (
                  <span
                    className="fill"
                    key={`f-${active}`}
                    style={{ animationDuration: `${ROTATE_MS}ms` }}
                  />
                ) : null}
              </span>
              <span className="tag">{it.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
