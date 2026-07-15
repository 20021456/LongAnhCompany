'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AdminIcon } from './AdminIcon';
import { fmtDateVn, fmtNumberVn } from '@/lib/format';

/** Map article.status → VN-localised pill (matches the prototype copy). */
function NewsStatusBadge({ status }: { status: string }) {
  const meta: Record<string, { cls: string; label: string }> = {
    published: { cls: 'pub', label: 'Đã xuất bản' },
    draft: { cls: 'draft', label: 'Nháp' },
    scheduled: { cls: 'sched', label: 'Hẹn giờ' },
    archived: { cls: 'hide', label: 'Đã lưu trữ' },
  };
  const m = meta[status] ?? { cls: 'hide', label: status };
  return (
    <span className={'lac-badge ' + m.cls}>
      <span className="dot" />
      {m.label}
    </span>
  );
}

/** One row passed in from the server. */
export interface AdminNewsRow {
  id: string;
  slug: string;
  titleVi: string;
  /** Lowercase category slug — drives the chip colour. */
  cat: string;
  /** Localised category name (vi). */
  catLabel: string;
  /** 1–3 letter author initials, e.g. "AN", "LH". Empty when unknown. */
  author: string;
  /** ISO date string or null. */
  publishedAt: string | null;
  views: number;
  comments: number;
  status: string;
  isFeatured: boolean;
  coverImageUrl: string;
}

/** Known categories with their labels — kept here so the chip bar renders in
 *  the prototype's order even when DB rows arrive sorted differently. */
const CAT_ORDER: { key: string; label: string }[] = [
  { key: 'business', label: 'Kinh doanh' },
  { key: 'milestone', label: 'Cột mốc' },
  { key: 'product', label: 'Sản phẩm' },
  { key: 'tech', label: 'Công nghệ' },
  { key: 'event', label: 'Sự kiện' },
  { key: 'csr', label: 'CSR' },
];

export function AdminNewsList({ rows }: { rows: AdminNewsRow[] }) {
  const [cat, setCat] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((p) => {
      if (cat !== 'all' && p.cat !== cat) return false;
      if (q && !p.titleVi.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, cat, search]);

  const countByCat = (key: string) => rows.filter((p) => p.cat === key).length;

  return (
    <div className="lac-table-wrap">
      {/* Toolbar — search · segmented chips · "Lọc thêm" */}
      <div className="lac-toolbar">
        <div style={{ position: 'relative', width: 280 }}>
          <input
            className="lac-input"
            style={{ paddingLeft: 32 }}
            placeholder="Tìm theo tiêu đề…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--ad-text-mute)',
              pointerEvents: 'none',
            }}
          >
            <AdminIcon name="search" size={14} />
          </span>
        </div>

        <div className="nw-segctl">
          <button type="button" className={cat === 'all' ? 'on' : ''} onClick={() => setCat('all')}>
            Tất cả · {rows.length}
          </button>
          {CAT_ORDER.map(({ key, label }) => {
            const n = countByCat(key);
            // Hide empty categories to keep the strip from getting noisy when
            // a slug isn't represented in the current data set.
            if (n === 0) return null;
            return (
              <button
                key={key}
                type="button"
                className={cat === key ? 'on' : ''}
                onClick={() => setCat(key)}
              >
                {label} · {n}
              </button>
            );
          })}
        </div>

        <div className="grow" />
        <button type="button" className="lac-btn ghost sm">
          <AdminIcon name="filter" size={13} /> Lọc thêm
        </button>
      </div>

      <table className="lac-table">
        <thead>
          <tr>
            <th style={{ width: 36 }}>
              <input type="checkbox" aria-label="Chọn tất cả" />
            </th>
            <th>Tiêu đề</th>
            <th style={{ width: 110 }}>Danh mục</th>
            <th style={{ width: 60 }}>Tác giả</th>
            <th style={{ width: 100 }}>Ngày đăng</th>
            <th style={{ width: 70 }}>Xem</th>
            <th style={{ width: 60 }}>BL</th>
            <th style={{ width: 110 }}>Trạng thái</th>
            <th style={{ width: 160 }} aria-label="Thao tác" />
          </tr>
        </thead>
        <tbody>
          {filtered.map((p, i) => (
            <tr key={p.id}>
              <td>
                <input type="checkbox" aria-label={`Chọn bài ${p.titleVi}`} />
              </td>
              <td>
                <div className="nw-title-cell">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="nw-thumb"
                    src={p.coverImageUrl || '/assets/placeholder.png'}
                    alt=""
                  />
                  <div style={{ minWidth: 0 }}>
                    <div className="title">{p.titleVi}</div>
                    <div className="meta">
                      ID: {i + 1} · /tin-tuc/{p.slug}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <span className={`nw-cat ${p.cat}`}>{p.catLabel}</span>
              </td>
              <td>{p.author ? <span className="nw-author-pill">{p.author}</span> : '—'}</td>
              <td style={{ fontSize: 12.5, color: 'var(--ad-text-soft)' }}>
                {p.publishedAt ? fmtDateVn(p.publishedAt) : '—'}
              </td>
              <td style={{ fontSize: 12.5, color: 'var(--ad-text-soft)' }}>
                {fmtNumberVn(p.views)}
              </td>
              <td style={{ fontSize: 12.5, color: 'var(--ad-text-soft)' }}>{p.comments}</td>
              <td>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <NewsStatusBadge status={p.status} />
                  {p.isFeatured ? (
                    <span className="lac-badge sched">
                      <span className="dot" />
                      nổi bật
                    </span>
                  ) : null}
                </div>
              </td>
              <td>
                <div className="row-actions tight">
                  <Link
                    className="lac-btn ghost sm"
                    title="Sửa bài viết"
                    href={`/admin/news/${p.slug}`}
                  >
                    <AdminIcon name="edit" size={13} />
                  </Link>
                  <a
                    className="lac-btn ghost sm"
                    title="Xem trên web"
                    href={`/vi/news/${p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <AdminIcon name="eye" size={13} />
                  </a>
                  <button type="button" className="lac-btn ghost sm" title="Nhân bản" disabled>
                    <AdminIcon name="copy" size={13} />
                  </button>
                  <button type="button" className="lac-btn ghost sm" title="Thêm" disabled>
                    <AdminIcon name="more" size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {filtered.length === 0 ? (
            <tr>
              <td
                colSpan={9}
                style={{ padding: 24, textAlign: 'center', color: 'var(--ad-text-mute)' }}
              >
                Không có bài viết phù hợp với bộ lọc hiện tại.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>

      <div className="lac-pag">
        <div>
          Hiển thị 1 – {filtered.length} của {filtered.length} bài
        </div>
        <div className="lac-pag-pages">
          <button type="button" disabled aria-label="Trang trước">
            ‹
          </button>
          <button type="button" className="on">
            1
          </button>
          <button type="button" disabled aria-label="Trang sau">
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
