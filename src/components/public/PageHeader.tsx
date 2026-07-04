import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { SmartImage } from '@/components/ui/SmartImage';
import { Words } from './Words';

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  eyebrow: string;
  title: string;
  sub?: string;
  breadcrumb?: Crumb[];
  /** Full-photo variant: dark-graded background image, white type. */
  bgImage?: string;
}

export function PageHeader({ eyebrow, title, sub, breadcrumb, bgImage }: Props) {
  return (
    <section className={'va-pageheader' + (bgImage ? ' va-pageheader--photo' : '')}>
      {bgImage ? (
        <div className="va-pageheader-bg">
          <SmartImage src={bgImage} alt="" width={2000} height={1200} priority />
        </div>
      ) : null}
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
        <h1 data-reveal="words">
          <Words text={title} step={120} />
        </h1>
        {sub ? (
          <p className="dim" data-reveal="words">
            <Words text={sub} step={40} from={500} />
          </p>
        ) : null}
      </div>
    </section>
  );
}
