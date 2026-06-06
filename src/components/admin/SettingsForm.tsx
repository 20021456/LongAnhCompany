'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminIcon } from './AdminIcon';
import { saveSettings, type ActionResult } from '@/app/admin/(panel)/settings/actions';

export interface SettingRow {
  key: string;
  group: string;
  vi: string;
  en: string;
  zh: string;
}

const GROUP_LABEL: Record<string, string> = {
  brand: 'Thương hiệu',
  contact: 'Thông tin liên hệ',
  social: 'Mạng xã hội',
  general: 'Chung',
};

export function SettingsForm({ rows }: { rows: SettingRow[] }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, { vi: string; en: string; zh: string }>>(
    Object.fromEntries(rows.map((r) => [r.key, { vi: r.vi, en: r.en, zh: r.zh }])),
  );
  const [state, setState] = useState<ActionResult | null>(null);
  const [busy, setBusy] = useState(false);

  const groups = [...new Set(rows.map((r) => r.group))];

  const setVal = (key: string, locale: 'vi' | 'en' | 'zh', val: string) =>
    setValues((p) => ({ ...p, [key]: { ...p[key], [locale]: val } }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setState(null);
    const res = await saveSettings(values);
    setBusy(false);
    setState(res);
    if (res.ok) router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      {state?.error ? (
        <div className="lg-err" style={{ marginBottom: 16 }}>
          <AdminIcon name="shield" size={14} />
          {state.error}
        </div>
      ) : null}
      {state?.ok ? (
        <div className="lac-badge pub" style={{ marginBottom: 16, padding: '8px 12px' }}>
          <span className="dot" />
          Đã lưu cài đặt.
        </div>
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {groups.map((g) => (
          <div key={g} className="lac-card">
            <div className="lac-card-head">
              <h3>{GROUP_LABEL[g] ?? g}</h3>
            </div>
            <div className="lac-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {rows
                .filter((r) => r.group === g)
                .map((r) => (
                  <div key={r.key} className="lac-field">
                    <label>
                      {r.key}
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                      <input
                        className="lac-input"
                        placeholder="VI"
                        value={values[r.key]?.vi ?? ''}
                        onChange={(e) => setVal(r.key, 'vi', e.target.value)}
                      />
                      <input
                        className="lac-input"
                        placeholder="EN"
                        value={values[r.key]?.en ?? ''}
                        onChange={(e) => setVal(r.key, 'en', e.target.value)}
                      />
                      <input
                        className="lac-input"
                        placeholder="ZH"
                        value={values[r.key]?.zh ?? ''}
                        onChange={(e) => setVal(r.key, 'zh', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <button type="submit" className="lac-btn primary" disabled={busy}>
          <AdminIcon name="check" size={15} />
          {busy ? 'Đang lưu…' : 'Lưu cài đặt'}
        </button>
      </div>
    </form>
  );
}
