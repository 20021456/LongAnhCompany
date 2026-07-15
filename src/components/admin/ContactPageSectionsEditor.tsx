'use client';

import { AdminIcon } from './AdminIcon';
import { Field } from './FormBits';
import { PeImg } from './PeImg';
import { EditorSection, type Lang } from './EditorChrome';
import {
  CONTACT_PAGE_SECTION_KEYS,
  type ContactPageSections,
  type ContactPageSectionKey,
  type ContactPageSectionsLocale,
  type ContactQuickChannelIcon,
  type ContactFormFieldType,
} from '@/lib/contact-page-content';

/**
 * 5-section editor for the contact page (`/admin/pages/contact`).
 *
 * Ported from the prototype admin/page-edit-contact.html:
 *   01 Header  — eyebrow + title + sub
 *   02 Quick   — 3 quick contact channels (icon + label + value)
 *   03 Offices — N office cards (name + addr + phone + email + hours + mapEmbedUrl)
 *   04 Form    — recipientEmail + ccEmail + successMessage + N fields + recaptcha
 *   05 Social  — 6 platforms (toggle + URL)
 */
export function ContactPageSectionsEditor({
  sections,
  lang,
  onPatch,
}: {
  sections: ContactPageSections;
  lang: Lang;
  onPatch: (key: ContactPageSectionKey, patch: Record<string, unknown>) => void;
}) {
  const C: ContactPageSectionsLocale = sections[lang];
  const L = lang.toUpperCase();

  let n = 0;
  const next = () => String(++n).padStart(2, '0');

  return (
    <>
      {/* 01 — HEADER */}
      <EditorSection
        num={next()}
        icon="layers"
        title="Page header — Banner trang"
        sub="Eyebrow, tiêu đề, mô tả cho trang Liên hệ"
      >
        <div className="pe-row">
          <Field label={`Eyebrow (${L})`}>
            <input
              className="lac-input"
              value={C.header.eyebrow}
              onChange={(e) => onPatch('header', { eyebrow: e.target.value })}
            />
          </Field>
          <Field label={`Tiêu đề chính (${L})`} required={lang === 'vi'}>
            <input
              className="lac-input"
              value={C.header.title}
              onChange={(e) => onPatch('header', { title: e.target.value })}
              required={lang === 'vi'}
            />
          </Field>
        </div>
        <Field label={`Mô tả ngắn (${L})`}>
          <textarea
            className="lac-textarea"
            value={C.header.sub}
            onChange={(e) => onPatch('header', { sub: e.target.value })}
          />
        </Field>
        <div className="pe-imgrow" style={{ marginTop: 8 }}>
          <PeImg
            src={C.header.imageUrl ?? ''}
            alt=""
            size={C.header.imageUrl ? 'Ảnh nền hero' : undefined}
            onChange={(dataUrl) => onPatch('header', { imageUrl: dataUrl })}
          />
          <div className="pe-stack">
            <Field label="Đường dẫn ảnh nền hero">
              <input
                className="lac-input"
                value={C.header.imageUrl ?? ''}
                spellCheck={false}
                style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 12 }}
                onChange={(e) => onPatch('header', { imageUrl: e.target.value })}
              />
            </Field>
          </div>
        </div>
      </EditorSection>

      {/* 02 — QUICK CONTACT */}
      <EditorSection
        num={next()}
        icon="bell"
        title="Phương thức liên hệ nhanh"
        sub="Hotline, email, chat — hiển thị thành các thẻ ngang"
      >
        <div className="pe-row three">
          {C.quick.items.map((channel, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                border: '1px solid var(--ad-line)',
                borderRadius: 8,
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--ad-text-mute)',
                  letterSpacing: '.05em',
                }}
              >
                KÊNH 0{i + 1}
              </span>
              <select
                className="lac-select"
                value={channel.icon}
                onChange={(e) => {
                  const items = [...C.quick.items];
                  items[i] = { ...channel, icon: e.target.value as ContactQuickChannelIcon };
                  onPatch('quick', { items });
                }}
              >
                <option value="chat">💬 Chat / Hotline</option>
                <option value="mail">✉ Email</option>
                <option value="globe">🌐 Zalo / WhatsApp</option>
                <option value="phone">📞 Phone</option>
              </select>
              <input
                className="lac-input"
                style={{ fontSize: 13 }}
                placeholder={`Nhãn kênh (${L})`}
                value={channel.label}
                onChange={(e) => {
                  const items = [...C.quick.items];
                  items[i] = { ...channel, label: e.target.value };
                  onPatch('quick', { items });
                }}
              />
              <input
                className="lac-input"
                style={{ fontWeight: 600 }}
                placeholder="Giá trị (SĐT / email)"
                value={channel.value}
                onChange={(e) => {
                  const items = [...C.quick.items];
                  items[i] = { ...channel, value: e.target.value };
                  onPatch('quick', { items });
                }}
              />
            </div>
          ))}
        </div>
      </EditorSection>

      {/* 03 — OFFICES */}
      <EditorSection
        num={next()}
        icon="globe"
        title="Văn phòng & Kho"
        sub={`${C.offices.items.length} điểm liên hệ trên toàn quốc`}
      >
        <div className="pe-card-grid">
          {C.offices.items.map((office, i) => (
            <div key={i} className="pe-card-edit">
              <div className="head">
                <span className="pill">CS {String(i + 1).padStart(2, '0')}</span>
                <div className="name">{office.name || `Cơ sở ${i + 1}`}</div>
                <button
                  type="button"
                  title="Xoá"
                  onClick={() => {
                    const items = C.offices.items.filter((_, j) => j !== i);
                    onPatch('offices', { items });
                  }}
                >
                  <AdminIcon name="trash" size={13} />
                </button>
              </div>
              <div className="pe-row">
                <Field label={`Tên cơ sở (${L})`}>
                  <input
                    className="lac-input"
                    value={office.name}
                    onChange={(e) => {
                      const items = [...C.offices.items];
                      items[i] = { ...office, name: e.target.value };
                      onPatch('offices', { items });
                    }}
                  />
                </Field>
                <Field label={`Giờ làm việc (${L})`}>
                  <input
                    className="lac-input"
                    value={office.hours}
                    onChange={(e) => {
                      const items = [...C.offices.items];
                      items[i] = { ...office, hours: e.target.value };
                      onPatch('offices', { items });
                    }}
                  />
                </Field>
              </div>
              <Field label={`Địa chỉ (${L})`}>
                <input
                  className="lac-input"
                  value={office.addr}
                  onChange={(e) => {
                    const items = [...C.offices.items];
                    items[i] = { ...office, addr: e.target.value };
                    onPatch('offices', { items });
                  }}
                />
              </Field>
              <div className="pe-row">
                <Field label="Điện thoại">
                  <input
                    className="lac-input"
                    value={office.phone}
                    spellCheck={false}
                    style={{
                      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                      fontSize: 12.5,
                    }}
                    onChange={(e) => {
                      const items = [...C.offices.items];
                      items[i] = { ...office, phone: e.target.value };
                      onPatch('offices', { items });
                    }}
                  />
                </Field>
                <Field label="Email">
                  <input
                    className="lac-input"
                    value={office.email}
                    spellCheck={false}
                    style={{
                      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                      fontSize: 12.5,
                    }}
                    onChange={(e) => {
                      const items = [...C.offices.items];
                      items[i] = { ...office, email: e.target.value };
                      onPatch('offices', { items });
                    }}
                  />
                </Field>
              </div>
              <Field label="Google Maps embed (URL)">
                <input
                  className="lac-input"
                  placeholder="https://www.google.com/maps/embed?pb=…"
                  value={office.mapEmbedUrl}
                  spellCheck={false}
                  style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 12 }}
                  onChange={(e) => {
                    const items = [...C.offices.items];
                    items[i] = { ...office, mapEmbedUrl: e.target.value };
                    onPatch('offices', { items });
                  }}
                />
              </Field>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="lac-btn sm"
          style={{ width: 'fit-content', marginTop: 10 }}
          onClick={() =>
            onPatch('offices', {
              items: [
                ...C.offices.items,
                {
                  name: '',
                  addr: '',
                  phone: '',
                  email: '',
                  hours: '',
                  mapEmbedUrl: '',
                },
              ],
            })
          }
        >
          <AdminIcon name="plus" size={13} /> Thêm cơ sở
        </button>
      </EditorSection>

      {/* 04 — FORM */}
      <EditorSection
        num={next()}
        icon="edit"
        title="Form liên hệ"
        sub="Cấu hình các trường, validation và email nhận"
      >
        <div className="pe-row">
          <Field label="Email nhận liên hệ" required={lang === 'vi'}>
            <input
              className="lac-input"
              type="email"
              value={C.form.recipientEmail}
              spellCheck={false}
              style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 12.5 }}
              onChange={(e) => onPatch('form', { recipientEmail: e.target.value })}
            />
          </Field>
          <Field label="Email CC (nội bộ)">
            <input
              className="lac-input"
              type="email"
              value={C.form.ccEmail}
              spellCheck={false}
              style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 12.5 }}
              onChange={(e) => onPatch('form', { ccEmail: e.target.value })}
            />
          </Field>
        </div>
        <Field label={`Thông báo sau khi gửi (success message — ${L})`}>
          <textarea
            className="lac-textarea"
            value={C.form.successMessage}
            onChange={(e) => onPatch('form', { successMessage: e.target.value })}
          />
        </Field>

        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--ad-text-mute)',
            letterSpacing: '.05em',
            textTransform: 'uppercase',
            marginTop: 6,
          }}
        >
          Trường của form ({C.form.fields.length})
        </div>
        <div className="pe-list">
          {C.form.fields.map((f, i) => (
            <div key={i} className="pe-list-item">
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr auto',
                  gap: 10,
                  alignItems: 'center',
                }}
              >
                <input
                  className="lac-input"
                  placeholder={`Nhãn (${L})`}
                  value={f.label}
                  onChange={(e) => {
                    const fields = [...C.form.fields];
                    fields[i] = { ...f, label: e.target.value };
                    onPatch('form', { fields });
                  }}
                />
                <input
                  className="lac-input"
                  placeholder="Tên trường (key)"
                  value={f.key}
                  spellCheck={false}
                  style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 12 }}
                  onChange={(e) => {
                    const fields = [...C.form.fields];
                    fields[i] = { ...f, key: e.target.value };
                    onPatch('form', { fields });
                  }}
                />
                <select
                  className="lac-select"
                  value={f.type}
                  onChange={(e) => {
                    const fields = [...C.form.fields];
                    fields[i] = { ...f, type: e.target.value as ContactFormFieldType };
                    onPatch('form', { fields });
                  }}
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="tel">Phone</option>
                  <option value="select">Select</option>
                  <option value="textarea">Textarea</option>
                </select>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12.5,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={f.required}
                    onChange={(e) => {
                      const fields = [...C.form.fields];
                      fields[i] = { ...f, required: e.target.checked };
                      onPatch('form', { fields });
                    }}
                  />
                  Bắt buộc
                </label>
              </div>
              <div className="actions">
                <button
                  type="button"
                  title="Xoá"
                  onClick={() => {
                    const fields = C.form.fields.filter((_, j) => j !== i);
                    onPatch('form', { fields });
                  }}
                >
                  <AdminIcon name="trash" size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="lac-btn sm"
          style={{ width: 'fit-content', marginTop: 10 }}
          onClick={() =>
            onPatch('form', {
              fields: [...C.form.fields, { key: '', label: '', type: 'text', required: false }],
            })
          }
        >
          <AdminIcon name="plus" size={13} /> Thêm trường
        </button>

        <Field label="Hiển thị reCAPTCHA">
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              paddingTop: 4,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={C.form.recaptchaEnabled}
              onChange={(e) => onPatch('form', { recaptchaEnabled: e.target.checked })}
            />
            <span style={{ color: 'var(--ad-text-mute)', fontSize: 12.5 }}>
              {C.form.recaptchaEnabled
                ? 'Chống spam — phiên bản v3 (vô hình)'
                : 'Tắt (không khuyến nghị)'}
            </span>
          </label>
        </Field>
      </EditorSection>

      {/* 05 — SOCIAL */}
      <EditorSection
        num={next()}
        icon="chat"
        title="Mạng xã hội & nền tảng B2B"
        sub="Liên kết Facebook, LinkedIn, Alibaba, Made-in-China…"
        defaultOpen={false}
      >
        <div className="pe-list">
          {C.social.items.map((s, i) => (
            <div key={i} className="pe-list-item">
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr auto',
                  gap: 10,
                  alignItems: 'center',
                }}
              >
                <input
                  className="lac-input"
                  placeholder={`Tên hiển thị (${L})`}
                  value={s.label}
                  onChange={(e) => {
                    const items = [...C.social.items];
                    items[i] = { ...s, label: e.target.value };
                    onPatch('social', { items });
                  }}
                />
                <input
                  className="lac-input"
                  placeholder={`https://… (URL ${s.platform})`}
                  value={s.url}
                  spellCheck={false}
                  style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 12 }}
                  onChange={(e) => {
                    const items = [...C.social.items];
                    items[i] = { ...s, url: e.target.value };
                    onPatch('social', { items });
                  }}
                />
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12.5,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={s.enabled}
                    onChange={(e) => {
                      const items = [...C.social.items];
                      items[i] = { ...s, enabled: e.target.checked };
                      onPatch('social', { items });
                    }}
                  />
                  Hiển thị
                </label>
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ad-text-mute)', marginTop: 6 }}>
          Các nền tảng cố định theo prototype — bỏ trống URL hoặc tắt &quot;Hiển thị&quot; để ẩn.
        </div>
      </EditorSection>
    </>
  );
}

/** Convert per-locale state into the `sections` payload for savePage. */
export function contactPageSectionsToPayload(s: ContactPageSections) {
  const out: Record<string, { vi: unknown; en: unknown; zh: unknown }> = {};
  for (const key of CONTACT_PAGE_SECTION_KEYS) {
    out[key] = { vi: s.vi[key], en: s.en[key], zh: s.zh[key] };
  }
  return out;
}
