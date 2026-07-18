import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Ornament from "@/components/Ornament";
import PostBody from "@/components/blog/PostBody";
import PostCard from "@/components/blog/PostCard";
import RelatedDarshan from "@/components/blog/RelatedDarshan";
import RImage from "@/components/RImage";
import { getPost, getPosts, relatedPosts, formatDate } from "@/lib/posts";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import { r2url } from "@/lib/r2";

export const revalidate = 300;

interface Params {
  params: { slug: string };
}

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.dek,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/blog/${post.slug}`,
      siteName: SITE_NAME,
      title: post.title,
      description: post.dek,
      publishedTime: post.date,
      images: [{ url: r2url(post.cover.r2Key), alt: post.cover.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.dek,
      images: [r2url(post.cover.r2Key)],
    },
  };
}

export default function KathaPage({ params }: Params) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const related = relatedPosts(post);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE_URL}/blog/${post.slug}`,
    headline: post.title,
    description: post.dek,
    image: r2url(post.cover.r2Key),
    datePublished: post.date,
    inLanguage: "en",
    keywords: post.tags.join(", "),
    author: { "@type": "Organization", name: "KaliPutra Mission" },
    publisher: { "@type": "Organization", name: SITE_NAME },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader variant="page" />
      <main className="katha-page">
        <article className="katha-article">
          <header className="k-head wrap">
            <div className="k-kind">
              <a href="/blog">Katha</a>
              <span className="kdot">·</span>
              <span>{post.kind}</span>
            </div>
            {post.deva && <div className="k-deva">{post.deva}</div>}
            <h1 className="k-title">{post.title}</h1>
            <p className="k-dek">{post.dek}</p>
            <div className="k-date">
              {formatDate(post.date)}
              <span className="kdot">·</span>
              {post.minutes} min read
            </div>
          </header>

          <figure className="k-cover">
            <RImage
              r2Key={post.cover.r2Key}
              alt={post.cover.alt}
              width={post.cover.width}
              height={post.cover.height}
              dominantColor={post.cover.dominantColor}
              priority
              sizes="(max-width:900px) 100vw, 860px"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </figure>

          <PostBody blocks={post.blocks} />

          <div className="k-end">
            <Ornament />
          </div>
        </article>

        <RelatedDarshan forms={post.relatedForms} />

        {related.length > 0 && (
          <section className="wrap k-related">
            <h2 className="k-related-h">Continue reading</h2>
            <div className="katha-grid">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
