import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('home');

  return (
    <main className="container mx-auto px-4 py-16">
      <section className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-500">
          {t('eyebrow')}
        </p>
        <h1 className="mt-4 text-4xl font-bold sm:text-6xl">
          {t('titleLine1')}{' '}
          <span className="text-brand-500">{t('titleLine2')}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">{t('subtitle')}</p>
      </section>

      <section className="mt-16 rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
        🚧 Phase 1 scaffold ready — phases 2 onwards will fill this in with real data from the
        database.
      </section>
    </main>
  );
}
