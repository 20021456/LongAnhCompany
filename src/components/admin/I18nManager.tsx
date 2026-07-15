'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminIcon } from './AdminIcon';
import {
  saveLanguages,
  saveTranslations,
  type ActionResult,
} from '@/app/admin/(panel)/i18n/actions';

export interface LangRow {
  code: string;
  name: string;
  flagEmoji: string;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
}

export interface StringRow {
  fullKey: string;
  namespace: string;
  vi: string;
  en: string;
  zh: string;
  overridden: boolean;
}

function Banner({ state }: { state: ActionResult | null }) {
  if (!state) return null;
  if (state.error)
    return (
      <div className="lg-err" style={{ marginBottom: 12 }}>
        <AdminIcon name="shield" size={14} />
        {state.error}
      </div>
    );
  if (state.ok)
    return (
      <div className="ad-badge pub" style={{ marginBottom: 12, padding: '8px 12px' }}>
        <span className="dot" />
        Đã lưu thành công.
      </div>
    );
  return null;
}

function LanguagesCard({ rows }: { rows: LangRow[] }) {
  const router = useRouter();
  const [langs, setLangs] = useState<LangRow[]>(rows);
  const [state, setState] = useState<ActionResult | null>(null);
  const [busy, setBusy] = useState(false);

  const update = (i: number, patch: Partial<LangRow>) =>
    setLangs((p) => p.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  const setDefault = (i: number) =>
    setLangs((p) => p.map((l, idx) => ({ ...l, isDefault: idx === i })));

  async function onSave() {
    setBusy(true);
    setState(null);
    const res = await saveLanguages(langs);
    setBusy(false);
    setState(res);
    if (res.ok) router.refresh();
  }

  return (
    <div className="ad-card">
      <div className="ad-card-head">
        <div>
          <h3>Ngôn ngữ</h3>
          <p>Bật/tắt và sắp xếp ngôn ngữ hiển thị trên website.</p>
        </div>
      </div>
      <div className="ad-card-body">
        <Banner state={state} />
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tên</th>
                <th>Cờ</th>
                <th>Thứ tự</th>
                <th>Mặc định</th>
                <th>Kích hoạt</th>
              </tr>
            </thead>
            <tbody>
              {langs.map((l, i) => (
                <tr key={l.code}>
                  <td style={{ fontWeight: 600 }}>{l.code}</td>
                  <td>
                    <input
                      className="ad-input"
                      value={l.name}
                      onChange={(e) => update(i, { name: e.target.value })}
                    />
                  </td>
                  <td style={{ width: 80 }}>
                    <input
                      className="ad-input"
                      value={l.flagEmoji}
                      onChange={(e) => update(i, { flagEmoji: e.target.value })}
                      style={{ textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ width: 90 }}>
                    <input
                      className="ad-input"
                      type="number"
                      value={l.sortOrder}
                      onChange={(e) => update(i, { sortOrder: Number(e.target.value) })}
                    />
                  </td>
                  <td>
                    <input
                      type="radio"
                      name="default-lang"
                      checked={l.isDefault}
                      onChange={() => setDefault(i)}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={l.isActive}
                      disabled={l.isDefault}
                      onChange={(e) => update(i, { isActive: e.target.checked })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 14 }}>
          <button type="button" className="ad-btn primary" disabled={busy} onClick={onSave}>
            <AdminIcon name="check" size={15} />
            {busy ? 'Đang lưu…' : 'Lưu ngôn ngữ'}
          </button>
        </div>
      </div>
    </div>
  );
}

function TranslationsCard({ rows }: { rows: StringRow[] }) {
  const router = useRouter();
  const [strings, setStrings] = useState<StringRow[]>(rows);
  const [ns, setNs] = useState('all');
  const [q, setQ] = useState('');
  const [state, setState] = useState<ActionResult | null>(null);
  const [busy, setBusy] = useState(false);

  const namespaces = useMemo(() => [...new Set(rows.map((r) => r.namespace))].sort(), [rows]);

  const update = (fullKey: string, patch: Partial<StringRow>) =>
    setStrings((p) => p.map((r) => (r.fullKey === fullKey ? { ...r, ...patch } : r)));

  const visible = strings.filter((r) => {
    if (ns !== 'all' && r.namespace !== ns) return false;
    if (q && !r.fullKey.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  async function onSave() {
    // Only send rows the editor actually changed.
    const dirty = strings.filter((r) => {
      const orig = rows.find((o) => o.fullKey === r.fullKey)!;
      return orig.vi !== r.vi || orig.en !== r.en || orig.zh !== r.zh;
    });
    if (dirty.length === 0) {
      setState({ error: 'Chưa có thay đổi nào để lưu.' });
      return;
    }
    setBusy(true);
    setState(null);
    const res = await saveTranslations(
      dirty.map((r) => ({
        fullKey: r.fullKey,
        namespace: r.namespace,
        vi: r.vi,
        en: r.en,
        zh: r.zh,
      })),
    );
    setBusy(false);
    setState(res);
    if (res.ok) router.refresh();
  }

  return (
    <div className="ad-card">
      <div className="ad-card-head">
        <div>
          <h3>Chuỗi giao diện</h3>
          <p>Ghi đè chuỗi dịch tĩnh. Để trống cả ba ô để khôi phục giá trị gốc từ tệp ngôn ngữ.</p>
        </div>
      </div>
      <div className="ad-card-body">
        <Banner state={state} />
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <select className="ad-select" value={ns} onChange={(e) => setNs(e.target.value)}>
            <option value="all">Tất cả nhóm</option>
            {namespaces.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <input
            className="ad-input"
            placeholder="Tìm theo key…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>Key</th>
                <th>VI</th>
                <th>EN</th>
                <th>ZH</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.fullKey}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 12.5 }}>{r.fullKey}</div>
                    {r.overridden ? (
                      <span className="ad-badge sched" style={{ marginTop: 4 }}>
                        <span className="dot" />
                        đã ghi đè
                      </span>
                    ) : null}
                  </td>
                  {(['vi', 'en', 'zh'] as const).map((loc) => (
                    <td key={loc}>
                      <textarea
                        className="ad-textarea"
                        rows={2}
                        value={r[loc]}
                        onChange={(e) => update(r.fullKey, { [loc]: e.target.value })}
                      />
                    </td>
                  ))}
                </tr>
              ))}
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--ad-text-mute)' }}>
                    Không có chuỗi nào khớp.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 14 }}>
          <button type="button" className="ad-btn primary" disabled={busy} onClick={onSave}>
            <AdminIcon name="check" size={15} />
            {busy ? 'Đang lưu…' : 'Lưu bản dịch'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function I18nManager({ langs, strings }: { langs: LangRow[]; strings: StringRow[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <LanguagesCard rows={langs} />
      <TranslationsCard rows={strings} />
    </div>
  );
}
