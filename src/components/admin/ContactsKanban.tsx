'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AdminIcon } from './AdminIcon';
import { setContactStatus, setContactAssignee } from '@/app/admin/(panel)/contacts/actions';

export interface KanbanCard {
  id: string;
  fullName: string;
  email: string;
  company: string | null;
  message: string | null;
  source: string | null;
  status: string; // new | contacted | quoted | won | lost
  createdAt: string;
  noteCount: number;
  assignedToId: string | null;
}

export interface AssignableUser {
  id: string;
  fullName: string;
}

const COLUMNS: { key: string; label: string; tone: string }[] = [
  { key: 'new', label: 'Mới', tone: '#F08023' },
  { key: 'contacted', label: 'Đã liên hệ', tone: '#3B82F6' },
  { key: 'quoted', label: 'Đã báo giá', tone: '#A855F7' },
  { key: 'won', label: 'Thành công', tone: '#22C55E' },
  { key: 'lost', label: 'Thất bại', tone: '#94A3B8' },
];

const SOURCE_LABEL: Record<string, string> = {
  home_form: 'Trang chủ',
  product_quote: 'Báo giá sản phẩm',
  contact_page: 'Trang liên hệ',
};

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function CardItem({
  card,
  users,
  onAssignChange,
}: {
  card: KanbanCard;
  users: AssignableUser[];
  onAssignChange: (userId: string | null) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: { status: card.status },
  });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: '#fff',
    border: '1px solid var(--ad-line)',
    borderRadius: 8,
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    opacity: isDragging ? 0.45 : 1,
    boxShadow: isDragging ? '0 6px 18px rgba(0,0,0,.18)' : undefined,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <div
        {...attributes}
        {...listeners}
        style={{
          cursor: 'grab',
          touchAction: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <AdminIcon name="grid" size={11} />
        <span style={{ fontWeight: 600, fontSize: 13, flex: 1 }}>{card.fullName}</span>
        <span style={{ fontSize: 11, color: 'var(--ad-text-mute)' }}>
          {fmtDate(card.createdAt)}
        </span>
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--ad-text-mute)', wordBreak: 'break-all' }}>
        {card.email}
        {card.company ? ` · ${card.company}` : ''}
      </div>
      {card.message ? (
        <div
          style={{
            fontSize: 12,
            color: 'var(--ad-text-soft)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {card.message}
        </div>
      ) : null}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
        <select
          className="ad-select"
          style={{ fontSize: 11, padding: '3px 6px', flex: 1 }}
          value={card.assignedToId ?? ''}
          onChange={(e) => onAssignChange(e.target.value || null)}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <option value="">— Chưa gán —</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.fullName}
            </option>
          ))}
        </select>
        <Link
          href={`/admin/contacts/${card.id}`}
          className="ad-btn sm ghost"
          style={{ padding: '3px 6px', fontSize: 11 }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {card.noteCount > 0 ? `Xem (${card.noteCount})` : 'Xem'}
        </Link>
      </div>
      {card.source ? (
        <div style={{ fontSize: 10.5, color: 'var(--ad-text-mute)' }}>
          Nguồn: {SOURCE_LABEL[card.source] ?? card.source}
        </div>
      ) : null}
    </div>
  );
}

function Column({
  status,
  label,
  tone,
  cards,
  users,
  onAssignChange,
}: {
  status: string;
  label: string;
  tone: string;
  cards: KanbanCard[];
  users: AssignableUser[];
  onAssignChange: (id: string, userId: string | null) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `col:${status}`, data: { status } });
  return (
    <div
      ref={setNodeRef}
      style={{
        background: isOver ? '#f5f5f6' : '#fafafa',
        border: '1px solid var(--ad-line-soft)',
        borderRadius: 10,
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        minWidth: 260,
        minHeight: 200,
        transition: 'background .15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: tone,
            flex: 'none',
          }}
        />
        <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, flex: 1 }}>{label}</h4>
        <span style={{ fontSize: 11.5, color: 'var(--ad-text-mute)' }}>{cards.length}</span>
      </div>
      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        {cards.length === 0 ? (
          <div
            style={{
              fontSize: 12,
              color: 'var(--ad-text-mute)',
              padding: '12px 6px',
              textAlign: 'center',
            }}
          >
            Kéo lead vào đây
          </div>
        ) : (
          cards.map((c) => (
            <CardItem
              key={c.id}
              card={c}
              users={users}
              onAssignChange={(uid) => onAssignChange(c.id, uid)}
            />
          ))
        )}
      </SortableContext>
    </div>
  );
}

export function ContactsKanban({
  cards: initial,
  users,
}: {
  cards: KanbanCard[];
  users: AssignableUser[];
}) {
  const router = useRouter();
  const [cards, setCards] = useState<KanbanCard[]>(initial);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const byStatus = useMemo(() => {
    const out: Record<string, KanbanCard[]> = {};
    for (const col of COLUMNS) out[col.key] = [];
    for (const c of cards) (out[c.status] ?? (out[c.status] = [])).push(c);
    return out;
  }, [cards]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const card = cards.find((c) => c.id === active.id);
    if (!card) return;

    // The drop target is either a column droppable (id "col:<status>") or
    // another card (whose data carries the column status).
    let targetStatus: string | null = null;
    const overId = String(over.id);
    if (overId.startsWith('col:')) targetStatus = overId.slice(4);
    else {
      const overCard = cards.find((c) => c.id === over.id);
      if (overCard) targetStatus = overCard.status;
    }
    if (!targetStatus || targetStatus === card.status) return;
    if (!COLUMNS.some((col) => col.key === targetStatus)) return;

    // Optimistic update, then persist.
    setCards((prev) => prev.map((c) => (c.id === card.id ? { ...c, status: targetStatus! } : c)));
    const res = await setContactStatus(card.id, targetStatus);
    if (res.error) {
      // Roll back on failure.
      setCards((prev) => prev.map((c) => (c.id === card.id ? { ...c, status: card.status } : c)));
      alert(res.error);
    } else {
      router.refresh();
    }
  }

  async function onAssignChange(id: string, userId: string | null) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, assignedToId: userId } : c)));
    const res = await setContactAssignee(id, userId);
    if (res.error) {
      alert(res.error);
      router.refresh();
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLUMNS.length}, minmax(240px, 1fr))`,
          gap: 12,
          overflowX: 'auto',
          paddingBottom: 8,
        }}
      >
        {COLUMNS.map((col) => (
          <Column
            key={col.key}
            status={col.key}
            label={col.label}
            tone={col.tone}
            cards={byStatus[col.key] ?? []}
            users={users}
            onAssignChange={onAssignChange}
          />
        ))}
      </div>
    </DndContext>
  );
}
