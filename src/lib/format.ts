/**
 * Deterministic formatting helpers — used in place of Date#toLocaleString
 * and Number#toLocaleString in components that get hydrated on the client.
 *
 * Node's ICU build and the browser's Intl implementation can disagree on
 * subtle details ("10:32" vs "10:32 SA", regular space vs NBSP between
 * digit groups, etc.). Since Client Components run the same code on both
 * sides of the SSR→hydration boundary, any locale-aware formatter is a
 * latent hydration-mismatch bug. These helpers do the formatting by hand
 * so the output is byte-identical everywhere.
 */

/** "15/05/2026" — short Vietnamese date. */
export function fmtDateVn(input: Date | string | number): string {
  const d = input instanceof Date ? input : new Date(input);
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** "15/05/2026 10:32" — date + time. */
export function fmtDateTimeVn(input: Date | string | number): string {
  const d = input instanceof Date ? input : new Date(input);
  return `${fmtDateVn(d)} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** "10:32" — 24-hour time. */
export function fmtHM(input: Date | string | number): string {
  const d = input instanceof Date ? input : new Date(input);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** "12.450" — Vietnamese-style number grouping with a dot separator. */
export function fmtNumberVn(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  const neg = n < 0;
  const abs = Math.abs(Math.trunc(n));
  const s = String(abs);
  // Insert '.' every 3 digits from the right.
  let out = '';
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) out += '.';
    out += s[i];
  }
  return neg ? '-' + out : out;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}
