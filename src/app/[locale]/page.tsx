import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { Hero } from '@/components/sections/Hero';
import { StatsStrip } from '@/components/sections/StatsStrip';
import { ProductsCarousel } from '@/components/sections/ProductsCarousel';
import { Capabilities } from '@/components/sections/Capabilities';
import { Certifications } from '@/components/sections/Certifications';
import { ExportMarkets } from '@/components/sections/ExportMarkets';
import { ContactCTA } from '@/components/sections/ContactCTA';

export default function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const loc = locale as Locale;

  return (
    <main>
      <Hero locale={loc} />
      <StatsStrip locale={loc} />
      <ProductsCarousel locale={loc} />
      <Capabilities locale={loc} />
      <Certifications locale={loc} />
      <ExportMarkets locale={loc} />
      <ContactCTA locale={loc} />
    </main>
  );
}
