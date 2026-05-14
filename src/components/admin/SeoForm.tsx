'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminIcon } from './AdminIcon';
import { Field } from './FormBits';
import { saveSeoSettings, type ActionResult } from '@/app/admin/(panel)/seo/actions';

type LocaleVal = { vi: string; en: string; zh: string };

export interface SeoFieldDef {
  key: string;
  label: string;
  help?: string;
  localized: boolean;
  type?: 'text' | 'textarea' | 'bool';
}

/** Field catalogue — also defines the order shown in the form. */
export const SEO_FIELDS: SeoFieldDef[] = [
  {
    key: 'seo.meta_title_default',
    label: 'Tiêu đề mặc định',
    help: 'Dùng khi một trang không có tiêu đề SEO riêng.',
    localized: true,
  },
  {
    key: 'seo.meta_desc_default',
    label: 'Mô tả mặc định',
    help: 'Đoạn mô tả hiển thị trên kết quả tìm kiếm (~155 ký tự).',
    localized: true,
    type: 'textarea',
  },
  {
    key: 'seo.keywords',
    label: 'Từ khoá',
    help: 'Phân tách bằng dấu phẩy.',
    localized: true,
  },
  {
    key: 'seo.og_image',
    label: 'Ảnh chia sẻ mặc định (OG image)',
    help: 'URL ảnh hiển thị khi chia sẻ lên mạng xã hội (1200×630).',
    localized: false,
  },
  {
    key: 'seo.canonical_base_url',
    label: 'Tên miền chuẩn (canonical)',
    help: 'VD: https://longanhcorp.com',
    localized: false,
  },
  {
    key: 'seo.twitter_handle',
    label: 'Tài khoản X / Twitter',
    help: 'VD: @longanhcorp',
    localized: false,
  },
  {
    key: 'seo.ga_measurement_id',
    label: 'Google Analytics ID',
    help: 'VD: G-XXXXXXXXXX',
    localized: false,
  },
  {
    key: 'seo.gtm_id',
    label: 'Google Tag Manager ID',
    help: 'VD: GTM-XXXXXXX',
    localized: false,
  },
  {
    key: 'seo.robots_indexable',
    label: 'Cho phép công cụ tìm kiếm lập chỉ mục',
    help: 'Tắt khi site đang chạy thử / chưa công bố.',
    localized: false,
    type: 'bool',
  },
];

export function SeoForm({ initial }: { initial: Record<string, LocaleVal> }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, LocaleVal>>(() =>
    Object.fromEntries(
      SEO_FIELDS.map((f) => [
        f.key,
        initial[f.key] ?? { vi: f.type === 'bool' ? 'true' : '', en: '', zh: '' },
      ]),
    ),
  );
  const [state, setState] = useState<ActionResult | null>(null);
  const [busy, setBusy] = useState(false);

  const setVal = (key: string, locale: keyof LocaleVal, val: string) =>
    setValues((p) => ({ ...p, [key]: { ...p[key], [locale]: val } }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setState(null);
    const res = await saveSeoSettings(values);
    setBusy(false);
    setState(res);
    if (res.ok) router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      {state?.error ? (
        <div className="lg-err" style={{ marginBottom: 16 }}>
          <AdminIcon name="shield" size={14} />
          {state.error}
        </div>
      ) : null}
      {state?.ok ? (
        <div className="ad-badge pub" style={{ marginBottom: 16, padding: '8px 12px' }}>
          <span className="dot" />
          Đã lưu cài đặt SEO.
        </div>
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="ad-card">
          <div className="ad-card-head">
            <h3>Thẻ meta đa ngôn ngữ</h3>
          </div>
          <div
            className="ad-card-body"
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {SEO_FIELDS.filter((f) => f.localized).map((f) => (
              <Field key={f.key} label={f.label} help={f.help}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {(['vi', 'en', 'zh'] as const).map((loc) =>
                    f.type === 'textarea' ? (
                      <textarea
                        key={loc}
                        className="ad-textarea"
                        placeholder={loc.toUpperCase()}
                        value={values[f.key]?.[loc] ?? ''}
                        onChange={(e) => setVal(f.key, loc, e.target.value)}
                      />
                    ) : (
                      <input
                        key={loc}
                        className="ad-input"
                        placeholder={loc.toUpperCase()}
                        value={values[f.key]?.[loc] ?? ''}
                        onChange={(e) => setVal(f.key, loc, e.target.value)}
                      />
                    ),
                  )}
                </div>
              </Field>
            ))}
          </div>
        </div>

        <div className="ad-card">
          <div className="ad-card-head">
            <h3>Kỹ thuật & theo dõi</h3>
          </div>
          <div
            className="ad-card-body"
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {SEO_FIELDS.filter((f) => !f.localized).map((f) => (
              <Field key={f.key} label={f.label} help={f.help}>
                {f.type === 'bool' ? (
                  <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
                    <input
                      type="checkbox"
                      checked={values[f.key]?.vi === 'true'}
                      onChange={(e) => setVal(f.key, 'vi', e.target.checked ? 'true' : 'false')}
                    />
                    Bật
                  </label>
                ) : (
                  <input
                    className="ad-input"
                    value={values[f.key]?.vi ?? ''}
                    onChange={(e) => setVal(f.key, 'vi', e.target.value)}
                  />
                )}
              </Field>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <button type="submit" className="ad-btn primary" disabled={busy}>
          <AdminIcon name="check" size={15} />
          {busy ? 'Đang lưu…' : 'Lưu cài đặt SEO'}
        </button>
      </div>
    </form>
  );
}
