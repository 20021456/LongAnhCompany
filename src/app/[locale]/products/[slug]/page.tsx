import { notFound } from 'next/navigation';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { ContactForm } from '@/components/public/ContactForm';
import { placeholderProducts } from '@/data/placeholder';

export function generateStaticParams() {
  return placeholderProducts.map((p) => ({ slug: p.slug }));
}

export default function ProductDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(params.locale);
  const loc = params.locale as Locale;

  const product = placeholderProducts.find((p) => p.slug === params.slug);
  if (!product) notFound();

  // Placeholder variants & specs — Phase 3 will pull from DB
  const variants =
    product.category === 'powder'
      ? [
          { code: '3um', label: '3 µm', price: '4,500,000', stock: 250, popular: true },
          { code: '8um', label: '8 µm', price: '4,200,000', stock: 320 },
          { code: '12um', label: '12 µm', price: '3,700,000', stock: 380 },
          { code: '20um', label: '20 µm', price: '3,000,000', stock: 580 },
        ]
      : [
          { code: 'sl-18', label: '1.6×2.4×18 mm', price: '6,800,000', stock: 80 },
          { code: 'sl-20', label: '1.6×2.4×20 mm', price: '7,500,000', stock: 120, popular: true },
          { code: 'sl-30', label: '1.6×2.4×30 mm', price: '9,800,000', stock: 60 },
        ];

  const applications =
    product.category === 'powder'
      ? ['Sơn nước & sơn dầu', 'Bột bả tường', 'Keo dán công nghiệp', 'Thức ăn chăn nuôi', 'Masterbatch nhựa', 'Giấy & cao su']
      : ['Mặt bàn bếp', 'Ốp tường mặt tiền', 'Sân vườn', 'Hồ bơi', 'Bậc thang', 'Cầu thang'];

  return (
    <main>
      <section className="border-b border-ink/5 bg-white py-6">
        <Container>
          <nav className="flex items-center gap-2 text-xs text-ink-muted">
            <Link href={`/${loc}`} className="hover:text-brand-600">
              {loc === 'vi' ? 'Trang chủ' : loc === 'en' ? 'Home' : '首页'}
            </Link>
            <Icon name="chevron-right" size={12} />
            <Link href={`/${loc}/products`} className="hover:text-brand-600">
              {loc === 'vi' ? 'Sản phẩm' : loc === 'en' ? 'Products' : '产品'}
            </Link>
            <Icon name="chevron-right" size={12} />
            <span className="text-ink">{product.name[loc]}</span>
          </nav>
        </Container>
      </section>

      <section className="bg-gradient-to-b from-white to-canvas py-12 sm:py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-navy-100 to-canvas ring-1 ring-ink/5">
              <div className="flex h-full items-end justify-start p-8">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-eyebrow text-ink-muted ring-1 ring-ink/5">
                  {product.code}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-eyebrow text-brand-600">
                {product.category === 'powder' ? 'CaCO₃ powder' : 'Natural stone'}
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tighter text-ink sm:text-4xl">
                {product.name[loc]}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                {product.shortDesc[loc]}
              </p>

              <div className="mt-8 rounded-2xl border border-ink/5 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">
                  {loc === 'vi' ? 'Quy cách' : loc === 'en' ? 'Variants' : '规格'}
                </p>
                <div className="mt-3 space-y-2">
                  {variants.map((v) => (
                    <div
                      key={v.code}
                      className="flex items-center justify-between rounded-lg border border-ink/5 px-4 py-3 hover:border-brand-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{v.label}</span>
                        {v.popular ? (
                          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-eyebrow text-brand-600">
                            Popular
                          </span>
                        ) : null}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-ink">{v.price} ₫</p>
                        <p className="text-[10px] text-ink-muted">Stock: {v.stock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-canvas p-3">
                  <p className="text-[10px] uppercase tracking-eyebrow text-ink-muted">MOQ</p>
                  <p className="font-semibold">25 tấn</p>
                </div>
                <div className="rounded-lg bg-canvas p-3">
                  <p className="text-[10px] uppercase tracking-eyebrow text-ink-muted">Lead time</p>
                  <p className="font-semibold">7–14 ngày</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {loc === 'vi' ? 'Ứng dụng' : loc === 'en' ? 'Applications' : '应用'}
              </h2>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {applications.map((app) => (
                  <div
                    key={app}
                    className="flex items-start gap-2 rounded-lg bg-white p-3 ring-1 ring-ink/5"
                  >
                    <Icon
                      name="check-circle"
                      size={16}
                      className="mt-0.5 shrink-0 text-brand-500"
                    />
                    <span className="text-sm">{app}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 ring-1 ring-ink/5 sm:p-8">
              <h2 className="text-2xl font-bold tracking-tight">
                {loc === 'vi' ? 'Yêu cầu báo giá' : loc === 'en' ? 'Request a quote' : '请求报价'}
              </h2>
              <p className="mt-2 text-sm text-ink-muted">
                {loc === 'vi'
                  ? 'Phản hồi trong 24h kèm bảng spec, COA và báo giá FOB.'
                  : loc === 'en'
                    ? '24h reply with spec sheet, COA and FOB pricing.'
                    : '24小时内回复,提供规格表、COA和FOB报价。'}
              </p>
              <div className="mt-6">
                <ContactForm locale={loc} source="product_quote" productId={product.slug} />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
