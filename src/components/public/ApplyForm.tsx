'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { Icon } from '@/components/ui/Icon';

const T: Record<Locale, Record<string, string>> = {
  vi: {
    title: 'Nộp hồ sơ trực tuyến',
    fullName: 'Họ và tên',
    email: 'Email',
    phone: 'Số điện thoại',
    cv: 'CV (PDF / DOC, tối đa 8MB)',
    coverLetter: 'Thư xin việc (tuỳ chọn)',
    submit: 'Gửi hồ sơ',
    sending: 'Đang gửi...',
    successTitle: 'Đã nhận hồ sơ của bạn!',
    successBody:
      'Chúng tôi sẽ phản hồi qua email trong vòng 3 ngày làm việc. Cảm ơn bạn đã quan tâm Long Anh.',
    missingCv: 'Vui lòng đính kèm CV.',
    genericError: 'Có lỗi xảy ra. Vui lòng thử lại.',
  },
  en: {
    title: 'Apply online',
    fullName: 'Full name',
    email: 'Email',
    phone: 'Phone number',
    cv: 'CV (PDF / DOC, max 8MB)',
    coverLetter: 'Cover letter (optional)',
    submit: 'Submit application',
    sending: 'Sending...',
    successTitle: 'Application received!',
    successBody:
      'We will reply by email within 3 business days. Thank you for your interest in Long Anh.',
    missingCv: 'Please attach your CV.',
    genericError: 'Something went wrong. Please try again.',
  },
  zh: {
    title: '在线投递简历',
    fullName: '姓名',
    email: '邮箱',
    phone: '电话号码',
    cv: '简历 (PDF / DOC,最大8MB)',
    coverLetter: '求职信(可选)',
    submit: '提交申请',
    sending: '发送中...',
    successTitle: '我们已收到您的简历!',
    successBody: '我们将在3个工作日内通过邮件回复您。感谢您对龙英的关注。',
    missingCv: '请附上您的简历。',
    genericError: '出错了。请重试。',
  },
};

export function ApplyForm({ jobSlug, locale }: { jobSlug: string; locale: Locale }) {
  const t = T[locale] ?? T.vi;
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [cvName, setCvName] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;
    setError('');

    const form = e.currentTarget;
    const cvInput = form.elements.namedItem('cv') as HTMLInputElement | null;
    if (!cvInput?.files?.[0]) {
      setError(t.missingCv);
      return;
    }
    const fd = new FormData(form);
    fd.append('jobSlug', jobSlug);

    setStatus('sending');
    try {
      const res = await fetch('/api/job-applications', { method: 'POST', body: fd });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        setError(json.error || t.genericError);
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setError(t.genericError);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="jd-apply">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div
            style={{
              width: 36,
              height: 36,
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
          <h3 style={{ margin: 0 }}>{t.successTitle}</h3>
        </div>
        <p>{t.successBody}</p>
      </div>
    );
  }

  return (
    <form className="jd-apply" onSubmit={onSubmit}>
      <h3>{t.title}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <input className="va-input" name="fullName" required placeholder={t.fullName} />
        <input className="va-input" name="email" type="email" required placeholder={t.email} />
      </div>
      <div style={{ marginTop: 12 }}>
        <input className="va-input" name="phone" placeholder={t.phone} />
      </div>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginTop: 12,
          padding: '10px 14px',
          border: '1px dashed rgba(0,0,0,.18)',
          borderRadius: 8,
          cursor: 'pointer',
          background: '#fff',
        }}
      >
        <Icon name="arrow" size={16} />
        <span style={{ fontSize: 13.5, opacity: 0.85, flex: 1 }}>{cvName || t.cv}</span>
        <input
          name="cv"
          type="file"
          required
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          style={{ display: 'none' }}
          onChange={(e) => setCvName(e.target.files?.[0]?.name ?? '')}
        />
      </label>
      <textarea
        className="va-input"
        name="coverLetter"
        placeholder={t.coverLetter}
        rows={4}
        style={{ marginTop: 12 }}
      />
      {error ? (
        <p style={{ marginTop: 10, fontSize: 13, color: '#c0392b' }}>{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="jd-btn jd-btn-p"
        style={{ marginTop: 14 }}
      >
        <Icon name="mail" size={15} />
        {status === 'sending' ? t.sending : t.submit}
      </button>
    </form>
  );
}
