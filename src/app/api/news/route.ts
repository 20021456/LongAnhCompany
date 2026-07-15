import { NextResponse } from 'next/server';
import { getArticles } from '@/lib/queries';

export const dynamic = 'force-dynamic';

/**
 * Public read-only news feed — all published articles newest first.
 * Optional `?category=` filters on the category slug stored on the article.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  let rows = await getArticles();
  if (category) rows = rows.filter((a) => a.cat === category);
  return NextResponse.json({ count: rows.length, articles: rows });
}
