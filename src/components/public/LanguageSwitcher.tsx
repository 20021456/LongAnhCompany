'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { locales, type Locale } from '@/lib/i18n/config';

interface Props {
  current: Locale;
}

const labels: Record<Locale, string> = {
  vi: 'VI',
  en: 'EN',
  zh: '中',
};

export function LanguageSwitcher({ current }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchTo = (next: Locale) => {
    if (next === current) return;
    const segments = pathname.split('/');
    if (locales.includes(segments[1] as Locale)) segments[1] = next;
    else segments.splice(1, 0, next);
    const nextPath = segments.join('/') || `/${next}`;
    startTransition(() => router.replace(nextPath));
  };

  return (
    <div className="va-lang">
      {locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchTo(loc)}
          disabled={isPending}
          className={current === loc ? 'on' : ''}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
