import type { ListingStatus, Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { listingInclude } from "./boatListing.model";

export const boatInclude = {
  seller: true,
  images: { orderBy: { position: "asc" as const } },
  customFields: { orderBy: { position: "asc" as const } },
};

// `includeDeleted` is opt-in — the public storefront (GET /api/boats) never
// sets it, so a soft-deleted boat disappears from listings automatically.
// The admin Boats page passes it explicitly so it can still see (and tag)
// deleted boats.
export function findAllBoats(options: { includeDeleted?: boolean } = {}) {
  return prisma.boat.findMany({
    where: {
      ...(options.includeDeleted ? {} : { isDeleted: false }),
      OR: [
        { listings: { none: {} } },
        { listings: { some: { status: "APPROVED" } } },
      ],
    },
    include: boatInclude,
    orderBy: { id: "asc" },
  });
}

export function findBoatById(id: number, options: { includeDeleted?: boolean } = {}) {
  return prisma.boat.findFirst({
    where: { id, ...(options.includeDeleted ? {} : { isDeleted: false }) },
    include: boatInclude,
  });
}

export function softDeleteBoat(id: number) {
  return prisma.boat.update({ where: { id }, data: { isDeleted: true }, include: boatInclude });
}

export function restoreBoat(id: number) {
  return prisma.boat.update({ where: { id }, data: { isDeleted: false }, include: boatInclude });
}

export function countBoatSales(id: number) {
  return prisma.sale.count({ where: { boatId: id } });
}

// Hard delete. Child rows (images, custom fields, listings and their comments,
// bookings) go with the boat via onDelete: Cascade. Returns the stored upload
// paths that were referenced so the caller can remove the files from disk —
// but only those no other boat still points at.
export async function permanentlyDeleteBoat(id: number) {
  const boat = await prisma.boat.findUnique({
    where: { id },
    select: { imageUrl: true, brochureUrl: true, images: { select: { path: true } } },
  });
  if (!boat) return [];

  const candidates = [boat.imageUrl, boat.brochureUrl, ...boat.images.map((image) => image.path)].filter(
    (value): value is string => Boolean(value),
  );

  await prisma.boat.delete({ where: { id } });

  const stillUsed = new Set<string>();
  for (const stored of candidates) {
    const used = await prisma.boat.count({
      where: { OR: [{ imageUrl: stored }, { brochureUrl: stored }, { images: { some: { path: stored } } }] },
    });
    if (used > 0) stillUsed.add(stored);
  }
  return [...new Set(candidates)].filter((stored) => !stillUsed.has(stored));
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
  listingStatus?: ListingStatus,
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
      data: { boatId: boat.id, sellerId, ...(listingStatus ? { status: listingStatus } : {}), ...listingPreferences },
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
  mainImageId?: number,
  mainNewImagePath?: string,
) {
  return prisma.$transaction(async (tx) => {
    const data: Prisma.BoatUncheckedUpdateInput = { ...boatData };
    if (newBrochureUrl !== undefined) data.brochureUrl = newBrochureUrl;

    if (mainImageId !== undefined) {
      const image = await tx.boatImage.findFirst({ where: { id: mainImageId, boatId: id } });
      if (image?.path) data.imageUrl = image.path;
    } else if (mainNewImagePath) {
      data.imageUrl = mainNewImagePath;
    }

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


export const MAX_FEATURED_BOATS = 4;

export function countFeaturedBoats(excludeId: number) {
  return prisma.boat.count({ where: { isFeatured: true, isDeleted: false, id: { not: excludeId } } });
}
