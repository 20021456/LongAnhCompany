import type { Locale } from '@/lib/i18n/config';
import { Container, SectionHeader } from '@/components/ui/Container';
import { placeholderTimeline } from '@/data/placeholder';

interface Props {
  locale: Locale;
}

export function Timeline({ locale }: Props) {
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHeader
          eyebrow={
            locale === 'vi' ? 'Lịch sử' : locale === 'en' ? 'Our journey' : '历程'
          }
          title={
            locale === 'vi'
              ? '20 năm — một mạch đá'
              : locale === 'en'
                ? '20 years — one continuous vein'
                : '20年 — 一脉相承'
          }
          centered
          className="mx-auto"
        />

        <div className="relative mt-16">
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-ink/10 to-transparent md:block" />
          <ol className="space-y-12 md:space-y-0">
            {placeholderTimeline.map((evt, i) => {
              const left = i % 2 === 0;
              return (
                <li
                  key={evt.year}
                  className={[
                    'relative md:grid md:grid-cols-2 md:gap-12',
                    !left && 'md:[direction:rtl]',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div className="md:[direction:ltr]">
                    <div className="md:py-12">
                      <p className="font-serif text-5xl font-bold tracking-tighter text-brand-500 md:text-6xl">
                        {evt.year}
                      </p>
                      <h3 className="mt-3 text-xl font-bold tracking-tight text-ink">
                        {evt.title[locale]}
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
                        {evt.body[locale]}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="relative h-full md:py-12">
                      <span className="absolute left-0 top-1/2 h-3 w-3 -translate-x-[7px] -translate-y-1/2 rounded-full border-2 border-brand-500 bg-white shadow" />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
