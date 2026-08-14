"use client";
import { useRef, useState } from "react";
import { INSTAGRAM_POSTS } from "@/content/instagramPosts";
import RImage from "./RImage";
import Ornament from "./Ornament";

const HANDLE = "kaliputramission";

/**
 * Same native `scroll-snap-type: x mandatory` carousel technique used in the
 * /components pattern reference — CSS does the actual sliding, JS only adds
 * prev/next buttons and dot pagination.
 */
export default function InstagramFeed() {
  const posts = INSTAGRAM_POSTS;
  const viewportRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function goTo(i: number) {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const slide = viewport.children[i] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }

  function onScroll() {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const slide = viewport.children[0] as HTMLElement | undefined;
    if (!slide) return;
    const slideW = slide.getBoundingClientRect().width + 18;
    setActive(Math.round(viewport.scrollLeft / slideW));
  }

  return (
    <section className="insta wrap">
      <div className="lib-head">
        <Ornament className="lib-orn" />
        <h2>From Instagram</h2>
        <div className="sub">
          Devotional moments from the KaliPutra Mission — follow along for
          more.
        </div>
        <a
          href={`https://www.instagram.com/${HANDLE}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="insta-follow"
        >
          @{HANDLE}
        </a>
      </div>

      <div className="insta-carousel">
        <div className="insta-viewport" ref={viewportRef} onScroll={onScroll}>
          {posts.map((post) => (
            <a
              key={post.id}
              className="insta-card"
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View this post from @${HANDLE} on Instagram`}
            >
              <div className="insta-card-head">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="insta-avatar" src="/logo.png" alt="" />
                <span className="insta-username">{HANDLE}</span>
              </div>

              <div className="insta-img">
                <RImage
                  r2Key={post.r2Key}
                  alt={post.caption}
                  width={post.width}
                  height={post.height}
                  dominantColor={post.dominantColor}
                  sizes="(max-width:760px) 82vw, 320px"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div className="insta-actions">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-4-1L3 20l1-5.5a8.5 8.5 0 0 1-1-4A8.38 8.38 0 0 1 11.5 2h1A8.5 8.5 0 0 1 21 10.5v1Z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2 11 13" />
                  <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
                </svg>
                <svg className="insta-save" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21 12 16l-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" />
                </svg>
              </div>

              <div className="insta-likes">{post.likes.toLocaleString()} likes</div>
              <div className="insta-caption">
                <strong>{HANDLE}</strong> {post.caption}
              </div>
              <div className="insta-time">{post.postedAgo} ago</div>
            </a>
          ))}
        </div>

        <div className="insta-nav">
          <button aria-label="Previous" onClick={() => goTo(Math.max(0, active - 1))}>
            ←
          </button>
          <div className="insta-dots">
            {posts.map((post, i) => (
              <button
                key={post.id}
                aria-label={`Go to post ${i + 1}`}
                className={`insta-dot${i === active ? " on" : ""}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <button
            aria-label="Next"
            onClick={() => goTo(Math.min(posts.length - 1, active + 1))}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
