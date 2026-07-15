import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { Icon } from '@/components/ui/Icon';
import { SmartImage } from '@/components/ui/SmartImage';
import { AboutRotator } from '@/components/public/AboutRotator';
import { Words } from '@/components/public/Words';
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

/** Marquee rails need >1 viewport of content: render N copies, shift by 1/N. */
const RAIL_COPIES = 3;

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const loc = locale as Locale;

  // Products rail comes from the product catalogue; all section copy
  // (hero, stats, about, certs, export, contact) comes from page_sections,
  // editable at /admin/pages/home, with COPY-derived defaults.
  const productMap = await getProducts();
  const products = Object.values(productMap).map((p) => ({
    code: p.code,
    slug: p.slug,
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

      {/* HERO — full-screen photo, headline top-left, stats bottom-left,
          sub + CTAs bottom-right */}
      <section id="home" className="va-hero4" data-snap>
        <div className="va-hero4-bg">
          <SmartImage
            src={S.hero.imageUrl || '/assets/nha-may-bot-sieu-min.webp'}
            alt={S.hero.imageAlt}
            width={2000}
            height={1250}
            priority
          />
        </div>
        <div className="va-wrap va-hero4-in">
          <div className="va-hero4-top">
            <div className="va-eyebrow">{S.hero.eyebrow}</div>
            <h1 data-reveal="words">
              <span className="hl">
                <Words text={S.hero.titleLine1} step={150} />
              </span>
              <span className="hl">
                <Words text={S.hero.titleLine2} step={150} from={550} />
              </span>
            </h1>
          </div>
          <div className="va-hero4-bottom">
            <div className="va-hero4-stats">
              {S.stats.items.map((s, i) => (
                <div
                  key={i}
                  className="va-hero4-stat"
                  data-reveal
                  data-reveal-delay={String(i + 1)}
                >
                  <b data-countup>{s.value}</b>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
            <div className="va-hero4-side" data-reveal data-reveal-delay="2">
              <p>{S.hero.sub}</p>
              <div className="va-hero-cta">
                <Link className="va-btn va-btn-p" href={`/${loc}/products`}>
                  {S.hero.ctaPrimary} <Icon name="arrow" size={15} />
                </Link>
                <Link className="va-btn va-btn-w" href={`/${loc}/contact`}>
                  {S.hero.ctaSecondary}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS — continuous full-image rail, captions over the photo */}
      <section id="products" className="va-section va-rail-section" data-snap>
        <div className="va-wrap">
          <div className="va-shead2">
            <div className="va-eyebrow" data-reveal>
              {S.products.eyebrow}
            </div>
            <h2 data-reveal="words">
              <Words text={S.products.title} step={120} />
            </h2>
            <p className="dim" data-reveal="words">
              <Words text={S.products.sub} step={45} from={550} />
            </p>
          </div>
        </div>
        <div className="va-rail" data-reveal="fade">
          <div className="va-rail-track">
            {Array.from({ length: RAIL_COPIES }).flatMap((_, copy) =>
              products.map((p, i) => (
                <Link
                  key={`${copy}-${p.code}`}
                  href={`/${loc}/products/${p.slug}`}
                  className="va-rail-card"
                  aria-hidden={copy > 0 || undefined}
                  tabIndex={copy > 0 ? -1 : undefined}
                >
                  <SmartImage src={p.img} alt={p.name} width={900} height={1200} sizes="420px" />
                  <div className="va-rail-shade" />
                  <div className="va-rail-top">
                    <span className="lbl">
                      <b>{p.name}</b>
                      <i>{p.meta}</i>
                    </span>
                  </div>
                  <div className="va-rail-foot">
                    <p>{p.desc}</p>
                    <span className="go">
                      {loc === 'vi' ? 'Xem chi tiết' : loc === 'en' ? 'See details' : '查看详情'} →
                    </span>
                  </div>
                </Link>
              )),
            )}
          </div>
        </div>
      </section>

      {/* ABOUT — full-screen split, scroll-driven capability deck.
          data-noflick: a fast wheel flick scrubs through the cards instead of
          paging past the whole (tall) section. */}
      <section id="about" className="va-section va-about4" data-snap data-noflick>
        <div className="va-wrap">
          <div className="va-shead2">
            <div className="va-eyebrow" data-reveal>
              {S.about.eyebrow}
            </div>
            <h2 data-reveal="words">
              <Words text={S.about.title} step={120} />
            </h2>
            <p className="dim" data-reveal="words">
              <Words text={S.about.intro} step={38} from={550} />
            </p>
          </div>
          <div data-grow>
            <AboutRotator cards={S.about.cards} />
          </div>
        </div>
      </section>

      {/* CERTS — same rail treatment as products */}
      <section id="certs" className="va-section va-rail-section" data-snap>
        <div className="va-wrap">
          <div className="va-shead2">
            <div className="va-eyebrow" data-reveal>
              {S.certs.eyebrow}
            </div>
            <h2 data-reveal="words">
              <Words text={S.certs.title} step={120} />
            </h2>
            <p className="dim" data-reveal="words">
              <Words text={S.certs.sub} step={45} from={550} />
            </p>
          </div>
        </div>
        <div className="va-rail" data-reveal="fade">
          <div className="va-rail-track slow">
            {Array.from({ length: RAIL_COPIES }).flatMap((_, copy) =>
              S.certs.items.map((c, i) => (
                <div
                  key={`${copy}-${i}`}
                  className="va-rail-card light"
                  aria-hidden={copy > 0 || undefined}
                >
                  <div className="va-rail-logo">
                    <SmartImage
                      src={c.logoUrl}
                      alt={c.name}
                      width={400}
                      height={400}
                      sizes="240px"
                    />
                  </div>
                  <div className="va-rail-top">
                    <span className="lbl">
                      <b>{c.name}</b>
                      <i>{c.issuer}</i>
                    </span>
                  </div>
                  <div className="va-rail-foot">
                    <p>{c.desc}</p>
                  </div>
                </div>
              )),
            )}
          </div>
        </div>
      </section>

      {/* EXPORT MAP */}
      <section className="va-section tight" data-snap>
        <div className="va-wrap">
          <div data-grow>
            <ExportMap locale={loc} content={S.exportCap} />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="va-wrap" data-snap>
        <div className="va-contact">
          <div data-reveal>
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
          <div data-reveal data-reveal-delay="2">
            <ContactForm locale={loc} source="home_form" />
          </div>
        </div>
      </section>
    </>
  );
}
