'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminIcon } from './AdminIcon';
import { AdminPageHead } from './AdminPageHead';
import { Field } from './FormBits';
import { LangTabs, EditorSection, StatusRadioGroup, ToggleRow, type Lang } from './EditorChrome';
import {
  saveProduct,
  type ProductInput,
  type ActionResult,
} from '@/app/admin/(panel)/products/actions';

interface VariantRow {
  variantCode: string;
  label: string;
  price: number;
  unit: string;
  stock: number;
  isPopular: boolean;
}

export interface ProductFormValue {
  id?: string;
  code: string;
  slug: string;
  categoryId: string;
  nameVi: string;
  nameEn: string;
  nameZh: string;
  summaryVi: string;
  summaryEn: string;
  summaryZh: string;
  shortDescVi: string;
  shortDescEn: string;
  shortDescZh: string;
  longDescVi: string;
  longDescEn: string;
  longDescZh: string;
  unitVi: string;
  unitEn: string;
  unitZh: string;
  moq: string;
  moqEn: string;
  moqZh: string;
  productionTime: string;
  productionTimeEn: string;
  productionTimeZh: string;
  coverImageUrl: string;
  gallery: string[];
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  variants: VariantRow[];
}

/** Resolve a locale-suffixed field key. `bareVi` fields use the bare key for VI. */
function lf(base: string, lang: Lang, bareVi = false): keyof ProductFormValue {
  if (lang === 'vi') return (bareVi ? base : base + 'Vi') as keyof ProductFormValue;
  return (base + (lang === 'en' ? 'En' : 'Zh')) as keyof ProductFormValue;
}

export function ProductForm({
  initial,
  categories,
  isNew,
}: {
  initial: ProductFormValue;
  categories: { id: string; name: string }[];
  isNew: boolean;
}) {
  const router = useRouter();
  const [v, setV] = useState<ProductFormValue>(initial);
  const [variants, setVariants] = useState<VariantRow[]>(initial.variants);
  const [gallery, setGallery] = useState<string[]>(initial.gallery);
  const [galleryInput, setGalleryInput] = useState('');
  const [lang, setLang] = useState<Lang>('vi');
  const [state, setState] = useState<ActionResult | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof ProductFormValue>(k: K, val: ProductFormValue[K]) =>
    setV((p) => ({ ...p, [k]: val }));
  const str = (k: keyof ProductFormValue) => (v[k] as string) ?? '';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setState(null);
    const payload: ProductInput = {
      id: v.id,
      code: v.code.trim(),
      slug: v.slug.trim(),
      categoryId: v.categoryId,
      nameVi: v.nameVi,
      nameEn: v.nameEn,
      nameZh: v.nameZh,
      summaryVi: v.summaryVi,
      summaryEn: v.summaryEn,
      summaryZh: v.summaryZh,
      shortDescVi: v.shortDescVi,
      shortDescEn: v.shortDescEn,
      shortDescZh: v.shortDescZh,
      longDescVi: v.longDescVi,
      longDescEn: v.longDescEn,
      longDescZh: v.longDescZh,
      unitVi: v.unitVi,
      unitEn: v.unitEn,
      unitZh: v.unitZh,
      moq: v.moq,
      moqEn: v.moqEn,
      moqZh: v.moqZh,
      productionTime: v.productionTime,
      productionTimeEn: v.productionTimeEn,
      productionTimeZh: v.productionTimeZh,
      coverImageUrl: v.coverImageUrl || gallery[0] || '',
      gallery,
      isFeatured: v.isFeatured,
      isActive: v.isActive,
      sortOrder: v.sortOrder,
      variants,
    };
    const res = await saveProduct(payload);
    setBusy(false);
    setState(res);
    if (res.ok) {
      router.push('/admin/products');
      router.refresh();
    }
  }

  const addVariant = () =>
    setVariants((vs) => [
      ...vs,
      { variantCode: '', label: '', price: 0, unit: v.unitVi || 'tấn', stock: 0, isPopular: false },
    ]);
  const updateVariant = (i: number, patch: Partial<VariantRow>) =>
    setVariants((vs) => vs.map((row, j) => (j === i ? { ...row, ...patch } : row)));
  const removeVariant = (i: number) => setVariants((vs) => vs.filter((_, j) => j !== i));

  const addGalleryImage = () => {
    const url = galleryInput.trim();
    if (!url) return;
    setGallery((g) => [...g, url]);
    setGalleryInput('');
  };
  const removeGalleryImage = (i: number) => setGallery((g) => g.filter((_, j) => j !== i));

  const L = lang.toUpperCase();

  return (
    <form onSubmit={onSubmit}>
      <AdminPageHead
        crumbs={[
          { label: 'Sản phẩm', href: '/admin/products' },
          { label: isNew ? 'Thêm mới' : v.code },
        ]}
        title={isNew ? 'Thêm sản phẩm' : `Sửa: ${v.nameVi || v.code}`}
        sub={isNew ? 'Tạo một sản phẩm mới trong catalogue' : `Mã ${v.code}`}
        actions={
          !isNew && v.slug ? (
            <>
              <a href={`/products/${v.slug}`} target="_blank" rel="noreferrer" className="lac-btn">
                <AdminIcon name="eye" size={14} /> Xem website
              </a>
              <button type="submit" className="lac-btn primary" disabled={busy}>
                <AdminIcon name="check" size={15} />
                {busy ? 'Đang lưu…' : 'Lưu & Xuất bản'}
              </button>
            </>
          ) : (
            <button type="submit" className="lac-btn primary" disabled={busy}>
              <AdminIcon name="check" size={15} />
              {busy ? 'Đang lưu…' : 'Lưu sản phẩm'}
            </button>
          )
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
          {/* 01 — Basic info */}
          <EditorSection
            num="01"
            icon="file"
            title="Thông tin cơ bản"
            sub="Mã, đường dẫn và tên sản phẩm"
          >
            <div className="pe-row">
              <Field label="Mã sản phẩm" required help="VD: P-06">
                <input
                  className="lac-input"
                  value={v.code}
                  disabled={!isNew}
                  onChange={(e) => set('code', e.target.value)}
                  required
                />
              </Field>
              <Field label="Slug (URL)" required>
                <input
                  className="lac-input"
                  value={v.slug}
                  onChange={(e) => set('slug', e.target.value)}
                  required
                />
              </Field>
            </div>
            <Field label={`Tên sản phẩm (${L})`} required={lang === 'vi'}>
              <input
                className="lac-input"
                value={str(lf('name', lang))}
                onChange={(e) => set(lf('name', lang), e.target.value)}
                required={lang === 'vi'}
              />
            </Field>
            <Field label={`Tóm tắt / spec line (${L})`} help="VD: Uncoated · 4–20 µm">
              <input
                className="lac-input"
                value={str(lf('summary', lang))}
                onChange={(e) => set(lf('summary', lang), e.target.value)}
              />
            </Field>
            <Field
              label={`Mô tả ngắn (${L})`}
              help="Hiển thị ở thẻ sản phẩm trên trang chủ và danh sách."
            >
              <textarea
                className="lac-textarea"
                value={str(lf('shortDesc', lang))}
                onChange={(e) => set(lf('shortDesc', lang), e.target.value)}
              />
            </Field>
          </EditorSection>

          {/* 02 — Detail content */}
          <EditorSection
            num="02"
            icon="news"
            title="Nội dung chi tiết"
            sub="Mô tả đầy đủ trên trang sản phẩm"
          >
            <Field label={`Mô tả chi tiết (${L})`}>
              <textarea
                className="lac-textarea"
                style={{ minHeight: 160 }}
                value={str(lf('longDesc', lang))}
                onChange={(e) => set(lf('longDesc', lang), e.target.value)}
              />
            </Field>
          </EditorSection>

          {/* 03 — Images */}
          <EditorSection
            num="03"
            icon="image"
            title="Thư viện ảnh sản phẩm"
            sub={`${gallery.length} ảnh · ảnh đầu là ảnh đại diện`}
          >
            <Field label="Ảnh đại diện (cover)" help="Để trống → dùng ảnh đầu tiên trong thư viện.">
              <input
                className="lac-input"
                value={v.coverImageUrl}
                onChange={(e) => set('coverImageUrl', e.target.value)}
                placeholder="/assets/bot-caco3-sieu-min.webp"
              />
            </Field>
            {gallery.length > 0 ? (
              <div className="pe-gallery">
                {gallery.map((src, i) => (
                  <div key={`${src}-${i}`} className="pe-gallery-item">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" />
                    {i === 0 && !v.coverImageUrl ? (
                      <span className="cover-tag">Đại diện</span>
                    ) : null}
                    <button
                      type="button"
                      className="x"
                      onClick={() => removeGalleryImage(i)}
                      title="Xoá ảnh"
                    >
                      <AdminIcon name="x" size={11} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="lac-empty" style={{ padding: 24 }}>
                Chưa có ảnh nào trong thư viện sản phẩm.
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="lac-input"
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                placeholder="Dán đường dẫn ảnh rồi bấm Thêm…"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addGalleryImage();
                  }
                }}
              />
              <button type="button" className="lac-btn" onClick={addGalleryImage}>
                <AdminIcon name="plus" size={14} /> Thêm ảnh
              </button>
            </div>
          </EditorSection>

          {/* 04 — Variants */}
          <EditorSection
            num="04"
            icon="box"
            title="Quy cách / Variants"
            sub='Mỗi quy cách có giá riêng. Đánh dấu "Hot" để hiển thị badge.'
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {variants.length === 0 ? (
                <div className="lac-empty" style={{ padding: 24 }}>
                  Chưa có quy cách nào.
                </div>
              ) : (
                variants.map((row, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '110px 1fr 130px 90px 70px auto',
                      gap: 8,
                      alignItems: 'center',
                    }}
                  >
                    <input
                      className="lac-input"
                      placeholder="mã (3um)"
                      value={row.variantCode}
                      onChange={(e) => updateVariant(i, { variantCode: e.target.value })}
                    />
                    <input
                      className="lac-input"
                      placeholder="nhãn (3 µm)"
                      value={row.label}
                      onChange={(e) => updateVariant(i, { label: e.target.value })}
                    />
                    <input
                      className="lac-input"
                      type="number"
                      placeholder="giá VND"
                      value={row.price}
                      onChange={(e) => updateVariant(i, { price: Number(e.target.value) })}
                    />
                    <input
                      className="lac-input"
                      placeholder="đơn vị"
                      value={row.unit}
                      onChange={(e) => updateVariant(i, { unit: e.target.value })}
                    />
                    <input
                      className="lac-input"
                      type="number"
                      placeholder="kho"
                      value={row.stock}
                      onChange={(e) => updateVariant(i, { stock: Number(e.target.value) })}
                    />
                    <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                      <label
                        style={{
                          fontSize: 11.5,
                          display: 'inline-flex',
                          gap: 4,
                          alignItems: 'center',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={row.isPopular}
                          onChange={(e) => updateVariant(i, { isPopular: e.target.checked })}
                        />
                        Hot
                      </label>
                      <button
                        type="button"
                        className="lac-btn sm ghost danger"
                        onClick={() => removeVariant(i)}
                      >
                        <AdminIcon name="trash" size={13} />
                      </button>
                    </span>
                  </div>
                ))
              )}
              <button
                type="button"
                className="lac-btn sm"
                style={{ width: 'fit-content' }}
                onClick={addVariant}
              >
                <AdminIcon name="plus" size={14} /> Thêm quy cách
              </button>
            </div>
          </EditorSection>
        </div>

        {/* SIDE */}
        <aside className="pe-side">
          <div className="lac-card">
            <div className="lac-card-head">
              <h3>Trạng thái</h3>
            </div>
            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <StatusRadioGroup<'pub' | 'hide'>
                value={v.isActive ? 'pub' : 'hide'}
                onChange={(s) => set('isActive', s === 'pub')}
                options={[
                  { value: 'pub', label: 'Đang bán', hint: 'Hiển thị trên website' },
                  { value: 'hide', label: 'Đã ẩn', hint: 'Không hiển thị, vẫn giữ dữ liệu' },
                ]}
              />
              <ToggleRow
                label="Nổi bật (carousel trang chủ)"
                checked={v.isFeatured}
                onChange={(c) => set('isFeatured', c)}
              />
              <Field label="Thứ tự sắp xếp">
                <input
                  className="lac-input"
                  type="number"
                  value={v.sortOrder}
                  onChange={(e) => set('sortOrder', Number(e.target.value))}
                />
              </Field>
            </div>
          </div>

          <div className="lac-card">
            <div className="lac-card-head">
              <h3>Phân loại</h3>
            </div>
            <div style={{ padding: 14 }}>
              <Field label="Danh mục" required>
                <select
                  className="lac-select"
                  value={v.categoryId}
                  onChange={(e) => set('categoryId', e.target.value)}
                  required
                >
                  <option value="">— Chọn danh mục —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          <div className="lac-card">
            <div className="lac-card-head">
              <h3>Thông số đơn hàng</h3>
            </div>
            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label={`Đơn vị (${L})`}>
                <input
                  className="lac-input"
                  value={str(lf('unit', lang))}
                  onChange={(e) => set(lf('unit', lang), e.target.value)}
                  placeholder="tấn"
                />
              </Field>
              <Field label={`MOQ (${L})`}>
                <input
                  className="lac-input"
                  value={str(lf('moq', lang, true))}
                  onChange={(e) => set(lf('moq', lang, true), e.target.value)}
                  placeholder="25 tấn"
                />
              </Field>
              <Field label={`Lead time (${L})`}>
                <input
                  className="lac-input"
                  value={str(lf('productionTime', lang, true))}
                  onChange={(e) => set(lf('productionTime', lang, true), e.target.value)}
                  placeholder="7–14 ngày"
                />
              </Field>
            </div>
          </div>
        </aside>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <button type="submit" className="lac-btn primary" disabled={busy}>
          <AdminIcon name="check" size={15} />
          {busy ? 'Đang lưu…' : 'Lưu sản phẩm'}
        </button>
        <button type="button" className="lac-btn" onClick={() => router.push('/admin/products')}>
          Huỷ
        </button>
      </div>
    </form>
  );
}
