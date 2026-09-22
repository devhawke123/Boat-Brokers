import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

const saleInclude = {
  boat: { select: { id: true, name: true, imageUrl: true } },
  seller: { select: { id: true, name: true, email: true } },
  buyer: { select: { id: true, firstName: true, surname: true, email: true } },
} as const;

export function findAllSales() {
  return prisma.sale.findMany({ orderBy: { createdAt: "desc" }, include: saleInclude });
}

export function findSaleById(id: number) {
  return prisma.sale.findUnique({ where: { id }, include: saleInclude });
}

export function createSale(data: Prisma.SaleUncheckedCreateInput) {
  return prisma.sale.create({ data, include: saleInclude });
}

export function updateSale(id: number, data: Prisma.SaleUncheckedUpdateInput) {
  return prisma.sale.update({ where: { id }, data, include: saleInclude });
}

export function deleteSale(id: number) {
  return prisma.sale.delete({ where: { id } });
}
