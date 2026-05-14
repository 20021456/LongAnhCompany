import { requirePermission } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { AdminPageHead } from '@/components/admin/AdminPageHead';
import { I18nManager, type LangRow, type StringRow } from '@/components/admin/I18nManager';
import viMessages from '../../../../../messages/vi.json';
import enMessages from '../../../../../messages/en.json';
import zhMessages from '../../../../../messages/zh.json';

type Tree = Record<string, unknown>;

/** Flatten a nested messages object → { "namespace.key": "value" }. */
function flatten(obj: Tree, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object') {
      Object.assign(out, flatten(v as Tree, key));
    } else {
      out[key] = String(v);
    }
  }
  return out;
}

export default async function AdminI18nPage() {
  await requirePermission('i18n.update');

  const [languages, overrides] = await Promise.all([
    db.language.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.translation.findMany(),
  ]);

  const langs: LangRow[] = languages.map((l) => ({
    code: l.code,
    name: l.name,
    flagEmoji: l.flagEmoji ?? '',
    isActive: l.isActive,
    isDefault: l.isDefault,
    sortOrder: l.sortOrder,
  }));

  const base = {
    vi: flatten(viMessages as Tree),
    en: flatten(enMessages as Tree),
    zh: flatten(zhMessages as Tree),
  };

  // DB overrides keyed by `${key}:${locale}` for quick lookup.
  const ov = new Map(overrides.map((t) => [`${t.key}:${t.locale}`, t.value]));

  // Union of every key seen in any base file.
  const allKeys = [
    ...new Set([...Object.keys(base.vi), ...Object.keys(base.en), ...Object.keys(base.zh)]),
  ].sort();

  const strings: StringRow[] = allKeys.map((fullKey) => {
    const namespace = fullKey.split('.')[0];
    const pick = (loc: 'vi' | 'en' | 'zh') =>
      ov.get(`${fullKey}:${loc}`) ?? base[loc][fullKey] ?? '';
    return {
      fullKey,
      namespace,
      vi: pick('vi'),
      en: pick('en'),
      zh: pick('zh'),
      overridden: ov.has(`${fullKey}:vi`) || ov.has(`${fullKey}:en`) || ov.has(`${fullKey}:zh`),
    };
  });

  return (
    <>
      <AdminPageHead
        crumbs={[{ label: 'Ngôn ngữ' }]}
        title="Ngôn ngữ & Bản dịch"
        sub={`${langs.length} ngôn ngữ · ${strings.length} chuỗi giao diện`}
      />
      <I18nManager langs={langs} strings={strings} />
    </>
  );
}
