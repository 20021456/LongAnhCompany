import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Icon, type IconName } from '@/components/ui/Icon';
import { SmartImage } from '@/components/ui/SmartImage';
import { PageHero } from '@/components/public/PageHero';
import { TimelineArc } from '@/components/public/TimelineArc';
import { WarehouseDeck } from '@/components/public/WarehouseDeck';
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
      <PageHero
        eyebrow={S.header.eyebrow}
        title={S.header.title}
        sub={S.header.sub}
        breadcrumb={[{ label: homeLabel, href: `/${loc}` }, { label: C.nav[1] }]}
        bgImage={S.header.imageUrl || '/assets/da-nguyen-lieu-cao-cap.webp'}
      />

      {/* STORY */}
      <section className="ab-section ab-intro-wrap">
        <div className="ab-intro-bg">
          <SmartImage src={S.story.bgImageUrl} alt="" width={1600} height={900} />
        </div>
        <div className="va-wrap">
          <div className="ab-intro">
            <div className="ab-intro-media">
              <div className="ab-intro-img" data-reveal="clip">
                <SmartImage
                  src={S.story.imageUrl}
                  alt={S.story.imageAlt}
                  width={1000}
                  height={1200}
                />
              </div>
              <div className="ab-intro-img2" data-reveal data-reveal-delay="2">
                <div data-parallax="0.05">
                  <SmartImage src={S.story.bgImageUrl} alt="" width={700} height={500} />
                </div>
              </div>
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

      {/* VALUES — split layout: title left, borderless icon list right.
          Same faint full-section photo backdrop as the story section. */}
      <section className="ab-section ab-intro-wrap">
        <div className="ab-intro-bg">
          <SmartImage src="/assets/kho-da-nguyen-lieu.webp" alt="" width={1600} height={900} />
        </div>
        <div className="va-wrap">
          <div className="ab-vals3">
            <div className="ab-vals3-head">
              <div className="ab-eyebrow" data-reveal>
                {S.values.eyebrow}
              </div>
              <h2 data-reveal="words">
                <Words text={S.values.title} step={100} />
              </h2>
            </div>
            <div className="ab-vals3-list">
              {S.values.items.map((it, i) => (
                <div
                  key={i}
                  className="ab-vals3-item"
                  data-reveal
                  data-reveal-delay={String(i % 3)}
                >
                  <div className="ab-vals3-icon">
                    <Icon name={(it.icon || 'check') as IconName} size={22} />
                  </div>
                  <div>
                    <h3>{it.name}</h3>
                    <p>{it.body}</p>
                  </div>
                </div>
              ))}
            </div>
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
                  <div key={i} className="ab-cap-row" data-reveal data-reveal-delay={String(i % 4)}>
                    <h4>{m.label}</h4>
                    <span data-countup>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WAREHOUSE — Kettal-collections layout: caption above, framed photo below */}
      <section className="ab-section">
        <WarehouseDeck
          eyebrow={S.warehouse.eyebrow}
          note={S.warehouse.title}
          slides={S.warehouse.images.filter(Boolean).map((src, i) => {
            const caps = S.warehouse.captions ?? [];
            const cap = caps.length > 0 ? caps[i % caps.length] : { title: '', sub: '' };
            return { src, title: cap.title, sub: cap.sub };
          })}
        />
      </section>

      {/* CERTS */}
      <section className="ab-certs">
        <div className="va-wrap">
          <div className="va-shead2">
            <div className="ab-eyebrow" data-reveal>
              {loc === 'zh' ? '认证' : loc === 'en' ? 'Certifications' : 'Chứng nhận'}
            </div>
            <h2 data-reveal="words">
              <Words text={S.certs.title} step={100} />
            </h2>
            <p className="dim" data-reveal="words">
              <Words text={S.certs.sub} step={40} from={500} />
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
        <div className="ab-cta" data-grow>
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
