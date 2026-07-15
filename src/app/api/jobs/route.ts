import { NextResponse } from 'next/server';
import { getJobs } from '@/lib/queries';

export const dynamic = 'force-dynamic';

/**
 * Public read-only job listing — all active vacancies. Optional `?dept=`
 * filters on the department code (e.g. `production`, `sales`, `engineering`).
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dept = searchParams.get('dept');
  const all = await getJobs();
  let rows = Object.values(all);
  if (dept) rows = rows.filter((j) => j.dept === dept);
  return NextResponse.json({ count: rows.length, jobs: rows });
}
