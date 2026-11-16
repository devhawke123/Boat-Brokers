import type { ApiBuyer, ApiBuyerBooking, BuyerStatus } from './api'
import { leadSources } from './adminLeadData'

export type BuyerStage = 'New' | 'Contacted' | 'Viewing Booked' | 'Won' | 'Lost'

export type BuyerActivity = {
  id: string
  title: string
  at: string
}

export type BuyerViewingRequest = {
  id: string
  boatName: string
  status: string
  slot: string
  requestedAt: string
  boatId: number
  imageUrl: string | null
}

export type BuyerInterestBoat = {
  id: string
  boatId: number
  name: string
  type: string
  price: number | null
  image: string | null
}

export type AdminBuyer = {
  id: string
  numericId: number
  firstName: string
  surname: string
  email: string
  phone: string
  source: string
  status: BuyerStage
  createdAt: string
  viewingRequests: BuyerViewingRequest[]
  interestedBoats: BuyerInterestBoat[]
  activity: BuyerActivity[]
}

export type BuyerFormValues = {
  firstName: string
  surname: string
  email: string
  phone: string
}

export const buyerStages: BuyerStage[] = ['New', 'Contacted', 'Viewing Booked', 'Won', 'Lost']
export const buyerSources = ['Manual', ...leadSources]

const stageFromApi: Record<BuyerStatus, BuyerStage> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  VIEWING_BOOKED: 'Viewing Booked',
  WON: 'Won',
  LOST: 'Lost',
}

const bookingStatusLabel: Record<ApiBuyerBooking['status'], string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
}

export const buyerStatusToApi = (status: BuyerStage): BuyerStatus =>
  status.toUpperCase().replaceAll(' ', '_') as BuyerStatus

export const buyerName = (buyer: { firstName: string; surname: string }) =>
  [buyer.firstName, buyer.surname].filter(Boolean).join(' ')

export function validateBuyer(values: BuyerFormValues) {
  const errors: Partial<Record<keyof BuyerFormValues, string>> = {}
  if (!values.firstName?.trim()) errors.firstName = 'Enter a first name.'
  if (!values.surname?.trim()) errors.surname = 'Enter a surname.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email?.trim() || '')) errors.email = 'Enter a valid email address.'
  return errors
}

export function filterBuyers(buyers: AdminBuyer[], { status = '', source = 'All sources', search = '' }: { status?: string; source?: string; search?: string } = {}) {
  const query = search.trim().toLowerCase()
  return buyers
    .filter(buyer =>
      (!status || buyer.status === status)
      && (source === 'All sources' || buyer.source === source)
      && [buyerName(buyer), buyer.email, buyer.phone].some(value => String(value || '').toLowerCase().includes(query)))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function buyerActivityEvent(title: string): BuyerActivity {
  return { id: crypto.randomUUID(), title, at: new Date().toISOString() }
}

function formatSlot(startsAt: string, endsAt: string) {
  const start = new Date(startsAt)
  const end = new Date(endsAt)
  const day = start.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  const time = (value: Date) => value.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return `${day} · ${time(start)}–${time(end)}`
}

function toViewingRequest(booking: ApiBuyerBooking): BuyerViewingRequest {
  return {
    id: String(booking.id),
    boatName: booking.boat.name,
    status: bookingStatusLabel[booking.status],
    slot: formatSlot(booking.slot.startsAt, booking.slot.endsAt),
    requestedAt: booking.createdAt,
    boatId: booking.boat.id,
    imageUrl: booking.boat.imageUrl,
  }
}

export type ListingInterestSource = {
  id: string
  boatId: number
  name: string
  type: string
  price: number | null
  image: string | null
}

export function interestedBoatsFromBookings(bookings: ApiBuyerBooking[], listings: ListingInterestSource[] = []): BuyerInterestBoat[] {
  const seen = new Set<number>()
  const boats: BuyerInterestBoat[] = []
  for (const booking of bookings) {
    const boatId = booking.boat.id
    if (seen.has(boatId)) continue
    seen.add(boatId)
    const listing = listings.find(item => item.boatId === boatId)
    boats.push({
      id: listing?.id || String(boatId),
      boatId,
      name: listing?.name || booking.boat.name,
      type: listing?.type || 'Boat',
      price: listing?.price ?? null,
      image: listing?.image ?? booking.boat.imageUrl,
    })
  }
  return boats
}

export function toAdminBuyer(buyer: ApiBuyer, extraActivity: BuyerActivity[] = [], listings: ListingInterestSource[] = []): AdminBuyer {
  const createdAt = typeof buyer.createdAt === 'string' ? buyer.createdAt : new Date(buyer.createdAt).toISOString()
  const bookings = buyer.bookings || []
  return {
    id: buyer.buyerId,
    numericId: buyer.id,
    firstName: buyer.firstName,
    surname: buyer.surname,
    email: buyer.email,
    phone: buyer.phone ?? '',
    source: buyer.source || 'Manual',
    status: stageFromApi[buyer.status],
    createdAt,
    viewingRequests: bookings.map(toViewingRequest),
    interestedBoats: interestedBoatsFromBookings(bookings, listings),
    activity: [
      { id: `${buyer.buyerId}-created`, title: 'Buyer added', at: createdAt },
      ...extraActivity,
    ],
  }
}
