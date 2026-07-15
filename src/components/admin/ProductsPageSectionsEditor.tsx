'use client';

import Link from 'next/link';
import { AdminIcon } from './AdminIcon';
import { Field } from './FormBits';
import { PeImg } from './PeImg';
import { EditorSection, type Lang } from './EditorChrome';
import { uploadImage } from '@/lib/upload-client';
import {
  PRODUCTS_PAGE_SECTION_KEYS,
  type ProductsPageSections,
  type ProductsPageSectionKey,
  type ProductsPageSectionsLocale,
} from '@/lib/products-page-content';

/** Same minimal product chip shape PageForm exports. */
interface ProductChip {
  code: string;
  nameVi: string;
  nameEn: string;
  nameZh: string;
}

/**
 * 7-section editor for the products listing page (`/admin/pages/products`).
 *
 * Ported from the LongAnhCorp prototype admin/page-edit-products.html:
 *   01 Page header
 *   02 Stats (4-number strip)
 *   03 Category tiles (2 cards)
 *   04 SKU list (P-01…P-05 — read from catalog + ordered here)
 *   05 Particle size visualizer (powder-only)
 *   06 Spec table (5 rows + cert badges)
 *   07 Quote CTA
 */
export function ProductsPageSectionsEditor({
  sections,
  lang,
  onPatch,
  currentProducts,
}: {
  sections: ProductsPageSections;
  lang: Lang;
  onPatch: (key: ProductsPageSectionKey, patch: Record<string, unknown>) => void;
  currentProducts?: ProductChip[];
}) {
  const C: ProductsPageSectionsLocale = sections[lang];
  const L = lang.toUpperCase();

  // Auto numbering 01..07.
  let n = 0;
  const next = () => String(++n).padStart(2, '0');

  const productMap = new Map((currentProducts ?? []).map((p) => [p.code, p]));
  const localizedName = (code: string) => {
    const p = productMap.get(code);
    if (!p) return code;
    return lang === 'en' ? p.nameEn : lang === 'zh' ? p.nameZh : p.nameVi;
  };

  return (
    <>
      {/* 01 — PAGE HEADER */}
      <EditorSection
        num={next()}
        icon="layers"
        title="Page header"
        sub="Tiêu đề và mô tả ngắn ở đầu trang"
      >
        <Field label={`Eyebrow (${L})`}>
          <input
            className="lac-input"
            value={C.header.eyebrow}
            onChange={(e) => onPatch('header', { eyebrow: e.target.value })}
          />
        </Field>
        <Field label={`Tiêu đề chính (${L})`}>
          <input
            className="lac-input"
            value={C.header.title}
            onChange={(e) => onPatch('header', { title: e.target.value })}
          />
        </Field>
        <Field label={`Mô tả ngắn (${L})`}>
          <textarea
            className="lac-textarea"
            value={C.header.sub}
            onChange={(e) => onPatch('header', { sub: e.target.value })}
          />
        </Field>
        <div className="pe-imgrow" style={{ marginTop: 8 }}>
          <PeImg
            src={C.header.imageUrl ?? ''}
            alt=""
            size={C.header.imageUrl ? 'Ảnh nền hero' : undefined}
            onChange={(dataUrl) => onPatch('header', { imageUrl: dataUrl })}
          />
          <div className="pe-stack">
            <Field label="Đường dẫn ảnh nền hero">
              <input
                className="lac-input"
                value={C.header.imageUrl ?? ''}
                spellCheck={false}
                style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 12 }}
                onChange={(e) => onPatch('header', { imageUrl: e.target.value })}
              />
            </Field>
          </div>
        </div>
      </EditorSection>

      {/* 02 — STATS */}
      <EditorSection
        num={next()}
        icon="trend"
        title="Stats — Dải 4 số"
        sub="Hiển thị ngay dưới page header"
      >
        <div className="pe-row four">
          {C.stats.items.map((s, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                border: '1px solid var(--ad-line)',
                borderRadius: 8,
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ad-text-mute)' }}>
                STAT {i + 1}
              </span>
              <input
                className="lac-input"
                style={{ fontWeight: 700, fontSize: 18 }}
                value={s.value}
                onChange={(e) => {
                  const items = [...C.stats.items];
                  items[i] = { ...s, value: e.target.value };
                  onPatch('stats', { items });
                }}
              />
              <input
                className="lac-input"
                style={{ fontSize: 12 }}
                value={s.label}
                onChange={(e) => {
                  const items = [...C.stats.items];
                  items[i] = { ...s, label: e.target.value };
                  onPatch('stats', { items });
                }}
              />
            </div>
          ))}
        </div>
      </EditorSection>

      {/* 03 — CATEGORY TILES */}
      <EditorSection
        num={next()}
        icon="grid"
        title="2 Tile danh mục lớn"
        sub="Bột đá CaCO₃ và Đá ốp lát tự nhiên"
      >
        <div className="pe-card-grid">
          {C.tiles.items.map((t, i) => (
            <div key={i} className="pe-card-edit">
              <div className="head">
                <span className="pill">TILE {t.number}</span>
                <div className="name">{t.title || `Tile ${i + 1}`}</div>
                <button type="button" title="Kéo" disabled>
                  <AdminIcon name="grid" size={14} />
                </button>
              </div>
              <div className="miniimg">
                {t.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={t.imageUrl} alt={t.title} />
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
                  id={`tile-file-${i}`}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    void uploadImage(file, 'products').then((url) => {
                      const items = [...C.tiles.items];
                      items[i] = { ...t, imageUrl: url };
                      onPatch('tiles', { items });
                    });
                  }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById(`tile-file-${i}`)?.click()}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'transparent',
                    border: 0,
                    cursor: 'pointer',
                  }}
                  aria-label="Đổi ảnh tile"
                />
              </div>
              <Field label={`Tiêu đề (${L})`}>
                <input
                  className="lac-input"
                  value={t.title}
                  onChange={(e) => {
                    const items = [...C.tiles.items];
                    items[i] = { ...t, title: e.target.value };
                    onPatch('tiles', { items });
                  }}
                />
              </Field>
              <Field label={`Mô tả (${L})`}>
                <textarea
                  className="lac-textarea"
                  style={{ minHeight: 60 }}
                  value={t.desc}
                  onChange={(e) => {
                    const items = [...C.tiles.items];
                    items[i] = { ...t, desc: e.target.value };
                    onPatch('tiles', { items });
                  }}
                />
              </Field>
              <Field label="Anchor neo">
                <input
                  className="lac-input"
                  value={t.anchor}
                  spellCheck={false}
                  style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 12 }}
                  onChange={(e) => {
                    const items = [...C.tiles.items];
                    items[i] = { ...t, anchor: e.target.value };
                    onPatch('tiles', { items });
                  }}
                />
              </Field>
            </div>
          ))}
        </div>
      </EditorSection>

      {/* 04 — SKU LIST */}
      <EditorSection
        num={next()}
        icon="rock"
        title="Danh sách sản phẩm (SKU)"
        sub="Các SKU hiển thị trên trang — sửa chi tiết tại /admin/products"
      >
        <div className="pe-list">
          {C.skuList.codes.map((code, i) => {
            const inCatalog = productMap.has(code);
            return (
              <div key={`${code}-${i}`} className="pe-list-item">
                <span className="num">{code}</span>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr auto',
                    gap: 10,
                    alignItems: 'center',
                  }}
                >
                  <div style={{ fontSize: 13 }}>
                    {inCatalog ? (
                      localizedName(code)
                    ) : (
                      <span style={{ color: 'var(--ad-danger)' }}>⚠ Mã không có trong catalog</span>
                    )}
                  </div>
                  {inCatalog ? (
                    <Link
                      href={`/admin/products/${code}`}
                      className="lac-btn ghost sm"
                      title="Sửa chi tiết SKU"
                    >
                      <AdminIcon name="edit" size={12} /> Sửa
                    </Link>
                  ) : (
                    <span style={{ fontSize: 11, color: 'var(--ad-text-mute)' }}>—</span>
                  )}
                </div>
                <div className="actions">
                  <button
                    type="button"
                    title="Bỏ khỏi danh sách"
                    onClick={() => {
                      const codes = C.skuList.codes.filter((_, j) => j !== i);
                      onPatch('skuList', { codes });
                    }}
                  >
                    <AdminIcon name="trash" size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 12 }}>
          <select
            className="lac-select"
            value=""
            onChange={(e) => {
              const code = e.target.value;
              if (!code) return;
              if (C.skuList.codes.includes(code)) return;
              onPatch('skuList', { codes: [...C.skuList.codes, code] });
            }}
          >
            <option value="">+ Thêm SKU vào danh sách…</option>
            {(currentProducts ?? [])
              .filter((p) => !C.skuList.codes.includes(p.code))
              .map((p) => (
                <option key={p.code} value={p.code}>
                  {p.code} · {localizedName(p.code)}
                </option>
              ))}
          </select>
        </div>

        <Link
          href="/admin/products"
          className="lac-btn ghost sm"
          style={{ width: 'fit-content', marginTop: 10 }}
        >
          <AdminIcon name="edit" size={12} /> Quản lý catalog sản phẩm
        </Link>
      </EditorSection>

      {/* 05 — PARTICLE SIZE */}
      <EditorSection
        num={next()}
        icon="activity"
        title="Particle size visualizer"
        sub="Dải các cỡ hạt khả dụng cho bột CaCO₃"
        defaultOpen={false}
      >
        <div className="pe-row">
          <Field label={`Eyebrow (${L})`}>
            <input
              className="lac-input"
              value={C.particle.eyebrow}
              onChange={(e) => onPatch('particle', { eyebrow: e.target.value })}
            />
          </Field>
          <Field label={`Tiêu đề (${L})`}>
            <input
              className="lac-input"
              value={C.particle.title}
              onChange={(e) => onPatch('particle', { title: e.target.value })}
            />
          </Field>
        </div>
        <div className="pe-row">
          <Field label="Bột không phủ — các cỡ (µm)" help="Cách nhau bằng dấu phẩy">
            <input
              className="lac-input"
              value={C.particle.uncoatedSizes}
              onChange={(e) => onPatch('particle', { uncoatedSizes: e.target.value })}
            />
          </Field>
          <Field label="Bột phủ Stearic — các cỡ (µm)" help="Cách nhau bằng dấu phẩy">
            <input
              className="lac-input"
              value={C.particle.coatedSizes}
              onChange={(e) => onPatch('particle', { coatedSizes: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Tỉ lệ Stearic Acid">
          <input
            className="lac-input"
            value={C.particle.stearicRatio}
            onChange={(e) => onPatch('particle', { stearicRatio: e.target.value })}
          />
        </Field>
      </EditorSection>

      {/* 06 — SPEC TABLE */}
      <EditorSection
        num={next()}
        icon="list"
        title="Bảng thông số kỹ thuật"
        sub="Chỉ tiêu chất lượng — Bột đá CaCO₃"
        defaultOpen={false}
      >
        <Field label={`Tiêu đề bảng (${L})`}>
          <input
            className="lac-input"
            value={C.specTable.title}
            onChange={(e) => onPatch('specTable', { title: e.target.value })}
          />
        </Field>
        <div className="pe-row">
          <Field label={`Cột "Bột không phủ" (${L})`}>
            <input
              className="lac-input"
              value={C.specTable.colUncoated}
              onChange={(e) => onPatch('specTable', { colUncoated: e.target.value })}
            />
          </Field>
          <Field label={`Cột "Bột phủ Stearic" (${L})`}>
            <input
              className="lac-input"
              value={C.specTable.colCoated}
              onChange={(e) => onPatch('specTable', { colCoated: e.target.value })}
            />
          </Field>
        </div>
        <div className="pe-list" style={{ marginTop: 12 }}>
          {C.specTable.rows.map((r, i) => (
            <div key={i} className="pe-list-item">
              <span className="num">{i + 1}</span>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 0.6fr',
                  gap: 8,
                }}
              >
                <input
                  className="lac-input"
                  placeholder={`Chỉ tiêu (${L})`}
                  value={r.label}
                  onChange={(e) => {
                    const rows = [...C.specTable.rows];
                    rows[i] = { ...r, label: e.target.value };
                    onPatch('specTable', { rows });
                  }}
                />
                <input
                  className="lac-input"
                  placeholder="Phủ Stearic"
                  value={r.coated}
                  onChange={(e) => {
                    const rows = [...C.specTable.rows];
                    rows[i] = { ...r, coated: e.target.value };
                    onPatch('specTable', { rows });
                  }}
                />
                <input
                  className="lac-input"
                  placeholder="Không phủ"
                  value={r.uncoated}
                  onChange={(e) => {
                    const rows = [...C.specTable.rows];
                    rows[i] = { ...r, uncoated: e.target.value };
                    onPatch('specTable', { rows });
                  }}
                />
                <input
                  className="lac-input"
                  placeholder="Đơn vị"
                  value={r.unit}
                  onChange={(e) => {
                    const rows = [...C.specTable.rows];
                    rows[i] = { ...r, unit: e.target.value };
                    onPatch('specTable', { rows });
                  }}
                />
              </div>
              <div className="actions">
                <button
                  type="button"
                  title="Xoá"
                  onClick={() => {
                    const rows = C.specTable.rows.filter((_, j) => j !== i);
                    onPatch('specTable', { rows });
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
          className="lac-btn sm"
          style={{ width: 'fit-content', marginTop: 10 }}
          onClick={() =>
            onPatch('specTable', {
              rows: [...C.specTable.rows, { label: '', coated: '', uncoated: '', unit: '' }],
            })
          }
        >
          <AdminIcon name="plus" size={13} /> Thêm dòng
        </button>

        <Field label="Chip chứng nhận dưới bảng" help="Enter để thêm">
          <div className="lac-tags">
            {C.specTable.certBadges.map((badge, i) => (
              <span key={`${badge}-${i}`} className="lac-tag">
                {badge}
                <button
                  type="button"
                  aria-label={`Bỏ ${badge}`}
                  onClick={() => {
                    const certBadges = C.specTable.certBadges.filter((_, j) => j !== i);
                    onPatch('specTable', { certBadges });
                  }}
                >
                  <AdminIcon name="x" size={11} />
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Thêm chip…"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  const v = (e.currentTarget.value || '').trim();
                  if (!v) return;
                  if (C.specTable.certBadges.includes(v)) {
                    e.currentTarget.value = '';
                    return;
                  }
                  onPatch('specTable', {
                    certBadges: [...C.specTable.certBadges, v],
                  });
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
        </Field>
      </EditorSection>

      {/* 07 — PROCESS */}
      <EditorSection
        num={next()}
        icon="layers"
        title="Quy trình — 4 bước"
        sub="Eyebrow, tiêu đề, câu statement và 4 bước sản xuất"
      >
        <div className="pe-row">
          <Field label={`Eyebrow (${L})`}>
            <input
              className="lac-input"
              value={C.process.eyebrow}
              onChange={(e) => onPatch('process', { eyebrow: e.target.value })}
            />
          </Field>
          <Field label={`Tiêu đề (${L})`}>
            <input
              className="lac-input"
              value={C.process.title}
              onChange={(e) => onPatch('process', { title: e.target.value })}
            />
          </Field>
        </div>
        <Field label={`Câu statement — hiện dần khi cuộn (${L})`}>
          <textarea
            className="lac-textarea"
            value={C.process.statement}
            onChange={(e) => onPatch('process', { statement: e.target.value })}
          />
        </Field>
        {C.process.steps.map((s, i) => (
          <div key={i} className="pe-row" style={{ marginBottom: 8 }}>
            <Field label={`Bước ${s.k || i + 1} — tên (${L})`}>
              <input
                className="lac-input"
                value={s.t}
                onChange={(e) => {
                  const steps = [...C.process.steps];
                  steps[i] = { ...steps[i], t: e.target.value };
                  onPatch('process', { steps });
                }}
              />
            </Field>
            <Field label={`Bước ${s.k || i + 1} — mô tả (${L})`}>
              <input
                className="lac-input"
                value={s.d}
                onChange={(e) => {
                  const steps = [...C.process.steps];
                  steps[i] = { ...steps[i], d: e.target.value };
                  onPatch('process', { steps });
                }}
              />
            </Field>
          </div>
        ))}
      </EditorSection>

      {/* 08 — QUOTE CTA */}
      <EditorSection
        num={next()}
        icon="mail"
        title="CTA — Báo giá FOB"
        sub="Banner kêu gọi liên hệ ở cuối trang"
      >
        <div className="pe-row">
          <Field label={`Kicker (${L})`}>
            <input
              className="lac-input"
              value={C.cta.kicker ?? ''}
              onChange={(e) => onPatch('cta', { kicker: e.target.value })}
            />
          </Field>
          <Field label={`Tiêu đề (${L})`}>
            <input
              className="lac-input"
              value={C.cta.title}
              onChange={(e) => onPatch('cta', { title: e.target.value })}
            />
          </Field>
        </div>
        <Field label={`Mô tả (${L})`}>
          <textarea
            className="lac-textarea"
            value={C.cta.sub}
            onChange={(e) => onPatch('cta', { sub: e.target.value })}
          />
        </Field>
        <div className="pe-row">
          <Field label={`Nút chính — chữ (${L})`}>
            <input
              className="lac-input"
              value={C.cta.primaryLabel}
              onChange={(e) => onPatch('cta', { primaryLabel: e.target.value })}
            />
          </Field>
          <Field label="Nút chính — liên kết">
            <input
              className="lac-input"
              value={C.cta.primaryHref}
              spellCheck={false}
              style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 12 }}
              onChange={(e) => onPatch('cta', { primaryHref: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Nút gọi điện — số hiển thị">
          <input
            className="lac-input"
            value={C.cta.phone ?? ''}
            onChange={(e) => onPatch('cta', { phone: e.target.value })}
          />
        </Field>
      </EditorSection>
    </>
  );
}

/** Convert per-locale state into the `sections` payload for savePage. */
export function productsPageSectionsToPayload(s: ProductsPageSections) {
  const out: Record<string, { vi: unknown; en: unknown; zh: unknown }> = {};
  for (const key of PRODUCTS_PAGE_SECTION_KEYS) {
    out[key] = { vi: s.vi[key], en: s.en[key], zh: s.zh[key] };
  }
  return out;
}
