'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminIcon } from './AdminIcon';
import { AdminPageHead } from './AdminPageHead';
import { Field } from './FormBits';
import { LangTabs, EditorSection, StatusRadioGroup, type Lang } from './EditorChrome';
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

const SUF: Record<Lang, string> = { vi: 'Vi', en: 'En', zh: 'Zh' };

export function PageForm({
  initial,
  label,
  path,
}: {
  initial: PageFormValue;
  label: string;
  path: string;
}) {
  const router = useRouter();
  const [v, setV] = useState<PageFormValue>(initial);
  const [lang, setLang] = useState<Lang>('vi');
  const [state, setState] = useState<ActionResult | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof PageFormValue>(k: K, val: PageFormValue[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  const fk = (base: string): keyof PageFormValue => (base + SUF[lang]) as keyof PageFormValue;

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

  const titleKey = fk('title');
  const metaTitleKey = fk('metaTitle');
  const metaDescKey = fk('metaDesc');
  const previewTitle = (v[metaTitleKey] as string) || (v[titleKey] as string) || label;
  const previewDesc = (v[metaDescKey] as string) || '— chưa có mô tả —';

  return (
    <form onSubmit={onSubmit}>
      <AdminPageHead
        crumbs={[{ label: 'Trang', href: '/admin/pages' }, { label }]}
        title={`Sửa trang — ${label}`}
        sub={path}
        actions={
          <>
            <a href={path} target="_blank" rel="noreferrer" className="ad-btn">
              <AdminIcon name="eye" size={14} /> Xem website
            </a>
            <button type="submit" className="ad-btn primary" disabled={busy}>
              <AdminIcon name="check" size={15} />
              {busy ? 'Đang lưu…' : 'Lưu & Xuất bản'}
            </button>
          </>
        }
      />

      {state?.error ? (
        <div className="lg-err" style={{ marginBottom: 16 }}>
          <AdminIcon name="shield" size={14} />
          {state.error}
        </div>
      ) : null}

      <LangTabs lang={lang} setLang={setLang} />

      <div className="pe-grid">
        <div className="pe-main">
          <EditorSection
            num="01"
            icon="file"
            title="Tiêu đề trang"
            sub="Tên trang hiển thị theo từng ngôn ngữ"
          >
            <Field
              label={`Tiêu đề (${lang.toUpperCase()})`}
              required={lang === 'vi'}
              help="Dùng cho tiêu đề tab trình duyệt và breadcrumb."
            >
              <input
                className="ad-input"
                value={v[titleKey] as string}
                onChange={(e) => set(titleKey, e.target.value)}
                required={lang === 'vi'}
              />
            </Field>
          </EditorSection>

          <EditorSection
            num="02"
            icon="seo"
            title="SEO & Mạng xã hội"
            sub="Hiển thị trên Google, Facebook, Zalo"
          >
            <Field label={`Meta title (${lang.toUpperCase()})`} help="50–60 ký tự là tối ưu.">
              <input
                className="ad-input"
                value={v[metaTitleKey] as string}
                onChange={(e) => set(metaTitleKey, e.target.value)}
                placeholder="Để trống → dùng tiêu đề trang"
              />
            </Field>
            <Field
              label={`Meta description (${lang.toUpperCase()})`}
              help="150–160 ký tự là tối ưu."
            >
              <textarea
                className="ad-textarea"
                value={v[metaDescKey] as string}
                onChange={(e) => set(metaDescKey, e.target.value)}
              />
            </Field>
            <Field
              label="Ảnh chia sẻ (Open Graph)"
              help="Hiển thị khi share lên Facebook/Zalo · 1200×630px."
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
                  width: '100%',
                  maxWidth: 360,
                  borderRadius: 6,
                  border: '1px solid var(--ad-line)',
                }}
              />
            ) : null}
            <div className="pe-google">
              <div className="lbl">Xem trước trên Google</div>
              <div className="url">
                long-anh.com <span style={{ color: '#5f6368' }}>› {path}</span>
              </div>
              <div className="ttl">{previewTitle}</div>
              <div className="desc">{previewDesc}</div>
            </div>
          </EditorSection>
        </div>

        <aside className="pe-side">
          <div className="ad-card">
            <div className="ad-card-head">
              <h3>Trạng thái</h3>
            </div>
            <div style={{ padding: 14 }}>
              <StatusRadioGroup<'pub' | 'hide'>
                value={v.isPublished ? 'pub' : 'hide'}
                onChange={(s) => set('isPublished', s === 'pub')}
                options={[
                  { value: 'pub', label: 'Đã xuất bản', hint: 'Hiển thị trên website' },
                  { value: 'hide', label: 'Đã ẩn', hint: 'Không hiển thị, vẫn giữ dữ liệu' },
                ]}
              />
            </div>
          </div>

          <div className="ad-card">
            <div className="ad-card-head">
              <h3>Đường dẫn</h3>
            </div>
            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="ad-code" style={{ display: 'inline-block', width: 'fit-content' }}>
                {path}
              </span>
              <div style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>
                Đường dẫn của các trang chính là cố định, không chỉnh sửa được.
              </div>
            </div>
          </div>

          <div className="ad-card">
            <div className="ad-card-head">
              <h3>Thông tin</h3>
            </div>
            <div
              style={{
                padding: 14,
                fontSize: 12.5,
                color: 'var(--ad-text-soft)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div>
                Mã trang: <span className="ad-code">{v.key}</span>
              </div>
              <div>Nội dung từng section (hero, thống kê…) lấy từ dữ liệu site.</div>
            </div>
          </div>
        </aside>
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
