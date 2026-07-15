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

/** Degrees between milestones along the wheel. */
const SPREAD = 24;
/** Scroll length allotted to each milestone step, in viewport heights. */
const PER_VH = 0.72;
/** Wheel geometry inside the 1600×860 viewBox. */
const CX = 800;
const CY = 1640;
const R = 1400;

/**
 * Company timeline as a scroll-pinned rotating wheel (myhealthprac "What
 * If" style). The section is tall; a sticky 100vh stage stays pinned while
 * you scroll through it, and scroll progress drives the wheel: it rotates
 * continuously and each milestone snaps to the apex in turn (year badge +
 * hanging story text). You scroll through every milestone before the page
 * moves on — no scroll hijacking, so it stays smooth and works on touch.
 * Dots and the year list jump to a milestone.
 */
export function TimelineArc({ eyebrow, title, items }: Props) {
  const n = items.length;
  const secRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [rot, setRot] = useState(0);

  useEffect(() => {
    if (n < 2) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const sec = secRef.current;
        if (!sec) return;
        const vh = window.innerHeight;
        const top = sec.getBoundingClientRect().top; // viewport-relative
        const total = sec.offsetHeight - vh || 1;
        const p = Math.min(1, Math.max(0, -top / total));
        const f = p * (n - 1);
        setActive(Math.round(f));
        setRot(reduced ? Math.round(f) * SPREAD : f * SPREAD);
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
  const it = items[active];
  const apexY = CY - R; // 240

  const goTo = (i: number) => {
    const sec = secRef.current;
    if (!sec) return;
    const total = sec.offsetHeight - window.innerHeight;
    const y = sec.offsetTop + (i / (n - 1)) * total;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section
      className="va-tl"
      ref={secRef}
      style={{ height: `${Math.max(1, n - 1) * PER_VH * 100 + 100}vh` }}
    >
      <div className="va-tl-sticky">
        <div className="va-wrap va-tl-head">
          <div className="va-eyebrow">{eyebrow}</div>
          <h2>{title}</h2>
        </div>

        <div className="va-tl-stage">
          <svg viewBox="0 0 1600 860" className="va-tl-svg" aria-hidden>
            <g style={{ transform: `rotate(${(-rot).toFixed(2)}deg)`, transformOrigin: `${CX}px ${CY}px` }}>
              <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.22)" />
              {items.map((m, i) => {
                const a = ((i * SPREAD - 90) * Math.PI) / 180;
                const x = CX + R * Math.cos(a);
                const y = CY + R * Math.sin(a);
                return (
                  <g key={i} onClick={() => goTo(i)} style={{ cursor: 'pointer', pointerEvents: 'all' }}>
                    <circle cx={x} cy={y} r={30} fill="transparent" />
                    <circle
                      cx={x}
                      cy={y}
                      r={i === active ? 9 : 5.5}
                      fill={i === active ? '#F08023' : 'rgba(255,255,255,0.5)'}
                      style={{ transition: 'fill .4s, r .4s' }}
                    />
                  </g>
                );
              })}
            </g>
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
              onClick={() => goTo(i)}
              aria-current={i === active}
            >
              {m.year}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
