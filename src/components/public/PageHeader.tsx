import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  eyebrow: string;
  title: string;
  sub?: string;
  breadcrumb?: Crumb[];
}

export function PageHeader({ eyebrow, title, sub, breadcrumb }: Props) {
  return (
    <section className="va-pageheader">
      <div className="va-wrap">
        {breadcrumb ? (
          <div className="va-bcrumb">
            {breadcrumb.map((c, i) => (
              <span key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
                {i < breadcrumb.length - 1 ? <Icon name="chevron" size={11} /> : null}
              </span>
            ))}
          </div>
        ) : null}
        <div className="va-eyebrow" data-reveal>
          {eyebrow}
        </div>
        <h1 data-reveal data-reveal-delay="1">{title}</h1>
        {sub ? (
          <p data-reveal data-reveal-delay="2">
            {sub}
          </p>
        ) : null}
      </div>
    </section>
  );
}
