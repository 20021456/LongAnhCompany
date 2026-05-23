import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/queries';

export const dynamic = 'force-dynamic';

/**
 * Public read-only product catalogue. Returns all active products. Each
 * product carries 3-locale strings under the same field; clients pick the
 * locale they need. Optional `?category=caco3-powder|stone` filters by
 * category slug.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const all = await getProducts();
  let rows = Object.values(all);
  if (category === 'caco3-powder') rows = rows.filter((p) => p.cat === 0);
  else if (category === 'stone') rows = rows.filter((p) => p.cat === 1);
  return NextResponse.json({ count: rows.length, products: rows });
}
