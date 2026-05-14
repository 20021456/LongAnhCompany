'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminIcon } from './AdminIcon';
import { Field, FieldRow } from './FormBits';
import { savePage, type PageInput, type ActionResult } from '@/app/admin/(panel)/pages/actions';

export interface PageFormValue {
  key: string;
  titleVi: string;
  titleEn: string;
  titleZh: string;
  metaTitleVi: string;
  metaTitleEn: string;
  metaTitleZh: string;
  metaDescVi: string;
  metaDescEn: string;
  metaDescZh: string;
  ogImageUrl: string;
  isPublished: boolean;
}

export function PageForm({ initial, label }: { initial: PageFormValue; label: string }) {
  const router = useRouter();
  const [v, setV] = useState<PageFormValue>(initial);
  const [state, setState] = useState<ActionResult | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof PageFormValue>(k: K, val: PageFormValue[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setState(null);
    const res = await savePage(v as unknown as PageInput);
    setBusy(false);
    setState(res);
    if (res.ok) {
      router.push('/admin/pages');
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit}>
      {state?.error ? (
        <div className="lg-err" style={{ marginBottom: 16 }}>
          <AdminIcon name="shield" size={14} />
          {state.error}
        </div>
      ) : null}

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="ad-card">
            <div className="ad-card-head">
              <h3>Tiêu đề trang</h3>
            </div>
            <div className="ad-card-body">
              <Field label="Tiêu đề (VI)" required>
                <input
                  className="ad-input"
                  value={v.titleVi}
                  onChange={(e) => set('titleVi', e.target.value)}
                  required
                />
              </Field>
              <FieldRow>
                <Field label="Tiêu đề (EN)">
                  <input
                    className="ad-input"
                    value={v.titleEn}
                    onChange={(e) => set('titleEn', e.target.value)}
                  />
                </Field>
                <Field label="Tiêu đề (ZH)">
                  <input
                    className="ad-input"
                    value={v.titleZh}
                    onChange={(e) => set('titleZh', e.target.value)}
                  />
                </Field>
              </FieldRow>
            </div>
          </div>

          <div className="ad-card">
            <div className="ad-card-head">
              <div>
                <h3>Thẻ meta SEO</h3>
                <p>Để trống để dùng giá trị SEO mặc định của site.</p>
              </div>
            </div>
            <div
              className="ad-card-body"
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <Field label="Meta title (VI / EN / ZH)">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  <input
                    className="ad-input"
                    placeholder="VI"
                    value={v.metaTitleVi}
                    onChange={(e) => set('metaTitleVi', e.target.value)}
                  />
                  <input
                    className="ad-input"
                    placeholder="EN"
                    value={v.metaTitleEn}
                    onChange={(e) => set('metaTitleEn', e.target.value)}
                  />
                  <input
                    className="ad-input"
                    placeholder="ZH"
                    value={v.metaTitleZh}
                    onChange={(e) => set('metaTitleZh', e.target.value)}
                  />
                </div>
              </Field>
              <Field label="Meta description (VI / EN / ZH)">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  <textarea
                    className="ad-textarea"
                    placeholder="VI"
                    value={v.metaDescVi}
                    onChange={(e) => set('metaDescVi', e.target.value)}
                  />
                  <textarea
                    className="ad-textarea"
                    placeholder="EN"
                    value={v.metaDescEn}
                    onChange={(e) => set('metaDescEn', e.target.value)}
                  />
                  <textarea
                    className="ad-textarea"
                    placeholder="ZH"
                    value={v.metaDescZh}
                    onChange={(e) => set('metaDescZh', e.target.value)}
                  />
                </div>
              </Field>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="ad-card">
            <div className="ad-card-head">
              <h3>Xuất bản</h3>
            </div>
            <div
              className="ad-card-body"
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <div style={{ fontSize: 12.5, color: 'var(--ad-text-mute)' }}>
                Trang: <strong>{label}</strong>
              </div>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={v.isPublished}
                  onChange={(e) => set('isPublished', e.target.checked)}
                />
                Đã xuất bản (hiển thị công khai)
              </label>
            </div>
          </div>

          <div className="ad-card">
            <div className="ad-card-head">
              <h3>Ảnh chia sẻ</h3>
            </div>
            <div className="ad-card-body">
              <Field
                label="OG image URL"
                help="Ảnh hiển thị khi chia sẻ trang này lên mạng xã hội."
              >
                <input
                  className="ad-input"
                  value={v.ogImageUrl}
                  onChange={(e) => set('ogImageUrl', e.target.value)}
                  placeholder="/assets/og-home.jpg"
                />
              </Field>
              {v.ogImageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={v.ogImageUrl}
                  alt=""
                  style={{
                    marginTop: 8,
                    width: '100%',
                    borderRadius: 6,
                    border: '1px solid var(--ad-line)',
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <button type="submit" className="ad-btn primary" disabled={busy}>
          <AdminIcon name="check" size={15} />
          {busy ? 'Đang lưu…' : 'Lưu trang'}
        </button>
        <button type="button" className="ad-btn" onClick={() => router.push('/admin/pages')}>
          Huỷ
        </button>
      </div>
    </form>
  );
}
