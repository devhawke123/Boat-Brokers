import path from "path";

// Image paths in the DB are stored relative to the repo root, e.g.
// "boat brokers product images/POPPY/1.jpg" (see prisma/seed.js).
// Static files are served from that folder under the "/media" prefix.
const IMAGES_FOLDER_NAME = "boat brokers product images";

export function toMediaUrl(relPath: string | null | undefined): string | null {
  if (!relPath) return null;
  const normalized = relPath.split(path.sep).join("/");
  const withoutRoot = normalized.startsWith(`${IMAGES_FOLDER_NAME}/`)
    ? normalized.slice(IMAGES_FOLDER_NAME.length + 1)
    : normalized;
  return `/media/${withoutRoot.split("/").map(encodeURIComponent).join("/")}`;
}

// Blog image paths in the DB are stored relative to the repo root, e.g.
// "bb-blogs/01-some-slug/header.jpg" (see prisma/seed-blogs.js). Static files
// are served from that folder under the "/media/blogs" prefix.
const BLOG_IMAGES_FOLDER_NAME = "bb-blogs";

export function toBlogMediaUrl(relPath: string | null | undefined): string | null {
  if (!relPath) return null;
  const normalized = relPath.split(path.sep).join("/");
  const withoutRoot = normalized.startsWith(`${BLOG_IMAGES_FOLDER_NAME}/`)
    ? normalized.slice(BLOG_IMAGES_FOLDER_NAME.length + 1)
    : normalized;
  return `/media/blogs/${withoutRoot.split("/").map(encodeURIComponent).join("/")}`;
}
