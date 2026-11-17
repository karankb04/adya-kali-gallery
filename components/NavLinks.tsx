"use client";
import { usePathname } from "next/navigation";
import { isCurrent } from "./MobileMenu";

const LINKS = [
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/music", label: "Music" },
  { href: "/blog", label: "Katha" },
];

/** Desktop menu links; the page you're on is marked (red + underline). */
export default function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="navlinks" aria-label="Main">
      {LINKS.map((l) => (
        <a key={l.href} href={l.href} aria-current={isCurrent(pathname, l.href) ? "page" : undefined}>
          {l.label}
        </a>
      ))}
    </nav>
  );
}
