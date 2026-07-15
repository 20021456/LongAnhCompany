'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminIcon } from './AdminIcon';
import { Field, FieldRow } from './FormBits';
import { LangTabs, type Lang } from './EditorChrome';
import { saveJob, type JobInput, type ActionResult } from '@/app/admin/(panel)/jobs/actions';

export interface JobFormValue {
  id?: string;
  slug: string;
  departmentId: string;
  titleVi: string;
  titleEn: string;
  titleZh: string;
  location: string;
  salaryTextVi: string;
  salaryTextEn: string;
  salaryTextZh: string;
  experienceVi: string;
  experienceEn: string;
  experienceZh: string;
  levelVi: string;
  levelEn: string;
  levelZh: string;
  typeVi: string;
  typeEn: string;
  typeZh: string;
  tagsText: string;
  descriptionVi: string;
  descriptionEn: string;
  descriptionZh: string;
  respVi: string;
  respEn: string;
  respZh: string;
  reqVi: string;
  reqEn: string;
  reqZh: string;
  benVi: string;
  benEn: string;
  benZh: string;
  deadlineText: string;
  slots: number;
  isActive: boolean;
}

const SUF: Record<Lang, string> = { vi: 'Vi', en: 'En', zh: 'Zh' };

export function JobForm({
  initial,
  departments,
}: {
  initial: JobFormValue;
  departments: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [v, setV] = useState<JobFormValue>(initial);
  const [lang, setLang] = useState<Lang>('vi');
  const [state, setState] = useState<ActionResult | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof JobFormValue>(k: K, val: JobFormValue[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  /** Localized field accessor — maps a base like "title" to titleVi/En/Zh. */
  const fk = (base: string): keyof JobFormValue => (base + SUF[lang]) as keyof JobFormValue;

  /** Typed string getter for the current locale. */
  const getStr = (base: string): string => (v[fk(base)] as string) || '';
  /** Typed string setter for the current locale. */
  const setStr = (base: string, val: string) => setV((p) => ({ ...p, [fk(base)]: val }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setState(null);
    const res = await saveJob(v as unknown as JobInput);
    setBusy(false);
    setState(res);
    if (res.ok) {
      router.push('/admin/jobs');
      router.refresh();
    }
  }

  const L = lang.toUpperCase();

  return (
    <form onSubmit={onSubmit}>
      {state?.error ? (
        <div className="lg-err" style={{ marginBottom: 16 }}>
          <AdminIcon name="shield" size={14} />
          {state.error}
        </div>
      ) : null}

      <LangTabs lang={lang} setLang={setLang} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: 20,
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="lac-card">
            <div className="lac-card-head">
              <h3>Thông tin vị trí</h3>
            </div>
            <div className="lac-card-body">
              {/* slug + dept are locale-independent — only shown once. */}
              <FieldRow>
                <Field label="Slug" required help="VD: 9 hoặc ky-su-moi">
                  <input
                    className="lac-input"
                    value={v.slug}
                    onChange={(e) => set('slug', e.target.value)}
                    required
                  />
                </Field>
                <Field label="Phòng ban" required>
                  <select
                    className="lac-select"
                    value={v.departmentId}
                    onChange={(e) => set('departmentId', e.target.value)}
                    required
                  >
                    <option value="">— Chọn phòng ban —</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </FieldRow>

              <Field label={`Tên vị trí (${L})`} required={lang === 'vi'}>
                <input
                  className="lac-input"
                  value={getStr('title')}
                  onChange={(e) => setStr('title', e.target.value)}
                  required={lang === 'vi'}
                />
              </Field>

              <Field label={`Mô tả công việc (${L})`}>
                <textarea
                  className="lac-textarea"
                  value={getStr('description')}
                  onChange={(e) => setStr('description', e.target.value)}
                />
              </Field>
            </div>
          </div>

          {(
            [
              { key: 'resp', label: 'Trách nhiệm chính' },
              { key: 'req', label: 'Yêu cầu công việc' },
              { key: 'ben', label: 'Quyền lợi & phúc lợi' },
            ] as const
          ).map(({ key, label }) => (
            <div key={key} className="lac-card">
              <div className="lac-card-head">
                <div>
                  <h3>{label}</h3>
                  <p>Mỗi dòng là một mục.</p>
                </div>
              </div>
              <div className="lac-card-body">
                <Field label={`Nội dung (${L})`}>
                  <textarea
                    className="lac-textarea"
                    style={{ minHeight: 120 }}
                    value={getStr(key)}
                    onChange={(e) => setStr(key, e.target.value)}
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="lac-card">
            <div className="lac-card-head">
              <h3>Trạng thái</h3>
            </div>
            <div
              className="lac-card-body"
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={v.isActive}
                  onChange={(e) => set('isActive', e.target.checked)}
                />
                Đang tuyển (hiển thị trên web)
              </label>
              <Field label="Số lượng tuyển">
                <input
                  className="lac-input"
                  type="number"
                  value={v.slots}
                  onChange={(e) => set('slots', Number(e.target.value))}
                />
              </Field>
              <Field label="Hạn nộp" help="Định dạng DD/MM/YYYY">
                <input
                  className="lac-input"
                  value={v.deadlineText}
                  onChange={(e) => set('deadlineText', e.target.value)}
                  placeholder="30/06/2026"
                />
              </Field>
            </div>
          </div>

          <div className="lac-card">
            <div className="lac-card-head">
              <h3>Chi tiết</h3>
            </div>
            <div
              className="lac-card-body"
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <Field label="Địa điểm" help="Locale-independent — dùng chung cho 3 ngôn ngữ.">
                <input
                  className="lac-input"
                  value={v.location}
                  onChange={(e) => set('location', e.target.value)}
                  placeholder="Quỳ Hợp, Nghệ An"
                />
              </Field>
              <Field label={`Mức lương (${L})`}>
                <input
                  className="lac-input"
                  value={getStr('salaryText')}
                  onChange={(e) => setStr('salaryText', e.target.value)}
                  placeholder={
                    lang === 'vi'
                      ? '18 – 30 triệu VND'
                      : lang === 'en'
                        ? '18–30M VND'
                        : '18–30M VND'
                  }
                />
              </Field>
              <Field label={`Kinh nghiệm (${L})`}>
                <input
                  className="lac-input"
                  value={getStr('experience')}
                  onChange={(e) => setStr('experience', e.target.value)}
                  placeholder={lang === 'vi' ? '2–5 năm' : lang === 'en' ? '2–5 years' : '2–5年'}
                />
              </Field>
              <Field label={`Cấp bậc (${L})`}>
                <input
                  className="lac-input"
                  value={getStr('level')}
                  onChange={(e) => setStr('level', e.target.value)}
                  placeholder={
                    lang === 'vi' ? 'Chuyên viên' : lang === 'en' ? 'Specialist' : '专员'
                  }
                />
              </Field>
              <Field label={`Loại hình (${L})`}>
                <input
                  className="lac-input"
                  value={getStr('type')}
                  onChange={(e) => setStr('type', e.target.value)}
                  placeholder={
                    lang === 'vi' ? 'Toàn thời gian' : lang === 'en' ? 'Full-time' : '全职'
                  }
                />
              </Field>
              <Field label="Tags" help="Phân tách bằng dấu phẩy. Dùng chung cho 3 ngôn ngữ.">
                <input
                  className="lac-input"
                  value={v.tagsText}
                  onChange={(e) => set('tagsText', e.target.value)}
                  placeholder="Cơ khí, ISO, PLC"
                />
              </Field>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <button type="submit" className="lac-btn primary" disabled={busy}>
          <AdminIcon name="check" size={15} />
          {busy ? 'Đang lưu…' : 'Lưu vị trí'}
        </button>
        <button type="button" className="lac-btn" onClick={() => router.push('/admin/jobs')}>
          Huỷ
        </button>
      </div>
    </form>
  );
}
