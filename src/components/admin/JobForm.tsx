'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminIcon } from './AdminIcon';
import { Field, FieldRow } from './FormBits';
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

export function JobForm({
  initial,
  departments,
}: {
  initial: JobFormValue;
  departments: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [v, setV] = useState<JobFormValue>(initial);
  const [state, setState] = useState<ActionResult | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof JobFormValue>(k: K, val: JobFormValue[K]) =>
    setV((p) => ({ ...p, [k]: val }));

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

  return (
    <form onSubmit={onSubmit}>
      {state?.error ? (
        <div className="lg-err" style={{ marginBottom: 16 }}>
          <AdminIcon name="shield" size={14} />
          {state.error}
        </div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="ad-card">
            <div className="ad-card-head">
              <h3>Thông tin vị trí</h3>
            </div>
            <div className="ad-card-body">
              <FieldRow>
                <Field label="Slug" required help="VD: 9 hoặc ky-su-moi">
                  <input className="ad-input" value={v.slug} onChange={(e) => set('slug', e.target.value)} required />
                </Field>
                <Field label="Phòng ban" required>
                  <select className="ad-select" value={v.departmentId} onChange={(e) => set('departmentId', e.target.value)} required>
                    <option value="">— Chọn phòng ban —</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </FieldRow>

              <Field label="Tên vị trí (VI)" required>
                <input className="ad-input" value={v.titleVi} onChange={(e) => set('titleVi', e.target.value)} required />
              </Field>
              <FieldRow>
                <Field label="Tên (EN)">
                  <input className="ad-input" value={v.titleEn} onChange={(e) => set('titleEn', e.target.value)} />
                </Field>
                <Field label="Tên (ZH)">
                  <input className="ad-input" value={v.titleZh} onChange={(e) => set('titleZh', e.target.value)} />
                </Field>
              </FieldRow>

              <Field label="Mô tả công việc (VI)">
                <textarea className="ad-textarea" value={v.descriptionVi} onChange={(e) => set('descriptionVi', e.target.value)} />
              </Field>
              <FieldRow>
                <Field label="Mô tả (EN)">
                  <textarea className="ad-textarea" value={v.descriptionEn} onChange={(e) => set('descriptionEn', e.target.value)} />
                </Field>
                <Field label="Mô tả (ZH)">
                  <textarea className="ad-textarea" value={v.descriptionZh} onChange={(e) => set('descriptionZh', e.target.value)} />
                </Field>
              </FieldRow>
            </div>
          </div>

          {(['resp', 'req', 'ben'] as const).map((key) => {
            const labels = {
              resp: 'Trách nhiệm chính',
              req: 'Yêu cầu công việc',
              ben: 'Quyền lợi & phúc lợi',
            };
            return (
              <div key={key} className="ad-card">
                <div className="ad-card-head">
                  <div>
                    <h3>{labels[key]}</h3>
                    <p>Mỗi dòng là một mục.</p>
                  </div>
                </div>
                <div className="ad-card-body">
                  <Field label="Tiếng Việt">
                    <textarea
                      className="ad-textarea"
                      value={v[`${key}Vi` as keyof JobFormValue] as string}
                      onChange={(e) => set(`${key}Vi` as keyof JobFormValue, e.target.value as never)}
                    />
                  </Field>
                  <FieldRow>
                    <Field label="English">
                      <textarea
                        className="ad-textarea"
                        value={v[`${key}En` as keyof JobFormValue] as string}
                        onChange={(e) => set(`${key}En` as keyof JobFormValue, e.target.value as never)}
                      />
                    </Field>
                    <Field label="中文">
                      <textarea
                        className="ad-textarea"
                        value={v[`${key}Zh` as keyof JobFormValue] as string}
                        onChange={(e) => set(`${key}Zh` as keyof JobFormValue, e.target.value as never)}
                      />
                    </Field>
                  </FieldRow>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="ad-card">
            <div className="ad-card-head">
              <h3>Trạng thái</h3>
            </div>
            <div className="ad-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
                <input type="checkbox" checked={v.isActive} onChange={(e) => set('isActive', e.target.checked)} />
                Đang tuyển (hiển thị trên web)
              </label>
              <Field label="Số lượng tuyển">
                <input className="ad-input" type="number" value={v.slots} onChange={(e) => set('slots', Number(e.target.value))} />
              </Field>
              <Field label="Hạn nộp" help="Định dạng DD/MM/YYYY">
                <input className="ad-input" value={v.deadlineText} onChange={(e) => set('deadlineText', e.target.value)} placeholder="30/06/2026" />
              </Field>
            </div>
          </div>

          <div className="ad-card">
            <div className="ad-card-head">
              <h3>Chi tiết</h3>
            </div>
            <div className="ad-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="Địa điểm">
                <input className="ad-input" value={v.location} onChange={(e) => set('location', e.target.value)} placeholder="Quỳ Hợp, Nghệ An" />
              </Field>
              <Field label="Mức lương (VI / EN / ZH)">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <input className="ad-input" placeholder="18 – 30 triệu VND" value={v.salaryTextVi} onChange={(e) => set('salaryTextVi', e.target.value)} />
                  <input className="ad-input" placeholder="18–30M VND" value={v.salaryTextEn} onChange={(e) => set('salaryTextEn', e.target.value)} />
                  <input className="ad-input" placeholder="18–30M VND" value={v.salaryTextZh} onChange={(e) => set('salaryTextZh', e.target.value)} />
                </div>
              </Field>
              <Field label="Kinh nghiệm (VI / EN / ZH)">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <input className="ad-input" placeholder="2–5 năm" value={v.experienceVi} onChange={(e) => set('experienceVi', e.target.value)} />
                  <input className="ad-input" placeholder="2–5 years" value={v.experienceEn} onChange={(e) => set('experienceEn', e.target.value)} />
                  <input className="ad-input" placeholder="2–5年" value={v.experienceZh} onChange={(e) => set('experienceZh', e.target.value)} />
                </div>
              </Field>
              <Field label="Cấp bậc (VI / EN / ZH)">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <input className="ad-input" placeholder="Chuyên viên" value={v.levelVi} onChange={(e) => set('levelVi', e.target.value)} />
                  <input className="ad-input" placeholder="Specialist" value={v.levelEn} onChange={(e) => set('levelEn', e.target.value)} />
                  <input className="ad-input" placeholder="专员" value={v.levelZh} onChange={(e) => set('levelZh', e.target.value)} />
                </div>
              </Field>
              <Field label="Loại hình (VI / EN / ZH)">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <input className="ad-input" placeholder="Toàn thời gian" value={v.typeVi} onChange={(e) => set('typeVi', e.target.value)} />
                  <input className="ad-input" placeholder="Full-time" value={v.typeEn} onChange={(e) => set('typeEn', e.target.value)} />
                  <input className="ad-input" placeholder="全职" value={v.typeZh} onChange={(e) => set('typeZh', e.target.value)} />
                </div>
              </Field>
              <Field label="Tags" help="Phân tách bằng dấu phẩy">
                <input className="ad-input" value={v.tagsText} onChange={(e) => set('tagsText', e.target.value)} placeholder="Cơ khí, ISO, PLC" />
              </Field>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <button type="submit" className="ad-btn primary" disabled={busy}>
          <AdminIcon name="check" size={15} />
          {busy ? 'Đang lưu…' : 'Lưu vị trí'}
        </button>
        <button type="button" className="ad-btn" onClick={() => router.push('/admin/jobs')}>
          Huỷ
        </button>
      </div>
    </form>
  );
}
