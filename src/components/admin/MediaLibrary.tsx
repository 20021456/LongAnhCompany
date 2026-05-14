'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminIcon } from './AdminIcon';
import { Field, FieldRow } from './FormBits';
import {
  addMedia,
  updateMedia,
  deleteMedia,
  type ActionResult,
} from '@/app/admin/(panel)/media/actions';

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  altVi: string;
  altEn: string;
  altZh: string;
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

function fmtSize(bytes: number | null): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function AddPanel({ onDone }: { onDone: () => void }) {
  const [url, setUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [altVi, setAltVi] = useState('');
  const [state, setState] = useState<ActionResult | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setState(null);
    const res = await addMedia({ url, filename, altVi });
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
    <div className="ad-card" style={{ marginBottom: 16 }}>
      <div className="ad-card-head">
        <div>
          <h3>Thêm ảnh</h3>
          <p>Đăng ký ảnh bằng đường dẫn (URL hoặc đường dẫn trong /public).</p>
        </div>
      </div>
      <div className="ad-card-body">
        {state?.error ? (
          <div className="lg-err" style={{ marginBottom: 12 }}>
            <AdminIcon name="shield" size={14} />
            {state.error}
          </div>
        ) : null}
        <form onSubmit={onSubmit}>
          <FieldRow>
            <Field label="Đường dẫn ảnh" required>
              <input
                className="ad-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="/assets/products/p-01.jpg"
                required
              />
            </Field>
            <Field label="Tên hiển thị" help="Để trống sẽ lấy theo tên tệp.">
              <input
                className="ad-input"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Bột đá CaCO₃"
              />
            </Field>
          </FieldRow>
          <Field label="Mô tả ảnh (alt — VI)">
            <input className="ad-input" value={altVi} onChange={(e) => setAltVi(e.target.value)} />
          </Field>
          <button type="submit" className="ad-btn primary" disabled={busy}>
            <AdminIcon name="plus" size={15} />
            {busy ? 'Đang thêm…' : 'Thêm vào thư viện'}
          </button>
        </form>
      </div>
    </div>
  );
}

function DetailPanel({ item }: { item: MediaItem }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [filename, setFilename] = useState(item.filename);
  const [altVi, setAltVi] = useState(item.altVi);
  const [altEn, setAltEn] = useState(item.altEn);
  const [altZh, setAltZh] = useState(item.altZh);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);

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
  }

  async function onSave() {
    setBusy(true);
    const res = await updateMedia({ id: item.id, filename, altVi, altEn, altZh });
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
          <dt>Đường dẫn</dt>
          <dd style={{ wordBreak: 'break-all' }}>
            <span className="ad-code">{item.url}</span>
          </dd>
          <dt>Upload bởi</dt>
          <dd>
            {item.uploadedByName ?? '—'} · {new Date(item.createdAt).toLocaleDateString('vi-VN')}
          </dd>
          <dt>Folder</dt>
          <dd>{item.folderName ?? 'Chưa phân loại'}</dd>
        </dl>

        {editing ? (
          <>
            <Field label="Tên hiển thị" required>
              <input
                className="ad-input"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
              />
            </Field>
            <Field label="Alt text (VI)" help="Mô tả ảnh cho SEO & screen readers.">
              <input
                className="ad-input"
                value={altVi}
                onChange={(e) => setAltVi(e.target.value)}
              />
            </Field>
            <Field label="Alt text (EN)">
              <input
                className="ad-input"
                value={altEn}
                onChange={(e) => setAltEn(e.target.value)}
              />
            </Field>
            <Field label="Alt text (ZH)">
              <input
                className="ad-input"
                value={altZh}
                onChange={(e) => setAltZh(e.target.value)}
              />
            </Field>
          </>
        ) : (
          <dl className="mb-info" style={{ margin: 0 }}>
            <dt>Alt text (VI)</dt>
            <dd>{item.altVi || <span style={{ color: 'var(--ad-text-mute)' }}>chưa có</span>}</dd>
            <dt>Alt text (EN)</dt>
            <dd>{item.altEn || <span style={{ color: 'var(--ad-text-mute)' }}>chưa có</span>}</dd>
            <dt>Alt text (ZH)</dt>
            <dd>{item.altZh || <span style={{ color: 'var(--ad-text-mute)' }}>chưa có</span>}</dd>
          </dl>
        )}
      </div>
      <div className="actions">
        {editing ? (
          <>
            <button type="button" className="ad-btn sm primary" disabled={busy} onClick={onSave}>
              <AdminIcon name="check" size={12} /> {busy ? 'Đang lưu…' : 'Lưu'}
            </button>
            <button
              type="button"
              className="ad-btn sm ghost"
              disabled={busy}
              onClick={() => setEditing(false)}
            >
              Huỷ
            </button>
          </>
        ) : (
          <button type="button" className="ad-btn sm" onClick={() => setEditing(true)}>
            <AdminIcon name="edit" size={12} /> Sửa thông tin
          </button>
        )}
        <a className="ad-btn sm" href={item.url} target="_blank" rel="noreferrer" title="Mở ảnh">
          <AdminIcon name="eye" size={12} />
        </a>
        <div style={{ flex: 1 }} />
        {confirming ? (
          <>
            <button type="button" className="ad-btn sm danger" disabled={busy} onClick={onDelete}>
              {busy ? '…' : 'Xác nhận xoá'}
            </button>
            <button type="button" className="ad-btn sm ghost" onClick={() => setConfirming(false)}>
              Huỷ
            </button>
          </>
        ) : (
          <button
            type="button"
            className="ad-btn sm danger"
            onClick={() => setConfirming(true)}
            title="Xoá ảnh"
          >
            <AdminIcon name="trash" size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

export function MediaLibrary({
  items,
  folders,
  canUpload,
}: {
  items: MediaItem[];
  folders: MediaFolderOption[];
  canUpload: boolean;
}) {
  const router = useRouter();
  const [folder, setFolder] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const [showAdd, setShowAdd] = useState(false);

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
    return items.filter((it) => {
      if (folder === 'none' && it.folderId !== null) return false;
      if (folder !== 'all' && folder !== 'none' && it.folderId !== folder) return false;
      if (q && !it.filename.toLowerCase().includes(q) && !it.altVi.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [items, folder, query]);

  const selected = filtered.find((i) => i.id === selectedId) ?? filtered[0] ?? null;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        {canUpload ? (
          <button type="button" className="ad-btn primary" onClick={() => setShowAdd((v) => !v)}>
            <AdminIcon name="upload" size={15} />
            {showAdd ? 'Đóng' : 'Thêm ảnh'}
          </button>
        ) : null}
      </div>

      {canUpload && showAdd ? (
        <AddPanel
          onDone={() => {
            setShowAdd(false);
            router.refresh();
          }}
        />
      ) : null}

      {items.length === 0 ? (
        <div className="ad-empty">
          Thư viện trống. {canUpload ? 'Bấm “Thêm ảnh” ở trên để đăng ký ảnh đầu tiên.' : ''}
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
            {folders.map((f) => (
              <button
                key={f.id}
                type="button"
                className={'mb-folder ' + (folder === f.id ? 'on' : '')}
                onClick={() => setFolder(f.id)}
              >
                <AdminIcon name="folder" size={14} />
                <span>{f.name}</span>
                <span className="count">{counts[f.id] ?? 0}</span>
              </button>
            ))}
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
          </div>

          <div className="mb-main">
            <div className="ad-toolbar" style={{ background: '#fff' }}>
              <div className="ad-search-box" style={{ width: 240 }}>
                <AdminIcon name="search" size={14} />
                <input
                  className="ad-input"
                  placeholder="Tìm theo tên, alt…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="grow" />
              <span style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>
                {filtered.length} ảnh
              </span>
            </div>
            {filtered.length === 0 ? (
              <div className="mb-empty">Không có ảnh nào khớp bộ lọc.</div>
            ) : (
              <div className="mb-grid">
                {filtered.map((it) => (
                  <button
                    key={it.id}
                    type="button"
                    className={'mb-tile ' + (selected?.id === it.id ? 'sel' : '')}
                    onClick={() => setSelectedId(it.id)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.url} alt={it.altVi || it.filename} />
                    {it.width && it.height ? (
                      <div className="meta">
                        {it.width}×{it.height}
                      </div>
                    ) : null}
                  </button>
                ))}
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
