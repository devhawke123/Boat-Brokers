import "dotenv/config";
import path from "path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { boatsRouter } from "./routes/boats";
import { blogsRouter } from "./routes/blogs";
import { sellersRouter } from "./routes/sellers";
import { boatListingsRouter } from "./routes/boatListings";

const app = express();
const port = process.env.PORT || 4000;
const imagesRoot = path.resolve(__dirname, "..", "..", "boat brokers product images");
const blogImagesRoot = path.resolve(__dirname, "..", "..", "bb-blogs");
const uploadsRoot = path.resolve(__dirname, "..", "uploads");

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/boats", boatsRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/sellers", sellersRouter);
app.use("/api/listings", boatListingsRouter);
app.use("/media", express.static(imagesRoot));
app.use("/media/blogs", express.static(blogImagesRoot));
app.use("/uploads", express.static(uploadsRoot));

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
