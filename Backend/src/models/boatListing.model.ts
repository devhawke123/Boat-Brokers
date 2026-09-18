import type { ListingStatus, Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const listingInclude = {
  boat: {
    include: {
      images: { orderBy: { position: "asc" as const } },
      customFields: { orderBy: { position: "asc" as const } },
    },
  },
  seller: true,
  // Only top-level comments here; each carries its own replies nested one
  // level deep (see ListingComment's self-relation in schema.prisma).
  comments: {
    where: { parentId: null },
    orderBy: { createdAt: "asc" as const },
    include: { replies: { orderBy: { createdAt: "asc" as const } } },
  },
};

export function findAllListings() {
  return prisma.boatListing.findMany({
    include: listingInclude,
    orderBy: { id: "asc" },
  });
}

export function findListingById(id: number) {
  return prisma.boatListing.findUnique({ where: { id }, include: listingInclude });
}

type ListingPreferences = Pick<
  Prisma.BoatListingUncheckedCreateInput,
  "sellTimeline" | "contactTime" | "listerType" | "additionalNotes" | "agreedToContact"
>;

export function createListing(boatId: number, sellerId: number, preferences: ListingPreferences = {}) {
  return prisma.boatListing.create({
    data: { boatId, sellerId, ...preferences },
    include: listingInclude,
  });
}

export function deleteListing(id: number) {
  return prisma.boatListing.delete({ where: { id } });
}

export function updateListingStatus(id: number, status: ListingStatus) {
  return prisma.boatListing.update({
    where: { id },
    data: { status },
    include: listingInclude,
  });
}

export function updateListingPreferences(id: number, preferences: ListingPreferences) {
  return prisma.boatListing.update({
    where: { id },
    data: preferences,
    include: listingInclude,
  });
}

type NewCommentOptions = {
  parentId?: number;
  fromSeller?: boolean;
};

export function addListingComment(listingId: number, content: string, author?: string, options: NewCommentOptions = {}) {
  return prisma.listingComment.create({
    data: { listingId, content, author, parentId: options.parentId, fromSeller: options.fromSeller ?? false },
    include: { replies: { orderBy: { createdAt: "asc" as const } } },
  });
}
