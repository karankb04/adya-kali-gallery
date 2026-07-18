import { POSTS } from "@/content/posts";
import { Post } from "@/types/post";

/** All katha, newest first. */
export function getPosts(): Post[] {
  return [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

/** Related katha by shared tags/forms (excluding the post itself). */
export function relatedPosts(post: Post, limit = 2): Post[] {
  return getPosts()
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      const shared =
        p.tags.filter((t) => post.tags.includes(t)).length +
        p.relatedForms.filter((f) => post.relatedForms.includes(f)).length;
      return { p, shared };
    })
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map((x) => x.p);
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
