import { NextResponse } from 'next/server';
import { locales, type Locale } from '@/lib/i18n/config';
import {
  getHomeSections,
  getAboutSections,
  getProductsPageSections,
  getCareersPageSections,
  getNewsPageSections,
  getContactPageSections,
} from '@/lib/queries';

export const dynamic = 'force-dynamic';

type Loader = (locale: Locale) => Promise<unknown>;

const LOADERS: Record<string, Loader> = {
  home: getHomeSections,
  about: getAboutSections,
  products: getProductsPageSections,
  career: getCareersPageSections,
  news: getNewsPageSections,
  contact: getContactPageSections,
};

/**
 * Public read-only sections for a CMS-managed page. Returns the merged
 * sections (defaults overlaid with admin edits) for every locale. Pass
 * `?lang=vi|en|zh` to only return that locale.
 */
export async function GET(req: Request, { params }: { params: { key: string } }) {
  const load = LOADERS[params.key];
  if (!load) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const lang = new URL(req.url).searchParams.get('lang') as Locale | null;
  if (lang && locales.includes(lang)) {
    return NextResponse.json({ key: params.key, locale: lang, sections: await load(lang) });
  }
  const entries = await Promise.all(locales.map(async (l) => [l, await load(l)] as const));
  return NextResponse.json({
    key: params.key,
    sections: Object.fromEntries(entries),
  });
}
