'use client';

import Link from 'next/link';
import { AdminIcon } from './AdminIcon';
import { Field } from './FormBits';
import { EditorSection, type Lang } from './EditorChrome';
import type { IconName } from '@/components/ui/Icon';
import {
  CAREERS_PAGE_SECTION_KEYS,
  type CareersPageSections,
  type CareersPageSectionKey,
  type CareersPageSectionsLocale,
} from '@/lib/careers-page-content';

/** Selectable icon names — mirrors the `IconName` union from Icon.tsx. */
const ICON_NAMES: IconName[] = [
  'arrow',
  'plus',
  'check',
  'chevron',
  'globe',
  'leaf',
  'factory',
  'ship',
  'spark',
  'box',
  'drop',
  'grid',
  'pin',
  'phone',
  'mail',
  'sun',
  'moon',
];

/** Minimal job catalog entry passed in from the server. */
export interface JobChip {
  slug: string;
  titleVi: string;
  titleEn: string;
  titleZh: string;
  deptVi: string;
  deptEn: string;
  deptZh: string;
  locationVi: string;
}

/**
 * 6-section editor for the careers page (`/admin/pages/career`).
 *
 * Ported from the prototype admin/page-edit-careers.html:
 *   01 Hero (eyebrow + title + sub + CTA + 4 stats)
 *   02 Jobs (title + email + sub + dept chips + selected job slugs)
 *   03 Values (eyebrow + title + sub + N value cards)
 *   04 Benefits (eyebrow + title + N benefit rows)
 *   05 Process (eyebrow + title + N step rows)
 *   06 CTA (open-application banner)
 */
export function CareersPageSectionsEditor({
  sections,
  lang,
  onPatch,
  currentJobs,
}: {
  sections: CareersPageSections;
  lang: Lang;
  onPatch: (key: CareersPageSectionKey, patch: Record<string, unknown>) => void;
  currentJobs?: JobChip[];
}) {
  const C: CareersPageSectionsLocale = sections[lang];
  const L = lang.toUpperCase();

  let n = 0;
  const next = () => String(++n).padStart(2, '0');

  const jobMap = new Map((currentJobs ?? []).map((j) => [j.slug, j]));
  const jobLabel = (slug: string) => {
    const j = jobMap.get(slug);
    if (!j) return slug;
    return lang === 'en' ? j.titleEn : lang === 'zh' ? j.titleZh : j.titleVi;
  };
  const jobDept = (slug: string) => {
    const j = jobMap.get(slug);
    if (!j) return '';
    return lang === 'en' ? j.deptEn : lang === 'zh' ? j.deptZh : j.deptVi;
  };

  return (
    <>
      {/* 01 — HERO */}
      <EditorSection
        num={next()}
        icon="layers"
        title="Hero — Banner trang"
        sub="Eyebrow, tiêu đề lớn, mô tả và 4 stats nổi bật"
      >
        <div className="pe-row">
          <Field label={`Eyebrow (${L})`}>
            <input
              className="lac-input"
              value={C.hero.eyebrow}
              onChange={(e) => onPatch('hero', { eyebrow: e.target.value })}
            />
          </Field>
          <Field label={`CTA — chữ (${L})`}>
            <input
              className="lac-input"
              value={C.hero.ctaLabel}
              onChange={(e) => onPatch('hero', { ctaLabel: e.target.value })}
            />
          </Field>
        </div>
        <Field label={`Tiêu đề chính (${L})`}>
          <input
            className="lac-input"
            value={C.hero.title}
            onChange={(e) => onPatch('hero', { title: e.target.value })}
          />
        </Field>
        <Field label={`Mô tả (${L})`}>
          <textarea
            className="lac-textarea"
            value={C.hero.sub}
            onChange={(e) => onPatch('hero', { sub: e.target.value })}
          />
        </Field>

        <div style={{ borderTop: '1px solid var(--ad-line-soft)', paddingTop: 14 }}>
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
            4 stats hero
          </div>
          <div className="pe-row four">
            {C.hero.stats.map((s, i) => (
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
                  className="lac-input"
                  style={{ fontWeight: 700, fontSize: 18 }}
                  value={s.value}
                  onChange={(e) => {
                    const stats = [...C.hero.stats];
                    stats[i] = { ...s, value: e.target.value };
                    onPatch('hero', { stats });
                  }}
                />
                <input
                  className="lac-input"
                  style={{ fontSize: 12 }}
                  value={s.label}
                  onChange={(e) => {
                    const stats = [...C.hero.stats];
                    stats[i] = { ...s, label: e.target.value };
                    onPatch('hero', { stats });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </EditorSection>

      {/* 02 — JOBS */}
      <EditorSection
        num={next()}
        icon="users"
        title="Vị trí đang tuyển"
        sub={`Hiện có ${C.jobs.jobSlugs.length} vị trí hiển thị · ${C.jobs.departments.length} phòng ban filter`}
      >
        <div className="pe-row">
          <Field label={`Tiêu đề section (${L})`}>
            <input
              className="lac-input"
              value={C.jobs.title}
              onChange={(e) => onPatch('jobs', { title: e.target.value })}
            />
          </Field>
          <Field label="Email nhận hồ sơ">
            <input
              className="lac-input"
              value={C.jobs.email}
              spellCheck={false}
              style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 12 }}
              onChange={(e) => onPatch('jobs', { email: e.target.value })}
            />
          </Field>
        </div>
        <Field label={`Mô tả (${L})`}>
          <textarea
            className="lac-textarea"
            value={C.jobs.sub}
            onChange={(e) => onPatch('jobs', { sub: e.target.value })}
          />
        </Field>

        <Field label={`Phòng ban (filter chip — ${L})`} help="Enter hoặc dấu phẩy để thêm">
          <div className="lac-tags">
            {C.jobs.departments.map((d, i) => (
              <span key={`${d}-${i}`} className="lac-tag">
                {d}
                <button
                  type="button"
                  aria-label={`Bỏ ${d}`}
                  onClick={() => {
                    const departments = C.jobs.departments.filter((_, j) => j !== i);
                    onPatch('jobs', { departments });
                  }}
                >
                  <AdminIcon name="x" size={11} />
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Thêm phòng ban…"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  const v = (e.currentTarget.value || '').trim();
                  if (!v || C.jobs.departments.includes(v)) {
                    e.currentTarget.value = '';
                    return;
                  }
                  onPatch('jobs', { departments: [...C.jobs.departments, v] });
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
        </Field>

        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--ad-text-mute)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginTop: 6,
          }}
        >
          {C.jobs.jobSlugs.length} vị trí được chọn từ catalog
        </div>
        <div className="pe-list">
          {C.jobs.jobSlugs.map((slug, i) => {
            const inCatalog = jobMap.has(slug);
            return (
              <div key={`${slug}-${i}`} className="pe-list-item">
                <span className="num">JOB {String(slug).padStart(2, '0')}</span>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr auto',
                    gap: 10,
                    alignItems: 'center',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 500 }}>
                    {inCatalog ? (
                      jobLabel(slug)
                    ) : (
                      <span style={{ color: 'var(--ad-danger)' }}>
                        ⚠ Slug không có trong catalog
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ad-text-mute)' }}>
                    {inCatalog ? jobDept(slug) : '—'}
                  </div>
                  {inCatalog ? (
                    <Link
                      href={`/admin/jobs/${slug}`}
                      className="lac-btn ghost sm"
                      title="Sửa chi tiết vị trí"
                    >
                      <AdminIcon name="edit" size={12} /> Sửa
                    </Link>
                  ) : (
                    <span style={{ fontSize: 11, color: 'var(--ad-text-mute)' }}>—</span>
                  )}
                </div>
                <div className="actions">
                  <button
                    type="button"
                    title="Bỏ khỏi danh sách"
                    onClick={() => {
                      const jobSlugs = C.jobs.jobSlugs.filter((_, j) => j !== i);
                      onPatch('jobs', { jobSlugs });
                    }}
                  >
                    <AdminIcon name="trash" size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 12 }}>
          <select
            className="lac-select"
            value=""
            onChange={(e) => {
              const slug = e.target.value;
              if (!slug) return;
              if (C.jobs.jobSlugs.includes(slug)) return;
              onPatch('jobs', { jobSlugs: [...C.jobs.jobSlugs, slug] });
            }}
          >
            <option value="">+ Thêm vị trí từ catalog…</option>
            {(currentJobs ?? [])
              .filter((j) => !C.jobs.jobSlugs.includes(j.slug))
              .map((j) => (
                <option key={j.slug} value={j.slug}>
                  {j.slug} · {jobLabel(j.slug)} ({jobDept(j.slug)})
                </option>
              ))}
          </select>
        </div>

        <Link
          href="/admin/jobs"
          className="lac-btn ghost sm"
          style={{ width: 'fit-content', marginTop: 10 }}
        >
          <AdminIcon name="edit" size={12} /> Quản lý vị trí tuyển dụng
        </Link>
      </EditorSection>

      {/* 03 — VALUES */}
      <EditorSection
        num={next()}
        icon="grid"
        title="Văn hóa doanh nghiệp"
        sub={`${C.values.items.length} giá trị cốt lõi (Values grid)`}
      >
        <div className="pe-row">
          <Field label={`Eyebrow (${L})`}>
            <input
              className="lac-input"
              value={C.values.eyebrow}
              onChange={(e) => onPatch('values', { eyebrow: e.target.value })}
            />
          </Field>
          <Field label={`Tiêu đề (${L})`}>
            <input
              className="lac-input"
              value={C.values.title}
              onChange={(e) => onPatch('values', { title: e.target.value })}
            />
          </Field>
        </div>
        <Field label={`Mô tả (${L})`}>
          <textarea
            className="lac-textarea"
            value={C.values.sub}
            onChange={(e) => onPatch('values', { sub: e.target.value })}
          />
        </Field>
        <div className="pe-card-grid">
          {C.values.items.map((v, i) => (
            <div key={i} className="pe-card-edit">
              <div className="head">
                <span className="pill">VAL {String(i + 1).padStart(2, '0')}</span>
                <div className="name">{v.name || `Giá trị ${i + 1}`}</div>
                <button
                  type="button"
                  title="Xoá"
                  onClick={() => {
                    const items = C.values.items.filter((_, j) => j !== i);
                    onPatch('values', { items });
                  }}
                >
                  <AdminIcon name="trash" size={13} />
                </button>
              </div>
              <Field label={`Tiêu đề (${L})`}>
                <input
                  className="lac-input"
                  value={v.name}
                  onChange={(e) => {
                    const items = [...C.values.items];
                    items[i] = { ...v, name: e.target.value };
                    onPatch('values', { items });
                  }}
                />
              </Field>
              <Field label="Icon">
                <select
                  className="lac-select"
                  value={v.icon || 'check'}
                  onChange={(e) => {
                    const items = [...C.values.items];
                    items[i] = { ...v, icon: e.target.value };
                    onPatch('values', { items });
                  }}
                >
                  {ICON_NAMES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={`Mô tả (${L})`}>
                <textarea
                  className="lac-textarea"
                  style={{ minHeight: 70 }}
                  value={v.body}
                  onChange={(e) => {
                    const items = [...C.values.items];
                    items[i] = { ...v, body: e.target.value };
                    onPatch('values', { items });
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
            onPatch('values', {
              items: [...C.values.items, { name: '', body: '', icon: 'check' }],
            })
          }
        >
          <AdminIcon name="plus" size={13} /> Thêm giá trị
        </button>
      </EditorSection>

      {/* 04 — BENEFITS */}
      <EditorSection num={next()} icon="star" title="Phúc lợi" sub="N ô phúc lợi cho nhân viên">
        <div className="pe-row">
          <Field label={`Eyebrow (${L})`}>
            <input
              className="lac-input"
              value={C.benefits.eyebrow}
              onChange={(e) => onPatch('benefits', { eyebrow: e.target.value })}
            />
          </Field>
          <Field label={`Tiêu đề (${L})`}>
            <input
              className="lac-input"
              value={C.benefits.title}
              onChange={(e) => onPatch('benefits', { title: e.target.value })}
            />
          </Field>
        </div>
        <div className="pe-list">
          {C.benefits.items.map((b, i) => (
            <div key={i} className="pe-list-item">
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
                <input
                  className="lac-input"
                  placeholder={`Tên phúc lợi (${L})`}
                  value={b.label}
                  onChange={(e) => {
                    const items = [...C.benefits.items];
                    items[i] = { ...b, label: e.target.value };
                    onPatch('benefits', { items });
                  }}
                />
                <input
                  className="lac-input"
                  placeholder={`Mô tả (${L})`}
                  value={b.body}
                  onChange={(e) => {
                    const items = [...C.benefits.items];
                    items[i] = { ...b, body: e.target.value };
                    onPatch('benefits', { items });
                  }}
                />
              </div>
              <div className="actions">
                <button
                  type="button"
                  title="Xoá"
                  onClick={() => {
                    const items = C.benefits.items.filter((_, j) => j !== i);
                    onPatch('benefits', { items });
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
            onPatch('benefits', { items: [...C.benefits.items, { label: '', body: '' }] })
          }
        >
          <AdminIcon name="plus" size={13} /> Thêm phúc lợi
        </button>
      </EditorSection>

      {/* 05 — PROCESS */}
      <EditorSection
        num={next()}
        icon="trend"
        title="Quy trình tuyển dụng"
        sub="N bước cho ứng viên"
        defaultOpen={false}
      >
        <div className="pe-row">
          <Field label={`Eyebrow (${L})`}>
            <input
              className="lac-input"
              value={C.process.eyebrow}
              onChange={(e) => onPatch('process', { eyebrow: e.target.value })}
            />
          </Field>
          <Field label={`Tiêu đề (${L})`}>
            <input
              className="lac-input"
              value={C.process.title}
              onChange={(e) => onPatch('process', { title: e.target.value })}
            />
          </Field>
        </div>
        <div className="pe-list">
          {C.process.items.map((s, i) => (
            <div key={i} className="pe-list-item">
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
                <input
                  className="lac-input"
                  placeholder={`Tên bước (${L})`}
                  value={s.title}
                  onChange={(e) => {
                    const items = [...C.process.items];
                    items[i] = { ...s, title: e.target.value };
                    onPatch('process', { items });
                  }}
                />
                <input
                  className="lac-input"
                  placeholder={`Mô tả (${L})`}
                  value={s.body}
                  onChange={(e) => {
                    const items = [...C.process.items];
                    items[i] = { ...s, body: e.target.value };
                    onPatch('process', { items });
                  }}
                />
              </div>
              <div className="actions">
                <button
                  type="button"
                  title="Xoá"
                  onClick={() => {
                    const items = C.process.items.filter((_, j) => j !== i);
                    onPatch('process', { items });
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
            onPatch('process', { items: [...C.process.items, { title: '', body: '' }] })
          }
        >
          <AdminIcon name="plus" size={13} /> Thêm bước
        </button>
      </EditorSection>

      {/* 06 — CTA */}
      <EditorSection
        num={next()}
        icon="upload"
        title="CTA — Gửi CV tự do"
        sub="Block cho ứng viên gửi CV dù chưa có vị trí phù hợp"
        defaultOpen={false}
      >
        <div className="pe-row">
          <Field label={`Tiêu đề (${L})`}>
            <input
              className="lac-input"
              value={C.cta.title}
              onChange={(e) => onPatch('cta', { title: e.target.value })}
            />
          </Field>
          <Field label="Email nhận">
            <input
              className="lac-input"
              value={C.cta.email}
              spellCheck={false}
              style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 12 }}
              onChange={(e) => onPatch('cta', { email: e.target.value })}
            />
          </Field>
        </div>
        <Field label={`Mô tả (${L})`}>
          <textarea
            className="lac-textarea"
            value={C.cta.sub}
            onChange={(e) => onPatch('cta', { sub: e.target.value })}
          />
        </Field>
      </EditorSection>
    </>
  );
}

/** Convert per-locale state into the `sections` payload for savePage. */
export function careersPageSectionsToPayload(s: CareersPageSections) {
  const out: Record<string, { vi: unknown; en: unknown; zh: unknown }> = {};
  for (const key of CAREERS_PAGE_SECTION_KEYS) {
    out[key] = { vi: s.vi[key], en: s.en[key], zh: s.zh[key] };
  }
  return out;
}
