const PROPOSALS = [
  {
    priority: "High",
    area: "Speed + SEO",
    title: "Load fonts with Next's font loader instead of CSS @import",
    why: "Fonts come in through @import inside the stylesheet: the browser has to fetch the CSS, then discover the font CSS, then the font files. That chain blocks text from painting and slows the page's first meaningful view, which is a ranking signal. next/font self-hosts the files, preloads them, and prevents the text from jumping when fonts swap in.",
    effort: "Small",
  },
  {
    priority: "High",
    area: "Accessibility",
    title: "Keyboard focus in the darshan viewer",
    why: "When an image opens, keyboard focus stays on the page behind it, Tab walks through hidden links, and closing doesn't return you to where you were. Section 08 on this page shows the fix: focus moves in, Escape closes, focus returns.",
    effort: "Small",
  },
  {
    priority: "High",
    area: "Devotional feel",
    title: "A Devanagari headline face with real character",
    why: "Every Devanagari line (mantras, form names, eyebrows) is set in Mukta, which reads like interface text. Tiro Devanagari Hindi (section 09) brings the stroke contrast of hand-lettered scripture. It is one ~80 KB file, replacing the ~200 KB of Mukta weights the site was loading, so the page gets lighter, not heavier.",
    effort: "Small",
  },
  {
    priority: "Medium",
    area: "Accessibility",
    title: "Skip-to-content link",
    why: "There is none, so keyboard and screen-reader users tab through the whole header on every page. One hidden-until-focused link fixes it.",
    effort: "Tiny",
  },
  {
    priority: "Medium",
    area: "SEO",
    title: "Breadcrumb structured data on Katha articles",
    why: "The gallery already has rich image data for Google; articles don't describe where they sit (Home > Katha > Article). Breadcrumb data often shows as a cleaner path in search results.",
    effort: "Small",
  },
  {
    priority: "Medium",
    area: "Devotional feel",
    title: "Sandhya (evening) mode",
    why: "There is no dark theme. Many devotees visit at night, for aarti or before sleep; a dark, lamp-lit palette that follows their phone's setting would feel gentler and more temple-like. Larger change: every colour needs a dark twin.",
    effort: "Medium",
  },
  {
    priority: "Medium",
    area: "Return visits",
    title: "Darshan of the Day on the homepage",
    why: "Section 07. Gives people a reason to come back each day, with zero client JavaScript and fully visible to search engines.",
    effort: "Tiny",
  },
];

/**
 * Prioritised UX recommendations for the live site, from a ui-ux-pro-max
 * audit. Static content, no client JS.
 */
export default function UxProposals() {
  return (
    <ol className="s2-ux">
      {PROPOSALS.map((p, i) => (
        <li className="s2-ux-item" key={p.title}>
          <span className="s2-ux-n">{String(i + 1).padStart(2, "0")}</span>
          <div className="s2-ux-body">
            <div className="s2-ux-tags">
              <span className={`s2-ux-pri s2-ux-pri--${p.priority.toLowerCase()}`}>{p.priority}</span>
              <span className="s2-ux-area">{p.area}</span>
              <span className="s2-ux-effort">Effort: {p.effort}</span>
            </div>
            <h3>{p.title}</h3>
            <p>{p.why}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
