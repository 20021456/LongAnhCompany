'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminIcon } from './AdminIcon';
import { Field, FieldRow } from './FormBits';
import { saveArticle, type ArticleInput, type ActionResult } from '@/app/admin/(panel)/news/actions';

export interface ArticleFormValue {
  id?: string;
  slug: string;
  categoryId: string;
  titleVi: string;
  titleEn: string;
  titleZh: string;
  excerptVi: string;
  excerptEn: string;
  excerptZh: string;
  contentVi: string;
  contentEn: string;
  contentZh: string;
  coverImageUrl: string;
  readTimeMin: number;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
}

export function ArticleForm({
  initial,
  categories,
}: {
  initial: ArticleFormValue;
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [v, setV] = useState<ArticleFormValue>(initial);
  const [state, setState] = useState<ActionResult | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof ArticleFormValue>(k: K, val: ArticleFormValue[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setState(null);
    const res = await saveArticle(v as ArticleInput);
    setBusy(false);
    setState(res);
    if (res.ok) {
      router.push('/admin/news');
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
        <div className="ad-card">
          <div className="ad-card-head">
            <h3>Nội dung bài viết</h3>
          </div>
          <div className="ad-card-body">
            <Field label="Slug (URL)" required help="Định danh duy nhất, VD: long-anh-mo-rong-2026">
              <input className="ad-input" value={v.slug} onChange={(e) => set('slug', e.target.value)} required />
            </Field>

            <Field label="Tiêu đề (VI)" required>
              <input className="ad-input" value={v.titleVi} onChange={(e) => set('titleVi', e.target.value)} required />
            </Field>
            <FieldRow>
              <Field label="Tiêu đề (EN)">
                <input className="ad-input" value={v.titleEn} onChange={(e) => set('titleEn', e.target.value)} />
              </Field>
              <Field label="Tiêu đề (ZH)">
                <input className="ad-input" value={v.titleZh} onChange={(e) => set('titleZh', e.target.value)} />
              </Field>
            </FieldRow>

            <Field label="Tóm tắt (VI)">
              <textarea className="ad-textarea" value={v.excerptVi} onChange={(e) => set('excerptVi', e.target.value)} />
            </Field>
            <FieldRow>
              <Field label="Tóm tắt (EN)">
                <textarea className="ad-textarea" value={v.excerptEn} onChange={(e) => set('excerptEn', e.target.value)} />
              </Field>
              <Field label="Tóm tắt (ZH)">
                <textarea className="ad-textarea" value={v.excerptZh} onChange={(e) => set('excerptZh', e.target.value)} />
              </Field>
            </FieldRow>

            <Field label="Nội dung (VI)" help="Hỗ trợ HTML cơ bản. Rich-text editor sẽ thêm sau.">
              <textarea
                className="ad-textarea"
                style={{ minHeight: 200 }}
                value={v.contentVi}
                onChange={(e) => set('contentVi', e.target.value)}
              />
            </Field>
            <FieldRow>
              <Field label="Nội dung (EN)">
                <textarea className="ad-textarea" style={{ minHeight: 140 }} value={v.contentEn} onChange={(e) => set('contentEn', e.target.value)} />
              </Field>
              <Field label="Nội dung (ZH)">
                <textarea className="ad-textarea" style={{ minHeight: 140 }} value={v.contentZh} onChange={(e) => set('contentZh', e.target.value)} />
              </Field>
            </FieldRow>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="ad-card">
            <div className="ad-card-head">
              <h3>Xuất bản</h3>
            </div>
            <div className="ad-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Trạng thái">
                <select className="ad-select" value={v.status} onChange={(e) => set('status', e.target.value as ArticleFormValue['status'])}>
                  <option value="draft">Bản nháp</option>
                  <option value="published">Đã đăng</option>
                  <option value="archived">Lưu trữ</option>
                </select>
              </Field>
              <Field label="Danh mục">
                <select className="ad-select" value={v.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
                  <option value="">— Không phân loại —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Thời gian đọc (phút)">
                <input
                  className="ad-input"
                  type="number"
                  value={v.readTimeMin}
                  onChange={(e) => set('readTimeMin', Number(e.target.value))}
                />
              </Field>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
                <input type="checkbox" checked={v.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} />
                Bài nổi bật
              </label>
            </div>
          </div>

          <div className="ad-card">
            <div className="ad-card-head">
              <h3>Ảnh bìa</h3>
            </div>
            <div className="ad-card-body">
              <Field label="URL ảnh bìa">
                <input
                  className="ad-input"
                  value={v.coverImageUrl}
                  onChange={(e) => set('coverImageUrl', e.target.value)}
                  placeholder="/assets/nha-may-bot-sieu-min.webp"
                />
              </Field>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <button type="submit" className="ad-btn primary" disabled={busy}>
          <AdminIcon name="check" size={15} />
          {busy ? 'Đang lưu…' : 'Lưu bài viết'}
        </button>
        <button type="button" className="ad-btn" onClick={() => router.push('/admin/news')}>
          Huỷ
        </button>
      </div>
    </form>
  );
}
