'use client';

import { useState } from 'react';
import { AdminIcon, type AdminIconName } from './AdminIcon';

export type Lang = 'vi' | 'en' | 'zh';

export const LANGS: { id: Lang; label: string; flag: string }[] = [
  { id: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'zh', label: '中文', flag: '🇨🇳' },
];

/** VN / EN / ZH language tab strip used on the editor screens. */
export function LangTabs({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="pe-langtabs">
      {LANGS.map((l) => (
        <button
          key={l.id}
          type="button"
          className={'pe-langtab ' + (lang === l.id ? 'on' : '')}
          onClick={() => setLang(l.id)}
        >
          <span className="flag">{l.flag}</span>
          {l.label}
        </button>
      ))}
      <span className="pe-sync">
        <AdminIcon name="refresh" size={12} /> 3 ngôn ngữ chung biểu mẫu
      </span>
    </div>
  );
}

/** Collapsible numbered section card. */
export function EditorSection({
  num,
  icon,
  title,
  sub,
  defaultOpen = true,
  children,
}: {
  num: string;
  icon: AdminIconName;
  title: string;
  sub?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={'pe-section ' + (open ? 'open' : '')}>
      <button type="button" className="pe-shead" onClick={() => setOpen((o) => !o)}>
        <span className="num">{num}</span>
        <span className="ico">
          <AdminIcon name={icon} size={16} />
        </span>
        <span className="titles">
          <h3>{title}</h3>
          {sub ? <p>{sub}</p> : null}
        </span>
        <span className="chev">
          <AdminIcon name="chevron" size={16} />
        </span>
      </button>
      <div className="pe-sbody">{children}</div>
    </div>
  );
}

/** Radio-card group used in the editor sidebar (status, etc.). */
export function StatusRadioGroup<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; hint: string }[];
}) {
  return (
    <div className="pe-status">
      {options.map((o) => (
        <label key={o.value} className={value === o.value ? 'on' : ''}>
          <input type="radio" checked={value === o.value} onChange={() => onChange(o.value)} />
          <span className="radio" />
          <div>
            <div style={{ fontWeight: 500 }}>{o.label}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ad-text-mute)' }}>{o.hint}</div>
          </div>
        </label>
      ))}
    </div>
  );
}

/** A small toggle switch (label + AdSwitch-style control). */
export function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 13,
        cursor: 'pointer',
      }}
    >
      <span>{label}</span>
      <button
        type="button"
        className={'lac-switch ' + (checked ? 'on' : '')}
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
      />
    </label>
  );
}
