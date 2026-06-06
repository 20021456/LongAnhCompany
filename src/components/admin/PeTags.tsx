'use client';

import { useState, type KeyboardEvent } from 'react';
import { AdminIcon } from './AdminIcon';

/**
 * Tag chip editor — port of prototype's PeTags.
 *
 * Renders the tags as `<span class="lac-tag">` chips with an X button,
 * plus an inline "Thêm tag…" input. Press Enter or comma to add a tag;
 * Backspace on an empty input deletes the last tag (matching the
 * prototype's expected behaviour).
 */
export function PeTags({
  tags,
  onChange,
  placeholder = 'Thêm tag…',
}: {
  tags: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');

  const add = (raw: string) => {
    const v = raw.trim();
    if (!v) return;
    if (tags.includes(v)) {
      setDraft('');
      return;
    }
    onChange([...tags, v]);
    setDraft('');
  };

  const remove = (idx: number) => {
    onChange(tags.filter((_, i) => i !== idx));
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(draft);
      return;
    }
    if (e.key === 'Backspace' && !draft && tags.length > 0) {
      e.preventDefault();
      remove(tags.length - 1);
    }
  };

  return (
    <div className="lac-tags">
      {tags.map((t, i) => (
        <span key={`${t}-${i}`} className="lac-tag">
          {t}
          <button type="button" aria-label={`Bỏ ${t}`} onClick={() => remove(i)}>
            <AdminIcon name="x" size={11} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKey}
        onBlur={() => draft && add(draft)}
        placeholder={placeholder}
      />
    </div>
  );
}
