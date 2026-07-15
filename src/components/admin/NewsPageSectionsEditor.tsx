'use client';

import { AdminIcon } from './AdminIcon';
import { Field } from './FormBits';
import { PeImg } from './PeImg';
import { EditorSection, type Lang } from './EditorChrome';
import { fmtNumberVn } from '@/lib/format';
import {
  NEWS_PAGE_SECTION_KEYS,
  type NewsPageSections,
  type NewsPageSectionKey,
  type NewsPageSectionsLocale,
  type NewsFeaturedMode,
  type NewsListSort,
  type NewsListLayout,
  type NewsByCategoryMode,
} from '@/lib/news-page-content';

/** Minimal article catalog entry passed in from the server. */
export interface ArticleChip {
  id: string;
  titleVi: string;
  titleEn: string;
  titleZh: string;
  views: number;
  cat: string;
  /** Published date ISO yyyy-mm-dd — used for sort previews. */
  date: string;
}

/**
 * 6-section editor for the news listing page (`/admin/pages/news`).
 *
 * Ported from the prototype admin/page-edit-news.html:
 *   01 Hero       (eyebrow + title + sub + search placeholder + toggle)
 *   02 Categories (N category rows: label + slug)
 *   03 Featured   (mode select + ordered list of selected article IDs)
 *   04 List + Sidebar config (perPage + sort + layout radio + 4 sidebar toggles)
 *   05 News by category (eyebrow + title + mode + articlesPerCategory)
 *   06 Newsletter CTA (title + sub + placeholder + button + footer + mailingListId)
 */
export function NewsPageSectionsEditor({
  sections,
  lang,
  onPatch,
  currentArticles,
}: {
  sections: NewsPageSections;
  lang: Lang;
  onPatch: (key: NewsPageSectionKey, patch: Record<string, unknown>) => void;
  currentArticles?: ArticleChip[];
}) {
  const C: NewsPageSectionsLocale = sections[lang];
  const L = lang.toUpperCase();

  let n = 0;
  const next = () => String(++n).padStart(2, '0');

  const articleMap = new Map((currentArticles ?? []).map((a) => [a.id, a]));
  const articleLabel = (id: string) => {
    const a = articleMap.get(id);
    if (!a) return id;
    return lang === 'en' ? a.titleEn : lang === 'zh' ? a.titleZh : a.titleVi;
  };
  const articleViews = (id: string) => articleMap.get(id)?.views ?? 0;

  // Auto-featured fallback when mode != 'manual': top 5 by views.
  const autoFeatured = [...(currentArticles ?? [])].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <>
      {/* 01 — HERO */}
      <EditorSection
        num={next()}
        icon="layers"
        title="Hero — Banner đầu trang"
        sub="Eyebrow, tiêu đề lớn và thanh tìm kiếm bài viết"
      >
        <div className="pe-row">
          <Field label={`Eyebrow (${L})`}>
            <input
              className="ad-input"
              value={C.hero.eyebrow}
              onChange={(e) => onPatch('hero', { eyebrow: e.target.value })}
            />
          </Field>
          <Field label={`Tiêu đề chính (${L})`} required={lang === 'vi'}>
            <input
              className="ad-input"
              value={C.hero.title}
              onChange={(e) => onPatch('hero', { title: e.target.value })}
              required={lang === 'vi'}
            />
          </Field>
        </div>
        <Field label={`Mô tả ngắn (${L})`}>
          <textarea
            className="ad-textarea"
            value={C.hero.sub}
            onChange={(e) => onPatch('hero', { sub: e.target.value })}
          />
        </Field>
        <div className="pe-imgrow" style={{ marginTop: 8 }}>
          <PeImg
            src={C.hero.imageUrl ?? ''}
            alt=""
            size={C.hero.imageUrl ? 'Ảnh nền hero' : undefined}
            onChange={(dataUrl) => onPatch('hero', { imageUrl: dataUrl })}
          />
          <div className="pe-stack">
            <Field label="Đường dẫn ảnh nền hero">
              <input
                className="ad-input"
                value={C.hero.imageUrl ?? ''}
                spellCheck={false}
                style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 12 }}
                onChange={(e) => onPatch('hero', { imageUrl: e.target.value })}
              />
            </Field>
          </div>
        </div>
        <div className="pe-row">
          <Field label={`Placeholder ô tìm kiếm (${L})`}>
            <input
              className="ad-input"
              value={C.hero.searchPlaceholder}
              onChange={(e) => onPatch('hero', { searchPlaceholder: e.target.value })}
            />
          </Field>
          <Field label="Hiển thị thanh tìm kiếm hero">
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                paddingTop: 8,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={C.hero.searchEnabled}
                onChange={(e) => onPatch('hero', { searchEnabled: e.target.checked })}
              />
              <span style={{ color: 'var(--ad-text-mute)' }}>
                {C.hero.searchEnabled ? 'Bật' : 'Tắt'}
              </span>
            </label>
          </Field>
        </div>
      </EditorSection>

      {/* 02 — CATEGORIES */}
      <EditorSection
        num={next()}
        icon="folder"
        title="Danh mục bài viết"
        sub={`${C.categories.items.length} chuyên mục dùng làm filter và section dưới trang`}
      >
        <div className="pe-list">
          {C.categories.items.map((cat, i) => (
            <div key={i} className="pe-list-item">
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 0.5fr',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                <input
                  className="ad-input"
                  placeholder={`Tên hiển thị (${L})`}
                  value={cat.label}
                  onChange={(e) => {
                    const items = [...C.categories.items];
                    items[i] = { ...cat, label: e.target.value };
                    onPatch('categories', { items });
                  }}
                />
                <input
                  className="ad-input"
                  placeholder="Slug (URL)"
                  value={cat.slug}
                  spellCheck={false}
                  style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 12 }}
                  onChange={(e) => {
                    const items = [...C.categories.items];
                    items[i] = { ...cat, slug: e.target.value };
                    onPatch('categories', { items });
                  }}
                />
                <span style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>
                  {currentArticles?.filter((a) => a.cat === cat.slug).length ?? 0} bài
                </span>
              </div>
              <div className="actions">
                <button
                  type="button"
                  title="Xoá"
                  onClick={() => {
                    const items = C.categories.items.filter((_, j) => j !== i);
                    onPatch('categories', { items });
                  }}
                >
                  <AdminIcon name="trash" size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="ad-btn sm"
          style={{ width: 'fit-content', marginTop: 10 }}
          onClick={() =>
            onPatch('categories', {
              items: [...C.categories.items, { label: '', slug: '' }],
            })
          }
        >
          <AdminIcon name="plus" size={13} /> Thêm danh mục
        </button>
      </EditorSection>

      {/* 03 — FEATURED */}
      <EditorSection
        num={next()}
        icon="star"
        title="Tin nổi bật (Trending)"
        sub="5 bài hiển thị to ở đầu trang"
      >
        <Field label="Cách chọn">
          <select
            className="ad-select"
            value={C.featured.mode}
            onChange={(e) => onPatch('featured', { mode: e.target.value as NewsFeaturedMode })}
          >
            <option value="auto-views">Tự động — Top 5 bài theo lượt xem 30 ngày</option>
            <option value="manual">Thủ công — chọn từng bài</option>
            <option value="flag">Bài có cờ &quot;Nổi bật&quot;</option>
          </select>
        </Field>

        {C.featured.mode === 'manual' ? (
          <>
            <div
              style={{
                background: '#fff',
                border: '1px solid var(--ad-line)',
                borderRadius: 8,
                padding: 12,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--ad-text-mute)',
                  marginBottom: 8,
                  fontWeight: 500,
                }}
              >
                Bài đang ghim ({C.featured.articleIds.length})
              </div>
              {C.featured.articleIds.length === 0 ? (
                <div style={{ fontSize: 12.5, color: 'var(--ad-text-mute)', padding: 8 }}>
                  Chưa chọn bài nào — chọn từ danh sách bên dưới.
                </div>
              ) : (
                <div className="pe-stack">
                  {C.featured.articleIds.map((id, i) => {
                    const inCatalog = articleMap.has(id);
                    return (
                      <div
                        key={`${id}-${i}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '8px 10px',
                          background: 'var(--ad-line-soft)',
                          borderRadius: 6,
                          fontSize: 12.5,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                            fontSize: 11,
                            color: 'var(--ad-primary)',
                            fontWeight: 600,
                            background: '#fff',
                            padding: '2px 6px',
                            borderRadius: 4,
                          }}
                        >
                          #{i + 1}
                        </span>
                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {inCatalog ? (
                            articleLabel(id)
                          ) : (
                            <span style={{ color: 'var(--ad-danger)' }}>
                              ⚠ Bài #{id} không có trong catalog
                            </span>
                          )}
                        </div>
                        <span style={{ color: 'var(--ad-text-mute)', fontSize: 11.5 }}>
                          {inCatalog ? `${fmtNumberVn(articleViews(id))} xem` : '—'}
                        </span>
                        <button
                          type="button"
                          title={`Bỏ #${i + 1}`}
                          aria-label={`Bỏ bài #${i + 1}`}
                          style={{
                            border: 0,
                            background: 'transparent',
                            cursor: 'pointer',
                            color: 'var(--ad-text-mute)',
                          }}
                          onClick={() => {
                            const articleIds = C.featured.articleIds.filter((_, j) => j !== i);
                            onPatch('featured', { articleIds });
                          }}
                        >
                          <AdminIcon name="x" size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ marginTop: 12 }}>
              <select
                className="ad-select"
                value=""
                onChange={(e) => {
                  const id = e.target.value;
                  if (!id) return;
                  if (C.featured.articleIds.includes(id)) return;
                  onPatch('featured', { articleIds: [...C.featured.articleIds, id] });
                }}
              >
                <option value="">+ Thêm bài vào featured…</option>
                {(currentArticles ?? [])
                  .filter((a) => !C.featured.articleIds.includes(a.id))
                  .map((a) => {
                    const label = lang === 'en' ? a.titleEn : lang === 'zh' ? a.titleZh : a.titleVi;
                    return (
                      <option key={a.id} value={a.id}>
                        #{a.id} · {label} ({fmtNumberVn(a.views)} xem)
                      </option>
                    );
                  })}
              </select>
            </div>
          </>
        ) : (
          <div
            style={{
              background: '#fff',
              border: '1px solid var(--ad-line)',
              borderRadius: 8,
              padding: 12,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: 'var(--ad-text-mute)',
                marginBottom: 8,
                fontWeight: 500,
              }}
            >
              Xem trước —{' '}
              {C.featured.mode === 'auto-views' ? 'Top 5 theo lượt xem' : 'Bài có cờ Nổi bật'} (
              {autoFeatured.length})
            </div>
            {autoFeatured.length === 0 ? (
              <div style={{ fontSize: 12.5, color: 'var(--ad-text-mute)', padding: 8 }}>
                Chưa có bài viết — thêm ở /admin/news.
              </div>
            ) : (
              <div className="pe-stack">
                {autoFeatured.map((a, i) => {
                  const label = lang === 'en' ? a.titleEn : lang === 'zh' ? a.titleZh : a.titleVi;
                  return (
                    <div
                      key={a.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 10px',
                        background: 'var(--ad-line-soft)',
                        borderRadius: 6,
                        fontSize: 12.5,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                          fontSize: 11,
                          color: 'var(--ad-primary)',
                          fontWeight: 600,
                          background: '#fff',
                          padding: '2px 6px',
                          borderRadius: 4,
                        }}
                      >
                        #{i + 1}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {label}
                      </div>
                      <span style={{ color: 'var(--ad-text-mute)', fontSize: 11.5 }}>
                        {fmtNumberVn(a.views)} xem
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ fontSize: 11.5, color: 'var(--ad-text-mute)', marginTop: 8 }}>
              Danh sách tự động — đổi sang &quot;Thủ công&quot; để chọn từng bài.
            </div>
          </div>
        )}
      </EditorSection>

      {/* 04 — LIST + SIDEBAR CONFIG */}
      <EditorSection
        num={next()}
        icon="list"
        title="Danh sách bài viết & Sidebar"
        sub="Bố cục chính + cột phải"
      >
        <div className="pe-row">
          <Field label="Số bài/trang">
            <input
              className="ad-input"
              type="number"
              min={3}
              max={48}
              value={C.listConfig.perPage}
              onChange={(e) => onPatch('listConfig', { perPage: Number(e.target.value) || 9 })}
            />
          </Field>
          <Field label="Sắp xếp mặc định">
            <select
              className="ad-select"
              value={C.listConfig.sort}
              onChange={(e) => onPatch('listConfig', { sort: e.target.value as NewsListSort })}
            >
              <option value="newest">Mới nhất trước</option>
              <option value="oldest">Cũ nhất trước</option>
              <option value="most-viewed">Lượt xem cao nhất</option>
              <option value="most-commented">Nhiều bình luận nhất</option>
            </select>
          </Field>
        </div>

        <Field label="Layout danh sách chính">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(
              [
                ['grid-3', 'Grid 3 cột'],
                ['grid-2', 'Grid 2 cột'],
                ['list-image-left', 'List dọc, ảnh trái'],
              ] as [NewsListLayout, string][]
            ).map(([val, label]) => {
              const on = C.listConfig.layout === val;
              return (
                <label
                  key={val}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 12px',
                    border: '1px solid var(--ad-line)',
                    borderRadius: 6,
                    fontSize: 13,
                    cursor: 'pointer',
                    background: on ? 'var(--ad-primary-soft)' : '#fff',
                    color: on ? 'var(--ad-primary)' : 'inherit',
                  }}
                >
                  <input
                    type="radio"
                    name="news-layout"
                    checked={on}
                    onChange={() => onPatch('listConfig', { layout: val })}
                  />
                  {label}
                </label>
              );
            })}
          </div>
        </Field>

        <div style={{ borderTop: '1px solid var(--ad-line-soft)', paddingTop: 12 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--ad-text-mute)',
              letterSpacing: '.05em',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            Sidebar (cột phải)
          </div>
          <div className="pe-stack">
            {(
              [
                ['sidebarHotTopics', 'Khối "Tiêu điểm" (Hot Topics) — top 5 theo lượt xem'],
                ['sidebarLatest', 'Khối "Tin mới" / "Đọc nhiều" (tabs)'],
                ['sidebarNewsletter', 'Khối "Đăng ký nhận tin"'],
                ['sidebarAd', 'Banner Quảng cáo CTA "Yêu cầu báo giá"'],
              ] as [keyof NewsPageSectionsLocale['listConfig'], string][]
            ).map(([key, label]) => {
              const on = Boolean(C.listConfig[key]);
              return (
                <label
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 13,
                    gap: 12,
                    padding: '8px 0',
                  }}
                >
                  <span>{label}</span>
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={(e) => onPatch('listConfig', { [key]: e.target.checked })}
                  />
                </label>
              );
            })}
          </div>
        </div>
      </EditorSection>

      {/* 05 — NEWS BY CATEGORY */}
      <EditorSection
        num={next()}
        icon="grid"
        title="Section 'Tin theo chủ đề'"
        sub="Mỗi danh mục có 1 row riêng hiển thị 3-4 bài mới nhất"
        defaultOpen={false}
      >
        <div className="pe-row">
          <Field label={`Eyebrow (${L})`}>
            <input
              className="ad-input"
              value={C.byCategory.eyebrow}
              onChange={(e) => onPatch('byCategory', { eyebrow: e.target.value })}
            />
          </Field>
          <Field label={`Tiêu đề (${L})`}>
            <input
              className="ad-input"
              value={C.byCategory.title}
              onChange={(e) => onPatch('byCategory', { title: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Số danh mục hiển thị bên dưới featured">
          <select
            className="ad-select"
            value={C.byCategory.mode}
            onChange={(e) => onPatch('byCategory', { mode: e.target.value as NewsByCategoryMode })}
          >
            <option value="top-2">Top 2 danh mục có nhiều bài nhất</option>
            <option value="top-3">Top 3 danh mục</option>
            <option value="all">Tất cả danh mục</option>
          </select>
        </Field>
        <Field label="Số bài hiển thị mỗi danh mục">
          <input
            className="ad-input"
            type="number"
            min={2}
            max={8}
            value={C.byCategory.articlesPerCategory}
            onChange={(e) =>
              onPatch('byCategory', {
                articlesPerCategory: Number(e.target.value) || 4,
              })
            }
          />
        </Field>
      </EditorSection>

      {/* 06 — NEWSLETTER */}
      <EditorSection
        num={next()}
        icon="mail"
        title="CTA — Đăng ký nhận tin"
        sub="Block email signup ở cuối danh sách"
        defaultOpen={false}
      >
        <Field label={`Tiêu đề (${L})`}>
          <input
            className="ad-input"
            value={C.newsletter.title}
            onChange={(e) => onPatch('newsletter', { title: e.target.value })}
          />
        </Field>
        <Field label={`Mô tả (${L})`}>
          <textarea
            className="ad-textarea"
            value={C.newsletter.sub}
            onChange={(e) => onPatch('newsletter', { sub: e.target.value })}
          />
        </Field>
        <div className="pe-row">
          <Field label={`Placeholder ô email (${L})`}>
            <input
              className="ad-input"
              value={C.newsletter.inputPlaceholder}
              onChange={(e) => onPatch('newsletter', { inputPlaceholder: e.target.value })}
            />
          </Field>
          <Field label={`Chữ trên nút (${L})`}>
            <input
              className="ad-input"
              value={C.newsletter.buttonLabel}
              onChange={(e) => onPatch('newsletter', { buttonLabel: e.target.value })}
            />
          </Field>
        </div>
        <Field label={`Ghi chú dưới form (${L})`}>
          <input
            className="ad-input"
            value={C.newsletter.footer}
            onChange={(e) => onPatch('newsletter', { footer: e.target.value })}
          />
        </Field>
        <Field label="Mailing list (Mailchimp / Brevo / nội bộ)">
          <input
            className="ad-input"
            value={C.newsletter.mailingListId}
            spellCheck={false}
            style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 12 }}
            onChange={(e) => onPatch('newsletter', { mailingListId: e.target.value })}
          />
        </Field>
      </EditorSection>
    </>
  );
}

/** Convert per-locale state into the `sections` payload for savePage. */
export function newsPageSectionsToPayload(s: NewsPageSections) {
  const out: Record<string, { vi: unknown; en: unknown; zh: unknown }> = {};
  for (const key of NEWS_PAGE_SECTION_KEYS) {
    out[key] = { vi: s.vi[key], en: s.en[key], zh: s.zh[key] };
  }
  return out;
}
