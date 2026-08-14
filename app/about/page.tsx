import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Ornament from "@/components/Ornament";

export const metadata: Metadata = {
  title: "About",
  robots: { index: false, follow: true },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader variant="page" />
      <section className="gallery-hero" style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}>
        <div className="wrap">
          <div className="gallery-hero-deva">परिचय</div>
          <h1>About</h1>
          <p className="gallery-hero-dek">
            The story of Adya Kali and the KaliPutra Mission — coming soon.
          </p>
          <div style={{ marginTop: "2rem" }}>
            <Ornament />
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
