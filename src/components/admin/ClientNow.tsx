'use client';

import { useEffect, useState } from 'react';

const WEEKDAYS_VI = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

function formatDateVi(d: Date) {
  const wd = WEEKDAYS_VI[d.getDay()];
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${wd}, ${dd}/${mm}/${d.getFullYear()}`;
}

/**
 * Renders the current date in the visitor's local timezone.
 *
 * Server-renders nothing → the client-side mount populates the text after
 * hydration. This avoids the hydration mismatch class where the SSR clock
 * disagrees with the client clock (Node ICU vs browser Intl, different
 * timezone, day rollover between request and paint, etc.).
 */
export function ClientNow({ fallback = '…' }: { fallback?: string } = {}) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    setText(formatDateVi(new Date()));
  }, []);

  return <>{text ?? fallback}</>;
}
