import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Icon } from '@/components/ui/Icon';
import { ContactForm } from '@/components/public/ContactForm';

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const loc = locale as Locale;
  const C = COPY[loc];

  return (
    <>
      <section className="va-hero" style={{ background: 'var(--va-bg-alt)' }}>
        <div
          className="va-wrap"
          style={{ padding: '90px 0', textAlign: 'center', maxWidth: 920, margin: '0 auto' }}
        >
          <div className="va-eyebrow">{C.contactEy}</div>
          <h1 style={{ fontSize: 'clamp(36px,4.4vw,58px)', margin: '16px 0 22px' }}>
            {C.contactH}
          </h1>
          <p className="va-hero-sub" style={{ margin: '0 auto', maxWidth: 680 }}>
            {C.contactP}
          </p>
        </div>
      </section>

      <section id="contact" className="va-wrap">
        <div className="va-contact" style={{ borderTop: 0 }}>
          <div>
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
            <p style={{ opacity: 0.7, fontSize: 15, lineHeight: 1.65 }}>
              {loc === 'vi'
                ? 'Hotline kinh doanh phản hồi trong 24h. Email cho yêu cầu kỹ thuật chi tiết. Form bên cạnh đính kèm spec / COA / yêu cầu báo giá.'
                : loc === 'en'
                  ? 'Sales hotline responds within 24h. Email for detailed technical requests. Form on the right for spec / COA / quote requests.'
                  : '销售热线24小时内回复。技术问题请发邮件。右侧表格用于规格 / COA / 报价请求。'}
            </p>
            <div className="va-contact-info">
              <div className="va-ci-row">
                <div className="va-ci-i">
                  <Icon name="pin" size={16} />
                </div>
                <div>
                  <div className="lbl">
                    {loc === 'vi' ? 'Trụ sở' : loc === 'en' ? 'Headquarters' : '总部'}
                  </div>
                  <div className="val">{C.addr}</div>
                </div>
              </div>
              <div className="va-ci-row">
                <div className="va-ci-i">
                  <Icon name="phone" size={16} />
                </div>
                <div>
                  <div className="lbl">Hotline</div>
                  <div className="val">
                    <a
                      href={`tel:${C.phone[0]}`}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {C.phone[0]}
                    </a>
                    <br />
                    <a
                      href={`tel:${C.phone[1]}`}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {C.phone[1]}
                    </a>
                  </div>
                </div>
              </div>
              <div className="va-ci-row">
                <div className="va-ci-i">
                  <Icon name="mail" size={16} />
                </div>
                <div>
                  <div className="lbl">Email</div>
                  <div className="val">
                    <a href={`mailto:${C.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {C.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ContactForm locale={loc} source="contact_page" />
        </div>

        <div style={{ marginTop: 24, marginBottom: 80, borderRadius: 16, overflow: 'hidden' }}>
          <iframe
            title="Long Anh location"
            src="https://maps.google.com/maps?width=100%25&height=400&hl=en&q=Vinh%20Tan%2C%20Vinh%2C%20Nghe%20An&t=&z=14&ie=UTF8&iwloc=B&output=embed"
            style={{ width: '100%', height: 400, border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
