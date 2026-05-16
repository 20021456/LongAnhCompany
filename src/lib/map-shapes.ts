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
  /** [minX, minY, maxX, maxY] in viewBox units — used as a cheap reject test. */
  bbox: [number, number, number, number];
  /** Arithmetic mean of all point coordinates — fast centroid approximation. */
  centroid: [number, number];
  /** All vertices of the polygon — used for the point-in-polygon test. */
  vertices: [number, number][];
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
    const vertices: [number, number][] = [];
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let sumX = 0;
    let sumY = 0;
    // Coordinates come in pairs after each command letter. We accept M and
    // L (absolute) which is the only form the prototype data uses.
    for (let i = 0; i + 1 < nums.length; i += 2) {
      const x = parseFloat(nums[i]);
      const y = parseFloat(nums[i + 1]);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      vertices.push([x, y]);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      sumX += x;
      sumY += y;
    }
    if (vertices.length === 0 || !Number.isFinite(minX)) continue;
    polys.push({
      path,
      bbox: [minX, minY, maxX, maxY],
      centroid: [sumX / vertices.length, sumY / vertices.length],
      vertices,
    });
  }
  return polys;
}

/**
 * Ray-casting point-in-polygon test. Counts edge crossings of a horizontal
 * ray cast from the point; an odd count means inside.
 */
function pointInPolygon(x: number, y: number, verts: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = verts.length - 1; i < verts.length; j = i++) {
    const [xi, yi] = verts[i];
    const [xj, yj] = verts[j];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/** Module-level cache — VA_MAP_BG never changes at runtime. */
const POLYGONS: Polygon[] = parsePolygons(VA_MAP_BG);

/**
 * Continent-level pins don't sit inside any one polygon, so for them we
 * fall back to "every polygon whose centroid is within R of the pin".
 */
const CONTINENT_RADIUS: Record<string, number> = {
  europe: 80,
  africa: 110,
};

/**
 * Pull in nearby islands / dependent territories for archipelagic
 * countries — point-in-polygon only catches the polygon the pin sits in,
 * which for Indonesia/Japan/UK misses the smaller islands the user
 * expects to see lit up.
 */
const ISLAND_RADIUS: Record<string, number> = {
  indonesia: 45,
  philippines: 30,
  japan: 30,
  uk: 18,
  'south-korea': 20,
  india: 25,
  'south-africa': 70,
};

/**
 * Concatenated SVG path containing every polygon that belongs to the
 * given pin. Returns null when nothing matched (e.g. an ocean pin).
 *
 * Strategy:
 *  1. Continent slugs (europe, africa) — use centroid-radius matching:
 *     every polygon whose centroid is within R of the pin is included.
 *  2. Everything else — point-in-polygon test: include the polygon the
 *     pin actually sits inside (correctly distinguishes Korea from the
 *     enclosing China bbox, etc.). Then optionally pull in nearby small
 *     islands within ISLAND_RADIUS for archipelagos.
 *  3. If nothing matches, fall back to the closest polygon by centroid
 *     distance so a slightly-off pin still highlights something.
 */
export function shapeForPin(pin: WorldPin): string | null {
  // ── 1. Continent fallback ──────────────────────────────────────────
  const continentR = CONTINENT_RADIUS[pin.slug];
  if (continentR !== undefined) {
    const r2 = continentR * continentR;
    const parts: string[] = [];
    for (const p of POLYGONS) {
      const dx = p.centroid[0] - pin.x;
      const dy = p.centroid[1] - pin.y;
      if (dx * dx + dy * dy <= r2) parts.push(p.path);
    }
    return parts.length ? parts.join(' ') : null;
  }

  // ── 2. Country: only the polygon(s) that geometrically contain the pin ──
  const parts: string[] = [];
  for (const p of POLYGONS) {
    // Fast bbox reject before the more expensive ray-cast.
    if (pin.x < p.bbox[0] || pin.x > p.bbox[2] || pin.y < p.bbox[1] || pin.y > p.bbox[3]) continue;
    if (pointInPolygon(pin.x, pin.y, p.vertices)) parts.push(p.path);
  }

  // ── 3. Optional: pull in nearby islands for archipelagic countries ──
  const islandR = ISLAND_RADIUS[pin.slug];
  if (islandR !== undefined) {
    const r2 = islandR * islandR;
    for (const p of POLYGONS) {
      if (parts.includes(p.path)) continue;
      const dx = p.centroid[0] - pin.x;
      const dy = p.centroid[1] - pin.y;
      if (dx * dx + dy * dy <= r2) parts.push(p.path);
    }
  }

  // ── 4. Last-chance fallback: nearest polygon centroid ──
  if (parts.length === 0) {
    let best: Polygon | null = null;
    let bestD = Infinity;
    for (const p of POLYGONS) {
      const dx = p.centroid[0] - pin.x;
      const dy = p.centroid[1] - pin.y;
      const d = dx * dx + dy * dy;
      if (d < bestD) {
        bestD = d;
        best = p;
      }
    }
    if (best && bestD <= 45 * 45) parts.push(best.path);
  }

  return parts.length === 0 ? null : parts.join(' ');
}
