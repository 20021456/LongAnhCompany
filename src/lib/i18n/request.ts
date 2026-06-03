import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { AbstractIntlMessages } from 'next-intl';
import { locales, defaultLocale, type Locale } from './config';
import { db } from '@/lib/db';

/** Write a dotted-path value into a nested messages object. */
function setByPath(obj: Record<string, unknown>, path: string, value: string) {
  const parts = path.split('.');
  let node = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (typeof node[p] !== 'object' || node[p] === null) node[p] = {};
    node = node[p] as Record<string, unknown>;
  }
  node[parts[parts.length - 1]] = value;
}

export default getRequestConfig(async ({ requestLocale }) => {
  // next-intl 3.22+: requestLocale is a Promise<string|undefined>. Fall back
  // to defaultLocale if missing (e.g. requests outside /[locale]/* routes).
  let locale = await requestLocale;
  if (!locale || !locales.includes(locale as Locale)) {
    if (locale) notFound();
    locale = defaultLocale;
  }

  const base = (await import(`../../../messages/${locale}.json`)).default;
  // Clone so DB overrides never mutate the cached JSON module.
  const messages = JSON.parse(JSON.stringify(base)) as Record<string, unknown>;

  // Overlay translation overrides from the admin i18n module. Best-effort:
  // if the DB is unreachable the base messages still render.
  try {
    const overrides = await db.translation.findMany({ where: { locale } });
    for (const t of overrides) setByPath(messages, t.key, t.value);
  } catch (err) {
    console.error('translation overlay skipped:', err);
  }

  return {
    locale,
    messages: messages as AbstractIntlMessages,
    timeZone: 'Asia/Ho_Chi_Minh',
  };
});
