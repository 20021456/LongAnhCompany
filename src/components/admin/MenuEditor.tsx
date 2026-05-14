'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminIcon } from './AdminIcon';
import { saveMenu, type ActionResult } from '@/app/admin/(panel)/menu/actions';

export interface MenuItemValue {
  labelVi: string;
  labelEn: string;
  labelZh: string;
  url: string;
  target: '_self' | '_blank';
  isActive: boolean;
}

export interface MenuData {
  location: string;
  items: MenuItemValue[];
}

const EMPTY_ITEM: MenuItemValue = {
  labelVi: '',
  labelEn: '',
  labelZh: '',
  url: '/',
  target: '_self',
  isActive: true,
};

const LOCATION_LABEL: Record<string, string> = {
  header: 'Menu đầu trang (header)',
  footer: 'Menu chân trang (footer)',
};

function MenuPanel({ data }: { data: MenuData }) {
  const router = useRouter();
  const [items, setItems] = useState<MenuItemValue[]>(data.items);
  const [state, setState] = useState<ActionResult | null>(null);
  const [busy, setBusy] = useState(false);

  const update = (i: number, patch: Partial<MenuItemValue>) =>
    setItems((p) => p.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    setItems((p) => {
      const next = [...p];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const remove = (i: number) => setItems((p) => p.filter((_, idx) => idx !== i));
  const add = () => setItems((p) => [...p, { ...EMPTY_ITEM }]);

  async function onSave() {
    setBusy(true);
    setState(null);
    const res = await saveMenu({ location: data.location, items });
    setBusy(false);
    setState(res);
    if (res.ok) router.refresh();
  }

  return (
    <div className="ad-card">
      <div className="ad-card-head">
        <div>
          <h3>{LOCATION_LABEL[data.location] ?? data.location}</h3>
          <p>{items.length} mục</p>
        </div>
        <button type="button" className="ad-btn sm" onClick={add}>
          <AdminIcon name="plus" size={13} /> Thêm mục
        </button>
      </div>
      <div className="ad-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {state?.error ? (
          <div className="lg-err">
            <AdminIcon name="shield" size={14} />
            {state.error}
          </div>
        ) : null}
        {state?.ok ? (
          <div className="ad-badge pub" style={{ padding: '8px 12px' }}>
            <span className="dot" />
            Đã lưu menu.
          </div>
        ) : null}

        {items.length === 0 ? (
          <div className="ad-empty">Chưa có mục nào. Bấm “Thêm mục” để bắt đầu.</div>
        ) : (
          items.map((it, i) => (
            <div
              key={i}
              style={{
                border: '1px solid var(--ad-line)',
                borderRadius: 8,
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                background: it.isActive ? 'transparent' : 'var(--ad-line-soft)',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <input
                  className="ad-input"
                  placeholder="Nhãn (VI)"
                  value={it.labelVi}
                  onChange={(e) => update(i, { labelVi: e.target.value })}
                />
                <input
                  className="ad-input"
                  placeholder="Label (EN)"
                  value={it.labelEn}
                  onChange={(e) => update(i, { labelEn: e.target.value })}
                />
                <input
                  className="ad-input"
                  placeholder="标签 (ZH)"
                  value={it.labelZh}
                  onChange={(e) => update(i, { labelZh: e.target.value })}
                />
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 130px auto',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                <input
                  className="ad-input"
                  placeholder="Đường dẫn — /products"
                  value={it.url}
                  onChange={(e) => update(i, { url: e.target.value })}
                />
                <select
                  className="ad-select"
                  value={it.target}
                  onChange={(e) =>
                    update(i, { target: e.target.value === '_blank' ? '_blank' : '_self' })
                  }
                >
                  <option value="_self">Cùng tab</option>
                  <option value="_blank">Tab mới</option>
                </select>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <button
                    type="button"
                    className="ad-btn sm ghost"
                    title="Lên"
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="ad-btn sm ghost"
                    title="Xuống"
                    disabled={i === items.length - 1}
                    onClick={() => move(i, 1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="ad-btn sm danger"
                    title="Xoá mục"
                    onClick={() => remove(i)}
                  >
                    <AdminIcon name="logout" size={13} />
                  </button>
                </div>
              </div>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12.5 }}>
                <input
                  type="checkbox"
                  checked={it.isActive}
                  onChange={(e) => update(i, { isActive: e.target.checked })}
                />
                Hiển thị trên web
              </label>
            </div>
          ))
        )}

        <div>
          <button type="button" className="ad-btn primary" disabled={busy} onClick={onSave}>
            <AdminIcon name="check" size={15} />
            {busy ? 'Đang lưu…' : 'Lưu menu'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function MenuEditor({ header, footer }: { header: MenuData; footer: MenuData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <MenuPanel data={header} />
      <MenuPanel data={footer} />
    </div>
  );
}
