import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export function findAllSellers() {
  return prisma.seller.findMany({ orderBy: { id: "asc" } });
}

export function findSellerById(id: number) {
  return prisma.seller.findUnique({ where: { id } });
}

export function findSellerByEmail(email: string) {
  return prisma.seller.findUnique({ where: { email } });
}

export function createSeller(data: Prisma.SellerCreateInput) {
  return prisma.seller.create({ data });
}

export function updateSeller(id: number, data: Prisma.SellerUpdateInput) {
  return prisma.seller.update({ where: { id }, data });
}

export function deleteSeller(id: number) {
  return prisma.seller.delete({ where: { id } });
}
