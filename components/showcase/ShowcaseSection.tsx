import Reveal from "./Reveal";

interface ShowcaseSectionProps {
  index: number;
  title: string;
  technique: string;
  description: string;
  children: React.ReactNode;
  /** Full-bleed sections (no max-width wrap, e.g. marquee/wall) skip the padded shell. */
  bleed?: boolean;
}

export default function ShowcaseSection({
  index,
  title,
  technique,
  description,
  children,
  bleed,
}: ShowcaseSectionProps) {
  return (
    <section className="sc-section" id={`sc-${index}`}>
      <div className="sc-section-head wrap">
        <Reveal variant="up" className="sc-section-head-in">
          <span className="sc-index">{String(index).padStart(2, "0")}</span>
          <span className="sc-technique">{technique}</span>
          <h2 className="sc-title">{title}</h2>
          <p className="sc-desc">{description}</p>
        </Reveal>
      </div>
      <div className={bleed ? "sc-stage sc-stage--bleed" : "sc-stage wrap"}>{children}</div>
    </section>
  );
}
