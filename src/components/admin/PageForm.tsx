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

export interface PageHeroLocale {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export type PageHeroValue = Record<Lang, PageHeroLocale>;

const SUF: Record<Lang, string> = { vi: 'Vi', en: 'En', zh: 'Zh' };

export function PageForm({
  initial,
  label,
  path,
  initialHero,
}: {
  initial: PageFormValue;
  label: string;
  path: string;
  /** Present only for pages that expose an editable hero block (e.g. home). */
  initialHero?: PageHeroValue;
}) {
  const router = useRouter();
  const [v, setV] = useState<PageFormValue>(initial);
  const [hero, setHero] = useState<PageHeroValue | null>(initialHero ?? null);
  const [lang, setLang] = useState<Lang>('vi');
  const [state, setState] = useState<ActionResult | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof PageFormValue>(k: K, val: PageFormValue[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  const fk = (base: string): keyof PageFormValue => (base + SUF[lang]) as keyof PageFormValue;

  const setHeroField = (field: keyof PageHeroLocale, val: string) =>
    setHero((h) => (h ? { ...h, [lang]: { ...h[lang], [field]: val } } : h));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setState(null);
    const res = await savePage({
      ...v,
      hero: hero ?? undefined,
    } as unknown as PageInput);
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

  // Dynamic section numbering — hero (when present) takes slot 01.
  let n = 0;
  const next = () => String(++n).padStart(2, '0');
  const heroNum = hero ? next() : '';
  const titleNum = next();
  const seoNum = next();

  const h = hero?.[lang];
  const L = lang.toUpperCase();

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
          {hero && h ? (
            <EditorSection
              num={heroNum}
              icon="layers"
              title="Hero — Banner đầu trang"
              sub="Eyebrow, tiêu đề 2 dòng, mô tả và 2 nút CTA"
            >
              <Field label={`Eyebrow — chữ nhỏ phía trên (${L})`}>
                <input
                  className="ad-input"
                  value={h.eyebrow}
                  onChange={(e) => setHeroField('eyebrow', e.target.value)}
                />
              </Field>
              <div className="pe-row">
                <Field label={`Tiêu đề dòng 1 (${L})`}>
                  <input
                    className="ad-input"
                    value={h.titleLine1}
                    onChange={(e) => setHeroField('titleLine1', e.target.value)}
                  />
                </Field>
                <Field label={`Tiêu đề dòng 2 — chữ cam (${L})`}>
                  <input
                    className="ad-input"
                    value={h.titleLine2}
                    onChange={(e) => setHeroField('titleLine2', e.target.value)}
                  />
                </Field>
              </div>
              <Field label={`Mô tả ngắn dưới tiêu đề (${L})`}>
                <textarea
                  className="ad-textarea"
                  value={h.sub}
                  onChange={(e) => setHeroField('sub', e.target.value)}
                />
              </Field>
              <div className="pe-row">
                <Field label={`Nút chính — chữ (${L})`} help="Liên kết tới trang Sản phẩm.">
                  <input
                    className="ad-input"
                    value={h.ctaPrimary}
                    onChange={(e) => setHeroField('ctaPrimary', e.target.value)}
                  />
                </Field>
                <Field label={`Nút phụ — chữ (${L})`} help="Liên kết tới trang Liên hệ.">
                  <input
                    className="ad-input"
                    value={h.ctaSecondary}
                    onChange={(e) => setHeroField('ctaSecondary', e.target.value)}
                  />
                </Field>
              </div>
            </EditorSection>
          ) : null}

          <EditorSection
            num={titleNum}
            icon="file"
            title="Tiêu đề trang"
            sub="Tên trang hiển thị theo từng ngôn ngữ"
          >
            <Field
              label={`Tiêu đề (${L})`}
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
            num={seoNum}
            icon="seo"
            title="SEO & Mạng xã hội"
            sub="Hiển thị trên Google, Facebook, Zalo"
          >
            <Field label={`Meta title (${L})`} help="50–60 ký tự là tối ưu.">
              <input
                className="ad-input"
                value={v[metaTitleKey] as string}
                onChange={(e) => set(metaTitleKey, e.target.value)}
                placeholder="Để trống → dùng tiêu đề trang"
              />
            </Field>
            <Field label={`Meta description (${L})`} help="150–160 ký tự là tối ưu.">
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
              <div>
                {hero
                  ? 'Sửa Hero ở trên rồi bấm Lưu — thay đổi hiện ngay trên website.'
                  : 'Nội dung từng section của trang này lấy từ dữ liệu site.'}
              </div>
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
