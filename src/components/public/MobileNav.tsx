'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

interface Props {
  items: { href: string; label: string }[];
}

export function MobileNav({ items }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="grid h-9 w-9 place-items-center rounded-full text-ink hover:bg-ink/5 lg:hidden"
      >
        <Icon name="menu" size={20} />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <nav className="absolute inset-y-0 right-0 flex w-80 max-w-[85vw] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-ink/5 px-5 py-4">
              <div className="text-sm font-bold tracking-tight">KS LONG ANH</div>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink/5"
              >
                <Icon name="close" size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-3">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-ink hover:bg-ink/5"
                >
                  {item.label}
                  <Icon name="chevron-right" size={14} className="text-ink-subtle" />
                </Link>
              ))}
            </div>
            <div className="border-t border-ink/5 px-5 py-4 text-xs text-ink-muted">
              <a href="tel:+84912779799" className="flex items-center gap-2 py-1">
                <Icon name="phone" size={14} /> (+84) 912 779 799
              </a>
              <a href="mailto:info@longanhcorp.com" className="flex items-center gap-2 py-1">
                <Icon name="mail" size={14} /> info@longanhcorp.com
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
