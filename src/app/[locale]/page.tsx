import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { Icon } from '@/components/ui/Icon';
import { SmartImage } from '@/components/ui/SmartImage';
import { ProductCarousel } from '@/components/public/ProductCarousel';
import { ExportMap } from '@/components/public/ExportMap';
import { ContactForm } from '@/components/public/ContactForm';
import { getProducts, getHomeSections } from '@/lib/queries';
import { buildPageMetadata } from '@/lib/page-metadata';
import { JsonLd, organizationSchema, webSiteSchema } from '@/components/seo/JsonLd';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildPageMetadata({
    pageKey: 'home',
    locale: locale as Locale,
    pathStripped: '/',
    fallbackTitle: 'KS Long Anh — Khoáng đá nguyên sinh từ Nghệ An',
    fallbackDescription:
      'Long Anh chuyên sản xuất bột đá CaCO₃ và đá tự nhiên — phục vụ ngành nhựa, sơn, giấy, xây dựng và xuất khẩu toàn cầu.',
    fallbackOgImage: '/assets/hero-sw.png',
  });
}

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const loc = locale as Locale;

  // Products carousel comes from the product catalogue; all section copy
  // (hero, stats, about, certs, export, contact) comes from page_sections,
  // editable at /admin/pages/home, with COPY-derived defaults.
  const productMap = await getProducts();
  const carouselProducts = Object.values(productMap).map((p) => ({
    code: p.code,
    cat: p.cat,
    img: p.images[0] ?? '',
    name: p.name[loc],
    meta: p.meta[loc],
    desc: p.desc[loc],
    tags: p.tags[loc] ?? [],
  }));
  const S = await getHomeSections(loc);

  return (
    <>
      <JsonLd
        data={organizationSchema({
          name: 'KS Long Anh',
          legalName: 'Công ty TNHH KS Long Anh',
          logo: '/assets/long-anh-logo.png',
          email: S.contact.email,
          phone: S.contact.phone1,
          address: S.contact.address,
        })}
      />
      <JsonLd data={webSiteSchema({ name: 'KS Long Anh' })} />
      {/* HERO */}
      <section id="home" className="va-hero split">
        <div className="va-wrap va-hero-l">
          <div className="va-eyebrow va-hero-eb">{S.hero.eyebrow}</div>
          <h1>
            {S.hero.titleLine1}
            <br />
            <b style={{ color: 'var(--brand-accent, #F08023)' }}>{S.hero.titleLine2}</b>
          </h1>
          <p className="va-hero-sub">{S.hero.sub}</p>
          <div className="va-hero-cta">
            <Link className="va-btn va-btn-p" href={`/${loc}/products`}>
              {S.hero.ctaPrimary} <Icon name="arrow" size={15} />
            </Link>
            <Link className="va-btn va-btn-g" href={`/${loc}/contact`}>
              {S.hero.ctaSecondary}
            </Link>
          </div>
        </div>
        <div className="va-hero-r">
          <div className="va-hero-art" />
          <div className="va-hero-grid" />
          <SmartImage
            className="va-hero-img"
            src={S.hero.imageUrl}
            alt={S.hero.imageAlt}
            width={1600}
            height={1100}
            priority
          />
        </div>
      </section>

      {/* STATS */}
      <section className="va-stats">
        <div className="va-wrap">
          <div className="va-stats-in">
            {S.stats.items.map((s, i) => (
              <div key={i} className="va-stat">
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="va-section" style={{ background: 'var(--va-bg-alt)' }}>
        <div className="va-wrap">
          <div className="va-shead">
            <div>
              <div className="va-eyebrow">{S.products.eyebrow}</div>
              <h2>{S.products.title}</h2>
            </div>
            <p>{S.products.sub}</p>
          </div>
          <ProductCarousel products={carouselProducts} locale={loc} sideArrows />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="va-section">
        <div className="va-wrap">
          <div className="va-shead">
            <div>
              <div className="va-eyebrow">{S.about.eyebrow}</div>
              <h2>{S.about.title}</h2>
            </div>
            <p>{S.about.intro}</p>
          </div>
          <div className="va-caps4">
            {S.about.cards.map((it, i) => (
              <div
                key={i}
                className="va-cap4"
                style={{
                  backgroundImage: `linear-gradient(180deg,rgba(15,30,50,.45) 0%,rgba(8,16,30,.95) 85%),url('${it.imageUrl}')`,
                }}
              >
                <div className="va-cap4-body">
                  <h3>{it.name}</h3>
                  <p>{it.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTS */}
      <section id="certs" className="va-section">
        <div className="va-wrap">
          <div className="va-shead">
            <div>
              <div className="va-eyebrow">{S.certs.eyebrow}</div>
              <h2>{S.certs.title}</h2>
            </div>
            <p>{S.certs.sub}</p>
          </div>

          <div className="va-certs-grid">
            {S.certs.items.map((c, i) => (
              <div key={i} className="va-cert-card">
                <div className="va-cert-img">
                  <SmartImage src={c.logoUrl} alt={c.name} width={400} height={400} sizes="200px" />
                </div>
                <div className="va-cert-body">
                  <div className="va-cert-meta">{c.issuer}</div>
                  <h3>{c.name}</h3>
                  <p>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link className="va-btn va-btn-p" href={`/${loc}/about#certs`}>
              {loc === 'zh'
                ? '查看所有认证'
                : loc === 'en'
                  ? 'View all certifications'
                  : 'Xem tất cả chứng chỉ'}{' '}
              <Icon name="arrow" size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* EXPORT MAP */}
      <section className="va-section tight">
        <div className="va-wrap">
          <ExportMap locale={loc} content={S.exportCap} />
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="va-wrap">
        <div className="va-contact">
          <div>
            <div className="va-eyebrow">{S.contact.eyebrow}</div>
            <h2>{S.contact.title}</h2>
            <p style={{ opacity: 0.7, fontSize: 15, lineHeight: 1.65 }}>{S.contact.sub}</p>
            <div className="va-contact-info">
              <div className="va-ci-row">
                <div className="va-ci-i">
                  <Icon name="pin" size={16} />
                </div>
                <div>
                  <div className="lbl">
                    {loc === 'zh' ? '总部' : loc === 'en' ? 'Headquarters' : 'Trụ sở'}
                  </div>
                  <div className="val">{S.contact.address}</div>
                </div>
              </div>
              <div className="va-ci-row">
                <div className="va-ci-i">
                  <Icon name="phone" size={16} />
                </div>
                <div>
                  <div className="lbl">
                    {loc === 'zh' ? '电话' : loc === 'en' ? 'Phone' : 'Điện thoại'}
                  </div>
                  <div className="val">
                    {S.contact.phone1}
                    {S.contact.phone2 ? (
                      <>
                        <br />
                        {S.contact.phone2}
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="va-ci-row">
                <div className="va-ci-i">
                  <Icon name="mail" size={16} />
                </div>
                <div>
                  <div className="lbl">Email</div>
                  <div className="val">{S.contact.email}</div>
                </div>
              </div>
            </div>
          </div>
          <ContactForm locale={loc} source="home_form" />
        </div>
      </section>
    </>
  );
}
