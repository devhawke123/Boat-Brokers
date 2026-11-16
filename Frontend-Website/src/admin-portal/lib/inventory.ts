import type { ApiBoatListing, ApiSeller, ListingStatus } from '../../seller-portal/lib/api'
import { listingFromApi } from '../../seller-portal/lib/listingAdapter'
import type { WizardData } from '../../seller-portal/lib/listingAdapter'
import type { ApiSale } from './api'
import { toOverviewBoat } from './adminOverview'
import type { ApprovalLabel } from './adminOverview'
import { sellerStatusLabel } from './statusLabels'

// Adapters from the live listing/seller/sale records to the row and drawer
// shapes of boat-brokers AdminInventory.jsx. The prototype's listingWorkflow
// kept approval, publication, featured and availability as local flags; here
// they are derived from the existing API fields only:
//   approval     <- listing.status (PENDING / REJECTED / APPROVED)
//   archived     <- boat.isDeleted (soft delete)
//   published    <- APPROVED && !isDeleted (what the public storefront lists)
//   featured     <- boat.isFeatured
//   availability <- boat.isSold / boat.isUnderOffer

export const MAX_FEATURED_BOATS = 4

export type SellerStage = (typeof sellerStatusLabel)[keyof typeof sellerStatusLabel]
export type Availability = 'Available' | 'Under offer' | 'Sold'
export type Publication = 'Published' | 'Not published' | 'Archived'

export const sellerStages = Object.values(sellerStatusLabel) as SellerStage[]
export const sellerStageValue = Object.fromEntries(Object.entries(sellerStatusLabel).map(([value, label]) => [label, value])) as Record<SellerStage, ApiSeller['status']>

export type InventoryPhoto = { src: string; name: string }
export type InventoryComment = { id: number; author: string; text: string; at: string; fromSeller: boolean }

export type InventoryBoat = {
  id: string
  listingId: number
  boatId: number
  code: string
  name: string
  type: string
  price: number | null
  photos: InventoryPhoto[]
  sellerId: string
  seller: InventorySeller
  status: ListingStatus
  approval: ApprovalLabel
  archived: boolean
  published: boolean
  featured: boolean
  availability: Availability
  submittedAt: string
  details: WizardData
  brochureUrl: string | null
  comments: InventoryComment[]
}

export type InventorySeller = {
  id: string
  apiId: number
  code: string
  name: string
  email: string
  phone: string
  location: string
  status: SellerStage
  joined: string
}

export function toInventoryBoat(listing: ApiBoatListing): InventoryBoat {
  const overview = toOverviewBoat(listing)
  // Older API builds omit the customFields relation on listing boats.
  const client = listingFromApi({ ...listing, boat: { ...listing.boat, customFields: listing.boat.customFields ?? [], images: listing.boat.images ?? [] } })
  const boat = listing.boat
  const photos = client.photos.length ? client.photos.map(photo => ({ src: photo.src, name: photo.name })) : boat.imageUrl ? [{ src: boat.imageUrl, name: boat.name }] : []
  return {
    id: overview.id,
    listingId: listing.id,
    boatId: boat.id,
    code: boat.boatId,
    name: boat.name,
    type: client.type,
    price: boat.price,
    photos,
    sellerId: String(listing.seller.id),
    seller: toInventorySeller(listing.seller),
    status: listing.status,
    approval: overview.approval,
    archived: overview.archived,
    published: overview.published,
    featured: Boolean(boat.isFeatured),
    availability: boat.isSold ? 'Sold' : boat.isUnderOffer ? 'Under offer' : 'Available',
    submittedAt: listing.createdAt,
    details: client.details,
    brochureUrl: boat.brochureUrl,
    comments: listing.comments
      .flatMap(comment => [comment, ...comment.replies])
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map(comment => ({ id: comment.id, author: comment.author || (comment.fromSeller ? listing.seller.name : 'The Boat Brokers'), text: comment.content, at: comment.createdAt, fromSeller: comment.fromSeller })),
  }
}

export function toInventorySeller(seller: ApiSeller): InventorySeller {
  return {
    id: String(seller.id),
    apiId: seller.id,
    code: seller.sellerId,
    name: seller.name,
    email: seller.email,
    phone: seller.phone ?? '',
    location: seller.location ?? '',
    status: sellerStatusLabel[seller.status],
    joined: seller.joiningDate,
  }
}

export const publicationStatus = (boat: InventoryBoat): Publication => boat.archived ? 'Archived' : boat.published ? 'Published' : 'Not published'
export const canReviewListing = (boat: InventoryBoat) => !boat.archived && boat.status === 'PENDING'
// Without a separate publish flag, requesting changes on an approved listing
// (status REJECTED) is the only non-archive way to take it off the storefront.
export const canRequestListingChanges = (boat: InventoryBoat) => !boat.archived && boat.status !== 'REJECTED'

// The newest sale that has not been cancelled is the boat's live transaction.
export function activeSaleFor(boat: InventoryBoat, sales: ApiSale[]) {
  return sales.filter(sale => sale.boat.id === boat.boatId && sale.status !== 'CANCELLED').sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] ?? null
}

// Mirrors the backend's updateBoatHandler rules so the toast explains a refusal before the request.
export function featuredRefusal(boat: InventoryBoat, boats: InventoryBoat[]) {
  if (boat.featured) return null
  if (boat.availability !== 'Available') return 'Boats that are under offer or sold cannot be featured.'
  if (boats.filter(item => item.featured && !item.archived && item.boatId !== boat.boatId).length >= MAX_FEATURED_BOATS) return `You can only have ${MAX_FEATURED_BOATS} featured boats at a time.`
  return null
}

export const boatSpecificationGroups: [string, [string, string, string?][]][] = [
  ['History', [['cin', 'CIN / hull ID'], ['crt', 'CRT number'], ['licence', 'Boat licence number'], ['previousOwners', 'Previous owners'], ['ownershipHistory', 'Ownership history'], ['engineService', 'Engine service history'], ['boilerService', 'Boiler service history'], ['hullMaintenance', 'Hull maintenance'], ['anodes', 'Anode maintenance'], ['documentation', 'Available documentation']]],
  ['Dimensions', [['length', 'Length overall', 'ft'], ['beam', 'Beam', 'ft'], ['draft', 'Draft', 'ft'], ['internalHeadroom', 'Internal headroom', 'ft'], ['saloonLength', 'Saloon length', 'ft'], ['galleyLength', 'Galley length', 'ft']]],
  ['Engine', [['engineModel', 'Engine / model'], ['engineHours', 'Engine hours', 'hrs'], ['gearbox', 'Gearbox'], ['fuelCapacity', 'Fuel capacity', 'L']]],
  ['Water & Heating', [['centralHeating', 'Central heating'], ['hotWater', 'Hot water source'], ['waterCapacity', 'Water tank capacity', 'L']]],
  ['Electrical', [['batteries', 'Battery bank'], ['inverter', 'Inverter / charger'], ['solarPanels', 'Solar panels'], ['shorePower', 'Shore power']]],
  ['Interior', [['berths', 'Berths'], ['insulation', 'Insulation'], ['saloonSeating', 'Saloon seating'], ['galleyEquipment', 'Galley equipment'], ['interiorNotes', 'Interior notes']]],
]
