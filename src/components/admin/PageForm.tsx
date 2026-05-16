'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminIcon } from './AdminIcon';
import { AdminPageHead } from './AdminPageHead';
import { Field } from './FormBits';
import { LangTabs, EditorSection, StatusRadioGroup, type Lang } from './EditorChrome';
import { PeImg } from './PeImg';
import { savePage, type PageInput, type ActionResult } from '@/app/admin/(panel)/pages/actions';
import { HOME_SECTION_KEYS, type HomeSections, type HomeSectionKey } from '@/lib/home-content';
import { WORLD_PINS, WORLD_PINS_BY_SLUG } from '@/lib/world-pins';

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

/** Minimal product info shown as chips in the home "Products" section. */
export interface ProductChip {
  code: string;
  nameVi: string;
  nameEn: string;
  nameZh: string;
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
  currentProducts,
}: {
  initial: PageFormValue;
  label: string;
  path: string;
  /** Present only for the home page — the full editable section content. */
  initialSections?: HomeSections;
  /** Live product catalogue — shown as read-only chips in the carousel section. */
  currentProducts?: ProductChip[];
}) {
  const router = useRouter();
  const [v, setV] = useState<PageFormValue>(initial);
  const [sections, setSections] = useState<HomeSections | null>(initialSections ?? null);
  const [lang, setLang] = useState<Lang>('vi');
  const [state, setState] = useState<ActionResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; fading: boolean }>({
    visible: false,
    fading: false,
  });

  // Mock auto-save indicator: every 30s after a change, show a toast briefly.
  // Phase 7 will swap this for a real debounced server action.
  useEffect(() => {
    if (!dirty) return;
    const showAt = setTimeout(() => {
      setToast({ visible: true, fading: false });
      const fadeAt = setTimeout(() => setToast((t) => ({ ...t, fading: true })), 2500);
      const hideAt = setTimeout(() => setToast({ visible: false, fading: false }), 2900);
      return () => {
        clearTimeout(fadeAt);
        clearTimeout(hideAt);
      };
    }, 30_000);
    return () => clearTimeout(showAt);
  }, [dirty]);

  const set = <K extends keyof PageFormValue>(k: K, val: PageFormValue[K]) => {
    setV((p) => ({ ...p, [k]: val }));
    if (!dirty) setDirty(true);
  };

  const fk = (base: string): keyof PageFormValue => (base + SUF[lang]) as keyof PageFormValue;

  /** Shallow-merge a patch into one section of the current locale. */
  const patch = (key: HomeSectionKey, p: Record<string, unknown>) => {
    setSections((s) => {
      if (!s) return s;
      const cur = s[lang][key] as unknown as Record<string, unknown>;
      return {
        ...s,
        [lang]: { ...s[lang], [key]: { ...cur, ...p } },
      } as HomeSections;
    });
    if (!dirty) setDirty(true);
  };

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
      />

      {/* Sticky savebar — back link · title · slug chip · status · autosave · actions */}
      <div className="pe-savebar">
        <Link href="/admin/pages" className="back">
          <AdminIcon name="chevron" size={14} /> Quay lại
        </Link>
        <div className="title">
          <AdminIcon name="file" size={16} />
          <span>{label}</span>
          <code className="slug-chip">{path}</code>
          <span className={'ad-badge ' + (v.isPublished ? 'pub' : 'draft')}>
            <span className="dot" />
            {v.isPublished ? 'Đã xuất bản' : 'Đã ẩn'}
          </span>
        </div>
        <span className="auto" suppressHydrationWarning>
          {dirty ? 'Có thay đổi chưa lưu' : 'Đã đồng bộ với cơ sở dữ liệu'}
        </span>
        <a href={path} target="_blank" rel="noreferrer" className="ad-btn sm">
          <AdminIcon name="eye" size={12} /> Xem
        </a>
        <button type="submit" className="ad-btn primary sm" disabled={busy}>
          <AdminIcon name="check" size={12} />
          {busy ? 'Đang lưu…' : 'Lưu & Xuất bản'}
        </button>
      </div>

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
                <div
                  style={{
                    borderTop: '1px solid var(--ad-line-soft)',
                    paddingTop: 16,
                    marginTop: 4,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--ad-text-mute)',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      marginBottom: 10,
                    }}
                  >
                    Ảnh hero
                  </div>
                  <div className="pe-imgrow">
                    <PeImg
                      src={C.hero.imageUrl}
                      alt={C.hero.imageAlt}
                      size={C.hero.imageUrl ? 'Ảnh hero' : undefined}
                      onChange={(dataUrl) => patch('hero', { imageUrl: dataUrl })}
                    />
                    <div className="pe-stack">
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
                      <Field label="Đường dẫn / URL ảnh" help="Tự cập nhật khi bạn chọn file mới.">
                        <input
                          className="ad-input"
                          value={C.hero.imageUrl}
                          onChange={(e) => patch('hero', { imageUrl: e.target.value })}
                          placeholder="/assets/hero-sw.png"
                          spellCheck={false}
                          style={{
                            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                            fontSize: 12,
                          }}
                        />
                      </Field>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          type="button"
                          className="ad-btn sm"
                          onClick={() => {
                            // Trigger the same file picker the PeImg overlay uses
                            (
                              document.querySelector(
                                '.imgwrap input[type="file"]',
                              ) as HTMLInputElement | null
                            )?.click();
                          }}
                        >
                          <AdminIcon name="upload" size={13} /> Đổi ảnh
                        </button>
                        <button type="button" className="ad-btn sm" disabled>
                          <AdminIcon name="image" size={13} /> Thư viện
                        </button>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>
                        Khuyến nghị: PNG nền trong suốt · tối thiểu 1200×900px · &lt; 500KB
                      </div>
                    </div>
                  </div>
                </div>
              </EditorSection>

              {/* 02 — STATS */}
              <EditorSection
                num={next()}
                icon="trend"
                title="Stats — Dải 4 con số"
                sub="Năm kinh nghiệm, công suất, quốc gia xuất khẩu, số mỏ"
              >
                <div className="pe-row four">
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
                <Field label="Cách hiển thị">
                  <select className="ad-select" defaultValue="auto">
                    <option value="auto">
                      Tự động — {currentProducts?.length ?? 5} dòng sản phẩm chính
                    </option>
                    <option value="manual" disabled>
                      Thủ công — chọn sản phẩm cụ thể (Phase 7)
                    </option>
                  </select>
                </Field>
                <div
                  style={{
                    background: '#fff',
                    border: '1px solid var(--ad-line)',
                    borderRadius: 8,
                    padding: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--ad-text-mute)',
                      marginBottom: 8,
                      fontWeight: 500,
                    }}
                  >
                    {currentProducts?.length ?? 0} sản phẩm đang hiển thị
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(currentProducts ?? []).map((p) => {
                      const name = lang === 'en' ? p.nameEn : lang === 'zh' ? p.nameZh : p.nameVi;
                      return (
                        <span key={p.code} className="ad-tag">
                          {p.code} · {name}
                          <button
                            type="button"
                            title="Tự động lấy từ catalogue — quản lý ở trang Sản phẩm"
                            disabled
                          >
                            <AdminIcon name="x" size={11} />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                  {!currentProducts?.length ? (
                    <div style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>
                      Chưa có sản phẩm — thêm ở{' '}
                      <Link
                        href="/admin/products"
                        style={{ color: 'var(--ad-primary)', fontWeight: 500 }}
                      >
                        /admin/products
                      </Link>
                      .
                    </div>
                  ) : null}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>
                  Danh sách trên lấy tự động từ catalogue ở chế độ <strong>Tự động</strong>. Để chọn
                  thủ công, quản lý ở{' '}
                  <Link
                    href="/admin/products"
                    style={{ color: 'var(--ad-primary)', fontWeight: 500 }}
                  >
                    Sản phẩm
                  </Link>
                  .
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
                <div className="pe-card-grid">
                  {C.about.cards.map((card, i) => (
                    <div key={i} className="pe-card-edit">
                      <div className="head">
                        <span className="pill">CARD {String(i + 1).padStart(2, '0')}</span>
                        <div className="name">{card.name || `Card ${i + 1}`}</div>
                        <button type="button" title="Kéo" aria-label="Kéo để sắp xếp">
                          <AdminIcon name="grid" size={14} />
                        </button>
                        <button
                          type="button"
                          title="Xoá"
                          aria-label="Xoá card"
                          onClick={() =>
                            patch('about', { cards: C.about.cards.filter((_, j) => j !== i) })
                          }
                        >
                          <AdminIcon name="trash" size={13} />
                        </button>
                      </div>
                      <div className="miniimg">
                        {card.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={card.imageUrl} alt={card.name} />
                        ) : (
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--ad-text-mute)',
                              fontSize: 12,
                            }}
                          >
                            (chưa có ảnh)
                          </div>
                        )}
                        <input
                          id={`about-card-file-${i}`}
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') {
                                const cards = [...C.about.cards];
                                cards[i] = { ...cards[i], imageUrl: reader.result };
                                patch('about', { cards });
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById(`about-card-file-${i}`)?.click()}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'transparent',
                            border: 0,
                            cursor: 'pointer',
                          }}
                          aria-label="Đổi ảnh card"
                          title="Click để đổi ảnh"
                        />
                      </div>
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
                      <Field label={`Mô tả (${L})`}>
                        <textarea
                          className="ad-textarea"
                          style={{ minHeight: 60 }}
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
                    className="pe-add-card"
                    onClick={() =>
                      patch('about', {
                        cards: [...C.about.cards, { name: '', body: '', imageUrl: '' }],
                      })
                    }
                  >
                    <AdminIcon name="plus" size={20} />
                    Thêm card mới
                  </button>
                </div>
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
                <div className="pe-list">
                  {C.certs.items.map((cert, i) => (
                    <div key={i} className="pe-list-item">
                      <span className="num">{String(i + 1).padStart(2, '0')}</span>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '0.6fr 1.5fr 1fr',
                          gap: 8,
                        }}
                      >
                        <input
                          className="ad-input"
                          placeholder="Tên cert"
                          value={cert.name}
                          onChange={(e) => {
                            const items = [...C.certs.items];
                            items[i] = { ...items[i], name: e.target.value };
                            patch('certs', { items });
                          }}
                        />
                        <input
                          className="ad-input"
                          placeholder={`Mô tả (${L})`}
                          value={cert.desc}
                          onChange={(e) => {
                            const items = [...C.certs.items];
                            items[i] = { ...items[i], desc: e.target.value };
                            patch('certs', { items });
                          }}
                        />
                        <input
                          className="ad-input"
                          placeholder="Đường dẫn logo"
                          value={cert.logoUrl}
                          onChange={(e) => {
                            const items = [...C.certs.items];
                            items[i] = { ...items[i], logoUrl: e.target.value };
                            patch('certs', { items });
                          }}
                          spellCheck={false}
                          style={{
                            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                            fontSize: 12,
                          }}
                        />
                      </div>
                      <div className="actions">
                        <button
                          type="button"
                          title="Xoá"
                          aria-label={`Xoá chứng nhận ${cert.name || i + 1}`}
                          onClick={() =>
                            patch('certs', { items: C.certs.items.filter((_, j) => j !== i) })
                          }
                        >
                          <AdminIcon name="trash" size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--ad-text-mute)',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      marginBottom: 10,
                    }}
                  >
                    Quốc gia hiển thị trên map ({L})
                  </div>

                  {/* Selected pins — drawn on the map in this order */}
                  <div
                    style={{
                      background: '#fff',
                      border: '1px solid var(--ad-line)',
                      borderRadius: 8,
                      padding: 12,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--ad-text-mute)',
                        marginBottom: 8,
                        fontWeight: 500,
                      }}
                    >
                      {C.exportCap.markets.length} quốc gia đang hiển thị · pin tự đặt đúng vị trí
                      địa lý thật
                    </div>
                    {C.exportCap.markets.length === 0 ? (
                      <div style={{ fontSize: 12.5, color: 'var(--ad-text-mute)', padding: 8 }}>
                        Chưa có quốc gia nào — chọn từ danh sách bên dưới.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {C.exportCap.markets.map((slug, i) => {
                          const pin = WORLD_PINS_BY_SLUG[slug];
                          const label = pin ? pin.name[lang] : slug;
                          return (
                            <span key={`${slug}-${i}`} className="ad-tag">
                              {label}
                              {pin ? (
                                <span
                                  style={{
                                    marginLeft: 4,
                                    fontSize: 10,
                                    color: 'var(--ad-text-mute)',
                                    fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                                  }}
                                >
                                  ({pin.x},{pin.y})
                                </span>
                              ) : (
                                <span
                                  style={{
                                    marginLeft: 4,
                                    fontSize: 10,
                                    color: 'var(--ad-danger)',
                                  }}
                                >
                                  (legacy — chọn lại)
                                </span>
                              )}
                              <button
                                type="button"
                                aria-label={`Bỏ ${label}`}
                                onClick={() => {
                                  const markets = C.exportCap.markets.filter((_, j) => j !== i);
                                  patch('exportCap', { markets });
                                }}
                              >
                                <AdminIcon name="x" size={11} />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Picker — add a country */}
                  <div style={{ marginTop: 12 }}>
                    <select
                      className="ad-select"
                      value=""
                      onChange={(e) => {
                        const slug = e.target.value;
                        if (!slug) return;
                        if (C.exportCap.markets.includes(slug)) return;
                        patch('exportCap', {
                          markets: [...C.exportCap.markets, slug],
                        });
                      }}
                    >
                      <option value="">+ Thêm quốc gia vào map…</option>
                      {WORLD_PINS.filter((p) => !C.exportCap.markets.includes(p.slug)).map((p) => (
                        <option key={p.slug} value={p.slug}>
                          {p.name[lang]} ({p.name.en})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--ad-text-mute)',
                      marginTop: 8,
                    }}
                  >
                    Mỗi quốc gia có toạ độ địa lý thật trong bảng <code>WORLD_PINS</code> — pin đặt
                    đúng vị trí trên map. Cần quốc gia chưa có?{' '}
                    <span style={{ color: 'var(--ad-text-soft)' }}>
                      bổ sung vào <code>src/lib/world-pins.ts</code> (Phase 7 sẽ chuyển sang bảng
                      DB).
                    </span>
                  </div>
                </div>
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
              <div className="pe-imgrow">
                <PeImg
                  src={v.ogImageUrl}
                  alt="OG image"
                  size={v.ogImageUrl ? '1200×630' : undefined}
                  onChange={(dataUrl) => set('ogImageUrl', dataUrl)}
                />
                <div className="pe-stack">
                  <input
                    className="ad-input"
                    value={v.ogImageUrl}
                    onChange={(e) => set('ogImageUrl', e.target.value)}
                    placeholder="/assets/og-home.jpg"
                    spellCheck={false}
                    style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 12 }}
                  />
                  <div style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>
                    Nếu để trống, hệ thống dùng ảnh hero của trang.
                  </div>
                </div>
              </div>
            </Field>
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
              <StatusRadioGroup<'draft' | 'pub' | 'sched' | 'hide'>
                value={v.isPublished ? 'pub' : 'hide'}
                onChange={(s) => set('isPublished', s === 'pub' || s === 'sched')}
                options={[
                  { value: 'draft', label: 'Nháp', hint: 'Chỉ admin thấy được' },
                  { value: 'pub', label: 'Đã xuất bản', hint: 'Hiển thị trên website' },
                  {
                    value: 'sched',
                    label: 'Hẹn giờ',
                    hint: 'Tự động xuất bản theo lịch (Phase 7)',
                  },
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
              <h3>Lịch sử thay đổi</h3>
            </div>
            <div className="pe-versions">
              {[
                { num: 'v12', when: '2 giờ trước · Admin', cur: true },
                { num: 'v11', when: '1 ngày trước · Admin' },
                { num: 'v10', when: '3 ngày trước · Admin' },
                { num: 'v9', when: '1 tuần trước · Admin' },
              ].map((vv) => (
                <div key={vv.num} className="v">
                  <span className="num">{vv.num}</span>
                  <div style={{ flex: 1 }}>
                    <div className="when">{vv.when}</div>
                  </div>
                  {vv.cur ? (
                    <span className="ad-badge pub" style={{ fontSize: 10 }}>
                      <span className="dot" /> Hiện tại
                    </span>
                  ) : (
                    <button type="button" title="Khôi phục">
                      <AdminIcon name="refresh" size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div style={{ padding: '8px 14px 12px', fontSize: 11.5, color: 'var(--ad-text-mute)' }}>
              Phase 7 sẽ thay danh sách giả lập này bằng audit_logs thật.
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

      {toast.visible ? (
        <div className={'pe-toast ' + (toast.fading ? 'fading' : '')}>
          <AdminIcon name="check" size={14} /> Đã lưu nháp tự động
        </div>
      ) : null}

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
