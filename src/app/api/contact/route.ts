import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().min(10),
  source: z.enum(['home_form', 'product_quote', 'contact_page']).default('contact_page'),
  productId: z.string().optional(),
  variantId: z.string().optional(),
  locale: z.string().optional(),
});

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 422 });
  }

  const data = parsed.data;
  const ip = req.headers.get('x-forwarded-for') ?? null;
  const userAgent = req.headers.get('user-agent') ?? null;

  try {
    const contact = await db.contact.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        company: data.company,
        phone: data.phone,
        message: data.message,
        source: data.source,
        productInterestId: data.productId,
        variantId: data.variantId,
        locale: data.locale,
        ipAddress: ip,
        userAgent,
        status: 'new',
      },
    });

    // TODO Phase 4: send email via Resend, notify Slack, etc.

    return NextResponse.json({ ok: true, id: contact.id }, { status: 201 });
  } catch (err) {
    console.error('Contact submission error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
