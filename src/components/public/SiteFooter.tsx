import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';

export async function SiteFooter() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'nav' });
  const tFooter = await getTranslations({ locale, namespace: 'footer' });

  const columns = [
    {
      title: t('about'),
      links: [
        { label: t('about'), href: `/${locale}/about` },
        { label: t('career'), href: `/${locale}/career` },
        { label: t('news'), href: `/${locale}/news` },
      ],
    },
    {
      title: t('products'),
      links: [
        { label: 'CaCO₃', href: `/${locale}/products?category=caco3-powder` },
        { label: 'Slab', href: `/${locale}/products?category=natural-stone` },
        { label: t('contact'), href: `/${locale}/contact` },
      ],
    },
  ];

  return (
    <footer className="mt-24 border-t border-ink/5 bg-navy-700 text-white/90">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/15 text-sm font-bold">
                LA
              </div>
              <div className="text-sm font-bold tracking-tight">KS LONG ANH</div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              Nhà sản xuất bột đá Canxi Cacbonat và đá tự nhiên hàng đầu Bắc Trung Bộ.
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { name: 'facebook' as const, href: 'https://facebook.com/longanhcorp' },
                { name: 'linkedin' as const, href: 'https://linkedin.com/company/longanhcorp' },
                { name: 'twitter' as const, href: 'https://twitter.com/longanhcorp' },
                { name: 'youtube' as const, href: '#' },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition hover:border-white/40 hover:bg-white/10"
                  aria-label={social.name}
                >
                  <Icon name={social.name} size={15} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-eyebrow text-white/60">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/80 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-eyebrow text-white/60">
              {t('contact')}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <Icon name="map-pin" size={14} className="mt-0.5 shrink-0" />
                <span>
                  Số D1-22, Đường 2K, KĐT Cửa Tiền, P. Vinh Tân, TP. Vinh, Nghệ An.
                </span>
              </li>
              <li>
                <a href="tel:+84912779799" className="flex items-center gap-2 hover:text-white">
                  <Icon name="phone" size={14} /> (+84) 912 779 799
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@longanhcorp.com"
                  className="flex items-center gap-2 hover:text-white"
                >
                  <Icon name="mail" size={14} /> info@longanhcorp.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row">
          <div>{tFooter('copyright')} · Reg. No. 2901xxxxx</div>
          <div className="flex gap-5">
            <Link href={`/${locale}/privacy`}>Privacy</Link>
            <Link href={`/${locale}/terms`}>Terms</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
