import type { Sale } from "@prisma/client";

type SaleWithRelations = Sale & {
  boat: { id: number; name: string; imageUrl: string | null };
  seller: { id: number; name: string; email: string };
  buyer: { id: number; firstName: string; surname: string; email: string };
};

export function serializeSale(sale: SaleWithRelations) {
  return {
    id: sale.id,
    saleId: sale.saleId,
    status: sale.status,
    soldPrice: sale.soldPrice,
    deposit: sale.deposit,
    // Balance is derived, not stored — always soldPrice minus deposit.
    balance: sale.soldPrice - sale.deposit,
    commission: sale.commission,
    createdAt: sale.createdAt,
    boat: sale.boat,
    seller: sale.seller,
    buyer: sale.buyer,
  };
}
