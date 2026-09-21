import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { listingInclude } from "./boatListing.model";

export const boatInclude = {
  seller: true,
  images: { orderBy: { position: "asc" as const } },
  customFields: { orderBy: { position: "asc" as const } },
};

export function findAllBoats() {
  return prisma.boat.findMany({
    where: {
      OR: [
        { listings: { none: {} } },
        { listings: { some: { status: "APPROVED" } } },
      ],
    },
    include: boatInclude,
    orderBy: { id: "asc" },
  });
}

export function findBoatById(id: number) {
  return prisma.boat.findUnique({ where: { id }, include: boatInclude });
}

type ListingPreferences = Pick<
  Prisma.BoatListingUncheckedCreateInput,
  "sellTimeline" | "contactTime" | "listerType" | "additionalNotes" | "agreedToContact"
>;

type CustomFieldInput = { label: string; value: string };

export function createBoatWithListing(
  sellerId: number,
  boatData: Omit<Prisma.BoatUncheckedCreateInput, "sellerId">,
  imagePaths: string[],
  listingPreferences: ListingPreferences = {},
  customFields: CustomFieldInput[] = [],
) {
  return prisma.$transaction(async (tx) => {
    const boat = await tx.boat.create({
      data: {
        ...boatData,
        sellerId,
        images: imagePaths.length ? { create: imagePaths.map((path, position) => ({ path, position })) } : undefined,
        customFields: customFields.length
          ? { create: customFields.map((field, position) => ({ ...field, position })) }
          : undefined,
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

export function updateBoat(
  id: number,
  boatData: Partial<Omit<Prisma.BoatUncheckedUpdateInput, "sellerId">>,
  newImagePaths: string[] = [],
  newBrochureUrl?: string,
  customFields?: CustomFieldInput[],
) {
  return prisma.$transaction(async (tx) => {
    const data: Prisma.BoatUncheckedUpdateInput = { ...boatData };
    if (newBrochureUrl !== undefined) data.brochureUrl = newBrochureUrl;

    const boat = await tx.boat.update({
      where: { id },
      data,
      include: boatInclude,
    });

    if (newImagePaths.length > 0) {
      // Determine next position index
      const maxPos = boat.images.length > 0 ? Math.max(...boat.images.map((img) => img.position)) : -1;
      await tx.boatImage.createMany({
        data: newImagePaths.map((path, i) => ({ boatId: id, path, position: maxPos + 1 + i })),
      });
    }

    if (customFields !== undefined) {
      // Replace all custom fields
      await tx.boatCustomField.deleteMany({ where: { boatId: id } });
      if (customFields.length > 0) {
        await tx.boatCustomField.createMany({
          data: customFields.map((field, position) => ({ boatId: id, ...field, position })),
        });
      }
    }

    // Refetch with updated images + customFields
    return tx.boat.findUniqueOrThrow({ where: { id }, include: boatInclude });
  });
}

