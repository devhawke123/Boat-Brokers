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
import { adminRouter } from "./routes/admin";
import { dashboardStatsRouter } from "./routes/dashboardStats";
import { availabilityRouter } from "./routes/availability";
import { bookingsRouter } from "./routes/bookings";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();
const port = process.env.PORT || 4000;
const imagesRoot = path.resolve(__dirname, "..", "..", "boat brokers product images");
const blogImagesRoot = path.resolve(__dirname, "..", "..", "bb-blogs");
const uploadsRoot = path.resolve(__dirname, "..", "uploads");

// Supports a comma-separated list (e.g. "https://example.com,https://www.example.com")
// so production can allow multiple origins without changing single-origin behavior.
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: allowedOrigins.length > 1 ? allowedOrigins : allowedOrigins[0] }));
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/boats", boatsRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/sellers", sellersRouter);
app.use("/api/listings", boatListingsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/admin", dashboardStatsRouter);
app.use("/api/availability-slots", availabilityRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/media", express.static(imagesRoot));
app.use("/media/blogs", express.static(blogImagesRoot));
app.use("/uploads", express.static(uploadsRoot));

app.use("/api", notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
