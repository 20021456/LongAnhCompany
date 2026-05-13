import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/config';
import { COPY } from '@/data/copy';
import { Icon } from '@/components/ui/Icon';

export default function JobDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(params.locale);
  const loc = params.locale as Locale;
  const C = COPY[loc];

  return (
    <>
      <section style={{ background: 'var(--va-bg-alt)', borderBottom: '1px solid var(--va-line)' }}>
        <div className="va-wrap" style={{ padding: '14px 0' }}>
          <nav style={{ fontSize: 12.5, opacity: 0.7, display: 'flex', gap: 6, alignItems: 'center' }}>
            <Link href={`/${loc}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              {C.nav[0]}
            </Link>
            <Icon name="chevron" size={12} />
            <Link href={`/${loc}/career`} style={{ color: 'inherit', textDecoration: 'none' }}>
              {C.nav[3]}
            </Link>
          </nav>
        </div>
      </section>

      <section className="va-section">
        <div className="va-wrap" style={{ maxWidth: 920, margin: '0 auto' }}>
          <div className="va-eyebrow">{loc === 'vi' ? 'Sản xuất' : loc === 'en' ? 'Manufacturing' : '生产'}</div>
          <h1 style={{ fontSize: 'clamp(28px,3.2vw,44px)', margin: '12px 0 24px' }}>
            {params.slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </h1>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
              padding: '20px 24px',
              border: '1px solid var(--va-line)',
              borderRadius: 14,
              background: 'var(--va-card)',
              marginBottom: 36,
            }}
          >
            <SpecItem label="Location" value="Quỳ Hợp, Nghệ An" />
            <SpecItem label="Salary" value="18 – 30M" />
            <SpecItem label="Experience" value="2–5 years" />
            <SpecItem label="Deadline" value="30/06/2026" />
          </div>

          <Section title={loc === 'vi' ? 'Mô tả công việc' : 'Job description'}>
            <p>
              {loc === 'vi'
                ? 'Vận hành và giám sát dây chuyền nghiền bột đá CaCO₃, đảm bảo chất lượng sản phẩm và an toàn lao động theo tiêu chuẩn ISO 9001.'
                : 'Operate and supervise CaCO₃ grinding lines, ensuring product quality and workplace safety to ISO 9001 standards.'}
            </p>
          </Section>

          <Section title={loc === 'vi' ? 'Trách nhiệm chính' : 'Key responsibilities'}>
            <List
              items={[
                'Vận hành dây chuyền sản xuất 8 tiếng/ca theo SOP',
                'Kiểm tra thông số kỹ thuật từng lô (cỡ hạt, độ trắng, độ ẩm)',
                'Phối hợp với phòng QC khi có lô không đạt',
                'Đào tạo công nhân mới về vận hành thiết bị',
                'Bảo trì cấp 1 thiết bị, ghi nhận sự cố vào hệ thống',
              ]}
            />
          </Section>

          <Section title={loc === 'vi' ? 'Yêu cầu' : 'Requirements'}>
            <List
              items={[
                'Tốt nghiệp Đại học chuyên ngành Cơ khí / Hóa / Công nghệ vật liệu',
                '2–5 năm kinh nghiệm trong sản xuất công nghiệp',
                'Thành thạo PLC, biến tần, hệ thống điều khiển dây chuyền',
                'Tiếng Anh giao tiếp cơ bản (đọc tài liệu kỹ thuật)',
                'Sẵn sàng đi công tác Quỳ Hợp khi cần',
              ]}
            />
          </Section>

          <Section title={loc === 'vi' ? 'Quyền lợi' : 'Benefits'}>
            <List
              items={[
                'Lương cơ bản 18–30 triệu + phụ cấp ca + thưởng KPI',
                'BHXH / BHYT / BHTN đóng đủ trên lương thực tế',
                'Khám sức khỏe định kỳ + bảo hiểm tai nạn 24/7',
                'Du lịch hằng năm, lương tháng 13',
                'Đào tạo kỹ thuật trong & ngoài nước',
              ]}
            />
          </Section>

          <div className="va-cap" style={{ marginTop: 40 }}>
            <div>
              <div className="va-eyebrow">
                {loc === 'vi' ? 'Ứng tuyển' : loc === 'en' ? 'Apply' : '申请'}
              </div>
              <h2>
                {loc === 'vi'
                  ? 'Sẵn sàng gia nhập?'
                  : loc === 'en'
                    ? 'Ready to apply?'
                    : '准备好申请了吗?'}
              </h2>
              <p>
                {loc === 'vi'
                  ? 'Gửi CV về hr@longanhcorp.com với tiêu đề [Vị trí - Họ tên]. Vòng phỏng vấn đầu trong 5 ngày làm việc.'
                  : 'Send your CV to hr@longanhcorp.com with subject [Position - Your name]. First-round interview within 5 business days.'}
              </p>
            </div>
            <a
              href="mailto:[email protected]"
              className="va-btn va-btn-p"
              style={{ alignSelf: 'center', justifySelf: 'end' }}
            >
              <Icon name="mail" size={15} /> hr@longanhcorp.com
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, opacity: 0.55, letterSpacing: '.08em', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 22, marginBottom: 12 }}>{title}</h2>
      <div style={{ fontSize: 14.5, lineHeight: 1.7, opacity: 0.82 }}>{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul style={{ paddingLeft: 22, margin: 0 }}>
      {items.map((it, i) => (
        <li key={i} style={{ marginBottom: 6 }}>
          {it}
        </li>
      ))}
    </ul>
  );
}
