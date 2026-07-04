import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Icon, type IconName } from '@/components/ui/Icon';
import { SmartImage } from '@/components/ui/SmartImage';
import { PageHeader } from '@/components/public/PageHeader';
import { TimelineArc } from '@/components/public/TimelineArc';
import { Words } from '@/components/public/Words';
import { getAboutSections, getCertifications } from '@/lib/queries';
import { buildPageMetadata } from '@/lib/page-metadata';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildPageMetadata({
    pageKey: 'about',
    locale: locale as Locale,
    pathStripped: '/about',
    fallbackTitle: 'Giới thiệu · KS Long Anh',
    fallbackDescription:
      'Hơn 20 năm khai thác và chế biến khoáng đá tại Quỳ Hợp — Nghệ An. Mỏ riêng, dây chuyền EU, ISO 9001.',
    fallbackOgImage: '/assets/da-nguyen-lieu-cao-cap.webp',
  });
}

/** Photo backdrops for the core-values cards (values have no CMS image). */
const VALUE_IMAGES = [
  '/assets/da-nguyen-lieu-cao-cap2.webp',
  '/assets/nha-may-bot-sieu-min-3.webp',
  '/assets/bao-bi-sieu-trang.jpg',
  '/assets/kiem-dinh.jpg',
  '/assets/co-so-ha-tang.jpg',
];

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const loc = locale as Locale;
  const C = COPY[loc];

  // All About content is editable from /admin/pages/about — read from
  // page_sections (with COPY-derived defaults). Cert logos / descriptions
  // come from the certifications catalogue.
  const [S, certCatalog] = await Promise.all([getAboutSections(loc), getCertifications()]);
  const certByName = new Map(certCatalog.map((c) => [c.name.trim().toLowerCase(), c]));

  const homeLabel = loc === 'zh' ? '首页' : loc === 'en' ? 'Home' : 'Trang chủ';

  return (
    <div className="ab">
      <PageHeader
        eyebrow={S.header.eyebrow}
        title={S.header.title}
        sub={S.header.sub}
        breadcrumb={[{ label: homeLabel, href: `/${loc}` }, { label: C.nav[1] }]}
      />

      {/* STORY */}
      <section className="ab-section ab-intro-wrap">
        <div className="ab-intro-bg">
          <SmartImage src={S.story.bgImageUrl} alt="" width={1600} height={900} />
        </div>
        <div className="va-wrap">
          <div className="ab-intro">
            <div className="ab-intro-img" data-reveal="clip">
              <SmartImage
                src={S.story.imageUrl}
                alt={S.story.imageAlt}
                width={1000}
                height={1200}
              />
            </div>
            <div>
              <div className="ab-eyebrow" data-reveal>
                {S.story.eyebrow}
              </div>
              <h2 data-reveal="words">
                <Words text={S.story.title} step={100} />
              </h2>
              {S.story.paragraph1 ? <p data-reveal>{S.story.paragraph1}</p> : null}
              {S.story.paragraph2 ? (
                <p data-reveal data-reveal-delay="1">
                  {S.story.paragraph2}
                </p>
              ) : null}
              {S.story.paragraph3 ? (
                <p data-reveal data-reveal-delay="2">
                  {S.story.paragraph3}
                </p>
              ) : null}
              <div className="ab-sig">
                <div className="ab-sig-img" />
                <div>
                  <b>{S.story.signerName}</b>
                  <span>{S.story.signerTitle}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE — rotating wheel */}
      <TimelineArc eyebrow={S.timeline.eyebrow} title={S.timeline.title} items={S.timeline.items} />

      {/* VALUES */}
      <section className="ab-section">
        <div className="va-wrap">
          <div
            style={{ textAlign: 'center', marginBottom: 48, maxWidth: 680, marginInline: 'auto' }}
          >
            <div className="ab-eyebrow" data-reveal>
              {S.values.eyebrow}
            </div>
            <h2 style={{ fontSize: 'clamp(30px,3.6vw,44px)' }} data-reveal="words">
              <Words text={S.values.title} step={100} />
            </h2>
          </div>
          <div className="ab-vals2">
            {S.values.items.map((it, i) => (
              <div key={i} className="ab-val2" data-reveal="clip" data-reveal-delay={String(i % 3)}>
                <SmartImage
                  src={VALUE_IMAGES[i % VALUE_IMAGES.length]}
                  alt={it.name}
                  width={800}
                  height={1000}
                  sizes="33vw"
                />
                <div className="ab-val2-shade" />
                <div className="ab-val2-chip">
                  <Icon name={(it.icon || 'check') as IconName} size={18} />
                </div>
                <div className="ab-val2-body">
                  <h3>{it.name}</h3>
                  <p>{it.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="ab-section" style={{ background: 'var(--va-bg-alt)' }}>
        <div className="va-wrap">
          <div className="ab-caps">
            <div className="ab-caps-img" data-reveal="clip">
              <SmartImage src={S.caps.imageUrl} alt={S.caps.imageAlt} width={1000} height={1100} />
            </div>
            <div>
              <div className="ab-eyebrow" data-reveal>
                {S.caps.eyebrow}
              </div>
              <h2 data-reveal="words">
                <Words text={S.caps.title} step={100} />
              </h2>
              {S.caps.sub ? <p data-reveal>{S.caps.sub}</p> : null}
              <div className="ab-caps-list">
                {S.caps.metrics.map((m, i) => (
                  <div key={i} className="ab-cap-row">
                    <div className="ab-cap-n">— {String(i + 1).padStart(2, '0')}</div>
                    <h4>{m.label}</h4>
                    <span>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WAREHOUSE */}
      <section className="ab-section">
        <div className="va-wrap">
          <div className="ab-shead-row">
            <div>
              <div className="ab-eyebrow" data-reveal>
                {S.warehouse.eyebrow}
              </div>
              <h2
                style={{ fontSize: 'clamp(28px,3.4vw,42px)', marginBottom: 0 }}
                data-reveal="words"
              >
                <Words text={S.warehouse.title} step={100} />
              </h2>
            </div>
          </div>
          <div className="ab-warehouse-grid" data-reveal="clip">
            {S.warehouse.images[0] ? (
              <div className="ab-wh-img">
                <SmartImage src={S.warehouse.images[0]} alt="" width={1000} height={1200} />
              </div>
            ) : null}
            <div className="ab-wh-col">
              {S.warehouse.images[1] ? (
                <div className="ab-wh-img">
                  <SmartImage src={S.warehouse.images[1]} alt="" width={900} height={700} />
                </div>
              ) : null}
              {S.warehouse.images[2] ? (
                <div className="ab-wh-img">
                  <SmartImage src={S.warehouse.images[2]} alt="" width={900} height={700} />
                </div>
              ) : null}
            </div>
            {S.warehouse.images[3] ? (
              <div className="ab-wh-img">
                <SmartImage src={S.warehouse.images[3]} alt="" width={1000} height={1200} />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* CERTS */}
      <section className="ab-certs">
        <div className="va-wrap">
          <div className="ab-certs-head">
            <div>
              <div className="ab-eyebrow" data-reveal>
                {loc === 'zh' ? '认证' : loc === 'en' ? 'Certifications' : 'Chứng nhận'}
              </div>
              <h2 data-reveal="words">
                <Words text={S.certs.title} step={100} />
              </h2>
            </div>
            <p data-reveal data-reveal-delay="1">
              {S.certs.sub}
            </p>
          </div>
          <div className="ab-certs-grid">
            {S.certs.items
              .filter((c) => c.enabled)
              .map((c, i) => {
                const cat = certByName.get(c.name.trim().toLowerCase());
                return (
                  <div
                    key={i}
                    className="ab-cert-card"
                    data-reveal
                    data-reveal-delay={String(i % 4)}
                  >
                    <div className="ab-cert-img">
                      {cat?.badge ? (
                        <SmartImage
                          src={cat.badge}
                          alt={c.name}
                          width={400}
                          height={400}
                          sizes="240px"
                        />
                      ) : null}
                    </div>
                    <div className="ab-cert-body">
                      {cat?.code ? (
                        <div className="ab-cert-meta">{cat.code.toUpperCase()}</div>
                      ) : null}
                      <h3>{c.name}</h3>
                      {cat?.desc?.[loc] ? <p>{cat.desc[loc]}</p> : null}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="va-wrap">
        <div className="ab-cta" data-reveal="scale">
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '.16em',
                textTransform: 'uppercase',
                color: '#F08023',
                marginBottom: 14,
              }}
            >
              {loc === 'zh'
                ? '与龙英合作'
                : loc === 'en'
                  ? 'Partner with Long Anh'
                  : 'Đối tác cùng Long Anh'}
            </div>
            <h2>{S.cta.title}</h2>
            <p>{S.cta.sub}</p>
          </div>
          <div className="ab-cta-btns">
            <Link className="ab-btn ab-btn-p" href={S.cta.primaryHref || `/${loc}/products`}>
              {S.cta.primaryLabel} →
            </Link>
            <Link className="ab-btn ab-btn-g" href={S.cta.secondaryHref || `/${loc}/contact`}>
              {S.cta.secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
