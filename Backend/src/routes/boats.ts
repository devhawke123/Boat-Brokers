import { Router } from "express";
import { prisma } from "../lib/prisma";
import { toMediaUrl } from "../lib/media";

export const boatsRouter = Router();

function serializeBoat<T extends { imageUrl: string | null; images: { path: string }[] }>(boat: T) {
  return {
    ...boat,
    imageUrl: toMediaUrl(boat.imageUrl),
    images: boat.images.map((img) => ({ ...img, path: toMediaUrl(img.path) })),
  };
}

boatsRouter.get("/", async (_req, res) => {
  const boats = await prisma.boat.findMany({
    include: { seller: true, images: { orderBy: { position: "asc" } } },
    orderBy: { id: "asc" },
  });
  res.json(boats.map(serializeBoat));
});

boatsRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid boat id" });

  const boat = await prisma.boat.findUnique({
    where: { id },
    include: { seller: true, images: { orderBy: { position: "asc" } } },
  });
  if (!boat) return res.status(404).json({ error: "Boat not found" });
  res.json(serializeBoat(boat));
});
