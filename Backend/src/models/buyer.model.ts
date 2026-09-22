import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

// Accepts either the global client or a $transaction handle, so callers
// running inside a transaction (see booking.model.ts) stay on the same
// connection instead of racing a separate one.
type Db = typeof prisma | Prisma.TransactionClient;

export function findBuyerByEmail(email: string, db: Db = prisma) {
  return db.buyer.findFirst({ where: { email } });
}

export function createBuyer(data: { firstName: string; surname: string; email: string; phone?: string }, db: Db = prisma) {
  return db.buyer.create({ data });
}

// Reuses an existing buyer record by email (repeat visitor) rather than
// creating a duplicate row per booking.
export async function findOrCreateBuyer(
  data: { firstName: string; surname: string; email: string; phone?: string },
  db: Db = prisma,
) {
  const existing = await findBuyerByEmail(data.email, db);
  if (existing) return existing;
  return createBuyer(data, db);
}

export function updateBuyerStatus(id: number, status: "NEW" | "CONTACTED" | "VIEWING_BOOKED" | "WON" | "LOST") {
  return prisma.buyer.update({ where: { id }, data: { status } });
}
