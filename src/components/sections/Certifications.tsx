import type { Locale } from '@/lib/i18n/config';
import { Container, SectionHeader } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { placeholderCertifications } from '@/data/placeholder';

interface Props {
  locale: Locale;
}

export function Certifications({ locale }: Props) {
  return (
    <section className="bg-gradient-to-b from-canvas to-white py-20 sm:py-28">
      <Container>
        <SectionHeader
          eyebrow={locale === 'vi' ? 'Chứng chỉ' : locale === 'en' ? 'Certifications' : '认证'}
          title={
            locale === 'vi'
              ? 'Đạt chuẩn chất lượng quốc tế.'
              : locale === 'en'
                ? 'Built to international standards.'
                : '符合国际标准。'
          }
          subtitle={
            locale === 'vi'
              ? 'Mỗi lô sản phẩm đều được kiểm tra QC theo ISO 9001, kèm COA và MSDS — đáp ứng yêu cầu khắt khe nhất từ thị trường Hàn Quốc, Nhật Bản, Ấn Độ và Trung Đông.'
              : locale === 'en'
                ? 'Each batch is QC-controlled to ISO 9001 and ships with COA and MSDS — meeting the toughest requirements from Korea, Japan, India and the Middle East.'
                : '每批产品均按ISO 9001进行QC检测,提供COA和MSDS — 满足韩国、日本、印度和中东市场最严苛的要求。'
          }
          centered
          className="mx-auto"
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {placeholderCertifications.map((cert) => (
            <div
              key={cert.code}
              className="group rounded-2xl border border-ink/5 bg-white p-6 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg"
            >
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-500 group-hover:text-white">
                <Icon name="award" size={28} />
              </div>
              <h3 className="mt-5 text-lg font-bold tracking-tight">{cert.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{cert.desc[locale]}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
