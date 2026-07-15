'use client';

import { AdminIcon } from './AdminIcon';
import { Field } from './FormBits';
import { EditorSection, type Lang } from './EditorChrome';
import { PeImg } from './PeImg';
import { uploadImage } from '@/lib/upload-client';
import type { IconName } from '@/components/ui/Icon';
import {
  ABOUT_SECTION_KEYS,
  type AboutSections,
  type AboutSectionKey,
  type AboutSectionsLocale,
} from '@/lib/about-content';

/** Selectable icon names — mirrors the `IconName` union from Icon.tsx. */
const ICON_NAMES: IconName[] = [
  'arrow',
  'plus',
  'check',
  'chevron',
  'globe',
  'leaf',
  'factory',
  'ship',
  'spark',
  'box',
  'drop',
  'grid',
  'pin',
  'phone',
  'mail',
  'sun',
  'moon',
];

/**
 * 8-section editor for the about page (`/admin/pages/about`).
 *
 * Ported from the LongAnhCorp prototype admin/page-edit-about.html with the
 * same numbering and visual structure (PeSection collapsible cards · 3-col
 * value grid · timeline as pe-list · capability metrics as pe-list · 4-image
 * warehouse strip · certification toggles · CTA buttons).
 */
export function AboutSectionsEditor({
  sections,
  lang,
  onPatch,
}: {
  sections: AboutSections;
  lang: Lang;
  onPatch: (key: AboutSectionKey, patch: Record<string, unknown>) => void;
}) {
  const C: AboutSectionsLocale = sections[lang];
  const L = lang.toUpperCase();

  // Auto-numbering matches the prototype 01 → 08.
  let n = 0;
  const next = () => String(++n).padStart(2, '0');

  return (
    <>
      {/* 01 — PAGE HEADER */}
      <EditorSection
        num={next()}
        icon="layers"
        title="Page header — Banner trang"
        sub="Tiêu đề và mô tả ngắn ở đầu trang giới thiệu"
      >
        <Field label={`Eyebrow (${L})`}>
          <input
            className="ad-input"
            value={C.header.eyebrow}
            onChange={(e) => onPatch('header', { eyebrow: e.target.value })}
          />
        </Field>
        <Field label={`Tiêu đề chính (${L})`}>
          <input
            className="ad-input"
            value={C.header.title}
            onChange={(e) => onPatch('header', { title: e.target.value })}
          />
        </Field>
        <Field label={`Mô tả ngắn (${L})`}>
          <textarea
            className="ad-textarea"
            value={C.header.sub}
            onChange={(e) => onPatch('header', { sub: e.target.value })}
          />
        </Field>
      </EditorSection>

      {/* 02 — STORY */}
      <EditorSection
        num={next()}
        icon="file"
        title="Câu chuyện thương hiệu"
        sub="Khối intro với ảnh và chữ ký người sáng lập"
      >
        <div className="pe-row">
          <Field label={`Eyebrow (${L})`}>
            <input
              className="ad-input"
              value={C.story.eyebrow}
              onChange={(e) => onPatch('story', { eyebrow: e.target.value })}
            />
          </Field>
          <Field label={`Tiêu đề — 2 dòng (${L})`} help="Cách hai dòng bằng dấu /">
            <input
              className="ad-input"
              value={C.story.title}
              onChange={(e) => onPatch('story', { title: e.target.value })}
            />
          </Field>
        </div>
        <Field label={`Đoạn 1 (${L})`}>
          <textarea
            className="ad-textarea"
            value={C.story.paragraph1}
            onChange={(e) => onPatch('story', { paragraph1: e.target.value })}
          />
        </Field>
        <Field label={`Đoạn 2 (${L})`}>
          <textarea
            className="ad-textarea"
            value={C.story.paragraph2}
            onChange={(e) => onPatch('story', { paragraph2: e.target.value })}
          />
        </Field>
        <Field label={`Đoạn 3 — kết (${L})`}>
          <textarea
            className="ad-textarea"
            value={C.story.paragraph3}
            onChange={(e) => onPatch('story', { paragraph3: e.target.value })}
          />
        </Field>

        <div
          style={{
            borderTop: '1px solid var(--ad-line-soft)',
            paddingTop: 16,
            marginTop: 4,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--ad-text-mute)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            Ảnh câu chuyện
          </div>
          <div className="pe-imgrow">
            <PeImg
              src={C.story.imageUrl}
              alt={C.story.imageAlt}
              size={C.story.imageUrl ? '1600×1200' : undefined}
              onChange={(dataUrl) => onPatch('story', { imageUrl: dataUrl })}
            />
            <div className="pe-stack">
              <Field label={`Mô tả ảnh — alt (${L})`}>
                <input
                  className="ad-input"
                  value={C.story.imageAlt}
                  onChange={(e) => onPatch('story', { imageAlt: e.target.value })}
                />
              </Field>
              <Field label="Đường dẫn ảnh">
                <input
                  className="ad-input"
                  value={C.story.imageUrl}
                  spellCheck={false}
                  style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 12 }}
                  onChange={(e) => onPatch('story', { imageUrl: e.target.value })}
                />
              </Field>
            </div>
          </div>

          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--ad-text-mute)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              margin: '16px 0 10px',
            }}
          >
            Ảnh nền mờ
          </div>
          <div className="pe-imgrow">
            <PeImg
              src={C.story.bgImageUrl}
              alt=""
              size={C.story.bgImageUrl ? '1600×900' : undefined}
              onChange={(dataUrl) => onPatch('story', { bgImageUrl: dataUrl })}
            />
            <div className="pe-stack">
              <Field label="Đường dẫn ảnh nền">
                <input
                  className="ad-input"
                  value={C.story.bgImageUrl}
                  spellCheck={false}
                  style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 12 }}
                  onChange={(e) => onPatch('story', { bgImageUrl: e.target.value })}
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="pe-row" style={{ marginTop: 12 }}>
          <Field label={`Tên người ký (${L})`}>
            <input
              className="ad-input"
              value={C.story.signerName}
              onChange={(e) => onPatch('story', { signerName: e.target.value })}
            />
          </Field>
          <Field label={`Chức danh (${L})`}>
            <input
              className="ad-input"
              value={C.story.signerTitle}
              onChange={(e) => onPatch('story', { signerTitle: e.target.value })}
            />
          </Field>
        </div>
      </EditorSection>

      {/* 03 — TIMELINE */}
      <EditorSection
        num={next()}
        icon="trend"
        title="Timeline — 20 năm hành trình"
        sub="5+ mốc lịch sử quan trọng"
      >
        <div className="pe-row">
          <Field label={`Eyebrow (${L})`}>
            <input
              className="ad-input"
              value={C.timeline.eyebrow}
              onChange={(e) => onPatch('timeline', { eyebrow: e.target.value })}
            />
          </Field>
          <Field label={`Tiêu đề section (${L})`}>
            <input
              className="ad-input"
              value={C.timeline.title}
              onChange={(e) => onPatch('timeline', { title: e.target.value })}
            />
          </Field>
        </div>
        <div className="pe-list" style={{ marginTop: 12 }}>
          {C.timeline.items.map((row, i) => (
            <div key={i} className="pe-list-item">
              <input
                className="ad-input"
                value={row.year}
                style={{
                  width: 70,
                  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
                onChange={(e) => {
                  const items = [...C.timeline.items];
                  items[i] = { ...row, year: e.target.value };
                  onPatch('timeline', { items });
                }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
                <input
                  className="ad-input"
                  placeholder={`Tiêu đề mốc (${L})`}
                  value={row.title}
                  onChange={(e) => {
                    const items = [...C.timeline.items];
                    items[i] = { ...row, title: e.target.value };
                    onPatch('timeline', { items });
                  }}
                />
                <input
                  className="ad-input"
                  placeholder={`Mô tả (${L})`}
                  value={row.body}
                  onChange={(e) => {
                    const items = [...C.timeline.items];
                    items[i] = { ...row, body: e.target.value };
                    onPatch('timeline', { items });
                  }}
                />
              </div>
              <div className="actions">
                <button
                  type="button"
                  title="Xoá"
                  onClick={() => {
                    const items = C.timeline.items.filter((_, j) => j !== i);
                    onPatch('timeline', { items });
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
            onPatch('timeline', {
              items: [...C.timeline.items, { year: '', title: '', body: '' }],
            })
          }
        >
          <AdminIcon name="plus" size={13} /> Thêm mốc thời gian
        </button>
      </EditorSection>

      {/* 04 — VALUES */}
      <EditorSection
        num={next()}
        icon="grid"
        title="Giá trị cốt lõi"
        sub="3 điều Long Anh không bao giờ thỏa hiệp"
      >
        <div className="pe-row">
          <Field label={`Eyebrow (${L})`}>
            <input
              className="ad-input"
              value={C.values.eyebrow}
              onChange={(e) => onPatch('values', { eyebrow: e.target.value })}
            />
          </Field>
          <Field label={`Tiêu đề (${L})`}>
            <input
              className="ad-input"
              value={C.values.title}
              onChange={(e) => onPatch('values', { title: e.target.value })}
            />
          </Field>
        </div>
        <div className="pe-row three">
          {C.values.items.map((v, i) => (
            <div key={i} className="pe-card-edit">
              <div className="head">
                <span className="pill">VAL {String(i + 1).padStart(2, '0')}</span>
                <div className="name">{v.name || `Giá trị ${i + 1}`}</div>
                <button
                  type="button"
                  title="Xoá"
                  onClick={() => {
                    const items = C.values.items.filter((_, j) => j !== i);
                    onPatch('values', { items });
                  }}
                >
                  <AdminIcon name="trash" size={13} />
                </button>
              </div>
              <Field label={`Tên giá trị (${L})`}>
                <input
                  className="ad-input"
                  value={v.name}
                  onChange={(e) => {
                    const items = [...C.values.items];
                    items[i] = { ...v, name: e.target.value };
                    onPatch('values', { items });
                  }}
                />
              </Field>
              <Field label="Icon">
                <select
                  className="ad-select"
                  value={v.icon || 'check'}
                  onChange={(e) => {
                    const items = [...C.values.items];
                    items[i] = { ...v, icon: e.target.value };
                    onPatch('values', { items });
                  }}
                >
                  {ICON_NAMES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={`Mô tả (${L})`}>
                <textarea
                  className="ad-textarea"
                  style={{ minHeight: 70 }}
                  value={v.body}
                  onChange={(e) => {
                    const items = [...C.values.items];
                    items[i] = { ...v, body: e.target.value };
                    onPatch('values', { items });
                  }}
                />
              </Field>
            </div>
          ))}
        </div>
      </EditorSection>

      {/* 05 — CAPABILITIES */}
      <EditorSection
        num={next()}
        icon="layers"
        title="Năng lực sản xuất"
        sub="Ảnh nhà máy + các chỉ số đo bằng con số"
      >
        <div className="pe-row">
          <Field label={`Eyebrow (${L})`}>
            <input
              className="ad-input"
              value={C.caps.eyebrow}
              onChange={(e) => onPatch('caps', { eyebrow: e.target.value })}
            />
          </Field>
          <Field label={`Tiêu đề (${L})`}>
            <input
              className="ad-input"
              value={C.caps.title}
              onChange={(e) => onPatch('caps', { title: e.target.value })}
            />
          </Field>
        </div>
        <Field label={`Mô tả (${L})`}>
          <textarea
            className="ad-textarea"
            value={C.caps.sub}
            onChange={(e) => onPatch('caps', { sub: e.target.value })}
          />
        </Field>

        <div className="pe-imgrow">
          <PeImg
            src={C.caps.imageUrl}
            alt={C.caps.imageAlt}
            size={C.caps.imageUrl ? '1920×1280' : undefined}
            onChange={(dataUrl) => onPatch('caps', { imageUrl: dataUrl })}
          />
          <div className="pe-stack">
            <Field label={`Mô tả ảnh — alt (${L})`}>
              <input
                className="ad-input"
                value={C.caps.imageAlt}
                onChange={(e) => onPatch('caps', { imageAlt: e.target.value })}
              />
            </Field>
            <Field label="Đường dẫn ảnh">
              <input
                className="ad-input"
                value={C.caps.imageUrl}
                spellCheck={false}
                style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 12 }}
                onChange={(e) => onPatch('caps', { imageUrl: e.target.value })}
              />
            </Field>
          </div>
        </div>

        <div className="pe-list" style={{ marginTop: 12 }}>
          {C.caps.metrics.map((m, i) => (
            <div key={i} className="pe-list-item">
              <span className="num">— {String(i + 1).padStart(2, '0')}</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10 }}>
                <input
                  className="ad-input"
                  placeholder={`Chỉ số (${L})`}
                  value={m.label}
                  onChange={(e) => {
                    const metrics = [...C.caps.metrics];
                    metrics[i] = { ...m, label: e.target.value };
                    onPatch('caps', { metrics });
                  }}
                />
                <input
                  className="ad-input"
                  placeholder={`Giá trị (${L})`}
                  value={m.value}
                  onChange={(e) => {
                    const metrics = [...C.caps.metrics];
                    metrics[i] = { ...m, value: e.target.value };
                    onPatch('caps', { metrics });
                  }}
                />
              </div>
              <div className="actions">
                <button
                  type="button"
                  title="Xoá"
                  onClick={() => {
                    const metrics = C.caps.metrics.filter((_, j) => j !== i);
                    onPatch('caps', { metrics });
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
            onPatch('caps', { metrics: [...C.caps.metrics, { label: '', value: '' }] })
          }
        >
          <AdminIcon name="plus" size={13} /> Thêm chỉ số
        </button>
      </EditorSection>

      {/* 06 — WAREHOUSE */}
      <EditorSection
        num={next()}
        icon="image"
        title="Dải ảnh kho bãi & Logistics"
        sub="4 ảnh full-bleed, kéo để sắp xếp"
      >
        <div className="pe-row">
          <Field label={`Eyebrow (${L})`}>
            <input
              className="ad-input"
              value={C.warehouse.eyebrow}
              onChange={(e) => onPatch('warehouse', { eyebrow: e.target.value })}
            />
          </Field>
          <Field label={`Tiêu đề (${L})`}>
            <input
              className="ad-input"
              value={C.warehouse.title}
              onChange={(e) => onPatch('warehouse', { title: e.target.value })}
            />
          </Field>
        </div>
        <div className="pe-strip">
          {C.warehouse.images.map((src, i) => (
            <div key={i} className="pe-strip-item">
              {src ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={src} alt={`Kho ${i + 1}`} />
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--ad-text-mute)',
                    fontSize: 12,
                  }}
                >
                  (chưa có ảnh)
                </div>
              )}
              <input
                id={`warehouse-file-${i}`}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  void uploadImage(file, 'pages').then((url) => {
                    const images = [...C.warehouse.images];
                    images[i] = url;
                    onPatch('warehouse', { images });
                  });
                }}
              />
              <button
                type="button"
                onClick={() => document.getElementById(`warehouse-file-${i}`)?.click()}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'transparent',
                  border: 0,
                  cursor: 'pointer',
                }}
                aria-label={`Đổi ảnh kho ${i + 1}`}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="ad-btn sm"
          style={{ width: 'fit-content', marginTop: 10 }}
          onClick={() => onPatch('warehouse', { images: [...C.warehouse.images, ''] })}
        >
          <AdminIcon name="plus" size={13} /> Thêm ảnh
        </button>
      </EditorSection>

      {/* 07 — CERTS */}
      <EditorSection
        num={next()}
        icon="shield"
        title="Chứng nhận quốc tế"
        sub="Logo & nhãn các chứng nhận"
        defaultOpen={false}
      >
        <Field label={`Tiêu đề (${L})`}>
          <input
            className="ad-input"
            value={C.certs.title}
            onChange={(e) => onPatch('certs', { title: e.target.value })}
          />
        </Field>
        <Field label={`Mô tả (${L})`}>
          <textarea
            className="ad-textarea"
            value={C.certs.sub}
            onChange={(e) => onPatch('certs', { sub: e.target.value })}
          />
        </Field>
        <div className="pe-row four" style={{ marginTop: 12 }}>
          {C.certs.items.map((cert, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                border: '1px solid var(--ad-line)',
                borderRadius: 8,
                padding: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <input
                type="checkbox"
                checked={cert.enabled}
                onChange={(e) => {
                  const items = [...C.certs.items];
                  items[i] = { ...cert, enabled: e.target.checked };
                  onPatch('certs', { items });
                }}
              />
              <input
                className="ad-input"
                value={cert.name}
                style={{ height: 28, fontSize: 13 }}
                onChange={(e) => {
                  const items = [...C.certs.items];
                  items[i] = { ...cert, name: e.target.value };
                  onPatch('certs', { items });
                }}
              />
            </div>
          ))}
        </div>
      </EditorSection>

      {/* 08 — CTA */}
      <EditorSection
        num={next()}
        icon="mail"
        title="CTA cuối trang"
        sub="Block kêu gọi liên hệ ở cuối About"
        defaultOpen={false}
      >
        <Field label={`Tiêu đề (${L})`}>
          <input
            className="ad-input"
            value={C.cta.title}
            onChange={(e) => onPatch('cta', { title: e.target.value })}
          />
        </Field>
        <Field label={`Mô tả (${L})`}>
          <textarea
            className="ad-textarea"
            value={C.cta.sub}
            onChange={(e) => onPatch('cta', { sub: e.target.value })}
          />
        </Field>
        <div className="pe-row">
          <Field label={`Nút chính — chữ (${L})`}>
            <input
              className="ad-input"
              value={C.cta.primaryLabel}
              onChange={(e) => onPatch('cta', { primaryLabel: e.target.value })}
            />
          </Field>
          <Field label="Nút chính — liên kết">
            <input
              className="ad-input"
              value={C.cta.primaryHref}
              spellCheck={false}
              style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 12 }}
              onChange={(e) => onPatch('cta', { primaryHref: e.target.value })}
            />
          </Field>
        </div>
        <div className="pe-row">
          <Field label={`Nút phụ — chữ (${L})`}>
            <input
              className="ad-input"
              value={C.cta.secondaryLabel}
              onChange={(e) => onPatch('cta', { secondaryLabel: e.target.value })}
            />
          </Field>
          <Field label="Nút phụ — liên kết">
            <input
              className="ad-input"
              value={C.cta.secondaryHref}
              spellCheck={false}
              style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 12 }}
              onChange={(e) => onPatch('cta', { secondaryHref: e.target.value })}
            />
          </Field>
        </div>
      </EditorSection>
    </>
  );
}

/** Convert local-side state into the `sections` payload for savePage. */
export function aboutSectionsToPayload(s: AboutSections) {
  const out: Record<string, { vi: unknown; en: unknown; zh: unknown }> = {};
  for (const key of ABOUT_SECTION_KEYS) {
    out[key] = { vi: s.vi[key], en: s.en[key], zh: s.zh[key] };
  }
  return out;
}
