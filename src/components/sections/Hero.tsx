import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';

interface Props {
  locale: Locale;
}

export async function Hero({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-canvas to-canvas">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-100/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-navy-100/50 blur-3xl"
      />

      <Container className="relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:py-32">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-eyebrow text-brand-700">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
            {t('eyebrow')}
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tightest text-ink sm:text-5xl lg:text-6xl">
            {t('titleLine1')}
            <br />
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              {t('titleLine2')}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
            {t('subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href={`/${locale}/products`} size="lg">
              {tCommon('viewMore')}
              <Icon name="arrow-right" size={16} />
            </ButtonLink>
            <ButtonLink href={`/${locale}/contact`} variant="ghost" size="lg">
              {tCommon('requestQuote')}
            </ButtonLink>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-ink-muted">
            <div className="flex items-center gap-1.5">
              <Icon name="check-circle" size={15} className="text-brand-500" />
              <span>ISO 9001:2015</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="check-circle" size={15} className="text-brand-500" />
              <span>REACH compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="check-circle" size={15} className="text-brand-500" />
              <span>SGS tested</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-navy-600 to-navy-800 shadow-2xl shadow-navy-900/20">
            <div className="flex h-full items-end p-8 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-eyebrow opacity-70">
                  Quy Hop, Nghe An
                </p>
                <p className="mt-2 font-serif text-2xl leading-tight">
                  Mỏ đá vôi trắng nguyên sinh
                  <br />— độ trắng &gt; 98%
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-5 shadow-xl ring-1 ring-ink/5">
            <p className="text-xs uppercase tracking-eyebrow text-ink-muted">Capacity</p>
            <p className="mt-1 text-2xl font-bold tracking-tight">350,000 t/y</p>
            <p className="text-xs text-ink-muted">5 plants · 12 ha</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
