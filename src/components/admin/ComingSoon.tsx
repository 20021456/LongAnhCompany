import { AdminPageHead, AdminEmpty } from './AdminPageHead';

/** Placeholder for admin modules scheduled for a later iteration. */
export function ComingSoon({
  title,
  crumb,
  note,
}: {
  title: string;
  crumb: string;
  note: string;
}) {
  return (
    <>
      <AdminPageHead crumbs={[{ label: crumb }]} title={title} sub="Module đang được phát triển" />
      <AdminEmpty>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ad-text-soft)' }}>{title}</div>
        <div style={{ marginTop: 6 }}>{note}</div>
      </AdminEmpty>
    </>
  );
}
