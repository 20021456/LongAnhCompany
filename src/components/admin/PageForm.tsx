'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminIcon } from './AdminIcon';
import { AdminPageHead } from './AdminPageHead';
import { Field } from './FormBits';
import { LangTabs, EditorSection, StatusRadioGroup, type Lang } from './EditorChrome';
import { savePage, type PageInput, type ActionResult } from '@/app/admin/(panel)/pages/actions';
import { HOME_SECTION_KEYS, type HomeSections, type HomeSectionKey } from '@/lib/home-content';

export interface PageFormValue {
  key: string;
  titleVi: string;
  titleEn: string;
  titleZh: string;
  metaTitleVi: string;
  metaTitleEn: string;
  metaTitleZh: string;
  metaDescVi: string;
  metaDescEn: string;
  metaDescZh: string;
  ogImageUrl: string;
  isPublished: boolean;
}

const SUF: Record<Lang, string> = { vi: 'Vi', en: 'En', zh: 'Zh' };

/** Transpose `{ vi:{...sections}, en, zh }` → `{ sectionKey: { vi, en, zh } }`. */
function toSectionsPayload(s: HomeSections) {
  const out: Record<string, { vi: unknown; en: unknown; zh: unknown }> = {};
  for (const key of HOME_SECTION_KEYS) {
    out[key] = { vi: s.vi[key], en: s.en[key], zh: s.zh[key] };
  }
  return out;
}

export function PageForm({
  initial,
  label,
  path,
  initialSections,
}: {
  initial: PageFormValue;
  label: string;
  path: string;
  /** Present only for the home page — the full editable section content. */
  initialSections?: HomeSections;
}) {
  const router = useRouter();
  const [v, setV] = useState<PageFormValue>(initial);
  const [sections, setSections] = useState<HomeSections | null>(initialSections ?? null);
  const [lang, setLang] = useState<Lang>('vi');
  const [state, setState] = useState<ActionResult | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof PageFormValue>(k: K, val: PageFormValue[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  const fk = (base: string): keyof PageFormValue => (base + SUF[lang]) as keyof PageFormValue;

  /** Shallow-merge a patch into one section of the current locale. */
  const patch = (key: HomeSectionKey, p: Record<string, unknown>) =>
    setSections((s) => {
      if (!s) return s;
      const cur = s[lang][key] as unknown as Record<string, unknown>;
      return {
        ...s,
        [lang]: { ...s[lang], [key]: { ...cur, ...p } },
      } as HomeSections;
    });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setState(null);
    const res = await savePage({
      ...v,
      sections: sections ? toSectionsPayload(sections) : undefined,
    } as unknown as PageInput);
    setBusy(false);
    setState(res);
    if (res.ok) {
      router.push('/admin/pages');
      router.refresh();
    }
  }

  const titleKey = fk('title');
  const metaTitleKey = fk('metaTitle');
  const metaDescKey = fk('metaDesc');
  const previewTitle = (v[metaTitleKey] as string) || (v[titleKey] as string) || label;
  const previewDesc = (v[metaDescKey] as string) || '— chưa có mô tả —';

  const C = sections?.[lang];
  const L = lang.toUpperCase();

  // Dynamic section numbering.
  let n = 0;
  const next = () => String(++n).padStart(2, '0');

  return (
    <form onSubmit={onSubmit}>
      <AdminPageHead
        crumbs={[{ label: 'Trang', href: '/admin/pages' }, { label }]}
        title={`Sửa trang — ${label}`}
        sub={path}
        actions={
          <>
            <a href={path} target="_blank" rel="noreferrer" className="ad-btn">
              <AdminIcon name="eye" size={14} /> Xem website
            </a>
            <button type="submit" className="ad-btn primary" disabled={busy}>
              <AdminIcon name="check" size={15} />
              {busy ? 'Đang lưu…' : 'Lưu & Xuất bản'}
            </button>
          </>
        }
      />

      {state?.error ? (
        <div className="lg-err" style={{ marginBottom: 16 }}>
          <AdminIcon name="shield" size={14} />
          {state.error}
        </div>
      ) : null}

      <LangTabs lang={lang} setLang={setLang} />

      <div className="pe-grid">
        <div className="pe-main">
          {C ? (
            <>
              {/* 01 — HERO */}
              <EditorSection
                num={next()}
                icon="layers"
                title="Hero — Banner đầu trang"
                sub="Eyebrow, tiêu đề 2 dòng, mô tả, 2 nút CTA và ảnh hero"
              >
                <Field label={`Eyebrow — chữ cam nhỏ phía trên (${L})`}>
                  <input
                    className="ad-input"
                    value={C.hero.eyebrow}
                    onChange={(e) => patch('hero', { eyebrow: e.target.value })}
                  />
                </Field>
                <div className="pe-row">
                  <Field label={`Tiêu đề dòng 1 — đen (${L})`}>
                    <input
                      className="ad-input"
                      value={C.hero.titleLine1}
                      onChange={(e) => patch('hero', { titleLine1: e.target.value })}
                    />
                  </Field>
                  <Field label={`Tiêu đề dòng 2 — cam (${L})`}>
                    <input
                      className="ad-input"
                      value={C.hero.titleLine2}
                      onChange={(e) => patch('hero', { titleLine2: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label={`Mô tả ngắn dưới tiêu đề (${L})`}>
                  <textarea
                    className="ad-textarea"
                    value={C.hero.sub}
                    onChange={(e) => patch('hero', { sub: e.target.value })}
                  />
                </Field>
                <div className="pe-row">
                  <Field label={`Nút chính — chữ (${L})`} help="Liên kết tới trang Sản phẩm.">
                    <input
                      className="ad-input"
                      value={C.hero.ctaPrimary}
                      onChange={(e) => patch('hero', { ctaPrimary: e.target.value })}
                    />
                  </Field>
                  <Field label={`Nút phụ — chữ (${L})`} help="Liên kết tới trang Liên hệ.">
                    <input
                      className="ad-input"
                      value={C.hero.ctaSecondary}
                      onChange={(e) => patch('hero', { ctaSecondary: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="pe-row">
                  <Field label="Ảnh hero (đường dẫn)">
                    <input
                      className="ad-input"
                      value={C.hero.imageUrl}
                      onChange={(e) => patch('hero', { imageUrl: e.target.value })}
                      placeholder="/assets/hero-sw.png"
                    />
                  </Field>
                  <Field
                    label={`Mô tả ảnh — alt (${L})`}
                    help="Quan trọng cho SEO & screen readers."
                  >
                    <input
                      className="ad-input"
                      value={C.hero.imageAlt}
                      onChange={(e) => patch('hero', { imageAlt: e.target.value })}
                    />
                  </Field>
                </div>
                {C.hero.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={C.hero.imageUrl}
                    alt=""
                    style={{
                      width: 200,
                      borderRadius: 6,
                      border: '1px solid var(--ad-line)',
                    }}
                  />
                ) : null}
              </EditorSection>

              {/* 02 — STATS */}
              <EditorSection
                num={next()}
                icon="trend"
                title="Stats — Dải 4 con số"
                sub="Năm kinh nghiệm, công suất, quốc gia xuất khẩu, số mỏ"
              >
                <div className="pe-row">
                  {C.stats.items.map((s, i) => (
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
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ad-text-mute)' }}>
                        STAT {i + 1}
                      </span>
                      <input
                        className="ad-input"
                        style={{ fontWeight: 700, fontSize: 18 }}
                        value={s.value}
                        onChange={(e) => {
                          const items = [...C.stats.items];
                          items[i] = { ...items[i], value: e.target.value };
                          patch('stats', { items });
                        }}
                      />
                      <input
                        className="ad-input"
                        style={{ fontSize: 12 }}
                        value={s.label}
                        onChange={(e) => {
                          const items = [...C.stats.items];
                          items[i] = { ...items[i], label: e.target.value };
                          patch('stats', { items });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </EditorSection>

              {/* 03 — PRODUCTS */}
              <EditorSection
                num={next()}
                icon="rock"
                title="Sản phẩm — Năm dòng chính"
                sub="Tiêu đề khối carousel sản phẩm dưới hero"
              >
                <div className="pe-row">
                  <Field label={`Eyebrow (${L})`}>
                    <input
                      className="ad-input"
                      value={C.products.eyebrow}
                      onChange={(e) => patch('products', { eyebrow: e.target.value })}
                    />
                  </Field>
                  <Field label={`Tiêu đề (${L})`}>
                    <input
                      className="ad-input"
                      value={C.products.title}
                      onChange={(e) => patch('products', { title: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label={`Phụ đề (${L})`}>
                  <textarea
                    className="ad-textarea"
                    value={C.products.sub}
                    onChange={(e) => patch('products', { sub: e.target.value })}
                  />
                </Field>
                <div style={{ fontSize: 12.5, color: 'var(--ad-text-mute)' }}>
                  Danh sách sản phẩm trong carousel lấy tự động từ catalogue — quản lý ở{' '}
                  <strong>Sản phẩm</strong>.
                </div>
              </EditorSection>

              {/* 04 — ABOUT */}
              <EditorSection
                num={next()}
                icon="grid"
                title="Về Long Anh — Lưới 5 ô năng lực"
                sub="Eyebrow, tiêu đề, intro và các thẻ năng lực"
              >
                <div className="pe-row">
                  <Field label={`Eyebrow (${L})`}>
                    <input
                      className="ad-input"
                      value={C.about.eyebrow}
                      onChange={(e) => patch('about', { eyebrow: e.target.value })}
                    />
                  </Field>
                  <Field label={`Tiêu đề (${L})`}>
                    <input
                      className="ad-input"
                      value={C.about.title}
                      onChange={(e) => patch('about', { title: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label={`Đoạn intro (${L})`}>
                  <textarea
                    className="ad-textarea"
                    value={C.about.intro}
                    onChange={(e) => patch('about', { intro: e.target.value })}
                  />
                </Field>
                {C.about.cards.map((card, i) => (
                  <div
                    key={i}
                    style={{
                      border: '1px solid var(--ad-line)',
                      borderRadius: 8,
                      padding: 12,
                      background: '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="ad-code">CARD {String(i + 1).padStart(2, '0')}</span>
                      <div style={{ flex: 1 }} />
                      <button
                        type="button"
                        className="ad-btn sm ghost danger"
                        onClick={() =>
                          patch('about', { cards: C.about.cards.filter((_, j) => j !== i) })
                        }
                      >
                        <AdminIcon name="trash" size={13} />
                      </button>
                    </div>
                    <div className="pe-row">
                      <Field label={`Tên card (${L})`}>
                        <input
                          className="ad-input"
                          value={card.name}
                          onChange={(e) => {
                            const cards = [...C.about.cards];
                            cards[i] = { ...cards[i], name: e.target.value };
                            patch('about', { cards });
                          }}
                        />
                      </Field>
                      <Field label="Ảnh nền (đường dẫn)">
                        <input
                          className="ad-input"
                          value={card.imageUrl}
                          onChange={(e) => {
                            const cards = [...C.about.cards];
                            cards[i] = { ...cards[i], imageUrl: e.target.value };
                            patch('about', { cards });
                          }}
                        />
                      </Field>
                    </div>
                    <Field label={`Mô tả (${L})`}>
                      <textarea
                        className="ad-textarea"
                        value={card.body}
                        onChange={(e) => {
                          const cards = [...C.about.cards];
                          cards[i] = { ...cards[i], body: e.target.value };
                          patch('about', { cards });
                        }}
                      />
                    </Field>
                  </div>
                ))}
                <button
                  type="button"
                  className="ad-btn sm"
                  style={{ width: 'fit-content' }}
                  onClick={() =>
                    patch('about', {
                      cards: [...C.about.cards, { name: '', body: '', imageUrl: '' }],
                    })
                  }
                >
                  <AdminIcon name="plus" size={14} /> Thêm card
                </button>
              </EditorSection>

              {/* 05 — CERTS */}
              <EditorSection
                num={next()}
                icon="shield"
                title="Chứng nhận quốc tế"
                sub="Eyebrow, tiêu đề, phụ đề và các thẻ chứng nhận"
              >
                <div className="pe-row">
                  <Field label={`Eyebrow (${L})`}>
                    <input
                      className="ad-input"
                      value={C.certs.eyebrow}
                      onChange={(e) => patch('certs', { eyebrow: e.target.value })}
                    />
                  </Field>
                  <Field label={`Tiêu đề (${L})`}>
                    <input
                      className="ad-input"
                      value={C.certs.title}
                      onChange={(e) => patch('certs', { title: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label={`Phụ đề (${L})`}>
                  <textarea
                    className="ad-textarea"
                    value={C.certs.sub}
                    onChange={(e) => patch('certs', { sub: e.target.value })}
                  />
                </Field>
                {C.certs.items.map((cert, i) => (
                  <div
                    key={i}
                    style={{
                      border: '1px solid var(--ad-line)',
                      borderRadius: 8,
                      padding: 12,
                      background: '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="ad-code">CERT {String(i + 1).padStart(2, '0')}</span>
                      <div style={{ flex: 1 }} />
                      <button
                        type="button"
                        className="ad-btn sm ghost danger"
                        onClick={() =>
                          patch('certs', { items: C.certs.items.filter((_, j) => j !== i) })
                        }
                      >
                        <AdminIcon name="trash" size={13} />
                      </button>
                    </div>
                    <div className="pe-row">
                      <Field label="Tên chứng nhận">
                        <input
                          className="ad-input"
                          value={cert.name}
                          onChange={(e) => {
                            const items = [...C.certs.items];
                            items[i] = { ...items[i], name: e.target.value };
                            patch('certs', { items });
                          }}
                        />
                      </Field>
                      <Field label={`Đơn vị / năm cấp (${L})`}>
                        <input
                          className="ad-input"
                          value={cert.issuer}
                          onChange={(e) => {
                            const items = [...C.certs.items];
                            items[i] = { ...items[i], issuer: e.target.value };
                            patch('certs', { items });
                          }}
                        />
                      </Field>
                    </div>
                    <div className="pe-row">
                      <Field label={`Mô tả (${L})`}>
                        <input
                          className="ad-input"
                          value={cert.desc}
                          onChange={(e) => {
                            const items = [...C.certs.items];
                            items[i] = { ...items[i], desc: e.target.value };
                            patch('certs', { items });
                          }}
                        />
                      </Field>
                      <Field label="Logo (đường dẫn)">
                        <input
                          className="ad-input"
                          value={cert.logoUrl}
                          onChange={(e) => {
                            const items = [...C.certs.items];
                            items[i] = { ...items[i], logoUrl: e.target.value };
                            patch('certs', { items });
                          }}
                        />
                      </Field>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="ad-btn sm"
                  style={{ width: 'fit-content' }}
                  onClick={() =>
                    patch('certs', {
                      items: [...C.certs.items, { name: '', issuer: '', desc: '', logoUrl: '' }],
                    })
                  }
                >
                  <AdminIcon name="plus" size={14} /> Thêm chứng nhận
                </button>
              </EditorSection>

              {/* 06 — EXPORT */}
              <EditorSection
                num={next()}
                icon="globe"
                title="Năng lực xuất khẩu — Map + 4 thẻ"
                sub="Eyebrow, tiêu đề, 4 thẻ tính năng, danh sách thị trường, caption"
              >
                <div className="pe-row">
                  <Field label={`Eyebrow (${L})`}>
                    <input
                      className="ad-input"
                      value={C.exportCap.eyebrow}
                      onChange={(e) => patch('exportCap', { eyebrow: e.target.value })}
                    />
                  </Field>
                  <Field label={`Tiêu đề (${L})`}>
                    <input
                      className="ad-input"
                      value={C.exportCap.title}
                      onChange={(e) => patch('exportCap', { title: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label={`Phụ đề (${L})`}>
                  <textarea
                    className="ad-textarea"
                    value={C.exportCap.sub}
                    onChange={(e) => patch('exportCap', { sub: e.target.value })}
                  />
                </Field>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--ad-text-mute)',
                    textTransform: 'uppercase',
                    letterSpacing: '.05em',
                  }}
                >
                  4 thẻ tính năng trên map
                </div>
                <div className="pe-row">
                  {C.exportCap.features.map((f, i) => (
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
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ad-text-mute)' }}>
                        EF {String(i + 1).padStart(2, '0')}
                      </span>
                      <input
                        className="ad-input"
                        value={f.title}
                        onChange={(e) => {
                          const features = [...C.exportCap.features];
                          features[i] = { ...features[i], title: e.target.value };
                          patch('exportCap', { features });
                        }}
                      />
                      <input
                        className="ad-input"
                        style={{ fontSize: 12 }}
                        value={f.body}
                        onChange={(e) => {
                          const features = [...C.exportCap.features];
                          features[i] = { ...features[i], body: e.target.value };
                          patch('exportCap', { features });
                        }}
                      />
                    </div>
                  ))}
                </div>
                <Field
                  label={`Danh sách thị trường — mỗi dòng một nước (${L})`}
                  help="Hiển thị thành markers trên bản đồ."
                >
                  <textarea
                    className="ad-textarea"
                    value={C.exportCap.markets.join('\n')}
                    onChange={(e) =>
                      patch('exportCap', {
                        markets: e.target.value
                          .split('\n')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </Field>
                <Field label={`Caption dưới map (${L})`}>
                  <input
                    className="ad-input"
                    value={C.exportCap.mapCaption}
                    onChange={(e) => patch('exportCap', { mapCaption: e.target.value })}
                  />
                </Field>
              </EditorSection>

              {/* 07 — CONTACT */}
              <EditorSection
                num={next()}
                icon="mail"
                title="Liên hệ — Khối cuối trang"
                sub="Eyebrow, tiêu đề, phụ đề và thông tin liên hệ"
              >
                <div className="pe-row">
                  <Field label={`Eyebrow (${L})`}>
                    <input
                      className="ad-input"
                      value={C.contact.eyebrow}
                      onChange={(e) => patch('contact', { eyebrow: e.target.value })}
                    />
                  </Field>
                  <Field label={`Tiêu đề (${L})`}>
                    <input
                      className="ad-input"
                      value={C.contact.title}
                      onChange={(e) => patch('contact', { title: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label={`Phụ đề (${L})`}>
                  <textarea
                    className="ad-textarea"
                    value={C.contact.sub}
                    onChange={(e) => patch('contact', { sub: e.target.value })}
                  />
                </Field>
                <Field label={`Địa chỉ trụ sở (${L})`}>
                  <input
                    className="ad-input"
                    value={C.contact.address}
                    onChange={(e) => patch('contact', { address: e.target.value })}
                  />
                </Field>
                <div className="pe-row three">
                  <Field label="Điện thoại 1">
                    <input
                      className="ad-input"
                      value={C.contact.phone1}
                      onChange={(e) => patch('contact', { phone1: e.target.value })}
                    />
                  </Field>
                  <Field label="Điện thoại 2">
                    <input
                      className="ad-input"
                      value={C.contact.phone2}
                      onChange={(e) => patch('contact', { phone2: e.target.value })}
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      className="ad-input"
                      value={C.contact.email}
                      onChange={(e) => patch('contact', { email: e.target.value })}
                    />
                  </Field>
                </div>
              </EditorSection>
            </>
          ) : (
            /* Non-home pages — title only */
            <EditorSection
              num={next()}
              icon="file"
              title="Tiêu đề trang"
              sub="Tên trang hiển thị theo từng ngôn ngữ"
            >
              <Field
                label={`Tiêu đề (${L})`}
                required={lang === 'vi'}
                help="Dùng cho tiêu đề tab trình duyệt và breadcrumb."
              >
                <input
                  className="ad-input"
                  value={v[titleKey] as string}
                  onChange={(e) => set(titleKey, e.target.value)}
                  required={lang === 'vi'}
                />
              </Field>
            </EditorSection>
          )}

          {/* SEO — always last */}
          <EditorSection
            num={next()}
            icon="seo"
            title="SEO & Mạng xã hội"
            sub="Tiêu đề trang, thẻ meta, hiển thị trên Google / Facebook / Zalo"
          >
            {C ? (
              <Field label={`Tiêu đề trang (${L})`} required={lang === 'vi'}>
                <input
                  className="ad-input"
                  value={v[titleKey] as string}
                  onChange={(e) => set(titleKey, e.target.value)}
                  required={lang === 'vi'}
                />
              </Field>
            ) : null}
            <Field label={`Meta title (${L})`} help="50–60 ký tự là tối ưu.">
              <input
                className="ad-input"
                value={v[metaTitleKey] as string}
                onChange={(e) => set(metaTitleKey, e.target.value)}
                placeholder="Để trống → dùng tiêu đề trang"
              />
            </Field>
            <Field label={`Meta description (${L})`} help="150–160 ký tự là tối ưu.">
              <textarea
                className="ad-textarea"
                value={v[metaDescKey] as string}
                onChange={(e) => set(metaDescKey, e.target.value)}
              />
            </Field>
            <Field
              label="Ảnh chia sẻ (Open Graph)"
              help="Hiển thị khi share lên Facebook/Zalo · 1200×630px."
            >
              <input
                className="ad-input"
                value={v.ogImageUrl}
                onChange={(e) => set('ogImageUrl', e.target.value)}
                placeholder="/assets/og-home.jpg"
              />
            </Field>
            {v.ogImageUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={v.ogImageUrl}
                alt=""
                style={{
                  width: '100%',
                  maxWidth: 360,
                  borderRadius: 6,
                  border: '1px solid var(--ad-line)',
                }}
              />
            ) : null}
            <div className="pe-google">
              <div className="lbl">Xem trước trên Google</div>
              <div className="url">
                long-anh.com <span style={{ color: '#5f6368' }}>› {path}</span>
              </div>
              <div className="ttl">{previewTitle}</div>
              <div className="desc">{previewDesc}</div>
            </div>
          </EditorSection>
        </div>

        <aside className="pe-side">
          <div className="ad-card">
            <div className="ad-card-head">
              <h3>Trạng thái</h3>
            </div>
            <div style={{ padding: 14 }}>
              <StatusRadioGroup<'pub' | 'hide'>
                value={v.isPublished ? 'pub' : 'hide'}
                onChange={(s) => set('isPublished', s === 'pub')}
                options={[
                  { value: 'pub', label: 'Đã xuất bản', hint: 'Hiển thị trên website' },
                  { value: 'hide', label: 'Đã ẩn', hint: 'Không hiển thị, vẫn giữ dữ liệu' },
                ]}
              />
            </div>
          </div>

          <div className="ad-card">
            <div className="ad-card-head">
              <h3>Đường dẫn</h3>
            </div>
            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="ad-code" style={{ display: 'inline-block', width: 'fit-content' }}>
                {path}
              </span>
              <div style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>
                Đường dẫn của các trang chính là cố định, không chỉnh sửa được.
              </div>
            </div>
          </div>

          <div className="ad-card">
            <div className="ad-card-head">
              <h3>Thông tin</h3>
            </div>
            <div
              style={{
                padding: 14,
                fontSize: 12.5,
                color: 'var(--ad-text-soft)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div>
                Mã trang: <span className="ad-code">{v.key}</span>
              </div>
              <div>
                {C
                  ? 'Sửa nội dung các section ở trên rồi bấm Lưu — thay đổi hiện ngay trên website.'
                  : 'Nội dung các section của trang này lấy từ dữ liệu site.'}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <button type="submit" className="ad-btn primary" disabled={busy}>
          <AdminIcon name="check" size={15} />
          {busy ? 'Đang lưu…' : 'Lưu trang'}
        </button>
        <button type="button" className="ad-btn" onClick={() => router.push('/admin/pages')}>
          Huỷ
        </button>
      </div>
    </form>
  );
}
