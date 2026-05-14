'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Inline status dropdown — calls a server action on change and refreshes
 * the route. Used by job applications and the contacts CRM.
 */
export function StatusSelect({
  id,
  value,
  options,
  action,
}: {
  id: string;
  value: string;
  options: { value: string; label: string }[];
  action: (id: string, status: string) => Promise<{ ok?: boolean; error?: string }>;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      className="ad-select"
      style={{ height: 30, fontSize: 12.5, width: 'auto', minWidth: 130 }}
      value={value}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(async () => {
          const res = await action(id, next);
          if (res.error) alert(res.error);
          else router.refresh();
        });
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
