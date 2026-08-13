import Link from "next/link";
import { Post } from "@/types/post";
import { formatDate } from "@/lib/posts";
import RImage from "../RImage";

interface PostCardProps {
  post: Post;
  /** Featured card: larger image, larger type (index lead story). */
  featured?: boolean;
  /** Load the cover image eagerly (e.g. the first slide of the hero carousel). */
  priority?: boolean;
}

export default function PostCard({ post, featured, priority }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`kcard${featured ? " kcard-featured" : ""}`}
    >
      <div className="kcard-img">
        <RImage
          r2Key={post.cover.r2Key}
          alt={post.cover.alt}
          width={post.cover.width}
          height={post.cover.height}
          dominantColor={post.cover.dominantColor}
          priority={priority}
          sizes={
            featured
              ? "(max-width:760px) 92vw, 640px"
              : "(max-width:760px) 92vw, 400px"
          }
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <span className="kcard-kind">{post.kind}</span>
      </div>
      <div className="kcard-meta">
        {post.deva && <div className="kcard-deva">{post.deva}</div>}
        <h3 className="kcard-title">{post.title}</h3>
        <p className="kcard-dek">{post.dek}</p>
        <div className="kcard-foot">
          <span>{formatDate(post.date)}</span>
          <span className="kdot">·</span>
          <span>{post.minutes} min read</span>
        </div>
      </div>
    </Link>
  );
}
