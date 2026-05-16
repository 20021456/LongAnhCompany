/**
 * World-pin catalogue — every country that can appear as an export-market
 * marker on the public ExportMap.
 *
 * Each pin has a stable `slug` (stored in `exportCap.markets`) plus the
 * (x, y) coordinates inside the 1000×500 world-map viewBox used in
 * src/components/public/ExportMap.tsx, and a localised name for VN / EN / ZH.
 *
 * Phase 7 may promote this to a real `pin_locations` DB table so editors
 * can add custom countries from the admin without a code deploy; for now
 * this in-code catalogue keeps the public map deterministic.
 *
 * Coordinates are calibrated against the existing 8 production markers
 * (South Korea 855,152 · Japan 883,154 · India 717,197 · Bangladesh 750,189
 * · Indonesia 828,261 · UAE 653,183 · Egypt 580,178 · Türkiye 597,144).
 */

import type { Locale } from './i18n/config';

export interface WorldPin {
  /** Stable identifier persisted in `exportCap.markets`. */
  slug: string;
  /** Position inside the 1000×500 ExportMap viewBox. */
  x: number;
  y: number;
  /** Localised display name. */
  name: Record<Locale, string>;
  /** Optional: bias the label position relative to the pin. */
  labelAbove?: boolean;
}

export const WORLD_PINS: WorldPin[] = [
  // ── Asia (production export markets) ─────────────────────────────────
  {
    slug: 'south-korea',
    x: 855,
    y: 152,
    name: { vi: 'Hàn Quốc', en: 'South Korea', zh: '韩国' },
    labelAbove: true,
  },
  { slug: 'japan', x: 883, y: 154, name: { vi: 'Nhật Bản', en: 'Japan', zh: '日本' } },
  { slug: 'china', x: 815, y: 132, name: { vi: 'Trung Quốc', en: 'China', zh: '中国' } },
  { slug: 'taiwan', x: 848, y: 188, name: { vi: 'Đài Loan', en: 'Taiwan', zh: '台湾' } },
  { slug: 'india', x: 717, y: 197, name: { vi: 'Ấn Độ', en: 'India', zh: '印度' } },
  {
    slug: 'bangladesh',
    x: 750,
    y: 189,
    name: { vi: 'Bangladesh', en: 'Bangladesh', zh: '孟加拉' },
    labelAbove: true,
  },
  { slug: 'pakistan', x: 690, y: 174, name: { vi: 'Pakistan', en: 'Pakistan', zh: '巴基斯坦' } },
  { slug: 'sri-lanka', x: 725, y: 232, name: { vi: 'Sri Lanka', en: 'Sri Lanka', zh: '斯里兰卡' } },
  { slug: 'thailand', x: 790, y: 218, name: { vi: 'Thái Lan', en: 'Thailand', zh: '泰国' } },
  { slug: 'malaysia', x: 805, y: 254, name: { vi: 'Malaysia', en: 'Malaysia', zh: '马来西亚' } },
  { slug: 'singapore', x: 813, y: 258, name: { vi: 'Singapore', en: 'Singapore', zh: '新加坡' } },
  {
    slug: 'philippines',
    x: 858,
    y: 217,
    name: { vi: 'Philippines', en: 'Philippines', zh: '菲律宾' },
  },
  { slug: 'indonesia', x: 828, y: 273, name: { vi: 'Indonesia', en: 'Indonesia', zh: '印尼' } },
  { slug: 'australia', x: 905, y: 360, name: { vi: 'Úc', en: 'Australia', zh: '澳大利亚' } },

  // ── Middle East ───────────────────────────────────────────────────────
  { slug: 'uae', x: 653, y: 183, name: { vi: 'UAE', en: 'UAE', zh: '阿联酋' } },
  {
    slug: 'saudi-arabia',
    x: 632,
    y: 195,
    name: { vi: 'Ả Rập Saudi', en: 'Saudi Arabia', zh: '沙特阿拉伯' },
  },
  { slug: 'iran', x: 650, y: 163, name: { vi: 'Iran', en: 'Iran', zh: '伊朗' } },
  { slug: 'turkey', x: 597, y: 144, name: { vi: 'Thổ Nhĩ Kỳ', en: 'Türkiye', zh: '土耳其' } },

  // ── Europe ────────────────────────────────────────────────────────────
  {
    slug: 'germany',
    x: 510,
    y: 108,
    name: { vi: 'Đức', en: 'Germany', zh: '德国' },
    labelAbove: true,
  },
  { slug: 'france', x: 482, y: 122, name: { vi: 'Pháp', en: 'France', zh: '法国' } },
  {
    slug: 'uk',
    x: 472,
    y: 96,
    name: { vi: 'Anh', en: 'United Kingdom', zh: '英国' },
    labelAbove: true,
  },
  { slug: 'italy', x: 518, y: 134, name: { vi: 'Ý', en: 'Italy', zh: '意大利' } },
  { slug: 'spain', x: 460, y: 145, name: { vi: 'Tây Ban Nha', en: 'Spain', zh: '西班牙' } },
  { slug: 'netherlands', x: 498, y: 102, name: { vi: 'Hà Lan', en: 'Netherlands', zh: '荷兰' } },
  { slug: 'russia', x: 600, y: 88, name: { vi: 'Nga', en: 'Russia', zh: '俄罗斯' } },
  { slug: 'poland', x: 535, y: 104, name: { vi: 'Ba Lan', en: 'Poland', zh: '波兰' } },

  // ── Africa ────────────────────────────────────────────────────────────
  { slug: 'egypt', x: 580, y: 178, name: { vi: 'Ai Cập', en: 'Egypt', zh: '埃及' } },
  { slug: 'morocco', x: 470, y: 168, name: { vi: 'Morocco', en: 'Morocco', zh: '摩洛哥' } },
  { slug: 'nigeria', x: 525, y: 272, name: { vi: 'Nigeria', en: 'Nigeria', zh: '尼日利亚' } },
  {
    slug: 'south-africa',
    x: 562,
    y: 388,
    name: { vi: 'Nam Phi', en: 'South Africa', zh: '南非' },
  },
  { slug: 'kenya', x: 610, y: 295, name: { vi: 'Kenya', en: 'Kenya', zh: '肯尼亚' } },

  // ── Americas ──────────────────────────────────────────────────────────
  { slug: 'usa-east', x: 248, y: 165, name: { vi: 'Hoa Kỳ', en: 'USA', zh: '美国' } },
  { slug: 'canada', x: 218, y: 108, name: { vi: 'Canada', en: 'Canada', zh: '加拿大' } },
  { slug: 'mexico', x: 215, y: 198, name: { vi: 'Mexico', en: 'Mexico', zh: '墨西哥' } },
  { slug: 'brazil', x: 345, y: 300, name: { vi: 'Brazil', en: 'Brazil', zh: '巴西' } },
  {
    slug: 'argentina',
    x: 305,
    y: 388,
    name: { vi: 'Argentina', en: 'Argentina', zh: '阿根廷' },
  },
];

/** O(1) lookup by slug. */
export const WORLD_PINS_BY_SLUG: Record<string, WorldPin> = Object.fromEntries(
  WORLD_PINS.map((p) => [p.slug, p]),
);

/** Localised display label for a slug. Returns null if unknown. */
export function pinLabel(slug: string, locale: Locale): string | null {
  const pin = WORLD_PINS_BY_SLUG[slug];
  return pin ? pin.name[locale] : null;
}
