import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// ponytail: completedSales is stubbed at 0 until the Sale model lands in a
// later module. Swap the stub for a real count once that model exists —
// same shape as the counts already wired below.
export async function getDashboardStats(_req: Request, res: Response) {
  const [totalVendors, totalBuyers, listings, underOffer, totalSales] = await Promise.all([
    prisma.seller.count(),
    prisma.buyer.count(),
    prisma.boatListing.count(),
    prisma.boat.count({ where: { isUnderOffer: true } }),
    prisma.boat.count({ where: { isSold: true } }),
  ]);

  res.json({
    peopleMetrics: {
      totalVendors,
      totalBuyers,
    },
    salesOverview: {
      listings,
      underOffer,
      totalSales,
      completedSales: 0,
    },
  });
}
