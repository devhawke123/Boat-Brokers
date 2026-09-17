import type { Boat, BoatImage, Seller } from "@prisma/client";
import { toMediaUrl } from "../lib/media";
import { serializeSeller } from "./seller.view";

type BoatWithRelations = Boat & { seller: Seller; images: BoatImage[] };

export function serializeBoat(boat: BoatWithRelations) {
  return {
    ...boat,
    seller: serializeSeller(boat.seller),
    imageUrl: toMediaUrl(boat.imageUrl),
    brochureUrl: toMediaUrl(boat.brochureUrl),
    images: boat.images.map((img) => ({ ...img, path: toMediaUrl(img.path) })),
  };
}
