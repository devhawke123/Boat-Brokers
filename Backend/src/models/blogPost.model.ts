import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export function findAllBlogPosts() {
  return prisma.blogPost.findMany({
    orderBy: { id: "asc" },
  });
}

export function findBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } });
}

// Admin-only — every post, not just the public-facing first five (see above).
export function findAllBlogPostsAdmin() {
  return prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
}

export function findBlogPostById(id: number) {
  return prisma.blogPost.findUnique({ where: { id } });
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Appends -2, -3, ... until the slug is free. Admin post volume is low
// (dozens, not thousands) so a few sequential lookups is fine.
async function uniqueSlug(base: string, excludeId?: number): Promise<string> {
  let slug = base;
  let suffix = 2;
  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
}

export async function createBlogPost(data: Omit<Prisma.BlogPostCreateInput, "slug"> & { slug?: string }) {
  const slug = await uniqueSlug(data.slug ? slugify(data.slug) : slugify(data.title));
  return prisma.blogPost.create({ data: { ...data, slug } });
}

export async function updateBlogPost(id: number, data: Partial<Prisma.BlogPostUpdateInput> & { slug?: string }) {
  const { slug: rawSlug, ...rest } = data;
  const slug = rawSlug ? await uniqueSlug(slugify(rawSlug), id) : undefined;
  return prisma.blogPost.update({ where: { id }, data: { ...rest, ...(slug ? { slug } : {}) } });
}

export function deleteBlogPost(id: number) {
  return prisma.blogPost.delete({ where: { id } });
}
