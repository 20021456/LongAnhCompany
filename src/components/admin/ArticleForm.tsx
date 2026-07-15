'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminIcon } from './AdminIcon';
import { AdminPageHead } from './AdminPageHead';
import { Field } from './FormBits';
import { EditorSection, LangTabs, StatusRadioGroup, type Lang } from './EditorChrome';
import { PeTags } from './PeTags';
import { TiptapEditor } from './TiptapEditor';
import { fmtNumberVn } from '@/lib/format';
import { uploadImage } from '@/lib/upload-client';
import {
  saveArticle,
  type ArticleInput,
  type ActionResult,
} from '@/app/admin/(panel)/news/actions';

const SUF: Record<Lang, string> = { vi: 'Vi', en: 'En', zh: 'Zh' };

/** One image attached to the article. The `featured` tile is the cover. */
export interface GalleryItem {
  src: string;
  alt: string;
  featured: boolean;
}

export interface ArticleFormValue {
  id?: string;
  slug: string;
  categoryId: string;
  /** ID of the User who authored the article. */
  authorId: string;
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
  /** ISO yyyy-mm-dd string for the <input type="date"> field. */
  publishedDate: string;
  tags: string[];
  gallery: GalleryItem[];
  metaTitleVi: string;
  metaDescVi: string;
  /** Read-only when editing — displayed in the stats panel. */
  views: number;
  comments: number;
}

export interface CategoryOption {
  id: string;
  slug: string;
  name: string;
}

export interface AuthorOption {
  id: string;
  name: string;
  role: string;
}

/** Strip Vietnamese diacritics + non-URL chars to produce a slug. */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function ArticleForm({
  initial,
  categories,
  authors,
  isNew,
}: {
  initial: ArticleFormValue;
  categories: CategoryOption[];
  authors: AuthorOption[];
  isNew: boolean;
}) {
  const router = useRouter();
  const [v, setV] = useState<ArticleFormValue>(initial);
  const [lang, setLang] = useState<Lang>('vi');
  const [state, setState] = useState<ActionResult | null>(null);
  const [busy, setBusy] = useState(false);

  // Sidebar UI-only toggles — schema doesn't model these yet (Phase 7).
  const [pinToTop, setPinToTop] = useState(false);
  const [allowComments, setAllowComments] = useState(true);

  // Gallery "Edit alt text" modal state.
  const [editAltIdx, setEditAltIdx] = useState(-1);
  const [altDraft, setAltDraft] = useState('');

  const set = <K extends keyof ArticleFormValue>(k: K, val: ArticleFormValue[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  // ─── Gallery helpers ────────────────────────────────────────────────────
  /** Append new tiles from picked files, uploading each to storage. */
  async function gAddFromFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const items: GalleryItem[] = await Promise.all(
      Array.from(files).map(async (f) => ({
        src: await uploadImage(f, 'articles'),
        alt: '',
        featured: false,
      })),
    );
    setV((p) => {
      const next = [...p.gallery, ...items];
      // First image added becomes featured by default so the cover isn't blank.
      if (!next.some((g) => g.featured) && next.length > 0) next[0].featured = true;
      return { ...p, gallery: next };
    });
  }
  function gPickFromDevice() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = () => void gAddFromFiles(input.files);
    input.click();
  }
  function gMakeFeatured(i: number) {
    setV((p) => {
      const next = p.gallery.map((g, j) => ({ ...g, featured: j === i }));
      // Keep the form's coverImageUrl pointer in sync with the chosen featured.
      return { ...p, gallery: next, coverImageUrl: next[i]?.src ?? p.coverImageUrl };
    });
  }
  function gMoveUp(i: number) {
    if (i === 0) return;
    setV((p) => {
      const c = [...p.gallery];
      [c[i - 1], c[i]] = [c[i], c[i - 1]];
      return { ...p, gallery: c };
    });
  }
  function gMoveDown(i: number) {
    setV((p) => {
      if (i >= p.gallery.length - 1) return p;
      const c = [...p.gallery];
      [c[i], c[i + 1]] = [c[i + 1], c[i]];
      return { ...p, gallery: c };
    });
  }
  function gDelete(i: number) {
    setV((p) => {
      const next = p.gallery.filter((_, j) => j !== i);
      // Re-promote the first remaining tile to featured if we just removed the cover.
      const wasFeatured = p.gallery[i]?.featured;
      if (wasFeatured && next.length > 0) next[0] = { ...next[0], featured: true };
      const cover = next.find((g) => g.featured)?.src ?? '';
      return {
        ...p,
        gallery: next,
        coverImageUrl: wasFeatured ? cover : p.coverImageUrl,
      };
    });
  }
  function gInsertIntoBody(src: string) {
    setV((p) => {
      const current = p[contentKey] as string;
      const sep = current && !current.endsWith('\n') ? '\n\n' : '';
      return { ...p, [contentKey]: `${current}${sep}![](${src})\n\n` };
    });
  }
  function gOpenAlt(i: number) {
    setEditAltIdx(i);
    setAltDraft(v.gallery[i]?.alt ?? '');
  }
  function gSaveAlt() {
    setV((p) => ({
      ...p,
      gallery: p.gallery.map((g, j) => (j === editAltIdx ? { ...g, alt: altDraft } : g)),
    }));
    setEditAltIdx(-1);
  }

  const titleKey = (`title` + SUF[lang]) as keyof ArticleFormValue;
  const excerptKey = (`excerpt` + SUF[lang]) as keyof ArticleFormValue;
  const contentKey = (`content` + SUF[lang]) as keyof ArticleFormValue;

  const title = (v[titleKey] as string) || '';
  const excerpt = (v[excerptKey] as string) || '';
  const body = (v[contentKey] as string) || '';

  // Char / word / read-time previews for the body editor.
  const bodyStats = useMemo(() => {
    const charCount = body.length;
    const words = body.split(/\s+/).filter(Boolean).length;
    const readMin = Math.max(1, Math.round(words / 200));
    return { charCount, words, readMin };
  }, [body]);

  function regenSlug() {
    const next = slugify(v.titleVi);
    set('slug', next || 'bai-moi');
  }

  function pickCoverFromDevice() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      set('coverImageUrl', await uploadImage(file, 'articles'));
    };
    input.click();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setState(null);
    const res = await saveArticle(v as unknown as ArticleInput);
    setBusy(false);
    setState(res);
    if (res.ok) {
      router.push('/admin/news');
      router.refresh();
    }
  }

  const L = lang.toUpperCase();
  const previewTitle = v.metaTitleVi || v.titleVi || 'Tiêu đề bài viết Long Anh';
  const previewDesc = v.metaDescVi || v.excerptVi || '— chưa có mô tả —';

  return (
    <form onSubmit={onSubmit}>
      <AdminPageHead
        crumbs={[
          { label: 'Tin tức', href: '/admin/news' },
          { label: isNew ? 'Bài viết mới' : v.titleVi || 'Bài viết' },
        ]}
        title={isNew ? 'Bài viết mới' : `Sửa: ${v.titleVi}`}
        sub={`/tin-tuc/${v.slug || 'bai-moi'}`}
      />

      {/* Sticky savebar */}
      <div className="pe-savebar">
        <Link href="/admin/news" className="back">
          <AdminIcon name="chevron" size={14} /> Quay lại
        </Link>
        <div className="title">
          <AdminIcon name="news" size={16} />
          <span>{isNew ? 'Bài viết mới' : v.titleVi || 'Bài viết'}</span>
          <code className="slug-chip">/tin-tuc/{v.slug || 'bai-moi'}</code>
          <span
            className={
              'lac-badge ' +
              (v.status === 'published' ? 'pub' : v.status === 'draft' ? 'draft' : 'hide')
            }
          >
            <span className="dot" />
            {v.status === 'published'
              ? 'Đã xuất bản'
              : v.status === 'draft'
                ? 'Nháp'
                : 'Đã lưu trữ'}
          </span>
        </div>
        <span className="auto" suppressHydrationWarning>
          {state?.ok ? 'Đã lưu' : 'Chưa lưu'}
        </span>
        {!isNew ? (
          <a href={`/vi/news/${v.slug}`} target="_blank" rel="noreferrer" className="lac-btn sm">
            <AdminIcon name="eye" size={12} /> Xem
          </a>
        ) : null}
        <button type="submit" className="lac-btn primary sm" disabled={busy}>
          <AdminIcon name="check" size={12} />
          {busy ? 'Đang lưu…' : 'Lưu bài viết'}
        </button>
      </div>

      {state?.error ? (
        <div className="lg-err" style={{ marginBottom: 16 }}>
          <AdminIcon name="shield" size={14} />
          {state.error}
        </div>
      ) : null}

      <LangTabs lang={lang} setLang={setLang} />

      <div className="pe-grid">
        <div className="pe-main">
          {/* 01 — COVER + TITLE + SLUG */}
          <EditorSection
            num="01"
            icon="image"
            title="Ảnh bìa & Tiêu đề"
            sub="Cover (1600×700), tiêu đề và đường dẫn"
          >
            <div
              className="ne-cover"
              onClick={pickCoverFromDevice}
              role="button"
              tabIndex={0}
              aria-label="Tải ảnh bìa"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  pickCoverFromDevice();
                }
              }}
            >
              {v.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.coverImageUrl} alt={v.titleVi || 'Ảnh bìa'} />
              ) : (
                <div className="ne-cover-empty">
                  <AdminIcon name="upload" size={26} />
                  <div>Tải ảnh bìa (khuyến nghị 1600×700)</div>
                </div>
              )}
              <div className="ne-cover-over">
                <button
                  type="button"
                  className="lac-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    pickCoverFromDevice();
                  }}
                >
                  <AdminIcon name="refresh" size={13} /> Đổi ảnh
                </button>
                {v.coverImageUrl ? (
                  <button
                    type="button"
                    className="lac-btn danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      set('coverImageUrl', '');
                    }}
                  >
                    <AdminIcon name="trash" size={13} /> Bỏ ảnh
                  </button>
                ) : null}
              </div>
            </div>

            <Field
              label={`Tiêu đề bài viết (${L})`}
              required={lang === 'vi'}
              help={`${title.length}/100 ký tự · Khuyến nghị 60-80 ký tự cho SEO`}
            >
              <input
                className="ne-title-input"
                value={title}
                onChange={(e) => set(titleKey, e.target.value as ArticleFormValue[typeof titleKey])}
                placeholder="Nhập tiêu đề bài viết…"
                required={lang === 'vi'}
              />
            </Field>

            <div className="ne-slug">
              <AdminIcon name="globe" size={13} />
              long-anh.com/tin-tuc/<code>{v.slug || 'bai-moi'}</code>
              <input
                className="lac-input"
                value={v.slug}
                onChange={(e) => set('slug', e.target.value)}
                placeholder="bai-viet-moi"
                spellCheck={false}
                style={{
                  marginLeft: 8,
                  maxWidth: 240,
                  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                  fontSize: 12,
                }}
              />
              <button
                type="button"
                className="lac-btn ghost sm"
                onClick={regenSlug}
                style={{ marginLeft: 'auto' }}
                title="Tạo lại từ tiêu đề tiếng Việt"
              >
                <AdminIcon name="refresh" size={12} /> Tạo lại slug
              </button>
            </div>

            <Field label="URL ảnh bìa (paste link)">
              <input
                className="lac-input"
                value={v.coverImageUrl}
                onChange={(e) => set('coverImageUrl', e.target.value)}
                placeholder="/assets/nha-may-bot-sieu-min.webp"
                spellCheck={false}
                style={{
                  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                  fontSize: 12,
                }}
              />
            </Field>
          </EditorSection>

          {/* 02 — EXCERPT */}
          <EditorSection
            num="02"
            icon="file"
            title="Tóm tắt (Excerpt)"
            sub="2-3 câu hiển thị trên list, social share và Google preview"
          >
            <Field
              label={`Đoạn tóm tắt (${L})`}
              required={lang === 'vi'}
              help={`${excerpt.length}/200 ký tự · 140-180 là tối ưu`}
            >
              <textarea
                className="lac-textarea"
                style={{ minHeight: 80 }}
                value={excerpt}
                onChange={(e) =>
                  set(excerptKey, e.target.value as ArticleFormValue[typeof excerptKey])
                }
                placeholder="Mô tả ngắn 2-3 câu…"
              />
            </Field>
          </EditorSection>

          {/* 03 — BODY */}
          <EditorSection
            num="03"
            icon="edit"
            title="Nội dung bài viết"
            sub="Soạn thảo nội dung chính (rich text)"
          >
            <TiptapEditor
              value={body}
              onChange={(html) => set(contentKey, html as ArticleFormValue[typeof contentKey])}
              placeholder="Viết nội dung bài viết…"
            />
            <div
              style={{
                display: 'flex',
                gap: 14,
                fontSize: 12,
                color: 'var(--ad-text-mute)',
                marginTop: 6,
              }}
            >
              <span>{fmtNumberVn(bodyStats.charCount)} ký tự</span>
              <span>~{bodyStats.readMin} phút đọc</span>
              <span>{fmtNumberVn(bodyStats.words)} từ</span>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--ad-text-mute)' }}>
              Thanh công cụ rich-text sẽ được kích hoạt ở Phase 7 — hiện tại lưu plain text.
            </div>
          </EditorSection>

          {/* 04 — IMAGE GALLERY */}
          <EditorSection
            num="04"
            icon="image"
            title="Thư viện ảnh"
            sub={`Quản lý ảnh đính kèm bài viết · ${v.gallery.length} ảnh`}
          >
            <div
              className="ne-gallery"
              onDragOver={(e) => {
                if (Array.from(e.dataTransfer.types).includes('Files')) {
                  e.preventDefault();
                }
              }}
              onDrop={(e) => {
                if (e.dataTransfer.files.length > 0) {
                  e.preventDefault();
                  void gAddFromFiles(e.dataTransfer.files);
                }
              }}
            >
              {v.gallery.map((g, i) => (
                <div key={`${g.src.slice(-12)}-${i}`} className="ne-gimg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.src} alt={g.alt} />
                  <span className="badge">IMG {String(i + 1).padStart(2, '0')}</span>
                  {g.featured ? (
                    <span className="featured-flag">
                      <AdminIcon name="star" size={10} /> Bìa
                    </span>
                  ) : null}
                  {g.alt ? <div className="alt">{g.alt}</div> : null}
                  <div className="over">
                    <button
                      type="button"
                      className="lac-btn sm"
                      title="Đặt làm ảnh bìa"
                      onClick={() => gMakeFeatured(i)}
                    >
                      <AdminIcon name="star" size={12} />
                    </button>
                    <button
                      type="button"
                      className="lac-btn sm"
                      title="Sửa mô tả (alt)"
                      onClick={() => gOpenAlt(i)}
                    >
                      <AdminIcon name="edit" size={12} />
                    </button>
                    <button
                      type="button"
                      className="lac-btn sm"
                      title="Chèn vào nội dung"
                      onClick={() => gInsertIntoBody(g.src)}
                    >
                      <AdminIcon name="plus" size={12} />
                    </button>
                    <button
                      type="button"
                      className="lac-btn sm"
                      title="Đẩy lên"
                      onClick={() => gMoveUp(i)}
                      disabled={i === 0}
                    >
                      <AdminIcon name="chevron" size={12} />
                    </button>
                    <button
                      type="button"
                      className="lac-btn sm"
                      title="Đẩy xuống"
                      onClick={() => gMoveDown(i)}
                      disabled={i === v.gallery.length - 1}
                    >
                      <AdminIcon name="chevron" size={12} />
                    </button>
                    <button
                      type="button"
                      className="lac-btn sm danger"
                      title="Xoá"
                      onClick={() => gDelete(i)}
                    >
                      <AdminIcon name="trash" size={12} />
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" className="ne-gadd" onClick={gPickFromDevice}>
                <AdminIcon name="upload" size={22} />
                <div>Tải ảnh lên</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>hoặc kéo thả</div>
              </button>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
                alignItems: 'center',
                marginTop: 12,
              }}
            >
              <button type="button" className="lac-btn" onClick={gPickFromDevice}>
                <AdminIcon name="upload" size={13} /> Thêm ảnh
              </button>
              <button type="button" className="lac-btn" disabled title="Phase 7">
                <AdminIcon name="image" size={13} /> Chọn từ thư viện chung
              </button>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--ad-text-mute)',
                  marginLeft: 'auto',
                }}
              >
                Khuyến nghị: JPG/WebP · &lt; 1MB · ảnh ngang 1200×800px
              </div>
            </div>
          </EditorSection>

          {editAltIdx >= 0 ? (
            <div className="ne-galt-modal" onClick={() => setEditAltIdx(-1)} role="presentation">
              <div
                className="ne-galt-card"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Sửa mô tả ảnh"
              >
                <h3>Mô tả ảnh (alt text)</h3>
                <Field
                  label="Văn bản thay thế"
                  help="Quan trọng cho SEO và screen reader. Mô tả ngắn gọn nội dung ảnh."
                >
                  <input
                    className="lac-input"
                    autoFocus
                    value={altDraft}
                    onChange={(e) => setAltDraft(e.target.value)}
                    placeholder="Ví dụ: Bao bột đá CaCO₃ tại kho xuất khẩu"
                  />
                </Field>
                <div className="actions">
                  <button type="button" className="lac-btn" onClick={() => setEditAltIdx(-1)}>
                    Huỷ
                  </button>
                  <button type="button" className="lac-btn primary" onClick={gSaveAlt}>
                    <AdminIcon name="check" size={13} /> Lưu
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* 05 — TAGS & RELATED */}
          <EditorSection
            num="05"
            icon="folder"
            title="Tags & Bài liên quan"
            sub='Tags hỗ trợ tìm kiếm và section "Bài liên quan"'
            defaultOpen={false}
          >
            <Field label="Tags">
              <PeTags tags={v.tags} onChange={(next) => set('tags', next)} />
            </Field>
            <div style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>
              Bài liên quan thủ công sẽ thêm ở Phase 7 — hiện tại hệ thống tự gợi ý theo danh mục +
              tag.
            </div>
          </EditorSection>

          {/* 06 — STATS (only when editing existing) */}
          {!isNew ? (
            <EditorSection
              num="06"
              icon="trend"
              title="Thống kê bài viết"
              sub="Hiển thị, không cho phép sửa"
              defaultOpen={false}
            >
              <div className="ne-meta-row">
                <div>
                  <div className="lbl">Lượt xem</div>
                  <div className="val">{fmtNumberVn(v.views)}</div>
                </div>
                <div>
                  <div className="lbl">Bình luận</div>
                  <div className="val">{fmtNumberVn(v.comments)}</div>
                </div>
                <div>
                  <div className="lbl">Thời gian đọc</div>
                  <div className="val">{v.readTimeMin} phút</div>
                </div>
              </div>
            </EditorSection>
          ) : null}

          {/* 07 — SEO */}
          <EditorSection
            num={isNew ? '06' : '07'}
            icon="seo"
            title="SEO & Mạng xã hội"
            sub="Meta title, meta description và xem trước trên Google"
          >
            <Field label="Meta title (VI)" help="50–60 ký tự là tối ưu.">
              <input
                className="lac-input"
                value={v.metaTitleVi}
                onChange={(e) => set('metaTitleVi', e.target.value)}
                placeholder="Để trống → dùng tiêu đề bài viết"
              />
            </Field>
            <Field label="Meta description (VI)" help="150–160 ký tự là tối ưu.">
              <textarea
                className="lac-textarea"
                value={v.metaDescVi}
                onChange={(e) => set('metaDescVi', e.target.value)}
                placeholder="Để trống → dùng đoạn tóm tắt"
              />
            </Field>
            <div className="pe-google">
              <div className="lbl">Xem trước trên Google</div>
              <div className="url">
                long-anh.com{' '}
                <span style={{ color: '#5f6368' }}>› tin-tuc › {v.slug || 'bai-moi'}</span>
              </div>
              <div className="ttl">{previewTitle}</div>
              <div className="desc">{previewDesc}</div>
            </div>
          </EditorSection>
        </div>

        <aside className="pe-side">
          {/* Trạng thái */}
          <div className="lac-card">
            <div className="lac-card-head">
              <h3>Trạng thái</h3>
            </div>
            <div style={{ padding: 14 }}>
              <StatusRadioGroup<ArticleFormValue['status']>
                value={v.status}
                onChange={(s) => set('status', s)}
                options={[
                  { value: 'draft', label: 'Nháp', hint: 'Chỉ admin thấy được' },
                  { value: 'published', label: 'Đã xuất bản', hint: 'Hiển thị trên website' },
                  { value: 'archived', label: 'Lưu trữ', hint: 'Ẩn khỏi danh sách công khai' },
                ]}
              />
            </div>
          </div>

          {/* Danh mục */}
          <div className="lac-card">
            <div className="lac-card-head">
              <h3>Danh mục</h3>
            </div>
            <div style={{ padding: 14 }}>
              <div className="ne-cat-radios">
                {categories.map((c) => {
                  const on = v.categoryId === c.id;
                  return (
                    <label key={c.id} className={on ? 'on' : ''}>
                      <input
                        type="radio"
                        name="article-category"
                        value={c.id}
                        checked={on}
                        onChange={() => set('categoryId', c.id)}
                      />
                      {c.name}
                    </label>
                  );
                })}
                <label className={!v.categoryId ? 'on' : ''}>
                  <input
                    type="radio"
                    name="article-category"
                    value=""
                    checked={!v.categoryId}
                    onChange={() => set('categoryId', '')}
                  />
                  — Không phân loại —
                </label>
              </div>
            </div>
          </div>

          {/* Cờ & hiển thị */}
          <div className="lac-card">
            <div className="lac-card-head">
              <h3>Cờ &amp; hiển thị</h3>
            </div>
            <div
              style={{
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                fontSize: 13,
              }}
            >
              <label className="ne-flag-row">
                <span>Bài viết nổi bật (Featured)</span>
                <input
                  type="checkbox"
                  checked={v.isFeatured}
                  onChange={(e) => set('isFeatured', e.target.checked)}
                />
              </label>
              <label className="ne-flag-row" title="Lưu ở Phase 7">
                <span>Ghim lên đầu danh mục</span>
                <input
                  type="checkbox"
                  checked={pinToTop}
                  onChange={(e) => setPinToTop(e.target.checked)}
                />
              </label>
              <label className="ne-flag-row" title="Lưu ở Phase 7">
                <span>Cho phép bình luận</span>
                <input
                  type="checkbox"
                  checked={allowComments}
                  onChange={(e) => setAllowComments(e.target.checked)}
                />
              </label>
            </div>
          </div>

          {/* Tác giả & ngày đăng */}
          <div className="lac-card">
            <div className="lac-card-head">
              <h3>Tác giả &amp; ngày đăng</h3>
            </div>
            <div
              style={{
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <Field label="Tác giả">
                <select
                  className="lac-select"
                  value={v.authorId}
                  onChange={(e) => set('authorId', e.target.value)}
                >
                  <option value="">— Chưa chọn —</option>
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} · {a.role}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Ngày xuất bản">
                <input
                  className="lac-input"
                  type="date"
                  value={v.publishedDate}
                  onChange={(e) => set('publishedDate', e.target.value)}
                />
              </Field>
              <Field label="Thời gian đọc (phút)">
                <input
                  className="lac-input"
                  type="number"
                  min={1}
                  max={60}
                  value={v.readTimeMin}
                  onChange={(e) => set('readTimeMin', Number(e.target.value) || 3)}
                />
              </Field>
              {!isNew ? (
                <div
                  style={{
                    background: 'var(--ad-line-soft)',
                    borderRadius: 6,
                    padding: 10,
                    fontSize: 11.5,
                    color: 'var(--ad-text-soft)',
                  }}
                >
                  {fmtNumberVn(v.views)} lượt xem · {v.comments} bình luận · {v.readTimeMin} phút
                  đọc
                </div>
              ) : null}
            </div>
          </div>
        </aside>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <button type="submit" className="lac-btn primary" disabled={busy}>
          <AdminIcon name="check" size={15} />
          {busy ? 'Đang lưu…' : 'Lưu bài viết'}
        </button>
        <button type="button" className="lac-btn" onClick={() => router.push('/admin/news')}>
          Huỷ
        </button>
      </div>
    </form>
  );
}
