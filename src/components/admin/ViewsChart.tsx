/**
 * Dashboard area chart — 30 day website views. Pure SVG, no JS library.
 * Stroke navy (var(--ad-primary)), gradient fill, 4 grid lines, dot every 5pts.
 * Ported verbatim from the LongAnhCorp prototype admin/index.html ViewsChart.
 */

export function ViewsChart({ data = DEFAULT_DATA }: { data?: number[] }) {
  const W = 720;
  const H = 200;
  const P = 24;
  const max = Math.max(...data);
  const xs = (i: number) => P + ((W - 2 * P) * i) / (data.length - 1);
  const ys = (v: number) => H - P - ((H - 2 * P) * v) / max;
  const path = data
    .map((v, i) => `${i ? 'L' : 'M'}${xs(i).toFixed(1)} ${ys(v).toFixed(1)}`)
    .join(' ');
  const area = `${path} L${xs(data.length - 1).toFixed(1)} ${H - P} L${xs(0).toFixed(1)} ${H - P}Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Lượt xem 30 ngày"
    >
      <defs>
        <linearGradient id="dash-g1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0F3D7A" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0F3D7A" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={P}
          x2={W - P}
          y1={P + (i * (H - 2 * P)) / 3}
          y2={P + (i * (H - 2 * P)) / 3}
          stroke="#F0F1F3"
          strokeWidth="1"
        />
      ))}
      <path d={area} fill="url(#dash-g1)" />
      <path
        d={path}
        stroke="#0F3D7A"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) =>
        i % 5 === 0 ? (
          <circle
            key={i}
            cx={xs(i)}
            cy={ys(v)}
            r="3"
            fill="#fff"
            stroke="#0F3D7A"
            strokeWidth="2"
          />
        ) : null,
      )}
    </svg>
  );
}

/** Fallback 30-day series (smooth-ish growth 320 → 1240). */
const DEFAULT_DATA = [
  320, 410, 380, 450, 520, 480, 510, 600, 560, 620, 700, 680, 720, 690, 760, 810, 770, 830, 880,
  900, 870, 940, 980, 950, 1010, 1080, 1040, 1120, 1180, 1240,
];
