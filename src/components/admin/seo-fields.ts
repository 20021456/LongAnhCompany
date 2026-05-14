/**
 * SEO field catalogue — shared between the SEO admin page (Server
 * Component) and SeoForm (Client Component). Kept in a non-`'use client'`
 * module so the server page can import the data without pulling in the
 * client bundle (Next.js forbids importing non-component named exports
 * from a client module into a server component).
 */

export interface SeoFieldDef {
  key: string;
  label: string;
  help?: string;
  localized: boolean;
  type?: 'text' | 'textarea' | 'bool';
}

/** Field catalogue — also defines the order shown in the form. */
export const SEO_FIELDS: SeoFieldDef[] = [
  {
    key: 'seo.meta_title_default',
    label: 'Tiêu đề mặc định',
    help: 'Dùng khi một trang không có tiêu đề SEO riêng.',
    localized: true,
  },
  {
    key: 'seo.meta_desc_default',
    label: 'Mô tả mặc định',
    help: 'Đoạn mô tả hiển thị trên kết quả tìm kiếm (~155 ký tự).',
    localized: true,
    type: 'textarea',
  },
  {
    key: 'seo.keywords',
    label: 'Từ khoá',
    help: 'Phân tách bằng dấu phẩy.',
    localized: true,
  },
  {
    key: 'seo.og_image',
    label: 'Ảnh chia sẻ mặc định (OG image)',
    help: 'URL ảnh hiển thị khi chia sẻ lên mạng xã hội (1200×630).',
    localized: false,
  },
  {
    key: 'seo.canonical_base_url',
    label: 'Tên miền chuẩn (canonical)',
    help: 'VD: https://longanhcorp.com',
    localized: false,
  },
  {
    key: 'seo.twitter_handle',
    label: 'Tài khoản X / Twitter',
    help: 'VD: @longanhcorp',
    localized: false,
  },
  {
    key: 'seo.ga_measurement_id',
    label: 'Google Analytics ID',
    help: 'VD: G-XXXXXXXXXX',
    localized: false,
  },
  {
    key: 'seo.gtm_id',
    label: 'Google Tag Manager ID',
    help: 'VD: GTM-XXXXXXX',
    localized: false,
  },
  {
    key: 'seo.robots_indexable',
    label: 'Cho phép công cụ tìm kiếm lập chỉ mục',
    help: 'Tắt khi site đang chạy thử / chưa công bố.',
    localized: false,
    type: 'bool',
  },
];
