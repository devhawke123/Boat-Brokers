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
