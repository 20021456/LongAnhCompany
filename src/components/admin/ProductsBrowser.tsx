'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AdminIcon } from './AdminIcon';
import { DeleteButton } from './DeleteButton';
import { fmtDateVn } from '@/lib/format';

export interface ProductRow {
  id: string;
  code: string;
  slug: string;
  nameVi: string;
  summaryVi: string;
  categoryId: string;
  categoryName: string;
  coverImageUrl: string | null;
  isActive: boolean;
  isFeatured: boolean;
  variantCount: number;
  updatedAt: string;
}

/**
 * Relative-time label. Renders the absolute date during SSR (deterministic),
 * then upgrades to a "hôm nay / hôm qua / N ngày trước" label on the client
 * after mount. Using `Date.now()` directly inside render would mismatch
 * between the server's clock and the browser's clock and cause hydration
 * errors.
 */
function useTimeAgo(iso: string): string {
  const [label, setLabel] = useState(() => fmtDateVn(iso));
  useEffect(() => {
    const diff = Date.now() - new Date(iso).getTime();
    const day = 86_400_000;
    if (diff < day) setLabel('hôm nay');
    else if (diff < 2 * day) setLabel('hôm qua');
    else if (diff < 30 * day) setLabel(`${Math.floor(diff / day)} ngày trước`);
    else setLabel(fmtDateVn(iso));
  }, [iso]);
  return label;
}

function TimeAgo({ iso }: { iso: string }) {
  return <>{useTimeAgo(iso)}</>;
}

function StatusBadges({ active, featured }: { active: boolean; featured: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      <span className={'lac-badge ' + (active ? 'pub' : 'hide')}>
        <span className="dot" />
        {active ? 'hiển thị' : 'đã ẩn'}
      </span>
      {featured ? (
        <span className="lac-badge sched">
          <span className="dot" />
          nổi bật
        </span>
      ) : null}
    </div>
  );
}

export function ProductsBrowser({
  rows,
  categories,
  deleteAction,
}: {
  rows: ProductRow[];
  categories: { id: string; nameVi: string }[];
  deleteAction: (id: string) => Promise<{ ok?: boolean; error?: string }>;
}) {
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [status, setStatus] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((p) => {
      if (categoryId !== 'all' && p.categoryId !== categoryId) return false;
      if (status === 'active' && !p.isActive) return false;
      if (status === 'hidden' && p.isActive) return false;
      if (status === 'featured' && !p.isFeatured) return false;
      if (q && !p.nameVi.toLowerCase().includes(q) && !p.code.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [rows, query, categoryId, status]);

  return (
    <div className="lac-table-wrap">
      <div className="lac-toolbar">
        <div className="lac-search-box" style={{ width: 280 }}>
          <AdminIcon name="search" size={14} />
          <input
            className="lac-input"
            placeholder="Tìm theo tên sản phẩm, mã…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="lac-select"
          style={{ width: 180 }}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="all">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameVi}
            </option>
          ))}
        </select>
        <select
          className="lac-select"
          style={{ width: 150 }}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">Mọi trạng thái</option>
          <option value="active">Đang hiển thị</option>
          <option value="hidden">Đã ẩn</option>
          <option value="featured">Nổi bật</option>
        </select>
        <div className="grow" />
        <div className="lac-seg icons">
          <button
            type="button"
            className={view === 'grid' ? 'on' : ''}
            onClick={() => setView('grid')}
            title="Dạng lưới"
          >
            <AdminIcon name="grid" size={14} />
          </button>
          <button
            type="button"
            className={view === 'list' ? 'on' : ''}
            onClick={() => setView('list')}
            title="Dạng danh sách"
          >
            <AdminIcon name="list" size={14} />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="lac-empty" style={{ border: 0, borderRadius: 0 }}>
          Không có sản phẩm nào khớp bộ lọc.
        </div>
      ) : view === 'grid' ? (
        <div className="pl-grid">
          {filtered.map((p) => (
            <Link key={p.id} href={`/admin/products/${p.code}`} className="pl-card">
              <div className="img">
                {p.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.coverImageUrl} alt={p.nameVi} />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--ad-text-mute)',
                    }}
                  >
                    <AdminIcon name="image" size={28} />
                  </div>
                )}
                <div className="badge-tr">
                  <span className={'lac-badge ' + (p.isActive ? 'pub' : 'hide')}>
                    <span className="dot" />
                    {p.isActive ? 'hiển thị' : 'ẩn'}
                  </span>
                </div>
              </div>
              <div className="body">
                <div className="cat">{p.categoryName}</div>
                <h4>{p.nameVi}</h4>
                <div style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>
                  <span className="lac-code">{p.code}</span>
                  {p.isFeatured ? (
                    <span style={{ marginLeft: 6, color: 'var(--ad-accent)' }}>★ nổi bật</span>
                  ) : null}
                </div>
                <div className="meta">
                  <span>{p.variantCount} quy cách</span>
                  <span>{<TimeAgo iso={p.updatedAt} />}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <table className="lac-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th style={{ width: 160 }}>Danh mục</th>
              <th style={{ width: 100 }}>Quy cách</th>
              <th style={{ width: 160 }}>Trạng thái</th>
              <th style={{ width: 130 }}>Sửa lần cuối</th>
              <th style={{ width: 150 }} />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {p.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.coverImageUrl} className="lac-thumb" alt="" />
                    ) : (
                      <div className="lac-thumb" />
                    )}
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.nameVi}</div>
                      <div style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>
                        <span className="lac-code">{p.code}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td>{p.categoryName}</td>
                <td>{p.variantCount}</td>
                <td>
                  <StatusBadges active={p.isActive} featured={p.isFeatured} />
                </td>
                <td style={{ color: 'var(--ad-text-soft)' }}>{<TimeAgo iso={p.updatedAt} />}</td>
                <td>
                  <div className="row-actions tight">
                    <Link
                      href={`/admin/products/${p.code}`}
                      className="lac-btn ghost sm"
                      title="Sửa sản phẩm"
                      aria-label="Sửa sản phẩm"
                    >
                      <AdminIcon name="edit" size={13} />
                    </Link>
                    <a
                      href={`/vi/products/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="lac-btn ghost sm"
                      title="Xem trên web"
                      aria-label="Xem trên web"
                    >
                      <AdminIcon name="eye" size={13} />
                    </a>
                    <DeleteButton id={p.id} action={deleteAction} iconOnly />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="lac-pag">
        <div>
          Hiển thị {filtered.length} / {rows.length} sản phẩm
        </div>
      </div>
    </div>
  );
}
