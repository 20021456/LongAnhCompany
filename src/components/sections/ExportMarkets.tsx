import type { Locale } from '@/lib/i18n/config';
import { Container, SectionHeader } from '@/components/ui/Container';
import { Icon, type IconName } from '@/components/ui/Icon';
import { placeholderMarkets } from '@/data/placeholder';

interface Props {
  locale: Locale;
}

const features: Array<{
  icon: IconName;
  title: Record<Locale, string>;
  body: Record<Locale, string>;
}> = [
  {
    icon: 'check-circle',
    title: { vi: 'Chất lượng cao cấp', en: 'Premium Quality', zh: '优质碳酸钙' },
    body: { vi: 'Độ trắng 98%+, CaCO₃ 98.5%+', en: 'Whiteness 98%+, CaCO₃ 98.5%+', zh: '白度 98%+,CaCO₃ 98.5%+' },
  },
  {
    icon: 'globe',
    title: { vi: 'Tầm phủ toàn cầu', en: 'Global Reach', zh: '全球覆盖' },
    body: { vi: '12 quốc gia · 8+ thị trường', en: '12 countries · 8+ key markets', zh: '12个国家 · 8+核心市场' },
  },
  {
    icon: 'ship',
    title: { vi: 'Logistics tin cậy', en: 'Reliable Logistics', zh: '可靠物流' },
    body: { vi: 'FOB cảng Cửa Lò & Hải Phòng', en: 'FOB Cua Lo & Hai Phong ports', zh: 'FOB窗碧港和海防港' },
  },
  {
    icon: 'shield',
    title: { vi: 'Niềm tin khách hàng', en: 'Customer Trust', zh: '客户信任' },
    body: { vi: '10+ năm đối tác dài hạn', en: '10+ years long-term partners', zh: '10年以上稳定合作' },
  },
];

export function ExportMarkets({ locale }: Props) {
  return (
    <section className="relative overflow-hidden bg-navy-800 py-20 text-white sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(240,128,35,0.15),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(59,130,246,0.15),transparent_60%)]" />
      <Container className="relative">
        <SectionHeader
          eyebrow={
            locale === 'vi'
              ? 'Năng lực xuất khẩu'
              : locale === 'en'
                ? 'Export capability'
                : '出口能力'
          }
          title={
            locale === 'vi'
              ? 'Sẵn sàng cho thị trường quốc tế'
              : locale === 'en'
                ? 'Built for international shipping'
                : '为国际航运而打造'
          }
          subtitle={
            locale === 'vi'
              ? 'Hệ thống đóng gói đa dạng từ bao 25 kg, jumbo bag 1 tấn đến container rời. Giao hàng FOB cảng Cửa Lò & Hải Phòng.'
              : locale === 'en'
                ? 'Packaging from 25 kg bag, 1-ton jumbo bag, to bulk container. FOB Cua Lo & Hai Phong.'
                : '从25公斤袋装、1吨吨袋到散装集装箱的多种包装。FOB窗碧港和海防港。'
          }
          centered
          className="mx-auto [&_h2]:text-white [&_p]:text-white/75"
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title.vi}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500/20 text-brand-300">
                <Icon name={f.icon} size={20} />
              </div>
              <h3 className="mt-5 text-base font-bold">{f.title[locale]}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/70">{f.body[locale]}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-eyebrow text-brand-300">
            {locale === 'vi' ? 'Thị trường' : locale === 'en' ? 'Markets' : '市场'}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {placeholderMarkets.map((m) => (
              <span
                key={m}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium"
              >
                {m}
              </span>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-sm italic text-white/60">
            {locale === 'vi'
              ? 'Từ nhà máy của chúng tôi đến cảng của bạn — giao hàng chất lượng, xây dựng niềm tin.'
              : locale === 'en'
                ? 'From our factory to your destination — delivering quality, building trust.'
                : '从我们的工厂到您的目的地 — 优质交付,信任建立。'}
          </p>
        </div>
      </Container>
    </section>
  );
}
