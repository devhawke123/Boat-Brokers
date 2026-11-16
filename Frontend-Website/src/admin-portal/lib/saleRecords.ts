import type { ApiSale, SaleStatus } from './api'
import { saleStatusLabel as apiSaleLabels } from './statusLabels'

// Ported from boat-brokers/src/lib/saleRecords.js. UI stages keep the
// prototype Current/Completed/Cancelled values (and query params); display
// uses statusLabels so CURRENT reads as "In progress".

export type SaleStage = 'Current' | 'Completed' | 'Cancelled'

export type SaleActivity = { id: string; title: string; at: string }

export type AdminSale = {
  id: string
  numericId: number
  boatId: number
  boatListingId: string | null
  boatName: string
  boatImage: string | null
  sellerId: number
  sellerName: string
  buyerId: number
  buyer: string
  buyerEmail: string
  price: number
  deposit: number
  commission: number
  status: SaleStage
  createdAt: string
  completedAt: string | null
  cancelledAt: string | null
  reason: string | null
  activity: SaleActivity[]
}

export type SaleFormValues = {
  buyerId: string
  price: string | number
  deposit: string | number
  commission: string | number
  status: SaleStage
}

export const saleStages: SaleStage[] = ['Current', 'Completed', 'Cancelled']

export const saleStatusLabel = (status: SaleStage | '' | null | undefined) => {
  if (!status) return ''
  return apiSaleLabels[status.toUpperCase() as SaleStatus] ?? status
}

export const saleStatusValue = (label: string): SaleStage =>
  label === 'In progress' ? 'Current' : (label as SaleStage)

export const saleStageToApi = (status: SaleStage): SaleStatus =>
  status.toUpperCase() as SaleStatus

export const saleStageFromApi = (status: SaleStatus): SaleStage =>
  ({ CURRENT: 'Current', COMPLETED: 'Completed', CANCELLED: 'Cancelled' } as const)[status]

export const saleMoney = (value: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 2 }).format(value)

const optionalAmount = (value: string | number | null | undefined) =>
  value == null || value === '' ? 0 : value

const cents = (value: string | number) => Math.round(Number(value) * 100)

const validMoney = (value: string | number) =>
  Number.isFinite(Number(value)) &&
  Number(value) >= 0 &&
  Number.isSafeInteger(cents(value)) &&
  Math.abs(Number(value) * 100 - cents(value)) < 0.000001

export function validateSale(values: SaleFormValues) {
  const errors: Partial<Record<keyof SaleFormValues, string>> = {}
  if (!values.buyerId) errors.buyerId = 'Select a buyer.'
  if (!['Current', 'Completed'].includes(values.status)) errors.status = 'Choose In progress or Completed.'
  if (!String(values.price ?? '').trim() || !validMoney(values.price) || cents(values.price) <= 0) {
    errors.price = 'Enter a price above £0 with no more than 2 decimal places.'
  }
  for (const key of ['deposit', 'commission'] as const) {
    if (!validMoney(optionalAmount(values[key]))) {
      errors[key] = 'Enter a non-negative amount with no more than 2 decimal places.'
    } else if (!errors.price && cents(optionalAmount(values[key])) > cents(values.price)) {
      errors[key] = 'This cannot exceed the sale price.'
    }
  }
  return errors
}

export const saleBalance = (sale: { price: string | number; deposit?: string | number | null }) =>
  (cents(sale.price) - cents(optionalAmount(sale.deposit))) / 100

/** Whole pounds for the live API (Int columns). */
export function saleAmountsForApi(values: Pick<SaleFormValues, 'price' | 'deposit' | 'commission'>) {
  return {
    soldPrice: Math.round(Number(values.price)),
    deposit: Math.round(Number(optionalAmount(values.deposit))),
    commission: Math.round(Number(optionalAmount(values.commission))),
  }
}

export function toAdminSale(
  sale: ApiSale,
  extras: { boatListingId?: string | null; reason?: string | null; activity?: SaleActivity[] } = {},
): AdminSale {
  const status = saleStageFromApi(sale.status)
  const buyerName = [sale.buyer.firstName, sale.buyer.surname].filter(Boolean).join(' ')
  const baseActivity: SaleActivity[] = [
    {
      id: `${sale.id}-created`,
      title: status === 'Completed' || status === 'Cancelled' ? (status === 'Completed' ? 'Sale completed' : 'Sale cancelled') : 'Sale started',
      at: sale.createdAt,
    },
  ]
  return {
    id: String(sale.id),
    numericId: sale.id,
    boatId: sale.boat.id,
    boatListingId: extras.boatListingId ?? null,
    boatName: sale.boat.name,
    boatImage: sale.boat.imageUrl,
    sellerId: sale.seller.id,
    sellerName: sale.seller.name,
    buyerId: sale.buyer.id,
    buyer: buyerName,
    buyerEmail: sale.buyer.email,
    price: Number(sale.soldPrice) || 0,
    deposit: Number(sale.deposit) || 0,
    commission: Number(sale.commission) || 0,
    status,
    createdAt: sale.createdAt,
    completedAt: status === 'Completed' ? sale.createdAt : null,
    cancelledAt: status === 'Cancelled' ? sale.createdAt : null,
    reason: extras.reason ?? null,
    activity: [...baseActivity, ...(extras.activity || [])],
  }
}

export function saleActivityEvent(title: string): SaleActivity {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, title, at: new Date().toISOString() }
}
