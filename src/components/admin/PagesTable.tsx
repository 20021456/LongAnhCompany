'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminIcon } from './AdminIcon';
import { fmtDateVn } from '@/lib/format';

export interface PageRow {
  key: string;
  label: string;
  path: string;
  isPublished: boolean;
  /** Number of editable sections on this page (read from page_sections). */
  sections: number;
  /** ISO string of the last edit, or null when the row only has defaults. */
  updatedAt: string | null;
  /** Initials of the last editor — falls back to "—" when unknown. */
  updaterInitials: string;
  /** Optional star/featured marker (e.g. the home page). */
  starred?: boolean;
}

type StatusKey = 'all' | 'pub' | 'draft' | 'sched' | 'hide';

const STATUS_FILTERS: { id: StatusKey; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pub', label: 'Đã xuất bản' },
  { id: 'draft', label: 'Nháp' },
  { id: 'sched', label: 'Hẹn giờ' },
  { id: 'hide', label: 'Đã ẩn' },
];

/**
 * Map the persisted Page (only an isPublished boolean today) to one of the
 * four visual statuses used by the prototype. The draft/sched buckets are
 * placeholders for Phase 7 (when we add a real status enum + scheduling)
 * — they currently always come up empty.
 */
function statusOf(row: PageRow): 'pub' | 'hide' {
  return row.isPublished ? 'pub' : 'hide';
}

const STATUS_LABEL: Record<'pub' | 'draft' | 'sched' | 'hide', string> = {
  pub: 'Đã xuất bản',
  draft: 'Nháp',
  sched: 'Hẹn giờ',
  hide: 'Đã ẩn',
};

/** "5 giờ trước" / "2 tuần trước" / fallback to a real date for >12 weeks. */
function timeAgo(iso: string | null): string {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'vừa xong';
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} ngày trước`;
  const w = Math.floor(d / 7);
  if (w < 12) return `${w} tuần trước`;
  return fmtDateVn(iso);
}

/** Time-ago label rendered client-side to avoid an SSR/CSR clock mismatch. */
function TimeAgo({ iso }: { iso: string | null }) {
  const [label, setLabel] = useState(() => (iso ? fmtDateVn(iso) : '—'));
  useEffect(() => {
    setLabel(timeAgo(iso));
  }, [iso]);
  return <>{label}</>;
}

export function PagesTable({ rows }: { rows: PageRow[] }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<StatusKey>('all');
  const [lang, setLang] = useState('vi');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((p) => {
      const s = statusOf(p);
      if (filter !== 'all' && filter !== s) return false;
      if (
        q &&
        !p.label.toLowerCase().includes(q) &&
        !p.path.toLowerCase().includes(q) &&
        !p.key.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [rows, query, filter]);

  const total = rows.length;
  const pubCount = rows.filter((r) => statusOf(r) === 'pub').length;
  const hideCount = total - pubCount;

  return (
    <div className="ad-table-wrap">
      <div className="ad-toolbar">
        <div className="ad-search-box" style={{ width: 280 }}>
          <AdminIcon name="search" size={14} />
          <input
            className="ad-input"
            placeholder="Tìm theo tên, slug…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="ad-select"
          style={{ width: 150 }}
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="vi">Tiếng Việt</option>
          <option value="en">English</option>
          <option value="zh">中文</option>
        </select>
        <div
          style={{
            display: 'flex',
            gap: 4,
            padding: 3,
            background: 'var(--ad-line-soft)',
            borderRadius: 6,
          }}
        >
          {STATUS_FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                style={{
                  border: 0,
                  background: active ? '#fff' : 'transparent',
                  padding: '4px 11px',
                  borderRadius: 4,
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: active ? 'var(--ad-text)' : 'var(--ad-text-soft)',
                  boxShadow: active ? 'var(--ad-shadow)' : 'none',
                  cursor: 'pointer',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <div className="grow" />
        <button className="ad-btn ghost sm" type="button" disabled>
          <AdminIcon name="filter" size={13} /> Lọc thêm
        </button>
      </div>

      <table className="ad-table">
        <thead>
          <tr>
            <th style={{ width: 36 }}>
              <input type="checkbox" />
            </th>
            <th>Tên trang</th>
            <th style={{ width: 200 }}>Đường dẫn</th>
            <th style={{ width: 110 }}>Sections</th>
            <th style={{ width: 140 }}>Trạng thái</th>
            <th style={{ width: 200 }}>Sửa lần cuối</th>
            <th style={{ width: 140 }} />
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => {
            const status = statusOf(p);
            return (
              <tr key={p.key}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="ad-iconbox">
                      <AdminIcon name="file" size={15} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        {p.label}
                        {p.starred ? <AdminIcon name="star" size={13} /> : null}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>ID: {p.key}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <code
                    style={{
                      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                      fontSize: 12,
                      color: 'var(--ad-text-soft)',
                      background: 'var(--ad-line-soft)',
                      padding: '2px 7px',
                      borderRadius: 4,
                    }}
                  >
                    {p.path}
                  </code>
                </td>
                <td>{p.sections} sections</td>
                <td>
                  <span className={'ad-badge ' + status}>
                    <span className="dot" />
                    {STATUS_LABEL[status]}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: 'var(--ad-primary)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: 9.5,
                        flex: 'none',
                      }}
                    >
                      {p.updaterInitials || '—'}
                    </div>
                    <div style={{ fontSize: 13 }}>
                      <TimeAgo iso={p.updatedAt} />
                    </div>
                  </div>
                </td>
                <td>
                  <div className="row-actions" style={{ justifyContent: 'flex-end' }}>
                    <Link
                      href={`/admin/pages/${p.key}`}
                      className="ad-btn ghost sm"
                      title="Sửa nội dung"
                    >
                      <AdminIcon name="edit" size={13} />
                    </Link>
                    <a
                      href={p.path}
                      target="_blank"
                      rel="noreferrer"
                      className="ad-btn ghost sm"
                      title="Xem trên web"
                    >
                      <AdminIcon name="eye" size={13} />
                    </a>
                    <button type="button" className="ad-btn ghost sm" title="Nhân bản" disabled>
                      <AdminIcon name="copy" size={13} />
                    </button>
                    <button type="button" className="ad-btn ghost sm" title="Thêm" disabled>
                      <AdminIcon name="more" size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', color: 'var(--ad-text-mute)' }}>
                Không có trang nào khớp bộ lọc.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>

      <div className="ad-pag">
        <div>
          Hiển thị 1 – {filtered.length} của {total} trang · {pubCount} đã xuất bản · {hideCount} đã
          ẩn
        </div>
        <div className="ad-pag-pages">
          <button type="button" disabled>
            ‹
          </button>
          <button type="button" className="on">
            1
          </button>
          <button type="button" disabled>
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
