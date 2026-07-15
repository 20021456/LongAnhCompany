import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Icon, type IconName } from '@/components/ui/Icon';
import { SmartImage } from '@/components/ui/SmartImage';
import { PageHeader } from '@/components/public/PageHeader';
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
            <div className="ab-intro-img">
              <SmartImage
                src={S.story.imageUrl}
                alt={S.story.imageAlt}
                width={1000}
                height={1200}
              />
            </div>
            <div>
              <div className="ab-eyebrow">{S.story.eyebrow}</div>
              <h2>{S.story.title}</h2>
              {S.story.paragraph1 ? <p>{S.story.paragraph1}</p> : null}
              {S.story.paragraph2 ? <p>{S.story.paragraph2}</p> : null}
              {S.story.paragraph3 ? <p>{S.story.paragraph3}</p> : null}
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

      {/* TIMELINE */}
      <section className="ab-time">
        <div className="va-wrap">
          <div className="ab-time-head">
            <div className="ab-eyebrow">{S.timeline.eyebrow}</div>
            <h2>{S.timeline.title}</h2>
          </div>
          <div className="ab-time-grid">
            {S.timeline.items.map((ev, i) => (
              <div key={i} className="ab-tnode">
                <div className="ab-tdot" />
                <b>{ev.year}</b>
                <h4>{ev.title}</h4>
                <p>{ev.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="ab-section">
        <div className="va-wrap">
          <div
            style={{ textAlign: 'center', marginBottom: 48, maxWidth: 680, marginInline: 'auto' }}
          >
            <div className="ab-eyebrow">{S.values.eyebrow}</div>
            <h2 style={{ fontSize: 'clamp(30px,3.6vw,44px)' }}>{S.values.title}</h2>
          </div>
          <div className="ab-vals">
            {S.values.items.map((it, i) => (
              <div key={i} className="ab-val">
                <div className="ab-val-i">
                  <Icon name={(it.icon || 'check') as IconName} size={24} />
                </div>
                <h3>{it.name}</h3>
                <p>{it.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="ab-section" style={{ background: 'var(--va-bg-alt)' }}>
        <div className="va-wrap">
          <div className="ab-caps">
            <div className="ab-caps-img">
              <SmartImage src={S.caps.imageUrl} alt={S.caps.imageAlt} width={1000} height={1100} />
            </div>
            <div>
              <div className="ab-eyebrow">{S.caps.eyebrow}</div>
              <h2>{S.caps.title}</h2>
              {S.caps.sub ? <p>{S.caps.sub}</p> : null}
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
              <div className="ab-eyebrow">{S.warehouse.eyebrow}</div>
              <h2 style={{ fontSize: 'clamp(28px,3.4vw,42px)', marginBottom: 0 }}>
                {S.warehouse.title}
              </h2>
            </div>
          </div>
          <div className="ab-warehouse-grid">
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
              <div className="ab-eyebrow">
                {loc === 'zh' ? '认证' : loc === 'en' ? 'Certifications' : 'Chứng nhận'}
              </div>
              <h2>{S.certs.title}</h2>
            </div>
            <p>{S.certs.sub}</p>
          </div>
          <div className="ab-certs-grid">
            {S.certs.items
              .filter((c) => c.enabled)
              .map((c, i) => {
                const cat = certByName.get(c.name.trim().toLowerCase());
                return (
                  <div key={i} className="ab-cert-card">
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
        <div className="ab-cta">
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
