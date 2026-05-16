/**
 * Per-pin country/region shape extractor.
 *
 * `VA_MAP_BG` (src/data/world-map.ts) is one giant SVG path containing
 * every land polygon in the world, separated into closed sub-paths by
 * `Z` commands. To "light up" a specific country we don't need extra
 * data — we just pick out the sub-paths whose footprint matches the
 * pin's location and re-paint them on a brighter layer.
 *
 * Each polygon is parsed once at module load (~118KB → ~1k sub-paths)
 * and indexed by its bounding box + centroid. Given a pin we then return
 * the concatenated path string of every polygon that either contains
 * the pin or whose centroid sits within `regionRadius` (continent-sized
 * for `europe`/`africa`, small for individual countries).
 */

import { VA_MAP_BG } from '@/data/world-map';
import type { WorldPin } from './world-pins';

interface Polygon {
  /** Raw SVG sub-path including the trailing `Z`. */
  path: string;
  /** [minX, minY, maxX, maxY] in viewBox units. */
  bbox: [number, number, number, number];
  /** Arithmetic mean of all point coordinates — fast centroid approximation. */
  centroid: [number, number];
}

function parsePolygons(d: string): Polygon[] {
  const polys: Polygon[] = [];
  // Split by Z while keeping the Z on each sub-path; the source data uses
  // an uppercase Z between every closed polygon.
  const parts = d.split('Z');
  for (const raw of parts) {
    if (!raw.trim()) continue;
    const path = raw + 'Z';
    const nums = raw.match(/-?\d+\.?\d*/g);
    if (!nums) continue;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    // Coordinates come in pairs after each command letter.
    for (let i = 0; i + 1 < nums.length; i += 2) {
      const x = parseFloat(nums[i]);
      const y = parseFloat(nums[i + 1]);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      sumX += x;
      sumY += y;
      count++;
    }
    if (count === 0 || !Number.isFinite(minX)) continue;
    polys.push({
      path,
      bbox: [minX, minY, maxX, maxY],
      centroid: [sumX / count, sumY / count],
    });
  }
  return polys;
}

/** Module-level cache — VA_MAP_BG never changes at runtime. */
const POLYGONS: Polygon[] = parsePolygons(VA_MAP_BG);

/**
 * How far around the pin we consider a polygon's centroid to belong to
 * this country / region. Continent-level slugs get a much wider radius.
 */
const PIN_RADIUS: Record<string, number> = {
  europe: 80,
  africa: 110,
  india: 35,
  indonesia: 45,
  japan: 40,
  china: 60,
  brazil: 55,
  'usa-east': 60,
  canada: 70,
  russia: 90,
  australia: 70,
  egypt: 35,
  'south-africa': 70,
};
const DEFAULT_RADIUS = 22;

/**
 * Concatenated SVG path containing every polygon that belongs to the
 * given pin. Returns null when nothing matched (e.g. an ocean pin).
 */
export function shapeForPin(pin: WorldPin): string | null {
  const r = PIN_RADIUS[pin.slug] ?? DEFAULT_RADIUS;
  const r2 = r * r;
  const parts: string[] = [];
  for (const p of POLYGONS) {
    // Pin is inside the polygon's bounding box ⇒ obvious match.
    const inside =
      pin.x >= p.bbox[0] && pin.x <= p.bbox[2] && pin.y >= p.bbox[1] && pin.y <= p.bbox[3];
    let matched = inside;
    if (!matched) {
      // Otherwise check whether the centroid is within the region radius
      // (catches small islands + continent groupings).
      const dx = p.centroid[0] - pin.x;
      const dy = p.centroid[1] - pin.y;
      if (dx * dx + dy * dy <= r2) matched = true;
    }
    if (matched) parts.push(p.path);
  }
  return parts.length === 0 ? null : parts.join(' ');
}
