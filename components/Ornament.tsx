/**
 * Gold devotional divider — a trishul flanked by fading rules.
 * Carries the hero's gold rim into the body of the site.
 */
export default function Ornament({ className }: { className?: string }) {
  return (
    <div className={`ornament${className ? ` ${className}` : ""}`} aria-hidden="true">
      <span className="orn-rule" />
      <svg viewBox="0 0 44 32" width="34" height="25">
        {/* trishul */}
        <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M22 30 V10" />
          <path d="M22 12 C 14 12, 12 6, 12 2 C 15 7, 19 8, 22 8 C 25 8, 29 7, 32 2 C 32 6, 30 12, 22 12 Z" />
          <path d="M22 2.5 V8" />
        </g>
        <circle cx="22" cy="19" r="2.1" fill="currentColor" stroke="none" />
      </svg>
      <span className="orn-rule" />
    </div>
  );
}
