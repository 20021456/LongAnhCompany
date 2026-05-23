'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

/** A stable browser-only id is attached to each row so DnD can reorder them
 *  even while users edit the row's content. Not persisted to the DB. */
interface SortableRow {
  id: string;
  value: MenuItemValue;
}

function newId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `row-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  );
}

function SortableMenuRow({
  row,
  onChange,
  onRemove,
}: {
  row: SortableRow;
  onChange: (patch: Partial<MenuItemValue>) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
  });
  const it = row.value;
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: '1px solid var(--ad-line)',
    borderRadius: 8,
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    background: it.isActive ? 'transparent' : 'var(--ad-line-soft)',
    opacity: isDragging ? 0.55 : 1,
    cursor: isDragging ? 'grabbing' : 'default',
  };
  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 1fr', gap: 8 }}>
        <button
          type="button"
          className="ad-btn sm ghost"
          {...attributes}
          {...listeners}
          title="Kéo để sắp xếp"
          aria-label="Kéo để sắp xếp"
          style={{ cursor: 'grab', touchAction: 'none' }}
        >
          <AdminIcon name="grid" size={13} />
        </button>
        <input
          className="ad-input"
          placeholder="Nhãn (VI)"
          value={it.labelVi}
          onChange={(e) => onChange({ labelVi: e.target.value })}
        />
        <input
          className="ad-input"
          placeholder="Label (EN)"
          value={it.labelEn}
          onChange={(e) => onChange({ labelEn: e.target.value })}
        />
        <input
          className="ad-input"
          placeholder="标签 (ZH)"
          value={it.labelZh}
          onChange={(e) => onChange({ labelZh: e.target.value })}
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
          onChange={(e) => onChange({ url: e.target.value })}
        />
        <select
          className="ad-select"
          value={it.target}
          onChange={(e) => onChange({ target: e.target.value === '_blank' ? '_blank' : '_self' })}
        >
          <option value="_self">Cùng tab</option>
          <option value="_blank">Tab mới</option>
        </select>
        <button type="button" className="ad-btn sm danger" title="Xoá mục" onClick={onRemove}>
          <AdminIcon name="logout" size={13} />
        </button>
      </div>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12.5 }}>
        <input
          type="checkbox"
          checked={it.isActive}
          onChange={(e) => onChange({ isActive: e.target.checked })}
        />
        Hiển thị trên web
      </label>
    </div>
  );
}

function MenuPanel({ data }: { data: MenuData }) {
  const router = useRouter();
  const [rows, setRows] = useState<SortableRow[]>(() =>
    data.items.map((v) => ({ id: newId(), value: v })),
  );
  const [state, setState] = useState<ActionResult | null>(null);
  const [busy, setBusy] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setRows((prev) => {
      const from = prev.findIndex((r) => r.id === active.id);
      const to = prev.findIndex((r) => r.id === over.id);
      if (from < 0 || to < 0) return prev;
      return arrayMove(prev, from, to);
    });
  }

  const update = (id: string, patch: Partial<MenuItemValue>) =>
    setRows((p) => p.map((r) => (r.id === id ? { ...r, value: { ...r.value, ...patch } } : r)));

  const remove = (id: string) => setRows((p) => p.filter((r) => r.id !== id));
  const add = () => setRows((p) => [...p, { id: newId(), value: { ...EMPTY_ITEM } }]);

  async function onSave() {
    setBusy(true);
    setState(null);
    const res = await saveMenu({ location: data.location, items: rows.map((r) => r.value) });
    setBusy(false);
    setState(res);
    if (res.ok) router.refresh();
  }

  return (
    <div className="ad-card">
      <div className="ad-card-head">
        <div>
          <h3>{LOCATION_LABEL[data.location] ?? data.location}</h3>
          <p>{rows.length} mục · kéo biểu tượng ⠿ để sắp xếp</p>
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

        {rows.length === 0 ? (
          <div className="ad-empty">Chưa có mục nào. Bấm “Thêm mục” để bắt đầu.</div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
              {rows.map((r) => (
                <SortableMenuRow
                  key={r.id}
                  row={r}
                  onChange={(patch) => update(r.id, patch)}
                  onRemove={() => remove(r.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
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
