import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ContactForm } from '@/components/public/ContactForm';
import { PageHero } from '@/components/public/PageHero';
import { getContactPageSections } from '@/lib/queries';
import { buildPageMetadata } from '@/lib/page-metadata';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildPageMetadata({
    pageKey: 'contact',
    locale: locale as Locale,
    pathStripped: '/contact',
    fallbackTitle: 'Liên hệ · KS Long Anh',
    fallbackDescription:
      'Liên hệ Long Anh — hotline, email, văn phòng tại Vinh, Nghệ An. Báo giá FOB trong 24h làm việc.',
    fallbackOgImage: '/assets/co-so-ha-tang.jpg',
  });
}

const QUICK_ICON_MAP: Record<string, IconName> = {
  chat: 'mail',
  mail: 'mail',
  globe: 'globe',
  phone: 'phone',
};

export default async function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const loc = locale as Locale;
  const S = await getContactPageSections(loc);

  return (
    <>
      <PageHero
        eyebrow={S.header.eyebrow}
        title={S.header.title}
        sub={S.header.sub}
        breadcrumb={[
          { label: loc === 'zh' ? '首页' : loc === 'en' ? 'Home' : 'Trang chủ', href: `/${loc}` },
          { label: loc === 'zh' ? '联系' : loc === 'en' ? 'Contact' : 'Liên hệ' },
        ]}
        bgImage={S.header.imageUrl || '/assets/co-so-ha-tang.jpg'}
      />

      <section id="contact" className="va-wrap">
        <div className="va-contact" style={{ borderTop: 0 }}>
          <div data-reveal>
            <div className="va-eyebrow">
              {loc === 'vi' ? 'Kênh liên lạc' : loc === 'en' ? 'Channels' : '联系渠道'}
            </div>
            <h2>
              {loc === 'vi'
                ? 'Chọn cách tiện nhất cho bạn'
                : loc === 'en'
                  ? 'Pick the channel that suits you'
                  : '选择您方便的渠道'}
            </h2>

            <div className="va-contact-info">
              {S.quick.items.map((q, i) => (
                <div key={i} className="va-ci-row">
                  <div className="va-ci-i">
                    <Icon name={QUICK_ICON_MAP[q.icon] ?? 'mail'} size={16} />
                  </div>
                  <div>
                    <div className="lbl">{q.label}</div>
                    <div className="val">{q.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {S.social.items.filter((s) => s.enabled).length > 0 ? (
              <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {S.social.items
                  .filter((s) => s.enabled)
                  .map((s, i) => (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: '1px solid var(--va-line, #e5e7eb)',
                        fontSize: 13,
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                    >
                      {s.label}
                    </a>
                  ))}
              </div>
            ) : null}
          </div>
          <ContactForm locale={loc} source="contact_page" />
        </div>

        {S.offices.items.map((o, i) => (
          <div
            key={i}
            style={{
              marginTop: 24,
              marginBottom: i === S.offices.items.length - 1 ? 80 : 24,
              padding: '20px 24px',
              border: '1px solid var(--va-line, #e5e7eb)',
              borderRadius: 12,
              background: '#fff',
            }}
          >
            <h3 style={{ margin: '0 0 12px', fontSize: 18 }}>{o.name}</h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 16,
                fontSize: 14,
                marginBottom: 16,
                color: 'var(--va-text-soft, #4b5563)',
              }}
            >
              {o.addr ? (
                <div>
                  <Icon name="pin" size={14} /> {o.addr}
                </div>
              ) : null}
              {o.phone ? (
                <div>
                  <Icon name="phone" size={14} />{' '}
                  <a href={`tel:${o.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {o.phone}
                  </a>
                </div>
              ) : null}
              {o.email ? (
                <div>
                  <Icon name="mail" size={14} />{' '}
                  <a
                    href={`mailto:${o.email}`}
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    {o.email}
                  </a>
                </div>
              ) : null}
              {o.hours ? (
                <div>
                  <Icon name="check" size={14} /> {o.hours}
                </div>
              ) : null}
            </div>
            {o.mapEmbedUrl ? (
              <div style={{ borderRadius: 8, overflow: 'hidden' }}>
                <iframe
                  title={o.name}
                  src={o.mapEmbedUrl}
                  style={{ width: '100%', height: 320, border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : null}
          </div>
        ))}
      </section>
    </>
  );
}
