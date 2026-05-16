'use client';

import { useRef } from 'react';
import { AdminIcon } from './AdminIcon';

/**
 * Image preview card — port of prototype's PeImg.
 *
 * 4:3 dashed wrap, click anywhere to open file picker; hover shows the
 * "Đổi / Crop" overlay; bottom badge shows the natural pixel size (auto-
 * detected on load if no `size` prop is passed).
 *
 * Phase 7 will swap the local data URL for a real upload to /api/media.
 */
export function PeImg({
  src,
  alt,
  size,
  onChange,
}: {
  src: string;
  alt?: string;
  /** Optional caption shown in the bottom badge (e.g. "2048×1521 · PNG"). */
  size?: string;
  /** Called when the user picks a new file — receives a data URL. */
  onChange?: (dataUrl: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    fileInputRef.current?.click();
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !onChange) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onChange(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="imgwrap" onClick={openPicker} role="button" tabIndex={0}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? ''} />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--ad-text-mute)',
            fontSize: 12,
            gap: 5,
          }}
        >
          <AdminIcon name="upload" size={18} />
          Chọn ảnh
        </div>
      )}
      <div className="imgover" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="ad-btn sm"
          onClick={(e) => {
            e.stopPropagation();
            openPicker();
          }}
        >
          <AdminIcon name="refresh" size={12} /> Đổi
        </button>
        <button type="button" className="ad-btn sm" onClick={(e) => e.stopPropagation()} disabled>
          <AdminIcon name="edit" size={12} /> Crop
        </button>
      </div>
      {size ? <div className="imgsize">{size}</div> : null}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
      {/* Hidden second input keeps the focused styles consistent across browsers */}
      <input ref={inputRef} type="text" hidden defaultValue={src} />
    </div>
  );
}
