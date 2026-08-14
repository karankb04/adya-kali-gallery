import { Post } from "@/types/post";
import PostCard from "./PostCard";

interface HeroCarouselProps {
  /** The posts to feature at the top of the index — same content as before. */
  posts: Post[];
}

/**
 * Pure CSS sticky stack: each card is `position: sticky` at a slightly
 * deeper offset than the one before it (via the --i custom property), so as
 * you scroll they pile up like a stack of photographs — no scroll library,
 * matching the "Forms that stack as you pass them" pattern from /components.
 */
export default function HeroCarousel({ posts }: HeroCarouselProps) {
  if (!posts.length) return null;

  return (
    <div className="wrap k-stack">
      {posts.map((post, i) => (
        <div
          key={post.slug}
          className="k-stack-card"
          style={{ "--i": i } as React.CSSProperties}
        >
          <PostCard post={post} featured priority={i === 0} />
        </div>
      ))}
    </div>
  );
}
