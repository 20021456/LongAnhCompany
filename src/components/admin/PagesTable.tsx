'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AdminIcon } from './AdminIcon';

export interface PageRow {
  key: string;
  label: string;
  path: string;
  isPublished: boolean;
  metaTitle: string;
  updatedAt: string | null;
}

const FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pub', label: 'Đã xuất bản' },
  { id: 'hide', label: 'Đã ẩn' },
];

export function PagesTable({ rows }: { rows: PageRow[] }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((p) => {
      if (filter === 'pub' && !p.isPublished) return false;
      if (filter === 'hide' && p.isPublished) return false;
      if (q && !p.label.toLowerCase().includes(q) && !p.path.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [rows, query, filter]);

  return (
    <div className="ad-table-wrap">
      <div className="ad-toolbar">
        <div className="ad-search-box" style={{ width: 280 }}>
          <AdminIcon name="search" size={14} />
          <input
            className="ad-input"
            placeholder="Tìm theo tên, đường dẫn…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="ad-seg">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={filter === f.id ? 'on' : ''}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <table className="ad-table">
        <thead>
          <tr>
            <th>Tên trang</th>
            <th style={{ width: 200 }}>Đường dẫn</th>
            <th>Tiêu đề SEO</th>
            <th style={{ width: 130 }}>Trạng thái</th>
            <th style={{ width: 140 }} />
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.key}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="ad-iconbox">
                    <AdminIcon name="file" size={15} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{p.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>ID: {p.key}</div>
                  </div>
                </div>
              </td>
              <td>
                <span className="ad-code">{p.path}</span>
              </td>
              <td style={{ color: p.metaTitle ? undefined : 'var(--ad-text-mute)' }}>
                {p.metaTitle || '— dùng mặc định —'}
              </td>
              <td>
                <span className={'ad-badge ' + (p.isPublished ? 'pub' : 'hide')}>
                  <span className="dot" />
                  {p.isPublished ? 'đã xuất bản' : 'đã ẩn'}
                </span>
              </td>
              <td>
                <div className="row-actions">
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
                </div>
              </td>
            </tr>
          ))}
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', color: 'var(--ad-text-mute)' }}>
                Không có trang nào khớp bộ lọc.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>

      <div className="ad-pag">
        <div>
          Hiển thị {filtered.length} / {rows.length} trang
        </div>
      </div>
    </div>
  );
}
