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
fs.mkdirSync(boatPhotosDir, { recursive: true });
fs.mkdirSync(boatBrochuresDir, { recursive: true });
fs.mkdirSync(sellerAvatarsDir, { recursive: true });

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
