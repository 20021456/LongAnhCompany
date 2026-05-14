'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AdminIcon } from './AdminIcon';
import { DeleteButton } from './DeleteButton';

export interface JobRow {
  id: string;
  slug: string;
  titleVi: string;
  location: string;
  departmentName: string;
  deadlineText: string;
  levelVi: string;
  applicationCount: number;
  isActive: boolean;
}

const FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'open', label: 'Đang tuyển' },
  { id: 'closed', label: 'Đã đóng' },
];

export function JobsTable({
  rows,
  deleteAction,
}: {
  rows: JobRow[];
  deleteAction: (id: string) => Promise<{ ok?: boolean; error?: string }>;
}) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((j) => {
      if (filter === 'open' && !j.isActive) return false;
      if (filter === 'closed' && j.isActive) return false;
      if (q && !j.titleVi.toLowerCase().includes(q) && !j.departmentName.toLowerCase().includes(q))
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
            placeholder="Tìm theo vị trí, phòng ban…"
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
            <th>Vị trí</th>
            <th style={{ width: 160 }}>Phòng ban</th>
            <th style={{ width: 130 }}>Hạn nộp</th>
            <th style={{ width: 130 }}>Đơn ứng tuyển</th>
            <th style={{ width: 120 }}>Trạng thái</th>
            <th style={{ width: 150 }} />
          </tr>
        </thead>
        <tbody>
          {filtered.map((j) => (
            <tr key={j.id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="ad-iconbox">
                    <AdminIcon name="users" size={15} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{j.titleVi}</div>
                    <div style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>
                      {[j.location, j.levelVi].filter(Boolean).join(' · ') || '—'}
                    </div>
                  </div>
                </div>
              </td>
              <td>{j.departmentName}</td>
              <td style={{ color: 'var(--ad-text-soft)' }}>{j.deadlineText || '—'}</td>
              <td>
                {j.applicationCount > 0 ? (
                  <Link
                    href={`/admin/jobs/${j.slug}/applications`}
                    style={{ color: 'var(--ad-primary)', fontWeight: 600 }}
                  >
                    {j.applicationCount} đơn
                  </Link>
                ) : (
                  <span style={{ color: 'var(--ad-text-mute)' }}>0</span>
                )}
              </td>
              <td>
                <span className={'ad-badge ' + (j.isActive ? 'pub' : 'hide')}>
                  <span className="dot" />
                  {j.isActive ? 'đang tuyển' : 'đã đóng'}
                </span>
              </td>
              <td>
                <div className="row-actions">
                  <Link href={`/admin/jobs/${j.slug}`} className="ad-btn sm">
                    <AdminIcon name="edit" size={13} /> Sửa
                  </Link>
                  <DeleteButton id={j.id} action={deleteAction} />
                </div>
              </td>
            </tr>
          ))}
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', color: 'var(--ad-text-mute)' }}>
                Không có vị trí nào khớp bộ lọc.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>

      <div className="ad-pag">
        <div>
          Hiển thị {filtered.length} / {rows.length} vị trí
        </div>
      </div>
    </div>
  );
}
