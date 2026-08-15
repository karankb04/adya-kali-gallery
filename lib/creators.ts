import { CREATORS } from "@/content/creators";
import { Creator } from "@/types/creator";

export function getCreators(): Creator[] {
  return CREATORS;
}

export function getCreator(slug: string): Creator | undefined {
  return CREATORS.find((c) => c.slug === slug);
}
