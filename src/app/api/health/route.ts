import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'ok', db: 'reachable' });
  } catch (err) {
    return NextResponse.json(
      { status: 'error', db: 'unreachable', error: String(err) },
      { status: 503 },
    );
  }
}
