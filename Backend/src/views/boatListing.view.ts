import type { Boat, BoatCustomField, BoatImage, BoatListing, ListingComment, Seller } from "@prisma/client";
import { toMediaUrl } from "../lib/media";
import { serializeSeller } from "./seller.view";

type ListingWithRelations = BoatListing & {
  boat: Boat & { images: BoatImage[]; customFields: BoatCustomField[] };
  seller: Seller;
  comments: (ListingComment & { replies: ListingComment[] })[];
};

export function serializeListing(listing: ListingWithRelations) {
  return {
    id: listing.id,
    status: listing.status,
    createdAt: listing.createdAt,
    sellTimeline: listing.sellTimeline,
    contactTime: listing.contactTime,
    listerType: listing.listerType,
    additionalNotes: listing.additionalNotes,
    agreedToContact: listing.agreedToContact,
    boat: {
      ...listing.boat,
      imageUrl: toMediaUrl(listing.boat.imageUrl),
      brochureUrl: toMediaUrl(listing.boat.brochureUrl),
      images: listing.boat.images.map((img) => ({ ...img, path: toMediaUrl(img.path) })),
      customFields: listing.boat.customFields,
    },
    seller: serializeSeller(listing.seller),
    comments: listing.comments,
  };
}
