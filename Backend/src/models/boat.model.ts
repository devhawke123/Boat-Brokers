import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { listingInclude } from "./boatListing.model";

export const boatInclude = {
  seller: true,
  images: { orderBy: { position: "asc" as const } },
};

export function findAllBoats() {
  return prisma.boat.findMany({ include: boatInclude, orderBy: { id: "asc" } });
}

export function findBoatById(id: number) {
  return prisma.boat.findUnique({ where: { id }, include: boatInclude });
}

type ListingPreferences = Pick<
  Prisma.BoatListingUncheckedCreateInput,
  "sellTimeline" | "contactTime" | "listerType" | "additionalNotes" | "agreedToContact"
>;

export function createBoatWithListing(
  sellerId: number,
  boatData: Omit<Prisma.BoatUncheckedCreateInput, "sellerId">,
  imagePaths: string[],
  listingPreferences: ListingPreferences = {},
) {
  return prisma.$transaction(async (tx) => {
    const boat = await tx.boat.create({
      data: {
        ...boatData,
        sellerId,
        images: imagePaths.length ? { create: imagePaths.map((path, position) => ({ path, position })) } : undefined,
      },
      include: boatInclude,
    });

    const listing = await tx.boatListing.create({
      data: { boatId: boat.id, sellerId, ...listingPreferences },
      include: listingInclude,
    });

    return { boat, listing };
  });
}
