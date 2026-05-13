import type { Locale } from '@/lib/i18n/config';
import { Container, SectionHeader } from '@/components/ui/Container';
import { ContactForm } from '@/components/public/ContactForm';
import { Icon } from '@/components/ui/Icon';

interface Props {
  locale: Locale;
}

export function ContactCTA({ locale }: Props) {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader
              eyebrow={locale === 'vi' ? 'Liên hệ' : locale === 'en' ? 'Contact' : '联系'}
              title={
                locale === 'vi'
                  ? 'Hãy bắt đầu từ một câu hỏi.'
                  : locale === 'en'
                    ? 'Start with a single question.'
                    : '从一个问题开始。'
              }
              subtitle={
                locale === 'vi'
                  ? 'Đội ngũ kinh doanh phản hồi trong vòng 24h làm việc — kèm bảng spec, COA và báo giá FOB.'
                  : locale === 'en'
                    ? 'Our sales team replies within 24 business hours — with spec sheet, COA and FOB pricing.'
                    : '我们的销售团队在24个工作小时内回复 — 提供规格表、COA和FOB报价。'
              }
            />

            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name="phone" size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-eyebrow text-ink-muted">Hotline</p>
                  <a
                    href="tel:+84912779799"
                    className="text-base font-semibold text-ink hover:text-brand-600"
                  >
                    (+84) 912 779 799
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name="mail" size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-eyebrow text-ink-muted">Email sales</p>
                  <a
                    href="mailto:info@longanhcorp.com"
                    className="text-base font-semibold text-ink hover:text-brand-600"
                  >
                    info@longanhcorp.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name="map-pin" size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-eyebrow text-ink-muted">
                    {locale === 'vi' ? 'Trụ sở' : locale === 'en' ? 'Headquarters' : '总部'}
                  </p>
                  <p className="max-w-xs text-sm text-ink">
                    Số D1-22, Đường 2K, KĐT Cửa Tiền, P. Vinh Tân, TP. Vinh, Nghệ An.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-6 ring-1 ring-ink/5 sm:p-8 lg:p-10">
            <ContactForm locale={locale} source="home_form" />
          </div>
        </div>
      </Container>
    </section>
  );
}
