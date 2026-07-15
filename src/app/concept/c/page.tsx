import Link from 'next/link';
import { ConceptFx } from '../ConceptFx';

export const metadata = { title: 'Concept C — Warm Industrial' };

/**
 * CONCEPT C — "Warm Industrial" (disciplined evolution of the current site).
 * Keeps the navy + orange identity and card language, but: ONE card style,
 * ONE navy band per page, no marquee/countup/parallax — reveal-once only.
 */

const P = [
  {
    img: '/assets/bot-caco3-sieu-min.webp',
    name: 'Bột đá CaCO₃ không phủ',
    meta: 'Uncoated · 3–20 µm',
    tags: ['Sơn', 'Keo', 'Bột bả'],
  },
  {
    img: '/assets/bot-sieu-min.webp',
    name: 'Bột đá CaCO₃ phủ Stearic Acid',
    meta: 'Coated · 3–20 µm',
    tags: ['PVC', 'PE/PP'],
  },
  {
    img: '/assets/da-slab-sieu-trang.webp',
    name: 'Đá Slab',
    meta: '1.6 × 2.4 m',
    tags: ['Nội thất', 'Mặt bàn'],
  },
  {
    img: '/assets/da-xe-quy-cach-1.webp',
    name: 'Đá xẻ quy cách',
    meta: '60×30 · 40×60 cm',
    tags: ['Sàn', 'Mặt tiền'],
  },
  {
    img: '/assets/da-che-den2.webp',
    name: 'Đá trang trí',
    meta: 'Sân vườn · Bể bơi',
    tags: ['Cảnh quan'],
  },
  {
    img: '/assets/da-cuoi-trang.jpeg',
    name: 'Đá cuội trắng',
    meta: 'Trang trí · Lối đi',
    tags: ['Sân vườn'],
  },
];

export default function ConceptC() {
  return (
    <div className="cc">
      <ConceptFx />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="cc-ribbon">
        CONCEPT C — WARM INDUSTRIAL · <Link href="/concept">← danh sách concept</Link>
      </div>

      <header className="cc-hd">
        <div className="cc-brand">
          <img src="/assets/long-anh-logo.png" alt="" />
          <div>
            <b>KS LONG ANH</b>
            <span>Bột đá CaCO₃ &amp; đá tự nhiên</span>
          </div>
        </div>
        <nav>
          <a href="#sp">Sản phẩm</a>
          <a href="#qt">Quy trình</a>
          <a href="#lh">Liên hệ</a>
        </nav>
        <a className="cc-btn" href="#lh">
          Yêu cầu báo giá
        </a>
      </header>

      {/* HERO — photo, light overlay, stats INSIDE the frame (no extra navy band) */}
      <section className="cc-hero">
        <img src="/assets/nha-may-bot-sieu-min.webp" alt="" />
        <div className="cc-hero-in">
          <p className="cc-kicker light" data-cr>
            Khoáng sản công nghiệp · Xuất khẩu quốc tế
          </p>
          <h1 data-cr style={{ transitionDelay: '.08s' }}>
            Khoáng đá nguyên sinh
            <br />
            từ trái tim Nghệ An
          </h1>
          <div className="cc-hero-row" data-cr style={{ transitionDelay: '.16s' }}>
            <a className="cc-btn" href="#sp">
              Xem sản phẩm
            </a>
            <div className="cc-hero-stats">
              {[
                ['20+', 'năm'],
                ['350K', 'tấn/năm'],
                ['12', 'quốc gia'],
              ].map(([v, k]) => (
                <div key={k}>
                  <b>{v}</b>
                  <span>{k}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS — ONE card style, static grid (no marquee) */}
      <section className="cc-sec" id="sp">
        <div className="cc-sec-head" data-cr>
          <div>
            <p className="cc-kicker">Danh mục sản phẩm</p>
            <h2>Năm dòng sản phẩm chính</h2>
          </div>
          <a className="cc-link" href="#sp">
            Toàn bộ →
          </a>
        </div>
        <div className="cc-grid">
          {P.map((p, i) => (
            <a
              key={p.name}
              className="cc-card"
              href="#sp"
              data-cr
              style={{ transitionDelay: `${(i % 3) * 0.07}s` }}
            >
              <div className="cc-card-img">
                <img src={p.img} alt={p.name} />
              </div>
              <div className="cc-card-body">
                <em>{p.meta}</em>
                <h3>{p.name}</h3>
                <div className="cc-tags">
                  {p.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* PROCESS — quiet numbered row */}
      <section className="cc-sec alt" id="qt">
        <div className="cc-sec-head" data-cr>
          <div>
            <p className="cc-kicker">Quy trình</p>
            <h2>Bốn bước, một tiêu chuẩn</h2>
          </div>
        </div>
        <div className="cc-steps">
          {[
            ['01', 'Khai thác từ mỏ', 'Đá vôi trắng nguyên sinh tại Quỳ Hợp, độ trắng vượt 98%.'],
            ['02', 'Nghiền siêu mịn', 'Cỡ hạt 3–20 µm, đồng đều theo từng lô sản xuất.'],
            ['03', 'Phủ Stearic Acid', 'Tăng phân tán cho ngành nhựa và sơn cao cấp.'],
            ['04', 'Kiểm định & xuất khẩu', 'COA + MSDS mỗi lô, giao FOB Cửa Lò · Hải Phòng.'],
          ].map(([n, t, d], i) => (
            <div key={n} className="cc-step" data-cr style={{ transitionDelay: `${i * 0.07}s` }}>
              <span className="cc-step-no">{n}</span>
              <h4>{t}</h4>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* THE one navy band on the page — capability + CTA together */}
      <section className="cc-navy" id="lh">
        <div className="cc-navy-l" data-cr>
          <p className="cc-kicker light">Sẵn sàng cho thị trường quốc tế</p>
          <h2>Hãy bắt đầu từ một câu hỏi.</h2>
          <p className="cc-navy-sub">
            Đội ngũ kinh doanh phản hồi trong 24h làm việc — kèm spec, COA và báo giá FOB.
          </p>
          <div className="cc-navy-cta">
            <a className="cc-btn" href="mailto:info@longanhcorp.com">
              Yêu cầu báo giá
            </a>
            <span>(+84) 942 224 499</span>
          </div>
        </div>
        <div className="cc-navy-r" data-cr style={{ transitionDelay: '.1s' }}>
          {[
            ['Mỏ đá vận hành', '05'],
            ['Công suất', '350.000 tấn/năm'],
            ['Dây chuyền', '06 nghiền · 02 phủ'],
            ['Chứng nhận', 'ISO · REACH · SGS'],
          ].map(([k, v]) => (
            <div key={k}>
              <span>{k}</span>
              <b>{v}</b>
            </div>
          ))}
        </div>
      </section>

      <footer className="cc-ft">
        <span>© 2026 Công ty TNHH KS Long Anh · Quỳ Hợp, Nghệ An</span>
        <span>info@longanhcorp.com · (+84) 942 224 499</span>
      </footer>
    </div>
  );
}

const CSS = `
.cc{--bg:#F7F8FA;--ink:#0e1726;--mut:#5b6573;--line:#e3e7ee;--navy:#0f3d7a;--acc:#F08023;
  background:var(--bg);color:var(--ink);font-family:var(--font-inter),sans-serif;font-size:15.5px;line-height:1.65}
.cc h1,.cc h2,.cc h3,.cc h4{font-family:var(--font-display),sans-serif;font-weight:500;letter-spacing:-.02em;margin:0}
.cc a{text-decoration:none;color:inherit}
.cc [data-cr]{opacity:0;transform:translateY(22px);transition:opacity .7s cubic-bezier(.22,.61,.24,1),transform .7s cubic-bezier(.22,.61,.24,1)}
.cc [data-cr].in{opacity:1;transform:none}

.cc-ribbon{position:fixed;z-index:60;bottom:18px;left:18px;background:var(--navy);color:#fff;
  font-size:11px;letter-spacing:.14em;padding:9px 14px;border-radius:99px;opacity:.94}
.cc-ribbon a{color:#f4b27a;margin-left:4px}

.cc-hd{position:sticky;top:0;z-index:50;display:flex;align-items:center;gap:36px;height:74px;
  padding:0 clamp(20px,3.5vw,56px);background:rgba(255,255,255,.9);backdrop-filter:blur(10px);
  border-bottom:1px solid var(--line)}
.cc-brand{display:flex;align-items:center;gap:12px}
.cc-brand img{width:38px;height:38px;object-fit:contain}
.cc-brand b{display:block;font-size:14px;letter-spacing:.1em}
.cc-brand span{font-size:10px;letter-spacing:.08em;color:var(--mut);text-transform:uppercase}
.cc-hd nav{margin-left:auto;display:flex;gap:28px}
.cc-hd nav a{font-size:14px;font-weight:500;color:var(--mut)}
.cc-hd nav a:hover{color:var(--ink)}
.cc-btn{display:inline-block;background:var(--acc);color:#fff;font-weight:600;font-size:14px;
  padding:13px 24px;border-radius:10px;transition:.25s;box-shadow:0 10px 22px -10px rgba(240,128,35,.55)}
.cc-btn:hover{transform:translateY(-2px)}

.cc-kicker{font-size:11.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--acc);font-weight:700;margin:0 0 16px}
.cc-kicker.light{color:#f4b27a}

.cc-hero{position:relative;height:88svh;min-height:540px;display:flex;align-items:flex-end;color:#fff;overflow:hidden}
.cc-hero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.cc-hero::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,16,30,.32) 0%,rgba(8,16,30,.18) 50%,rgba(8,16,30,.62) 100%)}
.cc-hero-in{position:relative;z-index:1;padding:0 clamp(20px,3.5vw,56px) 64px;width:100%}
.cc-hero h1{font-size:clamp(38px,5vw,76px);line-height:1.06}
.cc-hero-row{display:flex;align-items:center;justify-content:space-between;gap:32px;margin-top:36px;flex-wrap:wrap}
.cc-hero-stats{display:flex;gap:clamp(24px,3vw,48px)}
.cc-hero-stats>div{display:flex;flex-direction:column;gap:2px;padding-left:20px;border-left:1px solid rgba(255,255,255,.35)}
.cc-hero-stats b{font-size:22px;font-weight:600}
.cc-hero-stats span{font-size:11px;text-transform:uppercase;letter-spacing:.1em;opacity:.8}

.cc-sec{padding:clamp(80px,11vh,130px) clamp(20px,3.5vw,56px)}
.cc-sec.alt{background:#fff;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.cc-sec-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:40px}
.cc-sec-head h2{font-size:clamp(26px,3vw,42px)}
.cc-link{font-size:14px;font-weight:600;color:var(--navy);border-bottom:1px solid var(--navy);padding-bottom:2px}

.cc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.cc-card{background:#fff;border:1px solid var(--line);border-radius:14px;overflow:hidden;
  transition:transform .35s cubic-bezier(.22,.61,.24,1),box-shadow .35s}
.cc-card:hover{transform:translateY(-4px);box-shadow:0 24px 44px -22px rgba(14,23,38,.18)}
.cc-card-img{aspect-ratio:16/10;overflow:hidden}
.cc-card-img img{width:100%;height:100%;object-fit:cover;transition:transform .9s cubic-bezier(.22,.61,.24,1)}
.cc-card:hover .cc-card-img img{transform:scale(1.04)}
.cc-card-body{padding:20px 22px 24px}
.cc-card-body em{font-style:normal;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--mut)}
.cc-card-body h3{font-size:18px;margin:8px 0 12px}
.cc-tags{display:flex;gap:8px;flex-wrap:wrap}
.cc-tags span{font-size:11.5px;padding:4px 10px;border-radius:99px;background:var(--bg);border:1px solid var(--line);color:var(--mut)}

.cc-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(20px,2.6vw,40px)}
.cc-step-no{font-family:var(--font-display),sans-serif;font-size:15px;font-weight:600;color:var(--acc)}
.cc-step h4{font-size:17px;margin:12px 0 8px}
.cc-step p{font-size:13.5px;color:var(--mut);margin:0}

.cc-navy{display:grid;grid-template-columns:1.2fr 1fr;gap:clamp(30px,5vw,80px);align-items:center;
  background:linear-gradient(135deg,#0f3d7a 0%,#0a2b57 100%);color:#fff;
  padding:clamp(70px,10vh,110px) clamp(20px,3.5vw,56px)}
.cc-navy h2{font-size:clamp(28px,3.2vw,46px)}
.cc-navy-sub{color:rgba(255,255,255,.82);margin:16px 0 30px;max-width:46ch}
.cc-navy-cta{display:flex;align-items:center;gap:22px}
.cc-navy-cta span{font-weight:600}
.cc-navy-r{display:grid;grid-template-columns:1fr 1fr;gap:0}
.cc-navy-r>div{padding:18px 0;border-bottom:1px solid rgba(255,255,255,.18);display:flex;flex-direction:column;gap:4px}
.cc-navy-r span{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.65)}
.cc-navy-r b{font-size:17px;font-weight:600}

.cc-ft{display:flex;justify-content:space-between;gap:16px;padding:26px clamp(20px,3.5vw,56px);
  font-size:12.5px;color:var(--mut)}

@media (max-width:900px){
  .cc-hd nav{display:none}
  .cc-grid{grid-template-columns:1fr 1fr}
  .cc-steps{grid-template-columns:1fr 1fr}
  .cc-navy{grid-template-columns:1fr}
}
@media (max-width:600px){
  .cc-grid{grid-template-columns:1fr}
  .cc-steps{grid-template-columns:1fr}
  .cc-ft{flex-direction:column}
}
`;
