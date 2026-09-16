import type { ListingStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";

const listingInclude = {
  boat: true,
  seller: true,
  comments: { orderBy: { createdAt: "asc" as const } },
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

export function createListing(boatId: number, sellerId: number) {
  return prisma.boatListing.create({
    data: { boatId, sellerId },
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

export function addListingComment(listingId: number, content: string, author?: string) {
  return prisma.listingComment.create({
    data: { listingId, content, author },
  });
}
