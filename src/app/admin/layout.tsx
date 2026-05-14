import type { Metadata } from 'next';
import './admin.css';

export const metadata: Metadata = {
  title: 'Long Anh Admin',
  robots: { index: false, follow: false },
};

/**
 * Admin segment layout — only pulls in the admin stylesheet. The
 * authenticated shell (sidebar + topbar) lives in (panel)/layout.tsx
 * so the /admin/login page can render without it. The <html>/<body>
 * come from the root app/layout.tsx.
 */
export default function AdminSegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
