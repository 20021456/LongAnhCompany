'use client';

import { useState } from 'react';
import { z } from 'zod';
import type { Locale } from '@/lib/i18n/config';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().min(10),
});

type FormData = z.infer<typeof schema>;

interface Props {
  locale: Locale;
  source?: 'home_form' | 'product_quote' | 'contact_page';
  productId?: string;
  variantId?: string;
}

const labels = {
  vi: {
    name: 'Họ và tên',
    email: 'Email',
    company: 'Công ty',
    phone: 'Số điện thoại',
    message: 'Nội dung yêu cầu',
    submit: 'Gửi yêu cầu',
    sending: 'Đang gửi...',
    success: 'Đã gửi! Chúng tôi sẽ phản hồi trong 24h.',
    error: 'Có lỗi xảy ra. Vui lòng thử lại.',
  },
  en: {
    name: 'Full name',
    email: 'Email',
    company: 'Company',
    phone: 'Phone',
    message: 'Your message',
    submit: 'Send request',
    sending: 'Sending...',
    success: 'Sent! We will reply within 24 hours.',
    error: 'Something went wrong. Please try again.',
  },
  zh: {
    name: '姓名',
    email: '邮箱',
    company: '公司',
    phone: '电话',
    message: '留言',
    submit: '发送请求',
    sending: '发送中...',
    success: '已发送!我们将在24小时内回复。',
    error: '出错了。请重试。',
  },
} as const;

export function ContactForm({ locale, source = 'contact_page', productId, variantId }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const l = labels[locale];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setStatus('sending');

    const formData = new FormData(e.currentTarget);
    const data: FormData = {
      fullName: String(formData.get('fullName') ?? ''),
      email: String(formData.get('email') ?? ''),
      company: String(formData.get('company') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      message: String(formData.get('message') ?? ''),
    };

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        if (i.path[0]) fieldErrors[String(i.path[0])] = i.message;
      });
      setErrors(fieldErrors);
      setStatus('idle');
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...parsed.data, source, productId, variantId, locale }),
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
      <div className="rounded-2xl bg-brand-50 p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-500 text-white">
          <Icon name="check" size={24} />
        </div>
        <p className="mt-4 text-base font-semibold text-ink">{l.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="fullName" label={l.name} required error={errors.fullName} />
        <Field name="email" type="email" label={l.email} required error={errors.email} />
        <Field name="company" label={l.company} error={errors.company} />
        <Field name="phone" type="tel" label={l.phone} error={errors.phone} />
      </div>
      <Field
        name="message"
        label={l.message}
        as="textarea"
        rows={4}
        required
        error={errors.message}
      />
      {status === 'error' ? (
        <p className="text-sm text-red-600">{l.error}</p>
      ) : null}
      <Button type="submit" disabled={status === 'sending'} className="w-full sm:w-auto">
        {status === 'sending' ? l.sending : l.submit}
        <Icon name="arrow-right" size={16} />
      </Button>
    </form>
  );
}

interface FieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
  as?: 'input' | 'textarea';
  rows?: number;
}

function Field({ name, label, type = 'text', required, error, as = 'input', rows }: FieldProps) {
  const Tag = as;
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">
        {label}
        {required ? <span className="ml-0.5 text-brand-500">*</span> : null}
      </span>
      <Tag
        name={name}
        type={type}
        rows={rows}
        required={required}
        className="mt-1.5 block w-full rounded-lg border border-ink/10 bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
