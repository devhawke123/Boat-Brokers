import { prisma } from "../lib/prisma";

// Only the first five posts are listed publicly for now. The other 57 stay in
// the database untouched and are still served by findBlogPostBySlug, so a
// direct /blog/:slug link keeps working. To list everything again, drop the
// `take` below.
const PUBLIC_POST_LIMIT = 5;

export function findAllBlogPosts() {
  return prisma.blogPost.findMany({
    orderBy: { id: "asc" },
    take: PUBLIC_POST_LIMIT,
  });
}

export function findBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } });
}
