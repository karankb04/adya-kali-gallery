import Ornament from "./Ornament";

export default function SiteFooter() {
  return (
    <footer>
      <Ornament />
      <div className="fdeva">॥ जय माँ आद्या महाकाली ॥</div>
      <div className="fline">Spread her naam across all the worlds.</div>
      <div className="fsub">Adya Kali — a seva of devotion, never of commerce</div>
      <nav className="fnav">
        <a href="/#library">The Library</a>
        <span className="fdot">·</span>
        <a href="/blog">Katha</a>
        <span className="fdot">·</span>
        <a href="/sitemap.xml">Sitemap</a>
      </nav>
      <div className="cred">Images · KaliPutra Mission · Creative Bench</div>
    </footer>
  );
}
