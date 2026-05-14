'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminIcon } from './AdminIcon';
import { addContactNote } from '@/app/admin/(panel)/contacts/actions';

export function ContactNoteForm({ contactId }: { contactId: string }) {
  const router = useRouter();
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    setBusy(true);
    setError('');
    const res = await addContactNote({ contactId, note: note.trim() });
    setBusy(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setNote('');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      {error ? (
        <div className="lg-err" style={{ marginBottom: 10 }}>
          <AdminIcon name="shield" size={14} />
          {error}
        </div>
      ) : null}
      <textarea
        className="ad-textarea"
        placeholder="Thêm ghi chú nội bộ về lead này…"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div style={{ marginTop: 8 }}>
        <button type="submit" className="ad-btn primary sm" disabled={busy || !note.trim()}>
          <AdminIcon name="plus" size={13} />
          {busy ? 'Đang lưu…' : 'Thêm ghi chú'}
        </button>
      </div>
    </form>
  );
}
