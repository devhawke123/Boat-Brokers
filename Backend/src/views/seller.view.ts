import type { Seller } from "@prisma/client";

export function serializeSeller(seller: Seller) {
  const { password: _password, ...rest } = seller;
  return rest;
}
