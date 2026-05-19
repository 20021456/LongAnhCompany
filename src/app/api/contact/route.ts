import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { sendNotificationEmail, esc } from '@/lib/email';

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
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 422 },
    );
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

    const salesInbox = process.env.SALES_EMAIL;
    if (salesInbox) {
      // Best-effort notification — failure does not block the response.
      await sendNotificationEmail({
        to: salesInbox,
        replyTo: data.email,
        subject: `[Liên hệ mới] ${data.fullName}${data.company ? ` · ${data.company}` : ''}`,
        html: `
          <h2>Có yêu cầu liên hệ mới từ website</h2>
          <table cellpadding="6" style="font-size:14px">
            <tr><td><b>Họ tên</b></td><td>${esc(data.fullName)}</td></tr>
            <tr><td><b>Email</b></td><td>${esc(data.email)}</td></tr>
            <tr><td><b>Công ty</b></td><td>${esc(data.company)}</td></tr>
            <tr><td><b>Điện thoại</b></td><td>${esc(data.phone)}</td></tr>
            <tr><td><b>Nguồn</b></td><td>${esc(data.source)}</td></tr>
            <tr><td><b>Sản phẩm quan tâm</b></td><td>${esc(data.productId)}</td></tr>
            <tr><td><b>Ngôn ngữ</b></td><td>${esc(data.locale)}</td></tr>
          </table>
          <h3>Nội dung</h3>
          <p style="white-space:pre-wrap;line-height:1.55">${esc(data.message)}</p>
          <hr/>
          <p style="font-size:12px;color:#6b7280">
            Mở chi tiết trong admin: <code>/admin/contacts/${contact.id}</code>
          </p>
        `,
      });
    }

    return NextResponse.json({ ok: true, id: contact.id }, { status: 201 });
  } catch (err) {
    console.error('Contact submission error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
