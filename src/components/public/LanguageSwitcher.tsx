'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { locales, localeFlags, type Locale } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';

interface Props {
  current: Locale;
}

export function LanguageSwitcher({ current }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchTo = (next: Locale) => {
    const segments = pathname.split('/');
    if (locales.includes(segments[1] as Locale)) segments[1] = next;
    else segments.splice(1, 0, next);
    const nextPath = segments.join('/') || `/${next}`;
    startTransition(() => router.replace(nextPath));
  };

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center gap-1 rounded-full border border-ink/10 bg-white p-1 text-xs font-semibold"
    >
      {locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchTo(loc)}
          disabled={isPending}
          aria-current={current === loc ? 'true' : undefined}
          className={cn(
            'flex h-7 items-center gap-1 rounded-full px-3 uppercase transition',
            current === loc
              ? 'bg-navy-600 text-white'
              : 'text-ink-muted hover:bg-ink/5 hover:text-ink',
          )}
        >
          <span aria-hidden>{localeFlags[loc]}</span>
          <span>{loc}</span>
        </button>
      ))}
    </div>
  );
}
