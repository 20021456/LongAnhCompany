'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AdminIcon } from './AdminIcon';

/**
 * Confirm-then-delete button. `action` is a server action that takes the
 * id and removes the row; on success we refresh the current route.
 */
export function DeleteButton({
  id,
  action,
  label = 'Xoá',
  confirmText = 'Xoá mục này? Hành động không thể hoàn tác.',
}: {
  id: string;
  action: (id: string) => Promise<{ ok?: boolean; error?: string }>;
  label?: string;
  confirmText?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  if (confirming) {
    return (
      <span style={{ display: 'inline-flex', gap: 4 }}>
        <button
          type="button"
          className="ad-btn sm danger"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const res = await action(id);
              if (res.error) {
                alert(res.error);
                setConfirming(false);
              } else {
                router.refresh();
              }
            })
          }
        >
          {pending ? '…' : 'Xác nhận'}
        </button>
        <button
          type="button"
          className="ad-btn sm ghost"
          onClick={() => setConfirming(false)}
          disabled={pending}
        >
          Huỷ
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      className="ad-btn sm danger"
      title={confirmText}
      onClick={() => setConfirming(true)}
    >
      <AdminIcon name="logout" size={13} />
      {label}
    </button>
  );
}
