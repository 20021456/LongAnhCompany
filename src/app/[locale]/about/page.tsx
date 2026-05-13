import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { Container, SectionHeader } from '@/components/ui/Container';
import { Capabilities } from '@/components/sections/Capabilities';
import { Certifications } from '@/components/sections/Certifications';
import { Timeline } from '@/components/sections/Timeline';
import { ContactCTA } from '@/components/sections/ContactCTA';

export default function AboutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const loc = locale as Locale;

  return (
    <main>
      <section className="bg-gradient-to-b from-white to-canvas py-16 sm:py-24">
        <Container>
          <SectionHeader
            eyebrow={
              loc === 'vi' ? 'Giới thiệu' : loc === 'en' ? 'About' : '关于我们'
            }
            title={
              loc === 'vi'
                ? 'Khoáng đá nguyên sinh từ Nghệ An'
                : loc === 'en'
                  ? 'Pure mineral stone from Nghe An'
                  : '源自义安省的原始矿物石材'
            }
            subtitle={
              loc === 'vi'
                ? 'Hơn 20 năm khai thác và chế biến — chúng tôi xây dựng từng mối quan hệ qua từng container giao đúng hẹn.'
                : loc === 'en'
                  ? '20+ years of mining and milling — we build each partnership through containers delivered on time.'
                  : '20多年的开采与加工 — 我们通过准时交付的每一个集装箱建立每一份合作关系。'
            }
          />
        </Container>
      </section>

      <Timeline locale={loc} />
      <Capabilities locale={loc} />
      <Certifications locale={loc} />
      <ContactCTA locale={loc} />
    </main>
  );
}
