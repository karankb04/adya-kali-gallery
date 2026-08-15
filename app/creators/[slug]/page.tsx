import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import RImage from "@/components/RImage";
import { getCreator, getCreators } from "@/lib/creators";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import { r2url } from "@/lib/r2";

export const revalidate = 300;

interface Params {
  params: { slug: string };
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function generateStaticParams() {
  return getCreators().map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const creator = getCreator(params.slug);
  if (!creator) return {};
  const ogImage = creator.works[0]?.thumbnailR2Key
    ? r2url(creator.works[0].thumbnailR2Key)
    : undefined;
  return {
    title: `${creator.name} — ${creator.role}`,
    description: creator.bio,
    alternates: { canonical: `/creators/${creator.slug}` },
    // These are placeholder example profiles for a style review — keep them
    // out of search results until real contributors replace the content,
    // then drop this and add the routes to sitemap.xml/route.ts.
    robots: { index: false, follow: true },
    openGraph: {
      type: "profile",
      url: `${SITE_URL}/creators/${creator.slug}`,
      siteName: SITE_NAME,
      title: `${creator.name} — ${creator.role}`,
      description: creator.bio,
      images: ogImage ? [{ url: ogImage, alt: creator.name }] : undefined,
    },
  };
}

export default function CreatorPage({ params }: Params) {
  const creator = getCreator(params.slug);
  if (!creator) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/creators/${creator.slug}`,
    name: creator.name,
    jobTitle: creator.role,
    description: creator.bio,
    worksFor: { "@type": "Organization", name: "KaliPutra Mission" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      <section className="creator-hero">
        <div className="wrap creator-hero-in">
          <div className="creator-avatar" aria-hidden="true">
            {initials(creator.name)}
          </div>
          <h1>{creator.name}</h1>
          <div className="creator-role">{creator.role}</div>
        </div>
      </section>

      <div className="wrap creator-body">
        <blockquote className="creator-quote">
          <span className="creator-quote-label">Favourite seva</span>
          &ldquo;{creator.favoriteSeva}&rdquo;
        </blockquote>

        <div className="creator-grid">
          <div className="creator-bio">
            <h2>Bio</h2>
            <p>{creator.bio}</p>
          </div>
          <div className="creator-facts">
            <h2>Expertise</h2>
            <dl>
              {creator.facts.map((f) => (
                <div className="creator-fact-row" key={f.label}>
                  <dt>
                    {f.emoji ? `${f.emoji} ` : ""}
                    {f.label}
                  </dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <section className="creator-works">
          <h2>{creator.worksHeading}</h2>
          <div className="creator-works-grid">
            {creator.works.map((w) => (
              <Link key={w.title} href={w.href} className="creator-work-card">
                {w.thumbnailR2Key && (
                  <div className="creator-work-media">
                    <RImage
                      r2Key={w.thumbnailR2Key}
                      alt={w.title}
                      dominantColor={w.thumbnailDominantColor}
                      sizes="(max-width:600px) 90vw, 320px"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
                <span className="creator-work-kind">{w.kind}</span>
                <span className="creator-work-title">{w.title}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <SiteFooter />
    </>
  );
}
