'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminIcon } from './AdminIcon';
import { Field, FieldRow } from './FormBits';
import { saveProduct, type ProductInput, type ActionResult } from '@/app/admin/(panel)/products/actions';

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
  gallery: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  variants: VariantRow[];
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
  const [state, setState] = useState<ActionResult | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof ProductFormValue>(k: K, val: ProductFormValue[K]) =>
    setV((p) => ({ ...p, [k]: val }));

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
      gallery: v.gallery
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean),
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

  return (
    <form onSubmit={onSubmit}>
      {state?.error ? (
        <div className="lg-err" style={{ marginBottom: 16 }}>
          <AdminIcon name="shield" size={14} />
          {state.error}
        </div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
        {/* MAIN COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="ad-card">
            <div className="ad-card-head">
              <h3>Thông tin chính</h3>
            </div>
            <div className="ad-card-body">
              <FieldRow>
                <Field label="Mã sản phẩm" required help="VD: P-06">
                  <input
                    className="ad-input"
                    value={v.code}
                    disabled={!isNew}
                    onChange={(e) => set('code', e.target.value)}
                    required
                  />
                </Field>
                <Field label="Slug (URL)" required>
                  <input
                    className="ad-input"
                    value={v.slug}
                    onChange={(e) => set('slug', e.target.value)}
                    required
                  />
                </Field>
              </FieldRow>

              <Field label="Danh mục" required>
                <select
                  className="ad-select"
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

              <Field label="Tên sản phẩm (VI)" required>
                <input className="ad-input" value={v.nameVi} onChange={(e) => set('nameVi', e.target.value)} required />
              </Field>
              <FieldRow>
                <Field label="Tên (EN)">
                  <input className="ad-input" value={v.nameEn} onChange={(e) => set('nameEn', e.target.value)} />
                </Field>
                <Field label="Tên (ZH)">
                  <input className="ad-input" value={v.nameZh} onChange={(e) => set('nameZh', e.target.value)} />
                </Field>
              </FieldRow>

              <Field label="Tóm tắt / spec line (VI)" help="VD: Uncoated · 3–20 µm">
                <input className="ad-input" value={v.summaryVi} onChange={(e) => set('summaryVi', e.target.value)} />
              </Field>
              <FieldRow>
                <Field label="Tóm tắt (EN)">
                  <input className="ad-input" value={v.summaryEn} onChange={(e) => set('summaryEn', e.target.value)} />
                </Field>
                <Field label="Tóm tắt (ZH)">
                  <input className="ad-input" value={v.summaryZh} onChange={(e) => set('summaryZh', e.target.value)} />
                </Field>
              </FieldRow>

              <Field label="Mô tả ngắn (VI)">
                <textarea className="ad-textarea" value={v.shortDescVi} onChange={(e) => set('shortDescVi', e.target.value)} />
              </Field>
              <FieldRow>
                <Field label="Mô tả ngắn (EN)">
                  <textarea className="ad-textarea" value={v.shortDescEn} onChange={(e) => set('shortDescEn', e.target.value)} />
                </Field>
                <Field label="Mô tả ngắn (ZH)">
                  <textarea className="ad-textarea" value={v.shortDescZh} onChange={(e) => set('shortDescZh', e.target.value)} />
                </Field>
              </FieldRow>

              <Field label="Mô tả chi tiết (VI)">
                <textarea
                  className="ad-textarea"
                  style={{ minHeight: 120 }}
                  value={v.longDescVi}
                  onChange={(e) => set('longDescVi', e.target.value)}
                />
              </Field>
              <FieldRow>
                <Field label="Mô tả chi tiết (EN)">
                  <textarea className="ad-textarea" value={v.longDescEn} onChange={(e) => set('longDescEn', e.target.value)} />
                </Field>
                <Field label="Mô tả chi tiết (ZH)">
                  <textarea className="ad-textarea" value={v.longDescZh} onChange={(e) => set('longDescZh', e.target.value)} />
                </Field>
              </FieldRow>
            </div>
          </div>

          {/* VARIANTS */}
          <div className="ad-card">
            <div className="ad-card-head">
              <div>
                <h3>Quy cách / Variants</h3>
                <p>Mỗi quy cách có giá riêng. Đánh dấu "Phổ biến" để hiển thị badge.</p>
              </div>
              <button type="button" className="ad-btn sm" onClick={addVariant}>
                <AdminIcon name="plus" size={14} /> Thêm dòng
              </button>
            </div>
            <div className="ad-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {variants.length === 0 ? (
                <div className="ad-empty" style={{ padding: 24 }}>Chưa có quy cách nào.</div>
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
                      className="ad-input"
                      placeholder="mã (3um)"
                      value={row.variantCode}
                      onChange={(e) => updateVariant(i, { variantCode: e.target.value })}
                    />
                    <input
                      className="ad-input"
                      placeholder="nhãn (3 µm)"
                      value={row.label}
                      onChange={(e) => updateVariant(i, { label: e.target.value })}
                    />
                    <input
                      className="ad-input"
                      type="number"
                      placeholder="giá VND"
                      value={row.price}
                      onChange={(e) => updateVariant(i, { price: Number(e.target.value) })}
                    />
                    <input
                      className="ad-input"
                      placeholder="đơn vị"
                      value={row.unit}
                      onChange={(e) => updateVariant(i, { unit: e.target.value })}
                    />
                    <input
                      className="ad-input"
                      type="number"
                      placeholder="kho"
                      value={row.stock}
                      onChange={(e) => updateVariant(i, { stock: Number(e.target.value) })}
                    />
                    <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                      <label style={{ fontSize: 11.5, display: 'inline-flex', gap: 4, alignItems: 'center' }}>
                        <input
                          type="checkbox"
                          checked={row.isPopular}
                          onChange={(e) => updateVariant(i, { isPopular: e.target.checked })}
                        />
                        Hot
                      </label>
                      <button
                        type="button"
                        className="ad-btn sm ghost danger"
                        onClick={() => removeVariant(i)}
                      >
                        <AdminIcon name="logout" size={13} />
                      </button>
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* SIDE COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="ad-card">
            <div className="ad-card-head">
              <h3>Trạng thái</h3>
            </div>
            <div className="ad-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={v.isActive}
                  onChange={(e) => set('isActive', e.target.checked)}
                />
                Đang bán (hiển thị trên web)
              </label>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={v.isFeatured}
                  onChange={(e) => set('isFeatured', e.target.checked)}
                />
                Nổi bật (carousel trang chủ)
              </label>
              <Field label="Thứ tự sắp xếp">
                <input
                  className="ad-input"
                  type="number"
                  value={v.sortOrder}
                  onChange={(e) => set('sortOrder', Number(e.target.value))}
                />
              </Field>
            </div>
          </div>

          <div className="ad-card">
            <div className="ad-card-head">
              <h3>Hình ảnh</h3>
            </div>
            <div className="ad-card-body">
              <Field label="Gallery" help="Mỗi URL một dòng. Ảnh đầu là ảnh bìa.">
                <textarea
                  className="ad-textarea"
                  style={{ minHeight: 110, fontFamily: 'ui-monospace, monospace', fontSize: 12 }}
                  value={v.gallery}
                  onChange={(e) => set('gallery', e.target.value)}
                  placeholder="/assets/bot-caco3-sieu-min.webp"
                />
              </Field>
            </div>
          </div>

          <div className="ad-card">
            <div className="ad-card-head">
              <h3>Thông số đơn hàng</h3>
            </div>
            <div className="ad-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="Đơn vị (VI / EN / ZH)">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                  <input className="ad-input" placeholder="tấn" value={v.unitVi} onChange={(e) => set('unitVi', e.target.value)} />
                  <input className="ad-input" placeholder="ton" value={v.unitEn} onChange={(e) => set('unitEn', e.target.value)} />
                  <input className="ad-input" placeholder="吨" value={v.unitZh} onChange={(e) => set('unitZh', e.target.value)} />
                </div>
              </Field>
              <Field label="MOQ (VI / EN / ZH)">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                  <input className="ad-input" placeholder="25 tấn" value={v.moq} onChange={(e) => set('moq', e.target.value)} />
                  <input className="ad-input" placeholder="25 tons" value={v.moqEn} onChange={(e) => set('moqEn', e.target.value)} />
                  <input className="ad-input" placeholder="25吨" value={v.moqZh} onChange={(e) => set('moqZh', e.target.value)} />
                </div>
              </Field>
              <Field label="Lead time (VI / EN / ZH)">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                  <input className="ad-input" placeholder="7–14 ngày" value={v.productionTime} onChange={(e) => set('productionTime', e.target.value)} />
                  <input className="ad-input" placeholder="7–14 days" value={v.productionTimeEn} onChange={(e) => set('productionTimeEn', e.target.value)} />
                  <input className="ad-input" placeholder="7–14天" value={v.productionTimeZh} onChange={(e) => set('productionTimeZh', e.target.value)} />
                </div>
              </Field>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <button type="submit" className="ad-btn primary" disabled={busy}>
          <AdminIcon name="check" size={15} />
          {busy ? 'Đang lưu…' : 'Lưu sản phẩm'}
        </button>
        <button type="button" className="ad-btn" onClick={() => router.push('/admin/products')}>
          Huỷ
        </button>
      </div>
    </form>
  );
}
