import Link from 'next/link';
import { AdminIcon, type AdminIconName } from './AdminIcon';

/** Breadcrumb + title + optional action area shared by every admin page. */
export function AdminPageHead({
  crumbs,
  title,
  sub,
  actions,
}: {
  crumbs: { label: string; href?: string }[];
  title: string;
  sub?: string;
  actions?: React.ReactNode;
}) {
  return (
    <>
      <div className="ad-crumb">
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {i > 0 ? <span className="sep">/</span> : null}
            {c.href ? (
              <Link href={c.href}>{c.label}</Link>
            ) : (
              <span className="cur">{c.label}</span>
            )}
          </span>
        ))}
      </div>
      <div className="ad-phead">
        <div>
          <h1>{title}</h1>
          {sub ? <p>{sub}</p> : null}
        </div>
        {actions ? <div className="ad-phead-actions">{actions}</div> : null}
      </div>
    </>
  );
}

/** Empty-state block for lists with no rows. */
export function AdminEmpty({ children }: { children: React.ReactNode }) {
  return <div className="ad-empty">{children}</div>;
}

/** Status badge — maps a status string to a coloured pill. */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    published: 'pub',
    active: 'pub',
    won: 'pub',
    new: 'draft',
    draft: 'draft',
    reviewing: 'draft',
    contacted: 'sched',
    quoted: 'sched',
    interview: 'sched',
    archived: 'hide',
    lost: 'hide',
    rejected: 'hide',
    closed: 'hide',
  };
  return (
    <span className={'ad-badge ' + (map[status] ?? 'hide')}>
      <span className="dot" />
      {status}
    </span>
  );
}

export function AdminLinkButton({
  href,
  icon,
  variant = '',
  children,
}: {
  href: string;
  icon?: AdminIconName;
  variant?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={'ad-btn ' + variant}>
      {icon ? <AdminIcon name={icon} size={15} /> : null}
      {children}
    </Link>
  );
}
