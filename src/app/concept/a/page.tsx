import Link from 'next/link';
import { ConceptFx } from '../ConceptFx';

export const metadata = { title: 'Concept A — Quarry Editorial' };

/**
 * CONCEPT A — "Quarry Editorial" (Kettal direction).
 * One rhythm repeated: full-bleed photo → short statement → content grid.
 * Warm limestone-white canvas, ink text, ONE orange element per screen.
 * Motion: fade-up once, image hover scale — nothing else.
 */

const P = [
  {
    img: '/assets/bot-caco3-sieu-min.webp',
    name: 'Bột đá CaCO₃ không phủ',
    meta: 'Uncoated · 4–20 µm',
  },
  {
    img: '/assets/bot-sieu-min.webp',
    name: 'Bột đá CaCO₃ phủ Stearic Acid',
    meta: 'Coated · 4–20 µm',
  },
  { img: '/assets/da-slab-sieu-trang.webp', name: 'Đá Slab', meta: 'Tấm lớn · 1.6 × 2.4 m' },
  {
    img: '/assets/da-xe-quy-cach-1.webp',
    name: 'Đá xẻ quy cách',
    meta: '60×30 · 40×60 · 80×40 cm',
  },
  { img: '/assets/da-che-den2.webp', name: 'Đá trang trí', meta: 'Sân vườn · Bể bơi · Lối đi' },
];

export default function ConceptA() {
  return (
    <div className="ca">
      <ConceptFx />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Ribbon so the client knows this is a preview */}
      <div className="ca-ribbon">
        CONCEPT A — QUARRY EDITORIAL · <Link href="/concept">← danh sách concept</Link>
      </div>

      {/* Header: quiet, hairline, one orange element on the whole screen */}
      <header className="ca-hd">
        <div className="ca-hd-brand">KS LONG ANH</div>
        <nav>
          <a href="#products">Sản phẩm</a>
          <a href="#about">Về chúng tôi</a>
          <a href="#capacity">Năng lực</a>
          <a href="#contact">Liên hệ</a>
        </nav>
        <a className="ca-cta sm" href="#contact">
          Yêu cầu báo giá
        </a>
      </header>

      {/* 1 — HERO: photo is the star, overlay ~30%, ≤7-word title */}
      <section className="ca-hero">
        <img src="/assets/kho-da-nguyen-lieu.webp" alt="" />
        <div className="ca-hero-in">
          <h1 data-cr>
            Khoáng đá trắng
            <br />
            nguyên sinh từ Nghệ An.
          </h1>
          <p data-cr style={{ transitionDelay: '.12s' }}>
            Bột đá CaCO₃ và đá tự nhiên — từ mỏ riêng tại Quỳ Hợp đến 12 quốc gia.
          </p>
        </div>
        <div className="ca-hero-strip" data-cr style={{ transitionDelay: '.2s' }}>
          <div>
            <b>20+</b>
            <span>năm kinh nghiệm</span>
          </div>
          <div>
            <b>350.000</b>
            <span>tấn / năm</span>
          </div>
          <div>
            <b>05</b>
            <span>mỏ đá vận hành</span>
          </div>
          <div>
            <b>12</b>
            <span>quốc gia xuất khẩu</span>
          </div>
        </div>
      </section>

      {/* 2 — STATEMENT: whitespace + one sentence */}
      <section className="ca-statement">
        <p className="ca-kicker" data-cr>
          Triết lý
        </p>
        <h2 data-cr style={{ transitionDelay: '.08s' }}>
          Khai thác bền vững. Chế biến chính xác.
          <br />
          Giao hàng đúng hẹn.
        </h2>
      </section>

      {/* 3 — PRODUCT GRID: image, caption under, no card chrome */}
      <section className="ca-products" id="products">
        <div className="ca-row-head" data-cr>
          <p className="ca-kicker">Sản phẩm</p>
          <a className="ca-link" href="#products">
            Toàn bộ sản phẩm →
          </a>
        </div>
        <div className="ca-grid-2">
          {P.slice(0, 2).map((p, i) => (
            <a
              key={p.name}
              className="ca-tile"
              href="#products"
              data-cr
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="ca-tile-img tall">
                <img src={p.img} alt={p.name} />
              </div>
              <div className="ca-cap">
                <span>{p.name}</span>
                <em>{p.meta}</em>
              </div>
            </a>
          ))}
        </div>
        <div className="ca-grid-3">
          {P.slice(2).map((p, i) => (
            <a
              key={p.name}
              className="ca-tile"
              href="#products"
              data-cr
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="ca-tile-img">
                <img src={p.img} alt={p.name} />
              </div>
              <div className="ca-cap">
                <span>{p.name}</span>
                <em>{p.meta}</em>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 4 — FULL-BLEED BREAK: one photo, one caption */}
      <section className="ca-break">
        <img src="/assets/kho-hang-xuat-khau.webp" alt="" />
        <div className="ca-break-cap" data-cr>
          Kho thành phẩm — Quỳ Hợp, Nghệ An
        </div>
      </section>

      {/* 5 — NUMBERS: a quiet table, no countup */}
      <section className="ca-numbers" id="capacity">
        <p className="ca-kicker" data-cr>
          Năng lực sản xuất
        </p>
        <div className="ca-num-rows">
          {[
            ['Công suất hàng năm', '350.000 tấn'],
            ['Độ trắng CaCO₃', '≥ 98%'],
            ['Cỡ hạt', '4 – 20 µm'],
            ['Dây chuyền', '06 nghiền · 02 phủ Stearic'],
            ['Cảng xuất hàng', 'FOB Cửa Lò · Hải Phòng'],
          ].map(([k, v], i) => (
            <div key={k} className="ca-num-row" data-cr style={{ transitionDelay: `${i * 0.05}s` }}>
              <span>{k}</span>
              <b>{v}</b>
            </div>
          ))}
        </div>
      </section>

      {/* 6 — ABOUT TEASER: photo + short text */}
      <section className="ca-about" id="about">
        <div className="ca-about-img" data-cr>
          <img src="/assets/nha-may-bot-sieu-min-1.webp" alt="" />
        </div>
        <div className="ca-about-txt" data-cr style={{ transitionDelay: '.1s' }}>
          <p className="ca-kicker">Về chúng tôi</p>
          <h3>Chúng tôi xem mỗi tấn bột đá là một cam kết.</h3>
          <p className="ca-body">
            Hơn 20 năm khai thác và chế biến đá vôi trắng tại Quỳ Hợp — hệ thống 5 nhà máy theo công
            nghệ Châu Âu, kiểm soát trọn chuỗi từ mỏ đá đến container.
          </p>
          <a className="ca-link" href="#about">
            Câu chuyện Long Anh →
          </a>
        </div>
      </section>

      {/* 7 — CERTS: one quiet row */}
      <section className="ca-certs" data-cr>
        {['cert-iso-9001', 'cert-reach', 'cert-sgs', 'cert-msds'].map((c) => (
          <img key={c} src={`/assets/${c}.svg`} alt={c} />
        ))}
      </section>

      {/* 8 — FINAL CTA: the second (and last) orange element */}
      <section className="ca-final" id="contact">
        <h2 data-cr>Hãy bắt đầu từ một câu hỏi.</h2>
        <p data-cr style={{ transitionDelay: '.08s' }}>
          Phản hồi trong 24h làm việc — kèm spec, COA và báo giá FOB.
        </p>
        <div data-cr style={{ transitionDelay: '.16s' }}>
          <a className="ca-cta" href="#contact">
            Yêu cầu báo giá
          </a>
          <a className="ca-link" href="mailto:info@longanhcorp.com" style={{ marginLeft: 28 }}>
            info@longanhcorp.com
          </a>
        </div>
      </section>

      <footer className="ca-ft">
        <div>
          <b>KS LONG ANH</b>
          <span>Bột đá Canxi Cacbonat &amp; đá tự nhiên Việt Nam</span>
        </div>
        <div>
          <span>(+84) 942 224 499</span>
          <span>info@longanhcorp.com</span>
        </div>
        <div>
          <span>Quỳ Hợp · Nghệ An</span>
          <span>© 2026 KS Long Anh</span>
        </div>
      </footer>
    </div>
  );
}

const CSS = `
.ca{--bg:#FAFAF7;--ink:#141414;--mut:#6e6a63;--line:#e7e3da;--acc:#F08023;
  background:var(--bg);color:var(--ink);font-family:var(--font-inter),sans-serif;
  font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased}
.ca h1,.ca h2,.ca h3{font-family:var(--font-display),sans-serif;font-weight:500;letter-spacing:-.02em;margin:0}
.ca a{text-decoration:none;color:inherit}
.ca [data-cr]{opacity:0;transform:translateY(26px);transition:opacity .8s cubic-bezier(.22,.61,.24,1),transform .8s cubic-bezier(.22,.61,.24,1)}
.ca [data-cr].in{opacity:1;transform:none}

.ca-ribbon{position:fixed;z-index:60;bottom:18px;left:18px;background:#141414;color:#fff;
  font-size:11px;letter-spacing:.14em;padding:9px 14px;border-radius:99px;opacity:.92}
.ca-ribbon a{color:#f4b27a;margin-left:4px}

.ca-hd{position:sticky;top:0;z-index:50;display:flex;align-items:center;gap:40px;
  padding:0 clamp(24px,4vw,64px);height:72px;background:rgba(250,250,247,.88);
  backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.ca-hd-brand{font-family:var(--font-display),sans-serif;font-weight:600;letter-spacing:.12em;font-size:15px}
.ca-hd nav{display:flex;gap:30px;margin-left:auto}
.ca-hd nav a{font-size:13.5px;color:var(--mut);transition:color .25s}
.ca-hd nav a:hover{color:var(--ink)}
.ca-cta{display:inline-block;background:var(--acc);color:#fff;font-weight:600;font-size:14px;
  padding:14px 26px;border-radius:2px;transition:background .25s}
.ca-cta:hover{background:#d96f15}
.ca-cta.sm{padding:10px 18px;font-size:13px}

.ca-hero{position:relative;height:92svh;min-height:560px;display:flex;align-items:flex-end;color:#fff;overflow:hidden}
.ca-hero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.ca-hero::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,12,16,.18) 0%,rgba(10,12,16,.12) 55%,rgba(10,12,16,.5) 100%)}
.ca-hero-in{position:relative;z-index:1;padding:0 clamp(24px,4vw,64px) 120px}
.ca-hero h1{font-size:clamp(40px,5.4vw,84px);line-height:1.05}
.ca-hero p{margin:22px 0 0;font-size:clamp(16px,1.4vw,19px);max-width:52ch;color:rgba(255,255,255,.88)}
.ca-hero-strip{position:absolute;z-index:1;left:0;right:0;bottom:0;display:flex;
  border-top:1px solid rgba(255,255,255,.25);padding:0 clamp(24px,4vw,64px)}
.ca-hero-strip>div{flex:1;padding:18px 0;display:flex;align-items:baseline;gap:10px;border-left:1px solid rgba(255,255,255,.25);padding-left:22px}
.ca-hero-strip>div:first-child{border-left:0;padding-left:0}
.ca-hero-strip b{font-size:20px;font-weight:600;font-variant-numeric:tabular-nums}
.ca-hero-strip span{font-size:11px;text-transform:uppercase;letter-spacing:.1em;opacity:.75}

.ca-kicker{font-size:11.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--mut);margin:0 0 22px}
.ca-statement{padding:clamp(110px,16vh,180px) clamp(24px,4vw,64px);max-width:1200px}
.ca-statement h2{font-size:clamp(30px,3.6vw,54px);line-height:1.16}

.ca-products{padding:0 clamp(24px,4vw,64px) clamp(90px,12vh,140px)}
.ca-row-head{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:34px}
.ca-row-head .ca-kicker{margin:0}
.ca-link{font-size:13.5px;font-weight:600;border-bottom:1px solid var(--ink);padding-bottom:2px;transition:opacity .25s}
.ca-link:hover{opacity:.55}
.ca-grid-2{display:grid;grid-template-columns:1.35fr 1fr;gap:26px;margin-bottom:26px}
.ca-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:26px}
.ca-tile-img{overflow:hidden;aspect-ratio:4/3;background:#eceae4}
.ca-tile-img.tall{aspect-ratio:16/10}
.ca-tile-img img{width:100%;height:100%;object-fit:cover;transition:transform 1.1s cubic-bezier(.22,.61,.24,1)}
.ca-tile:hover .ca-tile-img img{transform:scale(1.035)}
.ca-cap{display:flex;justify-content:space-between;gap:14px;padding-top:14px}
.ca-cap span{font-weight:600;font-size:15px}
.ca-cap em{font-style:normal;font-size:12.5px;color:var(--mut);white-space:nowrap}

.ca-break{position:relative;height:72svh;min-height:420px;overflow:hidden}
.ca-break img{width:100%;height:100%;object-fit:cover}
.ca-break-cap{position:absolute;left:clamp(24px,4vw,64px);bottom:26px;color:#fff;font-size:12.5px;letter-spacing:.08em;text-transform:uppercase;text-shadow:0 1px 12px rgba(0,0,0,.4)}

.ca-numbers{padding:clamp(100px,14vh,160px) clamp(24px,4vw,64px);max-width:1080px}
.ca-num-rows{border-top:1px solid var(--line)}
.ca-num-row{display:flex;justify-content:space-between;align-items:baseline;gap:24px;padding:22px 0;border-bottom:1px solid var(--line)}
.ca-num-row span{color:var(--mut);font-size:14px}
.ca-num-row b{font-family:var(--font-display),sans-serif;font-weight:500;font-size:clamp(20px,2.2vw,30px);letter-spacing:-.01em}

.ca-about{display:grid;grid-template-columns:1.15fr 1fr;gap:clamp(32px,5vw,80px);align-items:center;
  padding:0 clamp(24px,4vw,64px) clamp(100px,14vh,160px)}
.ca-about-img{overflow:hidden;aspect-ratio:4/3;background:#eceae4}
.ca-about-img img{width:100%;height:100%;object-fit:cover}
.ca-about h3{font-size:clamp(26px,2.8vw,40px);line-height:1.2;margin-bottom:20px}
.ca-body{color:var(--mut);max-width:46ch;margin:0 0 26px}

.ca-certs{display:flex;gap:clamp(40px,6vw,90px);justify-content:center;align-items:center;
  padding:56px clamp(24px,4vw,64px);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.ca-certs img{height:44px;opacity:.55;filter:grayscale(1);transition:opacity .3s}
.ca-certs img:hover{opacity:.9}

.ca-final{text-align:center;padding:clamp(110px,16vh,190px) 24px}
.ca-final h2{font-size:clamp(30px,3.6vw,52px)}
.ca-final p{color:var(--mut);margin:18px 0 36px}

.ca-ft{display:flex;justify-content:space-between;gap:24px;padding:44px clamp(24px,4vw,64px);
  border-top:1px solid var(--line);font-size:12.5px;color:var(--mut)}
.ca-ft>div{display:flex;flex-direction:column;gap:6px}
.ca-ft b{color:var(--ink);letter-spacing:.1em;font-size:12.5px}

@media (max-width:860px){
  .ca-hd nav{display:none}
  .ca-hero-strip{flex-wrap:wrap}
  .ca-hero-strip>div{flex:1 1 40%;border-left:0;padding-left:0}
  .ca-grid-2,.ca-grid-3{grid-template-columns:1fr}
  .ca-about{grid-template-columns:1fr}
  .ca-certs{flex-wrap:wrap;gap:32px}
  .ca-ft{flex-direction:column}
}
`;
