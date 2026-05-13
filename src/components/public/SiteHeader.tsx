import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Icon, Logo } from '@/components/ui/Icon';
import { LanguageSwitcher } from './LanguageSwitcher';

interface Props {
  locale: Locale;
  active?: 'home' | 'about' | 'products' | 'career' | 'news' | 'contact';
}

export function SiteHeader({ locale, active }: Props) {
  const C = COPY[locale];
  const navIds = ['home', 'about', 'products', 'career', 'news', 'contact'] as const;
  const navHrefs = [
    `/${locale}`,
    `/${locale}/about`,
    `/${locale}/products`,
    `/${locale}/career`,
    `/${locale}/news`,
    `/${locale}/contact`,
  ];

  const shortBrand =
    locale === 'zh' ? '龙英矿业' : locale === 'en' ? 'LONG ANH MINERAL' : 'KS LONG ANH';

  return (
    <>
      {/* Top strip */}
      <div className="va-strip">
        <div className="va-wrap va-strip-in">
          <span>
            {locale === 'zh' ? '销售热线:' : locale === 'en' ? 'Sales hotline:' : 'Hotline kinh doanh:'}{' '}
            <b style={{ color: '#fff' }}>{C.phone[0]}</b>
          </span>
          <div className="va-strip-r">
            <a href={`mailto:${C.email}`}>
              <Icon name="mail" size={13} /> {C.email}
            </a>
            <span style={{ opacity: 0.4 }}>·</span>
            <a href={`/${locale}/contact`}>ISO 9001 : 2015</a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="va-hd">
        <div className="va-wrap va-hd-in">
          <Link href={`/${locale}`} className="va-brand">
            <span className="va-brand-mark">
              <Logo size={48} />
            </span>
            <span className="va-brand-name">
              <b>{shortBrand}</b>
              <span>{C.tagline}</span>
            </span>
          </Link>

          <nav className="va-nav">
            {C.nav.map((label: string, i: number) => {
              const id = navIds[i];
              const href = navHrefs[i];
              const isActive = active === id;

              if (id === 'products') {
                return (
                  <div key={i} className="va-nav-item">
                    <Link href={href} className={isActive ? 'is-active' : ''}>
                      {label}
                    </Link>
                    <div className="va-nav-dropdown">
                      <Link href={`/${locale}/products#powder`}>
                        <b>
                          {locale === 'zh'
                            ? '碳酸钙粉'
                            : locale === 'en'
                              ? 'CaCO₃ Powder'
                              : 'Bột đá CaCO₃'}
                        </b>
                        <span>Coated · Uncoated · 3–20 µm</span>
                      </Link>
                      <Link href={`/${locale}/products#stone`}>
                        <b>
                          {locale === 'zh'
                            ? '天然石材饰面'
                            : locale === 'en'
                              ? 'Natural cladding stone'
                              : 'Đá ốp lát tự nhiên'}
                        </b>
                        <span>
                          {locale === 'zh'
                            ? '大板 · 定制石材 · 装饰石材'
                            : locale === 'en'
                              ? 'Slab · Cut tile · Decorative'
                              : 'Slab · Đá xẻ · Đá trang trí'}
                        </span>
                      </Link>
                    </div>
                  </div>
                );
              }

              if (id === 'career') {
                const cdept = [
                  ['Sản xuất', 'Manufacturing', '生产', 'san-xuat'],
                  ['Kinh doanh', 'Sales', '销售', 'kinh-doanh'],
                  ['Kỹ thuật', 'Engineering', '工程', 'ky-thuat'],
                  ['Chất lượng', 'Quality', '质量', 'chat-luong'],
                  ['Hành chính', 'Admin', '行政', 'hanh-chinh'],
                ];
                const cdepSubs = [
                  ['Vận hành nhà máy · Bảo trì thiết bị', 'Plant ops · Equipment maintenance', '工厂运营 · 设备维护'],
                  ['Xuất khẩu · Bán hàng nội địa', 'Export sales · Domestic sales', '出口销售 · 国内销售'],
                  ['Cải tiến quy trình · PLC', 'Process · PLC', '工艺改进 · PLC'],
                  ['Kỹ thuật QC · ISO', 'QC lab · ISO', 'QC实验室 · ISO'],
                  ['Nhân sự · Kế toán', 'HR · Accounting', '人力资源 · 会计'],
                ];
                const li = locale === 'vi' ? 0 : locale === 'en' ? 1 : 2;
                return (
                  <div key={i} className="va-nav-item">
                    <Link href={href} className={isActive ? 'is-active' : ''}>
                      {label}
                    </Link>
                    <div className="va-nav-dropdown">
                      {cdept.map((d, j) => (
                        <Link key={j} href={`/${locale}/career?dept=${d[3]}`}>
                          <b>{d[li]}</b>
                          <span>{cdepSubs[j][li]}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link key={i} href={href} className={isActive ? 'is-active' : ''}>
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="va-cta-row">
            <LanguageSwitcher current={locale} />
          </div>
        </div>
      </header>
    </>
  );
}
