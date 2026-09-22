import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// ponytail: totalBuyers/vendorsWon/buyersWon/completedSales are stubbed at 0
// until their underlying models land (Buyer + vendor status in a later
// module, Sale in a later module still). Swap the stub for a real count once
// that model exists — same shape as the counts already wired below.
export async function getDashboardStats(_req: Request, res: Response) {
  const [totalVendors, listings, underOffer, totalSales] = await Promise.all([
    prisma.seller.count(),
    prisma.boatListing.count(),
    prisma.boat.count({ where: { isUnderOffer: true } }),
    prisma.boat.count({ where: { isSold: true } }),
  ]);

  res.json({
    peopleMetrics: {
      totalVendors,
      totalBuyers: 0,
      vendorsWon: 0,
      buyersWon: 0,
    },
    salesOverview: {
      listings,
      underOffer,
      totalSales,
      completedSales: 0,
    },
  });
}
