import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import path from "path";

// Seller-uploaded boat media lives outside the seeded "boat brokers product
// images" folder — see lib/media.ts for how their paths get resolved back
// into servable URLs.
const boatPhotosDir = path.resolve(__dirname, "..", "..", "uploads", "boats");
const boatBrochuresDir = path.resolve(__dirname, "..", "..", "uploads", "brochures");
const sellerAvatarsDir = path.resolve(__dirname, "..", "..", "uploads", "sellers");
const blogImagesDir = path.resolve(__dirname, "..", "..", "uploads", "blogs");

// Fail fast and loud at startup if these can't be created (e.g. a permissions
// problem on a freshly deployed server) instead of every upload silently
// 500ing later with no clue why.
for (const dir of [boatPhotosDir, boatBrochuresDir, sellerAvatarsDir, blogImagesDir]) {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (err) {
    console.error(`Failed to create upload directory "${dir}". Check filesystem permissions for the process user.`, err);
    throw err;
  }
}

const storage = multer.diskStorage({
  destination: (_req, file, cb) => cb(null, file.fieldname === "brochure" ? boatBrochuresDir : boatPhotosDir),
  filename: (_req, file, cb) => cb(null, `${crypto.randomUUID()}${path.extname(file.originalname)}`),
});

export const uploadBoatMedia = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024, files: 21 },
  fileFilter: (_req, file, cb) => {
    if (file.fieldname === "brochure") {
      if (file.mimetype !== "application/pdf") {
        cb(new Error("The boat brochure must be a PDF file"));
        return;
      }
      cb(null, true);
      return;
    }
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed for boat photos"));
      return;
    }
    cb(null, true);
  },
}).fields([
  { name: "photos", maxCount: 20 },
  { name: "brochure", maxCount: 1 },
]);

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, sellerAvatarsDir),
  filename: (_req, file, cb) => cb(null, `${crypto.randomUUID()}${path.extname(file.originalname)}`),
});

export const uploadSellerAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed for a seller avatar"));
      return;
    }
    cb(null, true);
  },
}).single("avatar");

const blogImageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, blogImagesDir),
  filename: (_req, file, cb) => cb(null, `${crypto.randomUUID()}${path.extname(file.originalname)}`),
});

export const uploadBlogImage = multer({
  storage: blogImageStorage,
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed for a blog post image"));
      return;
    }
    cb(null, true);
  },
}).single("image");
