import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Ornament from "@/components/Ornament";
import PostCard from "@/components/blog/PostCard";
import HeroCarousel from "@/components/blog/HeroCarousel";
import FaqSection from "@/components/FaqSection";
import { BLOG_INDEX_FAQS } from "@/content/faqs";
import { getPosts } from "@/lib/posts";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Katha — Stories & Teachings of the Mother",
  description:
    "Katha — devotional stories, iconography explainers, festival guides and scripture of Maa Adya Kali. Long-form reading from the living library of the Mother.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    siteName: SITE_NAME,
    title: "Katha — Stories & Teachings of the Mother",
    description:
      "Devotional stories, iconography explainers, festival guides and scripture of Maa Adya Kali.",
  },
};

export default function BlogIndex() {
  const posts = getPosts();
  const carousel = posts.slice(0, 3);

  return (
    <>
      <SiteHeader variant="page" />
      <main className="katha-page">
        <section className="katha-hero">
          <div className="wrap">
            <div className="katha-hero-deva">कथा</div>
            <h1>Katha</h1>
            <p className="katha-hero-dek">
              Stories and teachings of the Mother — her iconography, her
              festivals, her scripture. Long-form reading for the devoted and
              the curious alike.
            </p>
            <Ornament className="katha-orn" />
          </div>
        </section>

        {carousel.length > 0 && <HeroCarousel posts={carousel} />}

        <section className="wrap katha-list">
          <div className="katha-grid">
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      </main>
      <FaqSection
        deva="प्रश्न"
        title="Questions about Katha"
        sub="What this section is, and where the stories come from."
        items={BLOG_INDEX_FAQS}
      />
      <SiteFooter />
    </>
  );
}
