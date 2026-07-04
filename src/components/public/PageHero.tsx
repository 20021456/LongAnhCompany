import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { SmartImage } from '@/components/ui/SmartImage';
import { Words } from './Words';

interface Crumb {
  label: string;
  href?: string;
}
interface Stat {
  value: string;
  label: string;
}
interface Cta {
  label: string;
  href: string;
  primary?: boolean;
}

interface Props {
  eyebrow: string;
  title: string;
  sub?: string;
  bgImage: string;
  breadcrumb?: Crumb[];
  stats?: Stat[];
  ctas?: Cta[];
}

/** A hash/external href renders as <a>; internal routes use next/link. */
function HeroLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  if (href.startsWith('#') || href.startsWith('mailto:') || /^https?:\/\//.test(href)) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    );
  }
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}

/**
 * Shared full-photo page banner in the home-hero layout: background image
 * under a dark grade, title top-left, optional stats bottom-left, sub copy
 * and optional CTAs bottom-right. Reuses the `.va-hero4` styles (so the
 * sticky header goes transparent over it automatically via :has).
 */
export function PageHero({ eyebrow, title, sub, bgImage, breadcrumb, stats, ctas }: Props) {
  return (
    <section className="va-hero4 va-pagehero">
      <div className="va-hero4-bg">
        <SmartImage src={bgImage} alt="" width={2000} height={1250} priority />
      </div>
      <div className="va-wrap va-hero4-in">
        <div className="va-hero4-top">
          {breadcrumb ? (
            <div className="va-bcrumb va-pagehero-crumb">
              {breadcrumb.map((c, i) => (
                <span key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
                  {i < breadcrumb.length - 1 ? <Icon name="chevron" size={11} /> : null}
                </span>
              ))}
            </div>
          ) : null}
          <div className="va-eyebrow">{eyebrow}</div>
          <h1 data-reveal="words">
            <Words text={title} step={120} />
          </h1>
        </div>
        <div className="va-hero4-bottom">
          <div className="va-hero4-stats">
            {(stats ?? []).map((s, i) => (
              <div key={i} className="va-hero4-stat" data-reveal data-reveal-delay={String(i + 1)}>
                <b data-countup>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <div className="va-hero4-side" data-reveal data-reveal-delay="2">
            {sub ? <p>{sub}</p> : null}
            {ctas && ctas.length > 0 ? (
              <div className="va-hero-cta">
                {ctas.map((c, i) => (
                  <HeroLink key={i} href={c.href} className={'va-btn ' + (c.primary ? 'va-btn-p' : 'va-btn-w')}>
                    {c.label}
                    {c.primary ? <Icon name="arrow" size={15} /> : null}
                  </HeroLink>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
