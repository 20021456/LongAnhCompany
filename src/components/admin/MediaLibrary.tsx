'use client';

import { useState } from 'react';
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
  createdAt: string;
}

function AddForm({ onDone }: { onDone: () => void }) {
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

function MediaCard({ item }: { item: MediaItem }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [filename, setFilename] = useState(item.filename);
  const [altVi, setAltVi] = useState(item.altVi);
  const [altEn, setAltEn] = useState(item.altEn);
  const [altZh, setAltZh] = useState(item.altZh);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);

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
    <div
      style={{
        border: '1px solid var(--ad-line)',
        borderRadius: 8,
        overflow: 'hidden',
        background: 'var(--ad-surface)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ aspectRatio: '4 / 3', background: 'var(--ad-line-soft)', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.url}
          alt={item.altVi || item.filename}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {editing ? (
          <>
            <input
              className="ad-input"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Tên hiển thị"
            />
            <input
              className="ad-input"
              value={altVi}
              onChange={(e) => setAltVi(e.target.value)}
              placeholder="Alt (VI)"
            />
            <input
              className="ad-input"
              value={altEn}
              onChange={(e) => setAltEn(e.target.value)}
              placeholder="Alt (EN)"
            />
            <input
              className="ad-input"
              value={altZh}
              onChange={(e) => setAltZh(e.target.value)}
              placeholder="Alt (ZH)"
            />
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="button" className="ad-btn sm primary" disabled={busy} onClick={onSave}>
                {busy ? '…' : 'Lưu'}
              </button>
              <button
                type="button"
                className="ad-btn sm ghost"
                disabled={busy}
                onClick={() => setEditing(false)}
              >
                Huỷ
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontWeight: 600, fontSize: 13, wordBreak: 'break-word' }}>
              {item.filename}
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: 'var(--ad-text-mute)',
                wordBreak: 'break-all',
              }}
            >
              {item.url}
            </div>
            {item.altVi ? (
              <div style={{ fontSize: 12, color: 'var(--ad-text-soft)' }}>{item.altVi}</div>
            ) : null}
            <div style={{ display: 'flex', gap: 6, marginTop: 'auto', paddingTop: 6 }}>
              <button type="button" className="ad-btn sm" onClick={() => setEditing(true)}>
                <AdminIcon name="file" size={13} /> Sửa
              </button>
              {confirming ? (
                <>
                  <button
                    type="button"
                    className="ad-btn sm danger"
                    disabled={busy}
                    onClick={onDelete}
                  >
                    {busy ? '…' : 'Xác nhận'}
                  </button>
                  <button
                    type="button"
                    className="ad-btn sm ghost"
                    onClick={() => setConfirming(false)}
                  >
                    Huỷ
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="ad-btn sm danger"
                  onClick={() => setConfirming(true)}
                >
                  <AdminIcon name="logout" size={13} /> Xoá
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function MediaLibrary({ items, canUpload }: { items: MediaItem[]; canUpload: boolean }) {
  const router = useRouter();

  return (
    <>
      {canUpload ? <AddForm onDone={() => router.refresh()} /> : null}

      {items.length === 0 ? (
        <div className="ad-empty">
          Thư viện trống. {canUpload ? 'Thêm ảnh đầu tiên ở khung phía trên.' : ''}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 14,
          }}
        >
          {items.map((it) => (
            <MediaCard key={it.id} item={it} />
          ))}
        </div>
      )}
    </>
  );
}
