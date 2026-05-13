import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { Container, SectionHeader } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';

const placeholderArticles = [
  {
    slug: 'long-anh-mo-rong-xuong-da-slab-1-6m',
    cat: { vi: 'Sự kiện', en: 'Event', zh: '活动' },
    title: {
      vi: 'Long Anh mở rộng xưởng đá Slab 1.6m — công suất đạt 350,000 t/y',
      en: 'Long Anh expands 1.6m Slab workshop — capacity now 350,000 t/y',
      zh: '龙英扩建1.6米大板工坊 — 产能达35万吨/年',
    },
    date: '2026-04-15',
    excerpt: {
      vi: 'Bước ngoặt sản lượng mới giúp Long Anh đáp ứng thị trường Hàn Quốc và Trung Đông.',
      en: 'A new capacity milestone helps Long Anh serve Korea and Middle East markets.',
      zh: '新产能里程碑帮助龙英服务韩国和中东市场。',
    },
  },
  {
    slug: 'xuat-khau-bot-caco3-sang-an-do',
    cat: { vi: 'Xuất khẩu', en: 'Export', zh: '出口' },
    title: {
      vi: 'Xuất khẩu bột CaCO₃ phủ Stearic sang Ấn Độ — lô 5000 tấn đầu tiên',
      en: 'First 5000-ton shipment of coated CaCO₃ to India',
      zh: '首批5000吨涂层碳酸钙出口印度',
    },
    date: '2026-03-22',
    excerpt: {
      vi: 'Hợp đồng dài hạn 12 tháng với đối tác masterbatch lớn nhất Nam Á.',
      en: 'A 12-month contract with the largest masterbatch producer in South Asia.',
      zh: '与南亚最大母粒制造商签订12个月长期合同。',
    },
  },
  {
    slug: 'iso-9001-tai-chung-nhan-2026',
    cat: { vi: 'Chất lượng', en: 'Quality', zh: '质量' },
    title: {
      vi: 'Long Anh tái chứng nhận ISO 9001:2015 — chu kỳ 2026–2029',
      en: 'Long Anh recertified ISO 9001:2015 — 2026-2029 cycle',
      zh: '龙英再次获得ISO 9001:2015认证 — 2026-2029周期',
    },
    date: '2026-02-08',
    excerpt: {
      vi: 'Audit thông qua không có findings — đánh dấu chu kỳ chứng nhận thứ 3.',
      en: 'Audit passed without findings — marking the 3rd certification cycle.',
      zh: '审核无发现 — 标志着第三个认证周期。',
    },
  },
];

export default function NewsPage({
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
            eyebrow={loc === 'vi' ? 'Tin tức' : loc === 'en' ? 'News' : '新闻'}
            title={
              loc === 'vi'
                ? 'Tin tức & Sự kiện'
                : loc === 'en'
                  ? 'News & Events'
                  : '新闻与活动'
            }
            subtitle={
              loc === 'vi'
                ? 'Cập nhật những bước phát triển mới nhất của Long Anh và thị trường khoáng sản.'
                : loc === 'en'
                  ? "Stay current with Long Anh's milestones and the minerals market."
                  : '了解龙英的最新里程碑和矿产市场。'
            }
          />
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {placeholderArticles.map((art) => (
              <Link
                key={art.slug}
                href={`/${loc}/news/${art.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink/5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-[16/10] bg-gradient-to-br from-navy-100 to-canvas" />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 font-semibold uppercase tracking-eyebrow text-brand-600">
                      {art.cat[loc]}
                    </span>
                    <span className="text-ink-muted">
                      {new Date(art.date).toLocaleDateString(loc)}
                    </span>
                  </div>
                  <h2 className="mt-3 text-base font-bold leading-snug text-ink group-hover:text-brand-600">
                    {art.title[loc]}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">
                    {art.excerpt[loc]}
                  </p>
                  <div className="mt-5 flex items-center text-xs font-semibold text-brand-600">
                    {loc === 'vi' ? 'Đọc tiếp' : loc === 'en' ? 'Read more' : '阅读更多'}
                    <Icon
                      name="arrow-right"
                      size={14}
                      className="ml-1 transition group-hover:translate-x-0.5"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
