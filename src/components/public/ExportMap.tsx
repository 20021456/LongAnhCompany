import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Icon } from '@/components/ui/Icon';
import { VA_MAP_BG, VA_MAP_PARTNERS, VA_MAP_ORIGIN } from '@/data/world-map';

interface Props {
  locale: Locale;
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

export function ExportMap({ locale }: Props) {
  const C = COPY[locale];
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
                  {C.markets[d.key]}
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
          <div className="va-eyebrow">{C.capEy}</div>
          <h2>{C.capH}</h2>
          <p>{C.capP}</p>
          <div className="va-export-features">
            <div className="va-export-feature">
              <div className="va-ef-i">
                <Icon name="spark" size={16} />
              </div>
              <div>
                <b>
                  {locale === 'zh'
                    ? '优质碳酸钙'
                    : locale === 'en'
                      ? 'Premium Quality'
                      : 'Chất lượng cao cấp'}
                </b>
                <span>
                  {locale === 'zh'
                    ? '白度 98%+,CaCO₃ 98.5%+'
                    : locale === 'en'
                      ? 'Whiteness 98%+, CaCO₃ 98.5%+'
                      : 'Độ trắng 98%+, CaCO₃ 98.5%+'}
                </span>
              </div>
            </div>
            <div className="va-export-feature">
              <div className="va-ef-i">
                <Icon name="globe" size={16} />
              </div>
              <div>
                <b>
                  {locale === 'zh' ? '全球覆盖' : locale === 'en' ? 'Global Reach' : 'Tầm phủ toàn cầu'}
                </b>
                <span>
                  {locale === 'zh'
                    ? '12个国家 · 8+核心市场'
                    : locale === 'en'
                      ? '12 countries · 8+ key markets'
                      : '12 quốc gia · 8+ thị trường'}
                </span>
              </div>
            </div>
            <div className="va-export-feature">
              <div className="va-ef-i">
                <Icon name="ship" size={16} />
              </div>
              <div>
                <b>
                  {locale === 'zh'
                    ? '可靠物流'
                    : locale === 'en'
                      ? 'Reliable Logistics'
                      : 'Logistics tin cậy'}
                </b>
                <span>
                  {locale === 'zh'
                    ? 'FOB窗碧港和海防港'
                    : locale === 'en'
                      ? 'FOB Cua Lo & Hai Phong ports'
                      : 'FOB cảng Cửa Lò & Hải Phòng'}
                </span>
              </div>
            </div>
            <div className="va-export-feature">
              <div className="va-ef-i">
                <Icon name="check" size={16} />
              </div>
              <div>
                <b>
                  {locale === 'zh'
                    ? '客户信任'
                    : locale === 'en'
                      ? 'Customer Trust'
                      : 'Niềm tin khách hàng'}
                </b>
                <span>
                  {locale === 'zh'
                    ? '10年以上稳定合作'
                    : locale === 'en'
                      ? '10+ years long-term partners'
                      : '10+ năm đối tác dài hạn'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="va-map-caption">
        {locale === 'zh'
          ? '从我们的工厂到您的目的地 — 优质交付,信任建立。'
          : locale === 'en'
            ? 'From our factory to your destination — delivering quality, building trust.'
            : 'Từ nhà máy của chúng tôi đến cảng của bạn — giao hàng chất lượng, xây dựng niềm tin.'}
      </div>
    </div>
  );
}
