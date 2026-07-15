'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminIcon } from './AdminIcon';
import { Field, FieldRow } from './FormBits';
import { LangTabs, type Lang } from './EditorChrome';
import { PeImg } from './PeImg';
import {
  saveCertification,
  type CertificationInput,
  type ActionResult,
} from '@/app/admin/(panel)/certifications/actions';

export interface CertificationFormValue {
  id?: string;
  code: string;
  name: string;
  descriptionVi: string;
  descriptionEn: string;
  descriptionZh: string;
  badgeImageUrl: string;
  documentUrl: string;
  sortOrder: number;
}

const SUF: Record<Lang, string> = { vi: 'Vi', en: 'En', zh: 'Zh' };

export function CertificationForm({ initial }: { initial: CertificationFormValue }) {
  const router = useRouter();
  const [v, setV] = useState<CertificationFormValue>(initial);
  const [lang, setLang] = useState<Lang>('vi');
  const [state, setState] = useState<ActionResult | null>(null);
  const [busy, setBusy] = useState(false);

  const isNew = !initial.id;

  const set = <K extends keyof CertificationFormValue>(k: K, val: CertificationFormValue[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  /** Localized description accessor — maps to descriptionVi/En/Zh. */
  const descKey = (`description` + SUF[lang]) as keyof CertificationFormValue;
  const desc = (v[descKey] as string) || '';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setState(null);
    const res = await saveCertification(v as unknown as CertificationInput);
    setBusy(false);
    setState(res);
    if (res.ok) {
      router.push('/admin/certifications');
      router.refresh();
    }
  }

  const L = lang.toUpperCase();

  return (
    <form onSubmit={onSubmit}>
      {state?.error ? (
        <div className="lg-err" style={{ marginBottom: 16 }}>
          <AdminIcon name="shield" size={14} />
          {state.error}
        </div>
      ) : null}

      <LangTabs lang={lang} setLang={setLang} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: 20,
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="ad-card">
            <div className="ad-card-head">
              <h3>Thông tin chứng nhận</h3>
            </div>
            <div className="ad-card-body">
              {/* code + name are locale-independent — only shown once. */}
              <FieldRow>
                <Field label="Mã chứng nhận" required help="VD: iso · reach · sgs · msds">
                  <input
                    className="ad-input"
                    value={v.code}
                    onChange={(e) => set('code', e.target.value)}
                    placeholder="iso"
                    spellCheck={false}
                    required
                  />
                </Field>
                <Field label="Tên chứng nhận" required help="Dùng chung cho 3 ngôn ngữ.">
                  <input
                    className="ad-input"
                    value={v.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="ISO 9001:2015"
                    required
                  />
                </Field>
              </FieldRow>

              <Field label={`Mô tả (${L})`}>
                <textarea
                  className="ad-textarea"
                  style={{ minHeight: 120 }}
                  value={desc}
                  onChange={(e) =>
                    set(descKey, e.target.value as CertificationFormValue[typeof descKey])
                  }
                  placeholder="Mô tả ngắn về chứng nhận…"
                />
              </Field>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="ad-card">
            <div className="ad-card-head">
              <h3>Ảnh huy hiệu</h3>
            </div>
            <div className="ad-card-body">
              <PeImg
                src={v.badgeImageUrl}
                alt={v.name || 'Huy hiệu chứng nhận'}
                onChange={(url) => set('badgeImageUrl', url)}
              />
              <Field label="URL ảnh huy hiệu">
                <input
                  className="ad-input"
                  value={v.badgeImageUrl}
                  onChange={(e) => set('badgeImageUrl', e.target.value)}
                  placeholder="/assets/cert-iso.webp"
                  spellCheck={false}
                  style={{
                    fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                    fontSize: 12,
                  }}
                />
              </Field>
            </div>
          </div>

          <div className="ad-card">
            <div className="ad-card-head">
              <h3>Chi tiết</h3>
            </div>
            <div
              className="ad-card-body"
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <Field label="URL tài liệu" help="Liên kết tới file PDF (tuỳ chọn).">
                <input
                  className="ad-input"
                  value={v.documentUrl}
                  onChange={(e) => set('documentUrl', e.target.value)}
                  placeholder="/docs/iso-9001.pdf"
                  spellCheck={false}
                  style={{
                    fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                    fontSize: 12,
                  }}
                />
              </Field>
              <Field label="Thứ tự hiển thị" help="Số nhỏ hiển thị trước.">
                <input
                  className="ad-input"
                  type="number"
                  value={v.sortOrder}
                  onChange={(e) => set('sortOrder', Number(e.target.value) || 0)}
                />
              </Field>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <button type="submit" className="ad-btn primary" disabled={busy}>
          <AdminIcon name="check" size={15} />
          {busy ? 'Đang lưu…' : isNew ? 'Thêm chứng nhận' : 'Lưu chứng nhận'}
        </button>
        <button
          type="button"
          className="ad-btn"
          onClick={() => router.push('/admin/certifications')}
        >
          Huỷ
        </button>
      </div>
    </form>
  );
}
