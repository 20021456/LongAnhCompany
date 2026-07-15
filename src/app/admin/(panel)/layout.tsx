import { requireAuth } from '@/lib/auth-helpers';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';

/**
 * Authenticated admin shell — sidebar + topbar around every panel page.
 * `requireAuth()` redirects to /admin/login if there is no session
 * (the middleware already blocks unauthenticated /admin/* requests;
 * this is the in-app safety net + gives us the user object).
 */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();

  return (
    <div className="lac-app">
      <AdminSidebar role={user.role} permissions={user.permissions} />
      <div className="lac-main">
        <AdminTopbar name={user.name ?? user.email} email={user.email} role={user.role} />
        <div className="lac-body">{children}</div>
      </div>
    </div>
  );
}
