import type { Locale } from '@/lib/i18n/config';
import { Icon } from '@/components/ui/Icon';
import { VA_MAP_BG, VA_MAP_PARTNERS, VA_MAP_ORIGIN } from '@/data/world-map';
import type { ExportSection } from '@/lib/home-content';

interface Props {
  locale: Locale;
  content: ExportSection;
}

const dests = [
  { x: 855, y: 152, key: 0 }, // South Korea
  { x: 883, y: 154, key: 1 }, // Japan
  { x: 717, y: 197, key: 2 }, // India
  { x: 750, y: 189, key: 3 }, // Bangladesh
  { x: 828, y: 261, key: 4 }, // Indonesia
  { x: 653, y: 183, key: 5 }, // UAE
  { x: 580, y: 178, key: 6 }, // Egypt
  { x: 597, y: 144, key: 7 }, // Türkiye
];

const FEATURE_ICONS = ['spark', 'globe', 'ship', 'check'] as const;

export function ExportMap({ locale, content }: Props) {
  const ox = 803;
  const oy = 213; // Vietnam centroid

  return (
    <div className="va-export-map">
      {/* World map background */}
      <svg viewBox="0 0 1000 500" className="va-world-bg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="va-mapdots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="7" cy="7" r="0.6" fill="rgba(255,255,255,0.07)" />
          </pattern>
          <radialGradient id="va-origin-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F08023" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#F08023" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1000" height="500" fill="url(#va-mapdots)" />

        <path
          d={VA_MAP_BG}
          fill="rgba(91,155,213,0.18)"
          stroke="rgba(140,190,230,0.42)"
          strokeWidth="0.5"
          strokeLinejoin="round"
          fillRule="evenodd"
          className="va-map-land"
        />
        <path
          d={VA_MAP_PARTNERS}
          fill="rgba(91,155,213,0.62)"
          stroke="rgba(170,210,240,0.85)"
          strokeWidth="0.8"
          strokeLinejoin="round"
          fillRule="evenodd"
          className="va-map-partners"
        />
        <path
          d={VA_MAP_ORIGIN}
          fill="rgba(240,128,35,0.72)"
          stroke="rgba(255,176,112,0.95)"
          strokeWidth="1"
          strokeLinejoin="round"
          fillRule="evenodd"
          className="va-map-origin"
        />

        {/* Animated routes */}
        <g className="va-routes">
          {dests.map((d, i) => {
            const dx = d.x - ox;
            const mx = (ox + d.x) / 2;
            const bend = Math.max(36, Math.abs(dx) * 0.3);
            const my = Math.min(oy, d.y) - bend;
            return (
              <path
                key={i}
                d={`M ${ox} ${oy} Q ${mx} ${my} ${d.x} ${d.y}`}
                fill="none"
                stroke="#F08023"
                strokeWidth="1.4"
                strokeDasharray="2 6"
                strokeLinecap="round"
                className="va-route"
                style={{ animationDelay: `${i * 0.25}s` }}
              />
            );
          })}
        </g>

        {/* Destination markers */}
        <g className="va-dests">
          {dests.map((d, i) => {
            const above = d.key === 0 || d.key === 3;
            const tx = above ? 0 : d.x > 750 ? 10 : -10;
            const ty = above ? -10 : 3;
            const anchor = above ? 'middle' : d.x > 750 ? 'start' : 'end';
            return (
              <g key={i} transform={`translate(${d.x},${d.y})`}>
                <circle r="8" fill="#5B9BD5" opacity="0.18">
                  <animate
                    attributeName="r"
                    values="6;14;6"
                    dur="2.5s"
                    begin={`${0.3 + i * 0.2}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.4;0;0.4"
                    dur="2.5s"
                    begin={`${0.3 + i * 0.2}s`}
                    repeatCount="indefinite"
                  />
                </circle>
                <circle r="3.5" fill="#5B9BD5" stroke="#fff" strokeWidth="1" />
                <text
                  x={tx}
                  y={ty}
                  textAnchor={anchor}
                  fontSize="11"
                  fontWeight="500"
                  fill="rgba(255,255,255,0.9)"
                  style={{ paintOrder: 'stroke', stroke: 'rgba(10,43,87,0.9)', strokeWidth: 3 }}
                >
                  {content.markets[d.key] ?? ''}
                </text>
              </g>
            );
          })}
        </g>

        {/* Origin: Vietnam */}
        <g transform={`translate(${ox},${oy})`}>
          <circle r="32" fill="url(#va-origin-glow)" />
          <circle r="6" fill="#F08023" opacity="0.4">
            <animate attributeName="r" values="6;28;6" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle r="6" fill="#F08023" opacity="0.4">
            <animate
              attributeName="r"
              values="6;28;6"
              dur="2.4s"
              begin="1.2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;0;0.6"
              dur="2.4s"
              begin="1.2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="7" fill="#F08023" stroke="#fff" strokeWidth="1.5" />
          <text
            y="-14"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#F08023"
            style={{
              paintOrder: 'stroke',
              stroke: 'rgba(10,43,87,0.95)',
              strokeWidth: 3,
              letterSpacing: '1.5px',
            }}
          >
            {locale === 'zh'
              ? '越南 · 龙英'
              : locale === 'en'
                ? 'VIETNAM · LONG ANH'
                : 'VIỆT NAM · LONG ANH'}
          </text>
        </g>
      </svg>

      {/* Overlay glass card */}
      <div className="va-export-overlay">
        <div className="va-export-info">
          <div className="va-eyebrow">{content.eyebrow}</div>
          <h2>{content.title}</h2>
          <p>{content.sub}</p>
          <div className="va-export-features">
            {content.features.map((f, i) => (
              <div key={i} className="va-export-feature">
                <div className="va-ef-i">
                  <Icon name={FEATURE_ICONS[i] ?? 'check'} size={16} />
                </div>
                <div>
                  <b>{f.title}</b>
                  <span>{f.body}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="va-map-caption">{content.mapCaption}</div>
    </div>
  );
}
