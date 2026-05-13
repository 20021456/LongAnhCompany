'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Icon } from '@/components/ui/Icon';

interface Props {
  locale: Locale;
  source?: 'home_form' | 'product_quote' | 'contact_page';
  productId?: string;
  variantId?: string;
}

export function ContactForm({ locale, source = 'contact_page', productId, variantId }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const C = COPY[locale];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');

    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: String(formData.get('fullName') ?? ''),
      email: String(formData.get('email') ?? ''),
      company: String(formData.get('company') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      productInterest: String(formData.get('product') ?? ''),
      message: String(formData.get('message') ?? ''),
      source,
      productId,
      variantId,
      locale,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Bad response');
      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <form className="va-form">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              background: 'var(--brand-accent, #F08023)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="check" size={18} />
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>
            {locale === 'vi'
              ? 'Đã gửi! Chúng tôi sẽ phản hồi trong 24h.'
              : locale === 'en'
                ? 'Sent! We will reply within 24 hours.'
                : '已发送!我们将在24小时内回复。'}
          </div>
        </div>
      </form>
    );
  }

  return (
    <form className="va-form" onSubmit={onSubmit}>
      <div className="va-form-row">
        <input
          name="fullName"
          required
          className="va-input"
          placeholder={
            locale === 'zh' ? '姓名' : locale === 'en' ? 'Full name' : 'Họ và tên'
          }
        />
        <input
          name="company"
          className="va-input"
          placeholder={locale === 'zh' ? '公司' : locale === 'en' ? 'Company' : 'Công ty'}
        />
      </div>
      <div className="va-form-row">
        <input name="email" type="email" required className="va-input" placeholder="Email" />
        <input
          name="phone"
          className="va-input"
          placeholder={
            locale === 'zh' ? '电话号码' : locale === 'en' ? 'Phone' : 'Số điện thoại'
          }
        />
      </div>
      <div style={{ marginBottom: 14 }}>
        <select name="product" className="va-input">
          <option value="">
            {locale === 'zh'
              ? '感兴趣的产品'
              : locale === 'en'
                ? 'Product of interest'
                : 'Sản phẩm quan tâm'}
          </option>
          {C.products.map((p: { code: string; name: string }) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <textarea
        name="message"
        required
        className="va-input"
        placeholder={
          locale === 'zh'
            ? '需求详情(数量、规格、目的港...)'
            : locale === 'en'
              ? 'Your request (quantity, spec, destination port...)'
              : 'Nội dung yêu cầu (số lượng, quy cách, cảng đến...)'
        }
      />
      {status === 'error' ? (
        <p style={{ marginTop: 10, fontSize: 13, color: '#c0392b' }}>
          {locale === 'vi'
            ? 'Có lỗi xảy ra. Vui lòng thử lại.'
            : locale === 'en'
              ? 'Something went wrong. Please try again.'
              : '出错了。请重试。'}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="va-btn va-btn-p"
        style={{ marginTop: 14, width: '100%', justifyContent: 'center' }}
      >
        {status === 'sending'
          ? locale === 'vi'
            ? 'Đang gửi...'
            : locale === 'en'
              ? 'Sending...'
              : '发送中...'
          : locale === 'zh'
            ? '提交报价请求'
            : locale === 'en'
              ? 'Submit quote request'
              : 'Gửi yêu cầu báo giá'}{' '}
        <Icon name="arrow" size={15} />
      </button>
    </form>
  );
}
