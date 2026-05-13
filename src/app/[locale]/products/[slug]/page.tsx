import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Icon } from '@/components/ui/Icon';
import { ContactForm } from '@/components/public/ContactForm';

export function generateStaticParams() {
  return ['p-01', 'p-02', 'p-03', 'p-04', 'p-05'].map((slug) => ({ slug }));
}

export default function ProductDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(params.locale);
  const loc = params.locale as Locale;
  const C = COPY[loc];

  const code = params.slug.toUpperCase();
  const product = C.products.find((p: { code: string }) => p.code === code);
  if (!product) notFound();

  const variants =
    product.cat === 0
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

  const apps =
    product.cat === 0
      ? ['Sơn nước & sơn dầu', 'Bột bả tường', 'Keo dán công nghiệp', 'Masterbatch nhựa', 'Giấy & cao su', 'Thức ăn chăn nuôi']
      : ['Mặt bàn bếp', 'Ốp tường mặt tiền', 'Sân vườn', 'Hồ bơi', 'Bậc thang', 'Cầu thang'];

  return (
    <>
      {/* Breadcrumb */}
      <section style={{ background: 'var(--va-bg-alt)', borderBottom: '1px solid var(--va-line)' }}>
        <div className="va-wrap" style={{ padding: '14px 0' }}>
          <nav style={{ fontSize: 12.5, opacity: 0.7, display: 'flex', gap: 6, alignItems: 'center' }}>
            <Link href={`/${loc}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              {C.nav[0]}
            </Link>
            <Icon name="chevron" size={12} />
            <Link href={`/${loc}/products`} style={{ color: 'inherit', textDecoration: 'none' }}>
              {C.nav[2]}
            </Link>
            <Icon name="chevron" size={12} />
            <span>{product.name}</span>
          </nav>
        </div>
      </section>

      <section className="va-section">
        <div className="va-wrap">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }} className="pd-top">
            <div
              style={{
                borderRadius: 18,
                overflow: 'hidden',
                background: 'var(--va-bg-alt)',
                aspectRatio: '1 / 1',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.img}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div className="va-eyebrow">{product.code}</div>
              <h1 style={{ fontSize: 'clamp(28px,3vw,42px)', margin: '12px 0 16px' }}>
                {product.name}
              </h1>
              <p style={{ fontSize: 15.5, lineHeight: 1.7, opacity: 0.78 }}>{product.desc}</p>

              <div
                style={{
                  marginTop: 28,
                  border: '1px solid var(--va-line)',
                  borderRadius: 14,
                  padding: 22,
                }}
              >
                <div className="va-eyebrow" style={{ marginBottom: 14 }}>
                  {loc === 'vi' ? 'Quy cách' : loc === 'en' ? 'Variants' : '规格'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {variants.map((v) => (
                    <div
                      key={v.code}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        border: '1px solid var(--va-line)',
                        borderRadius: 10,
                        background: 'var(--va-card)',
                      }}
                    >
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <b style={{ fontSize: 14 }}>{v.label}</b>
                        {v.popular ? (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              padding: '3px 8px',
                              borderRadius: 99,
                              background: 'rgba(240,128,35,.12)',
                              color: 'var(--brand-accent,#F08023)',
                              letterSpacing: '.04em',
                              textTransform: 'uppercase',
                            }}
                          >
                            Popular
                          </span>
                        ) : null}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{v.price} ₫</div>
                        <div style={{ fontSize: 11, opacity: 0.6 }}>Stock: {v.stock}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                  marginTop: 16,
                }}
              >
                <Spec label="MOQ" value="25 tấn" />
                <Spec label="Lead time" value="7–14 ngày" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="va-section tight" style={{ background: 'var(--va-bg-alt)' }}>
        <div className="va-wrap">
          <div className="va-shead">
            <div>
              <div className="va-eyebrow">
                {loc === 'vi' ? 'Ứng dụng' : loc === 'en' ? 'Applications' : '应用'}
              </div>
              <h2>{C.appsH}</h2>
            </div>
            <p>{product.desc}</p>
          </div>
          <div className="va-apps">
            {apps.map((app, i) => (
              <div key={app} className="va-app">
                <div className="va-app-i">
                  <Icon
                    name={(['drop', 'check', 'spark', 'globe', 'leaf', 'grid'] as const)[i % 6]}
                    size={26}
                  />
                </div>
                <h4>{app}</h4>
                <p>
                  {loc === 'vi'
                    ? 'Giải pháp tối ưu cho ngành.'
                    : 'Optimal industry solution.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="va-wrap">
        <div className="va-contact">
          <div>
            <div className="va-eyebrow">
              {loc === 'vi' ? 'Báo giá' : loc === 'en' ? 'Quote' : '报价'}
            </div>
            <h2>{C.contactH}</h2>
            <p style={{ opacity: 0.7, fontSize: 15, lineHeight: 1.65 }}>{C.contactP}</p>
          </div>
          <ContactForm locale={loc} source="product_quote" productId={product.code} />
        </div>
      </section>
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: '12px 14px',
        border: '1px solid var(--va-line)',
        borderRadius: 10,
        background: 'var(--va-card)',
      }}
    >
      <div style={{ fontSize: 10.5, opacity: 0.55, letterSpacing: '.08em', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{value}</div>
    </div>
  );
}
