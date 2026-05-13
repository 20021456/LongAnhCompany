import type { Locale } from '@/lib/i18n/config';
import { Container, SectionHeader } from '@/components/ui/Container';
import { Icon, type IconName } from '@/components/ui/Icon';
import { placeholderCapabilities } from '@/data/placeholder';

interface Props {
  locale: Locale;
}

export function Capabilities({ locale }: Props) {
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHeader
          eyebrow={locale === 'vi' ? 'Về chúng tôi' : locale === 'en' ? 'About us' : '关于我们'}
          title={
            locale === 'vi'
              ? 'Khai thác bền vững. Chế biến chính xác. Giao hàng đúng hẹn.'
              : locale === 'en'
                ? 'Sustainable mining. Precise milling. On-time delivery.'
                : '可持续开采。精准加工。准时交付。'
          }
          subtitle={
            locale === 'vi'
              ? 'Khởi nguồn từ vùng đá vôi trắng Quỳ Hợp – Nghệ An, Long Anh sở hữu mỏ nguyên liệu chất lượng cao với độ trắng vượt 98% và hàm lượng CaCO₃ trên 98,5%.'
              : locale === 'en'
                ? 'Originating from the white limestone region of Quy Hop, Nghe An — Long Anh owns high-grade quarries with whiteness exceeding 98% and CaCO₃ content above 98.5%.'
                : '源自越南义安省归合县的白色石灰岩区,龙英拥有高品质矿源,白度超过98%,碳酸钙含量超过98.5%。'
          }
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3 lg:grid-cols-5">
          {placeholderCapabilities.map((cap, i) => (
            <div
              key={cap.key}
              className={[
                'group relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white ring-1 ring-white/10 transition hover:-translate-y-1',
                i === 0 && 'from-navy-700 to-navy-900',
                i === 1 && 'from-navy-600 to-navy-800',
                i === 2 && 'from-brand-700 to-brand-900',
                i === 3 && 'from-navy-800 to-navy-900',
                i === 4 && 'from-brand-600 to-brand-800',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur">
                <Icon name={cap.icon as IconName} size={20} />
              </div>
              <h3 className="mt-5 text-base font-bold tracking-tight">{cap.title[locale]}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{cap.body[locale]}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
