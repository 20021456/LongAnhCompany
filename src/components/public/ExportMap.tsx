import type { Locale } from '@/lib/i18n/config';
import { Icon } from '@/components/ui/Icon';
import { VA_MAP_BG, VA_MAP_PARTNERS, VA_MAP_ORIGIN } from '@/data/world-map';
import type { ExportSection } from '@/lib/home-content';
import { WORLD_PINS_BY_SLUG, type WorldPin } from '@/lib/world-pins';

interface Props {
  locale: Locale;
  content: ExportSection;
}

const FEATURE_ICONS = ['spark', 'globe', 'ship', 'check'] as const;

export function ExportMap({ locale, content }: Props) {
  const ox = 803;
  const oy = 213; // Vietnam centroid

  /**
   * Resolve each market entry to a real geographic pin. Entries are stored as
   * slugs (e.g. "south-korea", "germany") that look up into WORLD_PINS. We
   * also accept legacy free-text values from older saves — those are matched
   * case-insensitively against any pin's localised name so the public site
   * keeps rendering until an admin migrates the JSON.
   */
  const pins: WorldPin[] = [];
  const seen = new Set<string>();
  for (const raw of content.markets ?? []) {
    if (!raw) continue;
    const trimmed = String(raw).trim();
    if (!trimmed) continue;
    let pin: WorldPin | undefined = WORLD_PINS_BY_SLUG[trimmed];
    if (!pin) {
      const needle = trimmed.toLowerCase();
      pin = Object.values(WORLD_PINS_BY_SLUG).find(
        (p) =>
          p.name.vi.toLowerCase() === needle ||
          p.name.en.toLowerCase() === needle ||
          p.name.zh === trimmed,
      );
    }
    if (pin && !seen.has(pin.slug)) {
      pins.push(pin);
      seen.add(pin.slug);
    }
  }

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

        {/* Animated routes — one per resolved pin, drawn from Vietnam */}
        <g className="va-routes">
          {pins.map((pin, i) => {
            const dx = pin.x - ox;
            const mx = (ox + pin.x) / 2;
            const bend = Math.max(36, Math.abs(dx) * 0.3);
            const my = Math.min(oy, pin.y) - bend;
            return (
              <path
                key={pin.slug}
                d={`M ${ox} ${oy} Q ${mx} ${my} ${pin.x} ${pin.y}`}
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

        {/* Destination markers — positioned at each pin's real coordinates */}
        <g className="va-dests">
          {pins.map((pin, i) => {
            const above = pin.labelAbove === true;
            const tx = above ? 0 : pin.x > 750 ? 10 : -10;
            const ty = above ? -10 : 3;
            const anchor = above ? 'middle' : pin.x > 750 ? 'start' : 'end';
            return (
              <g key={pin.slug} transform={`translate(${pin.x},${pin.y})`}>
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
                  {pin.name[locale]}
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
