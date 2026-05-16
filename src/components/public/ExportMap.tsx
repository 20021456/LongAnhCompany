import type { Locale } from '@/lib/i18n/config';
import { Icon } from '@/components/ui/Icon';
import { VA_MAP_BG, VA_MAP_PARTNERS, VA_MAP_ORIGIN } from '@/data/world-map';
import type { ExportSection } from '@/lib/home-content';
import { WORLD_PINS_BY_SLUG, type WorldPin } from '@/lib/world-pins';
import { shapeForPin } from '@/lib/map-shapes';

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

  /**
   * Per-pin country/region SVG paths + the centroid of the matched shape.
   * The centroid (not the hand-picked seed coordinate) is where the dot,
   * halo and label get drawn so they sit at the country's visual centre.
   */
  type Placed = {
    pin: WorldPin;
    path: string;
    cx: number;
    cy: number;
    /** Label offset chosen by the collision resolver. */
    tx: number;
    ty: number;
    anchor: 'start' | 'middle' | 'end';
  };
  const placed: Placed[] = [];
  const labelBoxes: { x1: number; y1: number; x2: number; y2: number }[] = [];

  /** Approx label dimensions in viewBox units (font-size 11 ≈ 6 wide / 13 tall). */
  function labelSize(text: string) {
    return { w: text.length * 6, h: 13 };
  }

  /** 8 candidate positions tried in order of preference. */
  const CANDIDATES: { tx: number; ty: number; anchor: 'start' | 'middle' | 'end' }[] = [
    { tx: 12, ty: 4, anchor: 'start' }, // right
    { tx: -12, ty: 4, anchor: 'end' }, // left
    { tx: 0, ty: -12, anchor: 'middle' }, // above
    { tx: 0, ty: 18, anchor: 'middle' }, // below
    { tx: 14, ty: -10, anchor: 'start' }, // top-right
    { tx: -14, ty: -10, anchor: 'end' }, // top-left
    { tx: 14, ty: 18, anchor: 'start' }, // bottom-right
    { tx: -14, ty: 18, anchor: 'end' }, // bottom-left
  ];

  function rectsOverlap(
    a: { x1: number; y1: number; x2: number; y2: number },
    b: { x1: number; y1: number; x2: number; y2: number },
  ) {
    return !(a.x2 < b.x1 || b.x2 < a.x1 || a.y2 < b.y1 || b.y2 < a.y1);
  }

  for (const pin of pins) {
    const shape = shapeForPin(pin);
    if (!shape) continue;
    const [cx, cy] = shape.centroid;
    const label = pin.name[locale];
    const { w, h } = labelSize(label);

    let chosen = CANDIDATES[0];
    let chosenBox = null as null | { x1: number; y1: number; x2: number; y2: number };
    for (const c of CANDIDATES) {
      const lx = cx + c.tx;
      const ly = cy + c.ty;
      // Anchor adjusts the box's left/right.
      const x1 = c.anchor === 'start' ? lx : c.anchor === 'end' ? lx - w : lx - w / 2;
      const box = { x1, y1: ly - h, x2: x1 + w, y2: ly + 2 };
      const collides = labelBoxes.some((b) => rectsOverlap(b, box));
      if (!collides) {
        chosen = c;
        chosenBox = box;
        break;
      }
    }
    if (!chosenBox) {
      // All candidates collide — fall back to the first and accept overlap.
      const lx = cx + chosen.tx;
      const ly = cy + chosen.ty;
      const x1 = chosen.anchor === 'start' ? lx : chosen.anchor === 'end' ? lx - w : lx - w / 2;
      chosenBox = { x1, y1: ly - h, x2: x1 + w, y2: ly + 2 };
    }
    labelBoxes.push(chosenBox);
    placed.push({
      pin,
      path: shape.path,
      cx,
      cy,
      tx: chosen.tx,
      ty: chosen.ty,
      anchor: chosen.anchor,
    });
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
          {/*
           * Two-layer cyan glow used to light up every destination country.
           *
           * The static map already has a brighter "partner countries" path
           * (VA_MAP_PARTNERS) that fills the original 5–8 markets in solid
           * blue; dynamic pins can't paint country shapes (we have no per-
           * country path data), so we stack a tight bright core on top of a
           * large soft halo so every pin reads as "highlighted area" with
           * roughly the same visual weight as the partner fill.
           */}
          <radialGradient id="va-dest-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7BB3E6" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#5B9BD5" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#5B9BD5" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#5B9BD5" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="va-dest-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#AED4F2" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#5B9BD5" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#5B9BD5" stopOpacity="0" />
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

        {/*
         * Dynamic partner highlight — every pinned country/region painted
         * at its real outline. Paths come from shapeForPin() which plucks
         * matching sub-paths out of VA_MAP_BG + VA_MAP_PARTNERS.
         */}
        {placed.map((s) => (
          <path
            key={s.pin.slug}
            d={s.path}
            fill="rgba(91,155,213,0.62)"
            stroke="rgba(170,210,240,0.85)"
            strokeWidth="0.8"
            strokeLinejoin="round"
            fillRule="evenodd"
            className="va-pin-shape"
          />
        ))}

        <path
          d={VA_MAP_ORIGIN}
          fill="rgba(240,128,35,0.72)"
          stroke="rgba(255,176,112,0.95)"
          strokeWidth="1"
          strokeLinejoin="round"
          fillRule="evenodd"
          className="va-map-origin"
        />

        {/* Animated routes — one per pin, drawn from Vietnam to the centroid */}
        <g className="va-routes">
          {placed.map((s, i) => {
            const dx = s.cx - ox;
            const mx = (ox + s.cx) / 2;
            const bend = Math.max(36, Math.abs(dx) * 0.3);
            const my = Math.min(oy, s.cy) - bend;
            return (
              <path
                key={s.pin.slug}
                d={`M ${ox} ${oy} Q ${mx} ${my} ${s.cx} ${s.cy}`}
                fill="none"
                stroke="#F08023"
                strokeWidth="1.4"
                strokeDasharray="2 6"
                strokeLinecap="round"
                className="va-route"
                style={{ animationDelay: `${(i * 0.25).toFixed(2)}s` }}
              />
            );
          })}
        </g>

        {/* Destination markers — dot + label at the country's centroid */}
        <g className="va-dests">
          {placed.map((s, i) => {
            return (
              <g key={s.pin.slug} transform={`translate(${s.cx.toFixed(1)},${s.cy.toFixed(1)})`}>
                {/* Soft halo on top of the country-fill */}
                <circle r="28" fill="url(#va-dest-glow)" />
                {/* Tighter brighter core anchored at the pin */}
                <circle r="12" fill="url(#va-dest-core)" />
                {/* Slow breathing outer ring */}
                <circle r="6" fill="none" stroke="#7BB3E6" strokeWidth="1.2" opacity="0.7">
                  <animate
                    attributeName="r"
                    values="10;28;10"
                    dur="3.6s"
                    begin={`${(0.2 + i * 0.18).toFixed(2)}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.7;0;0.7"
                    dur="3.6s"
                    begin={`${(0.2 + i * 0.18).toFixed(2)}s`}
                    repeatCount="indefinite"
                  />
                </circle>
                {/* Faster small pulse closer to the dot */}
                <circle r="6" fill="#7BB3E6" opacity="0.45">
                  <animate
                    attributeName="r"
                    values="6;14;6"
                    dur="2.2s"
                    begin={`${(0.3 + i * 0.2).toFixed(2)}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.65;0;0.65"
                    dur="2.2s"
                    begin={`${(0.3 + i * 0.2).toFixed(2)}s`}
                    repeatCount="indefinite"
                  />
                </circle>
                {/* Center dot */}
                <circle r="4" fill="#fff" stroke="#5B9BD5" strokeWidth="2.2" />
                <text
                  x={s.tx}
                  y={s.ty}
                  textAnchor={s.anchor}
                  fontSize="11"
                  fontWeight="600"
                  fill="rgba(255,255,255,0.95)"
                  style={{ paintOrder: 'stroke', stroke: 'rgba(10,43,87,0.95)', strokeWidth: 3 }}
                >
                  {s.pin.name[locale]}
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
