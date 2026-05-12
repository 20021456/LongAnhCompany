import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Locale } from './i18n/config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Pick the right localized field from a DB row where i18n fields are stored
 * as separate columns (`*_vi`, `*_en`, `*_zh`).
 *
 * Example:
 *   pickLocale({ nameVi: 'Bột đá', nameEn: 'Powder', nameZh: '石粉' }, 'name', 'en')
 *   => 'Powder'
 */
export function pickLocale<T extends Record<string, unknown>>(
  row: T,
  field: string,
  locale: Locale,
  fallback: Locale = 'vi',
): string {
  const suffix = locale[0].toUpperCase() + locale.slice(1);
  const fallbackSuffix = fallback[0].toUpperCase() + fallback.slice(1);
  const value = row[`${field}${suffix}`] ?? row[`${field}${fallbackSuffix}`];
  return typeof value === 'string' ? value : '';
}

export function formatVND(value: number | string) {
  const num = typeof value === 'string' ? Number(value) : value;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(num);
}
