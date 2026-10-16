import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design Lab (internal)",
  robots: { index: false, follow: false },
};

const STYLE = `
  @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@200;300;400;500;600&family=Mukta:wght@400;500;600;700&display=swap');

  .dlab{background:#f3eeeb;min-height:100vh;color:#222}
  .dlab-note{max-width:640px;margin:0 auto;padding:2rem 1.5rem 0;text-align:center}
  .dlab-note h1{font-family:system-ui,sans-serif;font-size:1.2rem;color:#222;margin-bottom:.4rem}
  .dlab-note p{font-family:system-ui,sans-serif;font-size:.9rem;color:#7c6a60;line-height:1.5}

  .dlab-nav{display:flex;align-items:center;justify-content:space-between;gap:1.4rem;
    padding:1.1rem clamp(1rem,4vw,2.4rem);margin-top:2rem;background:#fff;border-bottom:2px solid #222}
  .dlab-mark{font-family:'Clash Display',sans-serif;font-weight:700;font-size:1.1rem;text-transform:uppercase;
    letter-spacing:.02em;color:#222}
  .dlab-links{display:flex;gap:2rem;font-family:'Roboto Slab',serif;font-weight:600;font-size:.92rem;color:#222}
  .dlab-links a{text-decoration:none;color:inherit}
  .dlab-cta{display:flex;gap:.7rem}
  .dlab-btn{font-family:'Clash Display',sans-serif;font-weight:600;font-size:.82rem;text-transform:uppercase;
    letter-spacing:.03em;padding:.6rem 1.2rem;border-radius:2px;border:none;cursor:pointer}
  .dlab-btn-donate{background:#db1f24;color:#fff}
  .dlab-btn-mission{background:transparent;border:1.5px solid #222;color:#222}

  .dlab-hero{padding:6rem clamp(1rem,4vw,2.4rem) 4rem;text-align:center}
  .dlab-deva{font-family:'Mukta',sans-serif;font-weight:600;color:#db1f24;font-size:1.1rem;letter-spacing:.1em;margin-bottom:1rem}
  .dlab-hero h1{font-family:'Clash Display',sans-serif;font-weight:700;text-transform:uppercase;
    font-size:clamp(2.4rem,6.5vw,5rem);line-height:.95;letter-spacing:-.01em;color:#111;margin-bottom:1.6rem}
  .dlab-dek{font-family:'Roboto Slab',serif;font-weight:300;font-size:clamp(1rem,1.6vw,1.15rem);
    line-height:1.7;color:#5c4f47;max-width:46ch;margin:0 auto}

  .dlab-section{padding:5rem clamp(1rem,4vw,2.4rem);border-top:2px solid #222;text-align:center}
  .dlab-eyebrow{font-family:'Roboto Slab',serif;font-weight:400;font-size:.8rem;letter-spacing:.16em;
    text-transform:uppercase;color:#db1f24;margin-bottom:1rem}
  .dlab-section h2{font-family:'Clash Display',sans-serif;font-weight:700;text-transform:uppercase;
    font-size:clamp(2.2rem,6vw,4.5rem);line-height:.98;letter-spacing:-.005em;color:#111;margin-bottom:1.2rem}
  .dlab-section .dlab-sub{font-family:'Roboto Slab',serif;font-weight:300;font-size:1.05rem;line-height:1.7;
    color:#5c4f47;max-width:42ch;margin:0 auto}

  .dlab-faq{padding:5rem clamp(1rem,4vw,2.4rem) 6rem;border-top:2px solid #222}
  .dlab-faq-inner{max-width:760px;margin:0 auto}
  .dlab-faq h2{font-family:'Clash Display',sans-serif;font-weight:700;text-transform:uppercase;
    font-size:clamp(1.5rem,3.2vw,2.1rem);line-height:1;letter-spacing:-.005em;color:#111;text-align:center;margin-bottom:3rem}
  .dlab-faq-item{padding:1.8rem 0;border-bottom:1px solid rgba(34,34,34,.15)}
  .dlab-faq-q{font-family:'Clash Display',sans-serif;font-weight:600;font-size:1.15rem;color:#111;margin-bottom:.6rem}
  .dlab-faq-a{font-family:'Roboto Slab',serif;font-weight:300;font-size:1rem;line-height:1.7;color:#5c4f47}
`;

const FAQS = [
  {
    q: "What is the KaliPutra Mission?",
    a: "A devotional mission dedicated to Maa Adya Kali — sharing her images, teachings, and seva with devotees everywhere, free of cost.",
  },
  {
    q: "How can I volunteer or contribute?",
    a: "Reach out via Instagram @kaliputramission — ways to get involved will be listed here soon.",
  },
];

export default function DesignLabPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <div className="dlab-note">
        <h1>Design Lab — internal, not linked anywhere</h1>
        <p>
          Typography-only test inspired by fatfish.ca: Clash Display (free
          stand-in for their paid IntegralCF) for headlines, Roboto Slab at a
          light weight for body — same contrast logic, different fonts. Same
          layout/spacing as the live site, only the type system changed.
        </p>
      </div>

      <div className="dlab">
        <header className="dlab-nav">
          <div className="dlab-mark">Maa Adya Kali Gallery</div>
          <nav className="dlab-links">
            <a href="#">Gallery</a>
            <a href="#">About</a>
            <a href="#">Music</a>
            <a href="#">Katha</a>
          </nav>
          <div className="dlab-cta">
            <button className="dlab-btn dlab-btn-donate">Donate</button>
            <button className="dlab-btn dlab-btn-mission">
              Visit KaliPutra Mission
            </button>
          </div>
        </header>

        <section className="dlab-hero">
          <div className="dlab-deva">परिचय</div>
          <h1>About</h1>
          <p className="dlab-dek">
            The story of Adya Kali and the KaliPutra Mission — coming soon.
          </p>
        </section>

        <section className="dlab-section">
          <div className="dlab-eyebrow">परिचय</div>
          <h2>Her seva, in the world</h2>
          <p className="dlab-sub">
            The sevas and annadanams carried out by the mission.
          </p>
        </section>

        <section className="dlab-faq">
          <div className="dlab-faq-inner">
            <h2>Questions about the mission</h2>
            {FAQS.map((f) => (
              <div className="dlab-faq-item" key={f.q}>
                <div className="dlab-faq-q">{f.q}</div>
                <div className="dlab-faq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
