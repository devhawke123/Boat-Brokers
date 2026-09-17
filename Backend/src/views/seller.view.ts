import type { Seller } from "@prisma/client";
import { toMediaUrl } from "../lib/media";

export function serializeSeller(seller: Seller) {
  const { password: _password, ...rest } = seller;
  return { ...rest, avatarUrl: toMediaUrl(seller.avatarUrl) };
}
