import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { Container, SectionHeader } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { ContactForm } from '@/components/public/ContactForm';

export default function ContactPage({
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
            eyebrow={loc === 'vi' ? 'Liên hệ' : loc === 'en' ? 'Contact' : '联系'}
            title={
              loc === 'vi'
                ? 'Hãy bắt đầu từ một câu hỏi.'
                : loc === 'en'
                  ? 'Start with a single question.'
                  : '从一个问题开始。'
            }
            subtitle={
              loc === 'vi'
                ? 'Đội ngũ kinh doanh phản hồi trong 24h làm việc — kèm bảng spec, COA và báo giá FOB.'
                : loc === 'en'
                  ? 'Our sales team replies within 24 business hours.'
                  : '我们的销售团队在24个工作小时内回复。'
            }
          />
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="space-y-5">
                <Channel
                  icon="phone"
                  label={loc === 'vi' ? 'Hotline kinh doanh' : 'Sales hotline'}
                  value="(+84) 912 779 799"
                  href="tel:+84912779799"
                />
                <Channel
                  icon="phone"
                  label={loc === 'vi' ? 'Văn phòng' : 'Office'}
                  value="(+84-2383) 982 555"
                  href="tel:+842383982555"
                />
                <Channel
                  icon="mail"
                  label="Email sales"
                  value="info@longanhcorp.com"
                  href="mailto:info@longanhcorp.com"
                />
                <Channel
                  icon="mail"
                  label="HR / Recruitment"
                  value="hr@longanhcorp.com"
                  href="mailto:[email protected]"
                />
                <Channel
                  icon="map-pin"
                  label={loc === 'vi' ? 'Địa chỉ trụ sở' : 'Head office'}
                  value="Số D1-22, Đường 2K, KĐT Cửa Tiền, P. Vinh Tân, TP. Vinh, Nghệ An"
                />
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 ring-1 ring-ink/5 sm:p-8 lg:col-span-2 lg:p-10">
              <ContactForm locale={loc} source="contact_page" />
            </div>
          </div>

          <div className="mt-12 overflow-hidden rounded-3xl ring-1 ring-ink/5">
            <iframe
              title="Long Anh location"
              src="https://maps.google.com/maps?width=100%25&amp;height=400&amp;hl=en&amp;q=Vinh%20Tan%2C%20Vinh%2C%20Nghe%20An&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              className="h-[400px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Container>
      </section>
    </main>
  );
}

function Channel({
  icon,
  label,
  value,
  href,
}: {
  icon: 'phone' | 'mail' | 'map-pin';
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-3 rounded-2xl bg-white p-5 ring-1 ring-ink/5">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
        <Icon name={icon} size={18} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-eyebrow text-ink-muted">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block hover:[&_p:last-child]:text-brand-600">
      {inner}
    </a>
  ) : (
    inner
  );
}
