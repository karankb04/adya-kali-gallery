"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Post } from "@/types/post";
import PostCard from "./PostCard";

interface HeroCarouselProps {
  /** The posts to cycle through — pinned scroll traverses one transition per pair. */
  posts: Post[];
}

/**
 * Pinned scroll carousel built from the same featured PostCard used
 * elsewhere (image-left, text-right — the site's existing lead-story
 * layout). The section holds in place while the user scrolls through it,
 * crossfading from one post's card to the next. Falls back to a static
 * first card when reduced motion is requested or there's nothing to
 * transition between.
 */
export default function HeroCarousel({ posts }: HeroCarouselProps) {
  const pinRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (posts.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    let ctx: gsap.Context | undefined;
    // Defer setup to the next tick: under React StrictMode's dev-only
    // double-invoke (mount -> cleanup -> mount), pinning synchronously in the
    // same tick as the prior revert() can measure a not-yet-settled layout,
    // collapsing the computed scroll range to zero. A macrotask delay lets
    // layout stabilize first (a rAF would do the same, but isn't guaranteed
    // to fire promptly on every render path, so setTimeout is more robust).
    const t = setTimeout(() => {
      ctx = gsap.context(() => {
        const slides = slideRefs.current.filter((s): s is HTMLDivElement => !!s);
        const dots = dotRefs.current.filter((d): d is HTMLSpanElement => !!d);
        const images = slides.map((s) => s.querySelector<HTMLElement>(".kcard-img img"));

        gsap.set(slides.slice(1), { autoAlpha: 0 });
        gsap.set(dots[0], { opacity: 1 });
        gsap.set(dots.slice(1), { opacity: 0.35 });

        const steps = slides.length - 1;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinRef.current,
            start: "top top",
            end: `+=${steps * 100}%`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        slides.forEach((slide, i) => {
          if (i === 0) return;
          const at = i - 1;
          const prev = slides[i - 1];
          tl.to(prev, { autoAlpha: 0, duration: 1, ease: "power1.inOut" }, at)
            .fromTo(
              slide,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 1, ease: "power1.inOut" },
              at
            )
            .fromTo(
              images[i],
              { scale: 1.08 },
              { scale: 1, duration: 1, ease: "none" },
              at
            );
          if (dots[i - 1] && dots[i]) {
            tl.to(dots[i - 1], { opacity: 0.35, duration: 1 }, at).to(
              dots[i],
              { opacity: 1, duration: 1 },
              at
            );
          }
        });

        ScrollTrigger.refresh();
      }, pinRef);
    });

    return () => {
      clearTimeout(t);
      ctx?.revert();
    };
  }, [posts.length]);

  if (!posts.length) return null;

  return (
    <div className="wrap k-carousel-pin" ref={pinRef}>
      <div className="k-carousel">
        {posts.map((post, i) => (
          <div
            key={post.slug}
            className="k-carousel-slide"
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
          >
            <PostCard post={post} featured priority={i === 0} />
          </div>
        ))}

        {posts.length > 1 && (
          <div className="k-carousel-dots" aria-hidden="true">
            {posts.map((post, i) => (
              <span
                key={post.slug}
                className="k-dot"
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
