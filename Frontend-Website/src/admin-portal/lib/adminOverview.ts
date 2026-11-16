import type { ApiAdminBooking, ApiBlogPostAdmin, ApiBuyer, ApiLead, ApiSale } from './api.ts'
import type { ApiAvailabilitySlot } from '../../lib/api.ts'
import type { ApiBoatListing } from '../../seller-portal/lib/api.ts'
import { listingReviewLabel, saleStatusLabel } from './statusLabels.ts'
import { slotLastDate, ukParts } from './availability.ts'

// Ported from boat-brokers/src/lib/adminOverview.js. The prototype computed
// these aggregates from local sample records; here the same card/chart shapes
// are computed from adapters over the live admin API records.

export type ApprovalLabel = (typeof listingReviewLabel)[keyof typeof listingReviewLabel]
export type LeadStage = 'New' | 'Contacted' | 'Listed' | 'Lost'
export type BuyerStage = 'New' | 'Contacted' | 'Viewing Booked' | 'Won' | 'Lost'
// The stored/query value for sales is the prototype's (Current/Completed/Cancelled);
// saleStatusLabel supplies the display label (Current -> In progress).
export type SaleStage = 'Current' | 'Completed' | 'Cancelled'
export type ViewingStatus = 'Approved' | 'Pending' | 'Rejected'

export const leadStatuses: LeadStage[] = ['New', 'Contacted', 'Listed', 'Lost']
export const approvalStatuses: ApprovalLabel[] = ['Awaiting review', 'Changes required', 'Approved']

export type OverviewBoat = {
  id: string
  name: string
  type: string
  price: number | null
  image: string | null
  approval: ApprovalLabel
  archived: boolean
  published: boolean
}
export type OverviewLead = { status: LeadStage; source: string }
export type OverviewBuyer = { status: BuyerStage }
export type OverviewSeller = { id: number }
export type OverviewSale = { status: SaleStage; price: number }
export type OverviewPost = { id: number; title: string; author: string; date: string; readTime: string; image: string | null }
export type OverviewBooking = { id: string; date: string; start: string; end: string; status: ViewingStatus }
export type OverviewSlot = { date: string; endDate?: string; start: string; end: string }

export type OverviewRecords = {
  boats: OverviewBoat[]
  leads: OverviewLead[]
  buyers: OverviewBuyer[]
  sellers: OverviewSeller[]
  sales: OverviewSale[]
  blogPosts: OverviewPost[]
  bookings: OverviewBooking[]
  availabilitySlots: OverviewSlot[]
}

const leadLabel: Record<ApiLead['status'], LeadStage> = { NEW: 'New', CONTACTED: 'Contacted', LISTED: 'Listed', LOST: 'Lost' }
const buyerLabel: Record<ApiBuyer['status'], BuyerStage> = { NEW: 'New', CONTACTED: 'Contacted', VIEWING_BOOKED: 'Viewing Booked', WON: 'Won', LOST: 'Lost' }
const saleStage: Record<ApiSale['status'], SaleStage> = { CURRENT: 'Current', COMPLETED: 'Completed', CANCELLED: 'Cancelled' }
const viewingLabel: Record<ApiAdminBooking['status'], ViewingStatus> = { PENDING: 'Pending', APPROVED: 'Approved', REJECTED: 'Rejected' }

export const saleStageLabel = (stage: SaleStage) => saleStatusLabel[stage.toUpperCase() as keyof typeof saleStatusLabel]

export function toOverviewBoat(listing: ApiBoatListing): OverviewBoat {
  const approval = listingReviewLabel[listing.status]
  const archived = Boolean(listing.boat.isDeleted)
  const type = listing.boat.boatType
  return {
    id: String(listing.id),
    name: listing.boat.name,
    type: typeof type === 'string' && type ? type : 'Boat',
    price: listing.boat.price,
    image: listing.boat.imageUrl,
    approval,
    archived,
    published: approval === 'Approved' && !archived,
  }
}
export const toOverviewLead = (lead: ApiLead): OverviewLead => ({ status: leadLabel[lead.status], source: lead.source ?? '' })
export const toOverviewBuyer = (buyer: ApiBuyer): OverviewBuyer => ({ status: buyerLabel[buyer.status] })
export const toOverviewSale = (sale: ApiSale): OverviewSale => ({ status: saleStage[sale.status], price: Number(sale.soldPrice) || 0 })
export const toOverviewPost = (post: ApiBlogPostAdmin): OverviewPost => ({ id: post.id, title: post.title, author: post.author, date: post.date.slice(0, 10), readTime: post.readTime, image: post.imageUrl })
export function toOverviewBooking(booking: ApiAdminBooking): OverviewBooking {
  const start = ukParts(booking.slot.startsAt), end = ukParts(booking.slot.endsAt)
  return { id: String(booking.id), date: start.date, start: start.time, end: end.date > start.date ? '24:00' : end.time, status: viewingLabel[booking.status] }
}
// Only open slots count as availability; a held slot already shows as a booking.
export function toOverviewSlots(slots: ApiAvailabilitySlot[]): OverviewSlot[] {
  return slots.filter(slot => slot.available).map(slot => {
    const start = ukParts(slot.startsAt), end = ukParts(slot.endsAt)
    return { date: start.date, start: start.time, end: end.date > start.date ? '24:00' : end.time }
  })
}

export function overviewSnapshot({ boats: allBoats, leads, buyers, sellers, sales, blogPosts, bookings, availabilitySlots }: OverviewRecords, today: string, time = '00:00') {
  const boats = allBoats.filter(boat => !boat.archived)
  const future = (item: { date: string; end: string }) => item.date > today || item.date === today && item.end > time
  const byStart = (a: OverviewBooking, b: OverviewBooking) => (a.date + a.start).localeCompare(b.date + b.start)
  const upcoming = bookings.filter(item => item.status === 'Approved' && future(item)).sort(byStart)
  const pending = bookings.filter(item => item.status === 'Pending' && future(item)).sort(byStart)
  return {
    boats, review: boats.filter(boat => boat.approval === 'Awaiting review'),
    changes: boats.filter(boat => boat.approval === 'Changes required'),
    published: boats.filter(boat => boat.published), leads, buyers, sellers, blogPosts,
    newLeads: leads.filter(lead => lead.status === 'New'), newBuyers: buyers.filter(buyer => buyer.status === 'New'),
    bookings, upcoming, pending, availabilitySlots, openSlots: availabilitySlots.filter(slot => future({ date: slotLastDate(slot), end: slot.end })), sales,
    currentSales: sales.filter(sale => sale.status === 'Current'), completedSales: sales.filter(sale => sale.status === 'Completed'),
    cancelledSales: sales.filter(sale => sale.status === 'Cancelled'),
    latestPosts: [...blogPosts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3),
  }
}
export type OverviewSnapshot = ReturnType<typeof overviewSnapshot>

export function overviewBreakdowns(boats: OverviewBoat[], leads: { source: string }[]) {
  const source = (lead: { source: string }) => lead.source || 'Not recorded'
  return {
    approvals: approvalStatuses.map(label => ({ label, count: boats.filter(boat => boat.approval === label).length })),
    sources: [...new Set(leads.map(source))].map(label => ({ label, count: leads.filter(lead => source(lead) === label).length })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)),
  }
}
