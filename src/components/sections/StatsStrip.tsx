import { Container } from '@/components/ui/Container';
import { Icon, type IconName } from '@/components/ui/Icon';
import type { Locale } from '@/lib/i18n/config';
import { placeholderStats } from '@/data/placeholder';

interface Props {
  locale: Locale;
}

export function StatsStrip({ locale }: Props) {
  return (
    <section className="relative -mt-8 sm:-mt-12">
      <Container>
        <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-xl shadow-navy-900/5 ring-1 ring-ink/5 sm:p-8 md:grid-cols-4 md:gap-8">
          {placeholderStats.map((stat) => (
            <div key={stat.key} className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Icon name={stat.icon as IconName} size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  {stat.value}
                </p>
                <p className="text-xs text-ink-muted">{stat.label[locale]}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
