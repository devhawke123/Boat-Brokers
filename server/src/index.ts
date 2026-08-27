import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { boatsRouter } from "./routes/boats";

const app = express();
const port = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/boats", boatsRouter);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
