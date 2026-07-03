'use client';

import { useEffect, useRef, useState } from 'react';

interface Item {
  year: string;
  title: string;
  body: string;
}

interface Props {
  eyebrow: string;
  title: string;
  items: Item[];
}

const ROTATE_MS = 6000;
/** Degrees between milestones along the wheel. */
const SPREAD = 26;
/** Wheel geometry inside the 1600×860 viewBox. */
const CX = 800;
const CY = 1640;
const R = 1400;

/**
 * Company timeline as a rotating wheel (myhealthprac "What If" style):
 * near-black full-width band, a huge hairline arc with milestone dots,
 * the active milestone at the apex under a circled year badge, and the
 * story text hanging from a thin vertical line. Auto-advances; dots and
 * the year list navigate.
 */
export function TimelineArc({ eyebrow, title, items }: Props) {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const n = items.length;

  useEffect(() => {
    if (hovering || n < 2) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % n), ROTATE_MS);
    return () => clearTimeout(id);
  }, [active, hovering, n]);

  // Scroll-linked spin: the wheel turns a few degrees with the page scroll
  // (the 1.1s transform transition turns it into a smooth trailing ease).
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const sec = sectionRef.current;
        if (!sec) return;
        const r = sec.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        sec.style.setProperty('--tl-scroll', `${((p - 0.5) * 26).toFixed(2)}deg`);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  if (n === 0) return null;
  const it = items[active];
  const apexY = CY - R; // 240

  return (
    <section
      className="va-tl"
      ref={sectionRef}
      data-snap
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="va-wrap va-tl-head">
        <div className="va-eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
      </div>

      <div className="va-tl-stage">
        <svg viewBox="0 0 1600 860" className="va-tl-svg" aria-hidden>
          {/* rotating wheel */}
          <g
            style={{
              transform: `rotate(calc(${-active * SPREAD}deg + var(--tl-scroll, 0deg)))`,
              transformOrigin: `${CX}px ${CY}px`,
              transition: 'transform 1.1s cubic-bezier(0.2, 0.65, 0.25, 1)',
            }}
          >
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.22)" />
            {items.map((m, i) => {
              const a = ((i * SPREAD - 90) * Math.PI) / 180;
              const x = CX + R * Math.cos(a);
              const y = CY + R * Math.sin(a);
              return (
                <g
                  key={i}
                  onClick={() => setActive(i)}
                  style={{ cursor: 'pointer', pointerEvents: 'all' }}
                >
                  <circle cx={x} cy={y} r={30} fill="transparent" />
                  <circle
                    cx={x}
                    cy={y}
                    r={i === active ? 9 : 5.5}
                    fill={i === active ? '#F08023' : 'rgba(255,255,255,0.55)'}
                    style={{ transition: 'fill .5s, r .5s' }}
                  />
                </g>
              );
            })}
          </g>
          {/* static apex furniture: year badge + hanging line */}
          <circle cx={CX} cy={apexY - 92} r={46} fill="none" stroke="rgba(255,255,255,0.35)" />
          <text
            x={CX}
            y={apexY - 92}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#fff"
            fontSize="24"
            fontWeight="500"
            style={{ letterSpacing: '0.02em' }}
          >
            {it.year}
          </text>
          <line
            x1={CX}
            y1={apexY + 16}
            x2={CX}
            y2={apexY + 190}
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1"
          />
        </svg>

        <div className="va-tl-center" key={active}>
          <h3>{it.title}</h3>
          <p>{it.body}</p>
        </div>
      </div>

      <div className="va-tl-years" role="tablist">
        {items.map((m, i) => (
          <button
            key={i}
            className={i === active ? 'on' : ''}
            onClick={() => setActive(i)}
            aria-current={i === active}
          >
            {m.year}
          </button>
        ))}
      </div>
    </section>
  );
}
