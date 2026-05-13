import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { Container, SectionHeader } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { placeholderProducts } from '@/data/placeholder';
import { ContactCTA } from '@/components/sections/ContactCTA';

export default function ProductsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const loc = locale as Locale;

  const categories = [
    {
      id: 'powder',
      title: {
        vi: 'Bột đá CaCO₃',
        en: 'CaCO₃ powder',
        zh: '碳酸钙粉',
      } as Record<Locale, string>,
      desc: {
        vi: 'Coated · Uncoated · 3 – 20 µm — phụ gia cho nhựa, sơn, giấy, thức ăn chăn nuôi.',
        en: 'Coated · Uncoated · 3 – 20 µm — additive for plastics, paint, paper, animal feed.',
        zh: '涂层 · 未涂层 · 3 – 20 µm — 用于塑料、涂料、纸张、动物饲料的添加剂。',
      } as Record<Locale, string>,
    },
    {
      id: 'stone',
      title: {
        vi: 'Đá ốp lát tự nhiên',
        en: 'Natural cladding stone',
        zh: '天然石材饰面',
      } as Record<Locale, string>,
      desc: {
        vi: 'Slab · Đá xẻ · Đá trang trí — cho công trình và không gian sống cao cấp.',
        en: 'Slab · Cut tile · Decorative — for premium architecture and living spaces.',
        zh: '大板 · 定制石材 · 装饰石材 — 用于高端建筑和生活空间。',
      } as Record<Locale, string>,
    },
  ];

  return (
    <main>
      <section className="bg-gradient-to-b from-white to-canvas py-16 sm:py-24">
        <Container>
          <SectionHeader
            eyebrow={
              loc === 'vi' ? 'Sản phẩm' : loc === 'en' ? 'Products' : '产品'
            }
            title={
              loc === 'vi'
                ? 'Hai dòng sản phẩm. Năm tiêu chuẩn.'
                : loc === 'en'
                  ? 'Two product lines. Five SKUs.'
                  : '两大产品系列。五个标准。'
            }
            subtitle={
              loc === 'vi'
                ? 'Từ bột đá CaCO₃ siêu mịn cho compound nhựa, đến đá tự nhiên cỡ lớn cho công trình cao cấp — tất cả đều đến từ một mỏ duy nhất.'
                : loc === 'en'
                  ? 'From ultra-fine CaCO₃ for plastic compounds, to large-format natural stone for premium projects — all from a single quarry.'
                  : '从塑料复合材料用的超细碳酸钙粉,到高端项目用的大尺寸天然石材 — 全部来自同一矿源。'
            }
          />
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-3xl bg-gradient-to-br from-navy-700 to-navy-900 p-8 text-white"
              >
                <p className="text-xs font-semibold uppercase tracking-eyebrow text-brand-300">
                  {cat.id === 'powder' ? '02 SKU' : '03 SKU'}
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight">{cat.title[loc]}</h2>
                <p className="mt-3 text-sm leading-relaxed text-white/75">{cat.desc[loc]}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {placeholderProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/${loc}/products/${product.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink/5 transition hover:-translate-y-1 hover:shadow-xl hover:ring-brand-200"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-navy-100 to-canvas">
                  <div className="flex h-full items-end p-5">
                    <div className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-eyebrow text-ink-muted backdrop-blur">
                      {product.category === 'powder' ? 'CaCO₃' : 'Stone'}
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold text-ink group-hover:text-brand-600">
                    {product.name[loc]}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {product.shortDesc[loc]}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-ink/5 px-2.5 py-0.5 text-[10px] font-medium text-ink-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center text-xs font-semibold text-brand-600">
                    {loc === 'vi' ? 'Xem chi tiết' : loc === 'en' ? 'View detail' : '查看详情'}
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

      <ContactCTA locale={loc} />
    </main>
  );
}
