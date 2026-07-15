'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminIcon, type AdminIconName } from './AdminIcon';
import { AdminPageHead } from './AdminPageHead';
import { Field, FieldRow } from './FormBits';
import { PeTags } from './PeTags';
import { fmtDateVn } from '@/lib/format';
import { uploadImage } from '@/lib/upload-client';
import {
  addMedia,
  updateMedia,
  deleteMedia,
  findMediaUsage,
  type ActionResult,
  type MediaUsage,
} from '@/app/admin/(panel)/media/actions';

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  altVi: string;
  altEn: string;
  altZh: string;
  caption: string;
  tags: string[];
  folderId: string | null;
  folderName: string | null;
  width: number | null;
  height: number | null;
  size: number | null;
  mimeType: string | null;
  uploadedByName: string | null;
  createdAt: string;
}

export interface MediaFolderOption {
  id: string;
  name: string;
}

/** Display label + icon for built-in folder slugs the prototype uses. */
const FOLDER_ICONS: Record<string, AdminIconName> = {
  product: 'rock',
  gallery: 'grid',
  banner: 'layers',
  logo: 'star',
};

/** Vietnamese label per usage entity type. */
const USAGE_LABEL: Record<MediaUsage['type'], string> = {
  article: 'Bài viết',
  product: 'Sản phẩm',
  page: 'Trang',
};

function fmtSize(bytes: number | null): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// ─── Upload panel (URL-based registration) ───────────────────────────────

function AddPanel({ onDone, folders }: { onDone: () => void; folders: MediaFolderOption[] }) {
  const [url, setUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [altVi, setAltVi] = useState('');
  const [folderId, setFolderId] = useState('');
  const [state, setState] = useState<ActionResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setState(null);
    try {
      const uploaded = await uploadImage(file, 'media');
      setUrl(uploaded);
      if (!filename) setFilename(file.name);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setState(null);
    const res = await addMedia({ url, filename, altVi, folderId: folderId || undefined });
    setBusy(false);
    setState(res);
    if (res.ok) {
      setUrl('');
      setFilename('');
      setAltVi('');
      onDone();
    }
  }

  return (
    <div className="lac-card" style={{ marginBottom: 14 }}>
      <div className="lac-card-head">
        <div>
          <h3>Thêm ảnh vào thư viện</h3>
          <p>
            Tải ảnh từ máy lên hoặc dán đường dẫn có sẵn (URL hoặc đường dẫn trong{' '}
            <code>/public</code>).
          </p>
        </div>
        <label className="lac-btn" style={{ cursor: uploading ? 'wait' : 'pointer' }}>
          <AdminIcon name="upload" size={14} />
          {uploading ? 'Đang tải lên…' : 'Tải ảnh từ máy'}
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            disabled={uploading}
            onChange={(e) => void onPickFile(e)}
          />
        </label>
      </div>
      <div className="lac-card-body">
        {state?.error ? (
          <div className="lg-err" style={{ marginBottom: 12 }}>
            <AdminIcon name="shield" size={14} />
            {state.error}
          </div>
        ) : null}
        <form onSubmit={onSubmit}>
          <FieldRow>
            <Field label="Đường dẫn ảnh" required help="Tự điền sau khi tải ảnh từ máy.">
              <input
                className="lac-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="/assets/products/p-01.jpg"
                required
              />
            </Field>
            <Field label="Tên hiển thị" help="Để trống sẽ lấy theo tên tệp.">
              <input
                className="lac-input"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Bột đá CaCO₃"
              />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label="Folder">
              <select
                className="lac-select"
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
              >
                <option value="">— Chưa phân loại —</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Mô tả ảnh (alt — VI)">
              <input
                className="lac-input"
                value={altVi}
                onChange={(e) => setAltVi(e.target.value)}
                placeholder="Đá nguyên liệu cao cấp Long Anh"
              />
            </Field>
          </FieldRow>
          <button type="submit" className="lac-btn primary" disabled={busy}>
            <AdminIcon name="upload" size={15} />
            {busy ? 'Đang thêm…' : 'Thêm vào thư viện'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Detail panel — preview + meta + editable alt + actions ───────────────

function DetailPanel({ item }: { item: MediaItem }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [filename, setFilename] = useState(item.filename);
  const [altVi, setAltVi] = useState(item.altVi);
  const [altEn, setAltEn] = useState(item.altEn);
  const [altZh, setAltZh] = useState(item.altZh);
  const [caption, setCaption] = useState(item.caption);
  const [tags, setTags] = useState<string[]>(item.tags);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [usage, setUsage] = useState<MediaUsage[] | null>(null);

  // Reset local edit state whenever a different image is selected.
  const [trackedId, setTrackedId] = useState(item.id);
  if (trackedId !== item.id) {
    setTrackedId(item.id);
    setEditing(false);
    setConfirming(false);
    setFilename(item.filename);
    setAltVi(item.altVi);
    setAltEn(item.altEn);
    setAltZh(item.altZh);
    setCaption(item.caption);
    setTags(item.tags);
    setUsage(null);
  }

  // Look up where this image is used (articles / products / pages).
  useEffect(() => {
    let active = true;
    setUsage(null);
    findMediaUsage(item.url)
      .then((rows) => {
        if (active) setUsage(rows);
      })
      .catch(() => {
        if (active) setUsage([]);
      });
    return () => {
      active = false;
    };
  }, [item.id, item.url]);

  async function onSave() {
    setBusy(true);
    const res = await updateMedia({ id: item.id, filename, altVi, altEn, altZh, caption, tags });
    setBusy(false);
    if (res.error) {
      alert(res.error);
      return;
    }
    setEditing(false);
    router.refresh();
  }

  async function onDelete() {
    setBusy(true);
    const res = await deleteMedia(item.id);
    setBusy(false);
    if (res.error) {
      alert(res.error);
      setConfirming(false);
      return;
    }
    router.refresh();
  }

  return (
    <div className="mb-detail">
      <div className="preview">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.url} alt={item.altVi || item.filename} />
      </div>
      <div className="body">
        <div>
          <div style={{ fontWeight: 600, fontSize: 13.5, wordBreak: 'break-all' }}>
            {item.filename}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ad-text-mute)', marginTop: 2 }}>
            {item.width && item.height ? `${item.width}×${item.height} · ` : ''}
            {fmtSize(item.size)}
          </div>
        </div>

        <dl className="mb-info" style={{ margin: 0 }}>
          <dt>Upload bởi</dt>
          <dd>
            {item.uploadedByName ?? '—'} · {fmtDateVn(item.createdAt)}
          </dd>
          <dt>Folder</dt>
          <dd>{item.folderName ?? 'Chưa phân loại'}</dd>
          <dt>Đường dẫn</dt>
          <dd style={{ wordBreak: 'break-all' }}>
            <span className="lac-code">{item.url}</span>
          </dd>
        </dl>

        <Field label="Alt text (VI)" required help="Mô tả ảnh cho SEO & screen readers">
          <input
            className="lac-input"
            value={altVi}
            disabled={!editing}
            onChange={(e) => setAltVi(e.target.value)}
            placeholder={editing ? 'Đá nguyên liệu cao cấp Long Anh' : 'chưa có'}
          />
        </Field>
        {editing ? (
          <>
            <Field label="Tên hiển thị" required>
              <input
                className="lac-input"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
              />
            </Field>
            <Field label="Alt text (EN)">
              <input
                className="lac-input"
                value={altEn}
                onChange={(e) => setAltEn(e.target.value)}
              />
            </Field>
            <Field label="Alt text (ZH)">
              <input
                className="lac-input"
                value={altZh}
                onChange={(e) => setAltZh(e.target.value)}
              />
            </Field>
          </>
        ) : (
          <dl className="mb-info" style={{ margin: 0 }}>
            <dt>Alt text (EN)</dt>
            <dd>{item.altEn || <span style={{ color: 'var(--ad-text-mute)' }}>chưa có</span>}</dd>
            <dt>Alt text (ZH)</dt>
            <dd>{item.altZh || <span style={{ color: 'var(--ad-text-mute)' }}>chưa có</span>}</dd>
          </dl>
        )}

        <Field label="Caption" help="Chú thích hiển thị kèm ảnh.">
          {editing ? (
            <textarea
              className="lac-textarea"
              style={{ minHeight: 60 }}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Khu vực kho đá nguyên liệu nhập từ mỏ Quỳ Hợp."
            />
          ) : (
            <div
              style={{ fontSize: 13, color: caption ? 'var(--ad-text)' : 'var(--ad-text-mute)' }}
            >
              {caption || 'chưa có'}
            </div>
          )}
        </Field>

        <Field label="Tags" help="Nhãn để tìm & phân loại ảnh.">
          {editing ? (
            <PeTags tags={tags} onChange={setTags} />
          ) : tags.length > 0 ? (
            <div className="lac-tags">
              {tags.map((t) => (
                <span key={t} className="lac-tag">
                  {t}
                </span>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: 'var(--ad-text-mute)' }}>chưa có</div>
          )}
        </Field>

        <div className="mb-usage">
          <b>📍 Đang được dùng ở:</b>
          {usage === null ? (
            <div style={{ color: 'var(--ad-text-soft)' }}>Đang kiểm tra…</div>
          ) : usage.length === 0 ? (
            <div style={{ color: 'var(--ad-text-soft)' }}>
              Chưa có bài viết / sản phẩm / trang nào dùng ảnh này.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
              {usage.map((u) => (
                <Link
                  key={`${u.type}-${u.href}`}
                  href={u.href}
                  style={{ color: 'var(--ad-primary)', fontWeight: 600, fontSize: 12.5 }}
                >
                  {USAGE_LABEL[u.type]}: {u.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="actions">
        {editing ? (
          <>
            <button type="button" className="lac-btn sm primary" disabled={busy} onClick={onSave}>
              <AdminIcon name="check" size={12} /> {busy ? 'Đang lưu…' : 'Lưu'}
            </button>
            <button
              type="button"
              className="lac-btn sm ghost"
              disabled={busy}
              onClick={() => setEditing(false)}
            >
              Huỷ
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="lac-btn ghost sm"
              onClick={() => setEditing(true)}
              title="Sửa thông tin"
              aria-label="Sửa thông tin"
            >
              <AdminIcon name="edit" size={12} />
            </button>
            <button
              type="button"
              className="lac-btn ghost sm"
              disabled
              title="Crop (Phase 7)"
              aria-label="Crop ảnh"
            >
              <AdminIcon name="image" size={12} />
            </button>
            <button
              type="button"
              className="lac-btn ghost sm"
              disabled
              title="Replace (Phase 7)"
              aria-label="Thay ảnh"
            >
              <AdminIcon name="refresh" size={12} />
            </button>
            <a
              className="lac-btn ghost sm"
              href={item.url}
              target="_blank"
              rel="noreferrer"
              title="Mở / tải về"
              aria-label="Tải ảnh"
              download
            >
              <AdminIcon name="download" size={12} />
            </a>
          </>
        )}
        <div style={{ flex: 1 }} />
        {!editing && confirming ? (
          <>
            <button type="button" className="lac-btn sm danger" disabled={busy} onClick={onDelete}>
              {busy ? '…' : 'Xác nhận xoá'}
            </button>
            <button type="button" className="lac-btn sm ghost" onClick={() => setConfirming(false)}>
              Huỷ
            </button>
          </>
        ) : !editing ? (
          <button
            type="button"
            className="lac-btn ghost sm"
            onClick={() => setConfirming(true)}
            title="Xoá ảnh"
            aria-label="Xoá ảnh"
            style={{ color: 'var(--ad-danger)' }}
          >
            <AdminIcon name="trash" size={12} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

// ─── Library shell — sidebar + grid + detail ──────────────────────────────

export function MediaLibrary({
  items,
  folders,
  canUpload,
  totalSizeBytes,
}: {
  items: MediaItem[];
  folders: MediaFolderOption[];
  canUpload: boolean;
  /** Sum of `size` across all media rows — rendered into the page-head sub. */
  totalSizeBytes: number;
}) {
  const router = useRouter();
  const [folder, setFolder] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('new');
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const [showAdd, setShowAdd] = useState(false);
  const addPanelRef = useRef<HTMLDivElement | null>(null);

  // Scroll the AddPanel into view when it opens (it sits above the layout).
  useEffect(() => {
    if (showAdd && addPanelRef.current) {
      addPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showAdd]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const it of items) {
      const key = it.folderId ?? 'none';
      map[key] = (map[key] ?? 0) + 1;
    }
    return map;
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matchType = (mime: string | null): boolean => {
      if (typeFilter === 'all') return true;
      const m = (mime ?? '').toLowerCase();
      if (typeFilter === 'jpg') return m.includes('jpeg') || m.includes('jpg') || m.includes('png');
      if (typeFilter === 'webp') return m.includes('webp');
      if (typeFilter === 'svg') return m.includes('svg');
      if (typeFilter === 'other') return !/jpeg|jpg|png|webp|svg/.test(m);
      return true;
    };
    const rows = items.filter((it) => {
      if (folder === 'none' && it.folderId !== null) return false;
      if (folder !== 'all' && folder !== 'none' && it.folderId !== folder) return false;
      if (!matchType(it.mimeType)) return false;
      if (
        q &&
        !it.filename.toLowerCase().includes(q) &&
        !it.altVi.toLowerCase().includes(q) &&
        !it.caption.toLowerCase().includes(q) &&
        !it.tags.some((t) => t.toLowerCase().includes(q))
      )
        return false;
      return true;
    });
    rows.sort((a, b) => {
      if (sortBy === 'old') return a.createdAt.localeCompare(b.createdAt);
      if (sortBy === 'name') return a.filename.localeCompare(b.filename);
      if (sortBy === 'size') return (b.size ?? 0) - (a.size ?? 0);
      return b.createdAt.localeCompare(a.createdAt); // 'new'
    });
    return rows;
  }, [items, folder, query, typeFilter, sortBy]);

  // Distinct tags across the whole library — drives the sidebar tag filter.
  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const it of items) for (const t of it.tags) set.add(t);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [items]);

  const selected = filtered.find((i) => i.id === selectedId) ?? filtered[0] ?? null;

  const sizeLabel = totalSizeBytes > 0 ? ` · ${(totalSizeBytes / 1024 / 1024).toFixed(1)} MB` : '';

  return (
    <>
      <AdminPageHead
        crumbs={[{ label: 'Thư viện ảnh' }]}
        title="Thư viện ảnh"
        sub={`${items.length} ảnh${sizeLabel} · auto-WebP convert đang bật`}
        actions={
          <>
            <button type="button" className="lac-btn" disabled title="Phase 7 — tạo folder mới">
              <AdminIcon name="folder" size={13} /> Tạo folder
            </button>
            {canUpload ? (
              <button
                type="button"
                className="lac-btn primary"
                onClick={() => setShowAdd((v) => !v)}
              >
                <AdminIcon name="upload" size={13} />
                {showAdd ? 'Đóng' : 'Upload ảnh'}
              </button>
            ) : null}
          </>
        }
      />

      {canUpload && showAdd ? (
        <div ref={addPanelRef}>
          <AddPanel
            folders={folders}
            onDone={() => {
              setShowAdd(false);
              router.refresh();
            }}
          />
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="lac-empty">
          Thư viện trống. {canUpload ? 'Bấm “Upload ảnh” ở góc phải để đăng ký ảnh đầu tiên.' : ''}
        </div>
      ) : (
        <div className="mb-layout">
          <div className="mb-folders">
            <h4>Folders</h4>
            <button
              type="button"
              className={'mb-folder ' + (folder === 'all' ? 'on' : '')}
              onClick={() => setFolder('all')}
            >
              <AdminIcon name="image" size={14} />
              <span>Tất cả</span>
              <span className="count">{items.length}</span>
            </button>
            {folders.map((f) => {
              const icon = FOLDER_ICONS[f.name.toLowerCase()] ?? 'folder';
              return (
                <button
                  key={f.id}
                  type="button"
                  className={'mb-folder ' + (folder === f.id ? 'on' : '')}
                  onClick={() => setFolder(f.id)}
                >
                  <AdminIcon name={icon} size={14} />
                  <span>{f.name}</span>
                  <span className="count">{counts[f.id] ?? 0}</span>
                </button>
              );
            })}
            {counts['none'] ? (
              <button
                type="button"
                className={'mb-folder ' + (folder === 'none' ? 'on' : '')}
                onClick={() => setFolder('none')}
              >
                <AdminIcon name="folder" size={14} />
                <span>Chưa phân loại</span>
                <span className="count">{counts['none']}</span>
              </button>
            ) : null}

            <h4 style={{ marginTop: 18 }}>Tags</h4>
            {allTags.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--ad-text-mute)', padding: '2px 4px' }}>
                Chưa có tag nào.
              </div>
            ) : (
              allTags.map((t) => (
                <button
                  key={t}
                  type="button"
                  className="mb-tag-dot"
                  onClick={() => setQuery(query === t ? '' : t)}
                  style={{
                    cursor: 'pointer',
                    width: '100%',
                    border: 0,
                    borderRadius: 6,
                    textAlign: 'left',
                    font: 'inherit',
                    background: query === t ? 'var(--ad-line-soft)' : 'transparent',
                  }}
                >
                  <span className="bullet" />
                  <span>{t}</span>
                </button>
              ))
            )}
          </div>

          <div className="mb-main">
            <div className="lac-toolbar" style={{ background: '#fff' }}>
              <div className="lac-search-box" style={{ width: 240 }}>
                <AdminIcon name="search" size={14} />
                <input
                  className="lac-input"
                  placeholder="Tìm theo tên, alt…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <select
                className="lac-select"
                style={{ width: 130 }}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Mọi loại</option>
                <option value="jpg">JPG / PNG</option>
                <option value="webp">WebP</option>
                <option value="svg">SVG</option>
                <option value="other">Khác</option>
              </select>
              <select
                className="lac-select"
                style={{ width: 130 }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="new">Mới nhất</option>
                <option value="old">Cũ nhất</option>
                <option value="name">Tên A→Z</option>
                <option value="size">Kích thước</option>
              </select>
              <div className="grow" />
              <span style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>
                {selected
                  ? `Đang chọn ${filtered.findIndex((i) => i.id === selected.id) + 1} / ${filtered.length} ảnh`
                  : `${filtered.length} ảnh`}
              </span>
            </div>
            {filtered.length === 0 ? (
              <div className="mb-empty">Không có ảnh nào khớp bộ lọc.</div>
            ) : (
              <div className="mb-grid">
                {filtered.map((it) => {
                  const isSelected = selected?.id === it.id;
                  return (
                    <button
                      key={it.id}
                      type="button"
                      className={'mb-tile ' + (isSelected ? 'sel' : '')}
                      onClick={() => setSelectedId(it.id)}
                      aria-pressed={isSelected}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={it.url} alt={it.altVi || it.filename} />
                      <span className="ck" aria-hidden="true">
                        {isSelected ? <AdminIcon name="check" size={10} /> : null}
                      </span>
                      {it.width && it.height ? (
                        <div className="meta">
                          {it.width}×{it.height}
                        </div>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {selected ? (
            <DetailPanel item={selected} />
          ) : (
            <div className="mb-detail">
              <div className="mb-empty">Chọn một ảnh để xem chi tiết.</div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
