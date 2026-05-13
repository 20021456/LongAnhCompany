import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { Container, SectionHeader } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { placeholderProducts } from '@/data/placeholder';

interface Props {
  locale: Locale;
}

export function ProductsCarousel({ locale }: Props) {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <SectionHeader
            eyebrow={
              locale === 'vi'
                ? 'Danh mục sản phẩm'
                : locale === 'en'
                  ? 'Product catalogue'
                  : '产品目录'
            }
            title={
              locale === 'vi'
                ? 'Năm dòng sản phẩm chính'
                : locale === 'en'
                  ? 'Five core product lines'
                  : '五大主要产品系列'
            }
            subtitle={
              locale === 'vi'
                ? 'Tối ưu cho từng ứng dụng — từ filler nhựa siêu mịn đến đá trang trí kích thước lớn.'
                : locale === 'en'
                  ? 'Tuned to each end use — from ultra-fine plastics filler to large decorative slab.'
                  : '针对每个应用进行优化 — 从超细塑料填料到大尺寸装饰板材。'
            }
          />
          <Link
            href={`/${locale}/products`}
            className="hidden shrink-0 items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 sm:inline-flex"
          >
            <span>{locale === 'vi' ? 'Xem tất cả' : locale === 'en' ? 'View all' : '查看全部'}</span>
            <Icon name="arrow-right" size={14} />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {placeholderProducts.slice(0, 6).map((product) => (
            <Link
              key={product.slug}
              href={`/${locale}/products/${product.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink/5 transition hover:-translate-y-1 hover:shadow-xl hover:ring-brand-200"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-navy-100 to-canvas">
                <div className="flex h-full items-end p-5">
                  <div className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-eyebrow text-ink-muted backdrop-blur">
                    {product.category === 'powder' ? 'CaCO₃ powder' : 'Natural stone'}
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-bold text-ink group-hover:text-brand-600">
                  {product.name[locale]}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {product.shortDesc[locale]}
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
                  {locale === 'vi' ? 'Xem chi tiết' : locale === 'en' ? 'View detail' : '查看详情'}
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
  );
}
