import type { Boat, BoatListing, ListingComment, Seller } from "@prisma/client";
import { toMediaUrl } from "../lib/media";
import { serializeSeller } from "./seller.view";

type ListingWithRelations = BoatListing & {
  boat: Boat;
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
      id: listing.boat.id,
      boatId: listing.boat.boatId,
      name: listing.boat.name,
      imageUrl: toMediaUrl(listing.boat.imageUrl),
      price: listing.boat.price,
    },
    seller: serializeSeller(listing.seller),
    comments: listing.comments,
  };
}
