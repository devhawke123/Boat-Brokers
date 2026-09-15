import type { BlogPost } from "@prisma/client";
import { toBlogMediaUrl } from "../lib/media";

const EXCERPT_LENGTH = 180;

function toExcerpt(html: string): string {
  const plain = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= EXCERPT_LENGTH) return plain;
  const truncated = plain.slice(0, EXCERPT_LENGTH);
  return `${truncated.slice(0, truncated.lastIndexOf(" "))}…`;
}

// List view: light payload for the blog listing page — no full content.
export function serializeBlogPostSummary(post: BlogPost) {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: toExcerpt(post.content),
    author: post.author,
    date: post.date,
    readTime: post.readTime,
    imageUrl: toBlogMediaUrl(post.imageUrl),
  };
}

// Detail view: full payload for a single blog post page.
export function serializeBlogPostDetail(post: BlogPost) {
  return {
    slug: post.slug,
    title: post.title,
    content: post.content,
    author: post.author,
    date: post.date,
    readTime: post.readTime,
    imageUrl: toBlogMediaUrl(post.imageUrl),
  };
}
