/**
 * Contact page section content — the editable CMS model for
 * `/admin/pages/contact`. Mirrors the home / about / products / careers /
 * news editors so all six share the `page_sections` persistence shape
 * (`{ vi, en, zh }` JSON per sectionKey).
 *
 * 5 sections, matching admin/page-edit-contact.html in the prototype:
 *   header   — eyebrow + main title + sub
 *   quick    — 3 quick-contact channel cards (icon + label + value)
 *   offices  — N office/warehouse cards (name, addr, phone, email, hours, mapEmbedUrl)
 *   form     — recipientEmail + ccEmail + successMessage + N form fields + recaptcha
 *   social   — 6 social/B2B platform rows (show toggle + URL)
 *
 * (SEO is handled by the page-level meta fields, not a section.)
 */

import type { Locale } from './i18n/config';

// ─── Per-section shapes ───────────────────────────────────────────────────

export interface ContactHeaderSection {
  eyebrow: string;
  title: string;
  sub: string;
  /** Hero banner background photo. */
  imageUrl?: string;
}

export type ContactQuickChannelIcon = 'chat' | 'mail' | 'globe' | 'phone';
export interface ContactQuickChannel {
  /** Which icon to render on the channel card. */
  icon: ContactQuickChannelIcon;
  /** Locale-aware label, e.g. "Hotline kinh doanh". */
  label: string;
  /** The actual phone number / email — locale-independent in practice but
   *  per-locale to allow region-specific numbers. */
  value: string;
}
export interface ContactQuickSection {
  items: ContactQuickChannel[];
}

export interface ContactOffice {
  /** "Trụ sở chính", "Nhà máy Quỳ Hợp", … */
  name: string;
  /** Full street address. */
  addr: string;
  phone: string;
  email: string;
  /** "T2–T7 · 8:00–17:30". */
  hours: string;
  /** Google Maps iframe `src` URL. */
  mapEmbedUrl: string;
}
export interface ContactOfficesSection {
  items: ContactOffice[];
}

export type ContactFormFieldType = 'text' | 'email' | 'tel' | 'select' | 'textarea';
export interface ContactFormField {
  /** Internal slug — `name`, `email`, `message`. Locale-independent. */
  key: string;
  /** Displayed label, locale-aware. */
  label: string;
  type: ContactFormFieldType;
  required: boolean;
}
export interface ContactFormSection {
  /** Inbox that receives form submissions. */
  recipientEmail: string;
  /** Optional CC. */
  ccEmail: string;
  /** Shown to the visitor after a successful submit, locale-aware. */
  successMessage: string;
  fields: ContactFormField[];
  recaptchaEnabled: boolean;
}

export type ContactSocialPlatform =
  | 'facebook'
  | 'linkedin'
  | 'twitter'
  | 'zalo'
  | 'alibaba'
  | 'youtube';
export interface ContactSocialItem {
  platform: ContactSocialPlatform;
  /** "Facebook", "LinkedIn"… locale-aware (e.g. zh: "脸书"). */
  label: string;
  url: string;
  enabled: boolean;
}
export interface ContactSocialSection {
  items: ContactSocialItem[];
}

export interface ContactPageSectionsLocale {
  header: ContactHeaderSection;
  quick: ContactQuickSection;
  offices: ContactOfficesSection;
  form: ContactFormSection;
  social: ContactSocialSection;
}

export type ContactPageSections = Record<Locale, ContactPageSectionsLocale>;

export const CONTACT_PAGE_SECTION_KEYS = ['header', 'quick', 'offices', 'form', 'social'] as const;
export type ContactPageSectionKey = (typeof CONTACT_PAGE_SECTION_KEYS)[number];

// ─── Default content (per locale) ─────────────────────────────────────────

const HEADER: Record<Locale, ContactHeaderSection> = {
  vi: {
    eyebrow: 'Liên hệ với Long Anh',
    title: 'Cần báo giá hoặc tư vấn kỹ thuật?',
    sub: 'Đội ngũ kinh doanh của chúng tôi sẽ phản hồi trong vòng 4 giờ làm việc — kèm spec, COA và báo giá FOB chi tiết.',
    imageUrl: '/assets/co-so-ha-tang.jpg',
  },
  en: {
    eyebrow: 'Contact Long Anh',
    title: 'Need a quote or technical consultation?',
    sub: 'Our sales team replies within 4 business hours — with spec sheets, COA and a detailed FOB quote.',
    imageUrl: '/assets/co-so-ha-tang.jpg',
  },
  zh: {
    eyebrow: '联系龙英',
    title: '需要报价或技术咨询?',
    sub: '我们的销售团队将在 4 个工作小时内回复 — 附带规格表、COA 和详细的 FOB 报价。',
    imageUrl: '/assets/co-so-ha-tang.jpg',
  },
};

const QUICK: Record<Locale, ContactQuickSection> = {
  vi: {
    items: [
      { icon: 'chat', label: 'Hotline kinh doanh', value: '(+84) 912 779 799' },
      { icon: 'mail', label: 'Email chính', value: 'info@longanhcorp.com' },
      { icon: 'globe', label: 'Zalo / WhatsApp', value: '(+84) 912 779 799' },
    ],
  },
  en: {
    items: [
      { icon: 'chat', label: 'Sales hotline', value: '(+84) 912 779 799' },
      { icon: 'mail', label: 'Primary email', value: 'info@longanhcorp.com' },
      { icon: 'globe', label: 'Zalo / WhatsApp', value: '(+84) 912 779 799' },
    ],
  },
  zh: {
    items: [
      { icon: 'chat', label: '销售热线', value: '(+84) 912 779 799' },
      { icon: 'mail', label: '主要邮箱', value: 'info@longanhcorp.com' },
      { icon: 'globe', label: 'Zalo / WhatsApp', value: '(+84) 912 779 799' },
    ],
  },
};

const OFFICES: Record<Locale, ContactOfficesSection> = {
  vi: {
    items: [
      {
        name: 'Trụ sở chính',
        addr: 'Số D1-22, Đường 2K, Khu Đô Thị Cửa Tiền, P. Vinh Tân, TP. Vinh, Nghệ An',
        phone: '(+84) 912 779 799',
        email: 'info@longanhcorp.com',
        hours: 'T2–T7 · 8:00–17:30',
        mapEmbedUrl: '',
      },
      {
        name: 'Phòng Kinh doanh',
        addr: 'Số D1-22, Đường 2K, Khu Đô Thị Cửa Tiền, P. Vinh Tân, TP. Vinh, Nghệ An',
        phone: '(+84-2383) 982 555',
        email: 'sales@longanhcorp.com',
        hours: 'T2–T6 · 8:30–17:30',
        mapEmbedUrl: '',
      },
      {
        name: 'Nhà máy Quỳ Hợp',
        addr: 'Khu CN Quỳ Hợp, Huyện Quỳ Hợp, Nghệ An',
        phone: '(+84-2383) 982 555',
        email: 'plant@longanhcorp.com',
        hours: 'T2–T7 · 7:00–17:00',
        mapEmbedUrl: '',
      },
    ],
  },
  en: {
    items: [
      {
        name: 'Headquarters',
        addr: 'D1-22, Road 2K, Cua Tien Urban Area, Vinh Tan Ward, Vinh City, Nghe An',
        phone: '(+84) 912 779 799',
        email: 'info@longanhcorp.com',
        hours: 'Mon–Sat · 8:00–17:30',
        mapEmbedUrl: '',
      },
      {
        name: 'Sales Office',
        addr: 'D1-22, Road 2K, Cua Tien Urban Area, Vinh Tan Ward, Vinh City, Nghe An',
        phone: '(+84-2383) 982 555',
        email: 'sales@longanhcorp.com',
        hours: 'Mon–Fri · 8:30–17:30',
        mapEmbedUrl: '',
      },
      {
        name: 'Quy Hop Plant',
        addr: 'Quy Hop Industrial Zone, Quy Hop District, Nghe An',
        phone: '(+84-2383) 982 555',
        email: 'plant@longanhcorp.com',
        hours: 'Mon–Sat · 7:00–17:00',
        mapEmbedUrl: '',
      },
    ],
  },
  zh: {
    items: [
      {
        name: '总部',
        addr: '义安省荣市荣新坊古田都市区 2K 路 D1-22 号',
        phone: '(+84) 912 779 799',
        email: 'info@longanhcorp.com',
        hours: '周一至周六 · 8:00–17:30',
        mapEmbedUrl: '',
      },
      {
        name: '销售办公室',
        addr: '义安省荣市荣新坊古田都市区 2K 路 D1-22 号',
        phone: '(+84-2383) 982 555',
        email: 'sales@longanhcorp.com',
        hours: '周一至周五 · 8:30–17:30',
        mapEmbedUrl: '',
      },
      {
        name: '葵合工厂',
        addr: '义安省葵合县葵合工业区',
        phone: '(+84-2383) 982 555',
        email: 'plant@longanhcorp.com',
        hours: '周一至周六 · 7:00–17:00',
        mapEmbedUrl: '',
      },
    ],
  },
};

const FORM_FIELDS_VI: ContactFormField[] = [
  { key: 'name', label: 'Họ tên', type: 'text', required: true },
  { key: 'company', label: 'Công ty', type: 'text', required: false },
  { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'phone', label: 'Điện thoại', type: 'tel', required: false },
  { key: 'product', label: 'Quan tâm sản phẩm', type: 'select', required: false },
  { key: 'message', label: 'Nội dung yêu cầu', type: 'textarea', required: true },
];
const FORM_FIELDS_EN: ContactFormField[] = [
  { key: 'name', label: 'Full name', type: 'text', required: true },
  { key: 'company', label: 'Company', type: 'text', required: false },
  { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'phone', label: 'Phone', type: 'tel', required: false },
  { key: 'product', label: 'Product of interest', type: 'select', required: false },
  { key: 'message', label: 'Message', type: 'textarea', required: true },
];
const FORM_FIELDS_ZH: ContactFormField[] = [
  { key: 'name', label: '姓名', type: 'text', required: true },
  { key: 'company', label: '公司', type: 'text', required: false },
  { key: 'email', label: '邮箱', type: 'email', required: true },
  { key: 'phone', label: '电话', type: 'tel', required: false },
  { key: 'product', label: '感兴趣的产品', type: 'select', required: false },
  { key: 'message', label: '留言内容', type: 'textarea', required: true },
];

const FORM: Record<Locale, ContactFormSection> = {
  vi: {
    recipientEmail: 'info@longanhcorp.com',
    ccEmail: 'sales@longanhcorp.com',
    successMessage:
      'Cảm ơn bạn đã liên hệ. Đội ngũ Long Anh sẽ phản hồi trong vòng 4 giờ làm việc.',
    fields: FORM_FIELDS_VI,
    recaptchaEnabled: true,
  },
  en: {
    recipientEmail: 'info@longanhcorp.com',
    ccEmail: 'sales@longanhcorp.com',
    successMessage:
      'Thank you for reaching out. The Long Anh team will reply within 4 business hours.',
    fields: FORM_FIELDS_EN,
    recaptchaEnabled: true,
  },
  zh: {
    recipientEmail: 'info@longanhcorp.com',
    ccEmail: 'sales@longanhcorp.com',
    successMessage: '感谢您的联系。龙英团队将在 4 个工作小时内回复您。',
    fields: FORM_FIELDS_ZH,
    recaptchaEnabled: true,
  },
};

const SOCIAL_SEED: { platform: ContactSocialPlatform; url: string }[] = [
  { platform: 'facebook', url: 'https://www.facebook.com/longanhcorp' },
  { platform: 'linkedin', url: 'https://www.linkedin.com/company/longanhcorp' },
  { platform: 'twitter', url: 'https://twitter.com/longanhcorp' },
  { platform: 'zalo', url: 'https://zalo.me/longanhcorp' },
  { platform: 'alibaba', url: '' },
  { platform: 'youtube', url: '' },
];

const SOCIAL_LABEL: Record<ContactSocialPlatform, Record<Locale, string>> = {
  facebook: { vi: 'Facebook', en: 'Facebook', zh: '脸书' },
  linkedin: { vi: 'LinkedIn', en: 'LinkedIn', zh: '领英' },
  twitter: { vi: 'Twitter / X', en: 'Twitter / X', zh: '推特' },
  zalo: { vi: 'Zalo OA', en: 'Zalo OA', zh: 'Zalo' },
  alibaba: { vi: 'Alibaba', en: 'Alibaba', zh: '阿里巴巴' },
  youtube: { vi: 'YouTube', en: 'YouTube', zh: 'YouTube' },
};

function makeSocial(locale: Locale): ContactSocialSection {
  return {
    items: SOCIAL_SEED.map((s) => ({
      platform: s.platform,
      label: SOCIAL_LABEL[s.platform][locale],
      url: s.url,
      enabled: !!s.url,
    })),
  };
}

export function contactPageDefaults(locale: Locale): ContactPageSectionsLocale {
  return {
    header: HEADER[locale],
    quick: { items: QUICK[locale].items.map((i) => ({ ...i })) },
    offices: { items: OFFICES[locale].items.map((o) => ({ ...o })) },
    form: { ...FORM[locale], fields: FORM[locale].fields.map((f) => ({ ...f })) },
    social: makeSocial(locale),
  };
}
