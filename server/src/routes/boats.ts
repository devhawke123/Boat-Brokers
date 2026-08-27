import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export const boatsRouter = Router();

const boatInput = z.object({
  title: z.string().min(1),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900),
  price: z.number().positive(),
  lengthFeet: z.number().positive(),
  description: z.string().min(1),
  imageUrl: z.string().url().optional(),
  brokerId: z.number().int(),
});

boatsRouter.get("/", async (_req, res) => {
  const boats = await prisma.boat.findMany({ include: { broker: true } });
  res.json(boats);
});

boatsRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const boat = await prisma.boat.findUnique({ where: { id }, include: { broker: true } });
  if (!boat) return res.status(404).json({ error: "Boat not found" });
  res.json(boat);
});

boatsRouter.post("/", async (req, res) => {
  const parsed = boatInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const boat = await prisma.boat.create({ data: parsed.data });
  res.status(201).json(boat);
});
