import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNav } from './MobileNav';

interface Props {
  locale: Locale;
}

export async function SiteHeader({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'nav' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  const navItems = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/products`, label: t('products') },
    { href: `/${locale}/news`, label: t('news') },
    { href: `/${locale}/career`, label: t('career') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <>
      {/* Top strip — hotline + email */}
      <div className="hidden bg-navy-700 text-xs text-white/90 md:block">
        <Container className="flex h-9 items-center justify-between">
          <div className="flex items-center gap-5">
            <a href="tel:+84912779799" className="flex items-center gap-1.5 hover:text-white">
              <Icon name="phone" size={13} />
              <span className="opacity-75">Hotline:</span>
              <span className="font-medium">(+84) 912 779 799</span>
            </a>
            <a
              href="mailto:info@longanhcorp.com"
              className="hidden items-center gap-1.5 hover:text-white lg:flex"
            >
              <Icon name="mail" size={13} />
              <span>info@longanhcorp.com</span>
            </a>
          </div>
          <div className="flex items-center gap-1.5 text-white/70">
            <Icon name="award" size={13} />
            <span>ISO 9001:2015 · REACH · SGS</span>
          </div>
        </Container>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 border-b border-ink/5 bg-white/85 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between gap-6">
          <Link href={`/${locale}`} className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-navy-600 to-navy-800 text-sm font-bold text-white">
              LA
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight text-ink">KS LONG ANH</div>
              <div className="text-[10px] uppercase tracking-eyebrow text-ink-muted">
                Mineral · Vietnam
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-muted transition hover:bg-ink/5 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher current={locale} />
            <Link
              href={`/${locale}/contact`}
              className="hidden items-center gap-1.5 rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-600 md:inline-flex"
            >
              {tCommon('requestQuote')}
              <Icon name="arrow-right" size={14} />
            </Link>
            <MobileNav items={navItems} />
          </div>
        </Container>
      </header>
    </>
  );
}
