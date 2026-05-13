import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { Container, SectionHeader } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';

const placeholderJobs = [
  {
    slug: 'ky-su-van-hanh-nha-may',
    dept: { vi: 'Sản xuất', en: 'Manufacturing', zh: '生产' },
    title: {
      vi: 'Kỹ sư Vận hành nhà máy',
      en: 'Plant Operations Engineer',
      zh: '工厂运营工程师',
    },
    location: 'Quỳ Hợp, Nghệ An',
    salary: '18–30M VND',
    experience: { vi: '2–5 năm', en: '2–5 years', zh: '2–5年' },
    deadline: '30/06/2026',
  },
  {
    slug: 'chuyen-vien-kinh-doanh-xuat-khau',
    dept: { vi: 'Kinh doanh', en: 'Sales', zh: '销售' },
    title: {
      vi: 'Chuyên viên Kinh doanh Xuất khẩu',
      en: 'Export Sales Executive',
      zh: '出口销售专员',
    },
    location: 'Vinh, Nghệ An',
    salary: '15–25M + commission',
    experience: { vi: '3+ năm', en: '3+ years', zh: '3年以上' },
    deadline: '30/06/2026',
  },
  {
    slug: 'ky-thuat-vien-phong-qc',
    dept: { vi: 'Chất lượng', en: 'Quality', zh: '质量' },
    title: {
      vi: 'Kỹ thuật viên Phòng QC',
      en: 'QC Technician',
      zh: '质检技术员',
    },
    location: 'Quỳ Hợp, Nghệ An',
    salary: '12–20M VND',
    experience: { vi: '1–3 năm', en: '1–3 years', zh: '1–3年' },
    deadline: '15/07/2026',
  },
  {
    slug: 'ky-su-bao-tri-thiet-bi',
    dept: { vi: 'Kỹ thuật', en: 'Engineering', zh: '工程' },
    title: {
      vi: 'Kỹ sư Bảo trì thiết bị',
      en: 'Equipment Maintenance Engineer',
      zh: '设备维护工程师',
    },
    location: 'Quỳ Hợp, Nghệ An',
    salary: '20–35M VND',
    experience: { vi: '3–7 năm', en: '3–7 years', zh: '3–7年' },
    deadline: '30/07/2026',
  },
];

export default function CareerPage({
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
              loc === 'vi'
                ? 'Cơ hội nghề nghiệp'
                : loc === 'en'
                  ? 'Career Opportunities'
                  : '职业机会'
            }
            title={
              loc === 'vi'
                ? 'Gia nhập đội ngũ Long Anh — nơi tài năng được phát triển.'
                : loc === 'en'
                  ? 'Join the Long Anh team — where talent grows.'
                  : '加入龙英团队 — 让人才得以成长。'
            }
            subtitle={
              loc === 'vi'
                ? 'Chúng tôi xây dựng một môi trường làm việc chuyên nghiệp, năng động và minh bạch, nơi mỗi cá nhân đều có cơ hội đóng góp và trưởng thành cùng doanh nghiệp.'
                : loc === 'en'
                  ? 'A professional, dynamic and transparent workplace where every individual contributes and grows with the company.'
                  : '专业、活力、透明的工作环境,每个人都有机会贡献并与公司共同成长。'
            }
          />
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="grid gap-4">
            {placeholderJobs.map((job) => (
              <Link
                key={job.slug}
                href={`/${loc}/career/${job.slug}`}
                className="group flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-ink/5 transition hover:ring-brand-200 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-eyebrow text-brand-600">
                    {job.dept[loc]}
                  </p>
                  <h2 className="mt-1.5 text-lg font-bold tracking-tight group-hover:text-brand-600">
                    {job.title[loc]}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-muted">
                    <span className="flex items-center gap-1.5">
                      <Icon name="map-pin" size={12} /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Icon name="shield" size={12} /> {job.experience[loc]}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Icon name="award" size={12} /> {job.salary}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-600">
                  <span className="hidden text-xs text-ink-muted sm:inline">
                    {loc === 'vi' ? 'Hạn:' : loc === 'en' ? 'Deadline:' : '截止日期:'}{' '}
                    {job.deadline}
                  </span>
                  {loc === 'vi' ? 'Ứng tuyển' : loc === 'en' ? 'Apply' : '申请'}
                  <Icon
                    name="arrow-right"
                    size={14}
                    className="transition group-hover:translate-x-0.5"
                  />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
