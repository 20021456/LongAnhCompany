'use client';

import { useFormStatus } from 'react-dom';
import { AdminIcon } from './AdminIcon';

/** Labelled field wrapper. */
export function Field({
  label,
  required,
  help,
  children,
}: {
  label: string;
  required?: boolean;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="ad-field" style={{ marginBottom: 16 }}>
      <label>
        {label}
        {required ? <span className="req">*</span> : null}
      </label>
      {children}
      {help ? <div className="help">{help}</div> : null}
    </div>
  );
}

/** A row of inputs — 2 or 3 columns. */
export function FieldRow({
  cols = 2,
  children,
}: {
  cols?: 2 | 3;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>
      {children}
    </div>
  );
}

/** Submit button that shows a pending state via useFormStatus. */
export function SubmitButton({ children = 'Lưu thay đổi' }: { children?: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="ad-btn primary" disabled={pending}>
      <AdminIcon name="check" size={15} />
      {pending ? 'Đang lưu…' : children}
    </button>
  );
}

/** Inline error/success banner driven by a server-action result. */
export function FormBanner({
  state,
}: {
  state?: { ok?: boolean; error?: string } | null;
}) {
  if (!state) return null;
  if (state.error) {
    return (
      <div className="lg-err" style={{ marginBottom: 16 }}>
        <AdminIcon name="shield" size={14} />
        {state.error}
      </div>
    );
  }
  if (state.ok) {
    return (
      <div
        className="ad-badge pub"
        style={{ marginBottom: 16, padding: '8px 12px', fontSize: 12.5 }}
      >
        <span className="dot" />
        Đã lưu thành công.
      </div>
    );
  }
  return null;
}
