import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function getDashboardStats(_req: Request, res: Response) {
  const [totalSellers, totalBuyers, listings, underOffer, totalSales, completedSales] = await Promise.all([
    prisma.seller.count(),
    prisma.buyer.count(),
    prisma.boatListing.count(),
    prisma.boat.count({ where: { isUnderOffer: true } }),
    prisma.sale.count(),
    prisma.sale.count({ where: { status: "COMPLETED" } }),
  ]);

  res.json({
    peopleMetrics: {
      totalSellers,
      totalBuyers,
    },
    salesOverview: {
      listings,
      underOffer,
      totalSales,
      completedSales,
    },
  });
}
