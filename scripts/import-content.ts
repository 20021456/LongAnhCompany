/**
 * Parse `LongAnhCorp/CONTENT.md` into a structured JSON file that the Phase 3
 * seed script can consume. Run from the monorepo root:
 *
 *   npx tsx scripts/import-content.ts ../LongAnhCorp/CONTENT.md > content.json
 *
 * Output schema (roughly):
 *   {
 *     "site.brand_short": { vi: "KS LONG ANH", en: "...", zh: "..." },
 *     "products": [...],
 *     "jobs": [...]
 *   }
 *
 * Phase 3 will flesh out this parser. For now this is a stub.
 */

import { readFileSync } from 'node:fs';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: tsx scripts/import-content.ts <path-to-CONTENT.md>');
  process.exit(1);
}

const raw = readFileSync(inputPath, 'utf8');

// TODO Phase 3: implement parser. Detect `[key]` markers and 🇻🇳/🇬🇧/🇨🇳 bullets.
console.log(JSON.stringify({ stub: true, charCount: raw.length }, null, 2));
