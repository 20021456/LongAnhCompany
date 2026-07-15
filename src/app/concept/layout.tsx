import type { Metadata } from 'next';

/**
 * Design-concept previews — internal only, never indexed.
 * Each concept page is fully self-contained (own header/footer/styles)
 * so the three directions can be compared without the production shell.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: { default: 'Design concepts · KS Long Anh', template: '%s · Concepts' },
};

export default function ConceptLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
