import type { ApiBoatListing, ApiListingComment, ApiSeller } from './api'
import { completedAdditionalDetails, type AdditionalDetail } from './additionalDetails'

// Shapes the client's v2 UI was built around; everything below converts our
// API records into them and back.
export type ClientStatus = 'Pending' | 'Approved' | 'Rejected' | 'Draft'

export type ClientPhoto = {
  id: string
  name: string
  src: string
  // Set for photos already stored on the server.
  imageId?: number
  // Set for photos picked in this session (or kept in a local draft).
  file?: File
}

export type WizardData = Record<Exclude<WizardKey, 'additionalDetails'>, string> & {
  additionalDetails: AdditionalDetail[]
}

export type ClientComment = {
  id: string
  commentId: number
  listingId: string
  author: string
  date: string
  text: string
  fromSeller: boolean
  parentId: number | null
  createdAt: string
}

export type ClientListing = {
  id: string
  // Present once the listing exists on the server; drafts only live locally.
  listingId?: number
  boatId?: number
  name: string
  type: string
  price: number | null
  submittedAt: string
  updatedAt?: string
  status: ClientStatus
  statusReason?: string
  details: WizardData
  photos: ClientPhoto[]
  brochureUrl?: string
  // Local drafts keep the picked brochure until submit.
  brochureFile?: File
  comments: ClientComment[]
}

export const initialData = {
  boatName: '',
  builder: '',
  year: '',
  length: '',
  boatType: '',
  askingPrice: '',
  overview: '',
  berths: '',
  sternType: '',
  steelSpec: '',
  fitOut: '',
  lastService: '',
  recentSurvey: '',
  blacking: '',
  boatSafety: '',
  cin: '',
  crt: '',
  licence: '',
  previousOwners: '',
  ownershipHistory: '',
  engineService: '',
  boilerService: '',
  hullMaintenance: '',
  anodes: '',
  documentation: '',
  beam: '',
  draft: '',
  internalHeadroom: '',
  saloonLength: '',
  galleyLength: '',
  engineModel: '',
  engineHours: '',
  gearbox: '',
  fuelCapacity: '',
  centralHeating: '',
  hotWater: '',
  waterCapacity: '',
  batteries: '',
  inverter: '',
  solarPanels: '',
  shorePower: '',
  insulation: '',
  saloonSeating: '',
  galleyEquipment: '',
  interiorNotes: '',
  additionalDetails: [] as AdditionalDetail[],
  videoUrl: '',
  virtualTourUrl: '',
  brochureName: '',
  contactName: '',
  email: '',
  phone: '',
  city: '',
  sellTimeline: '',
  contactTime: '',
  sellerType: '',
  notes: '',
}

export type WizardKey = keyof typeof initialData
export type TextKey = Exclude<WizardKey, 'additionalDetails'>

// Wizard field → Boat column(s). Some fields fill two columns because the
// public site reads one (builder, yearBuilt) and the admin portal the other.
const COLUMNS: [WizardKey, string][] = [
  ['builder', 'builder'],
  ['builder', 'hullBuilder'],
  ['boatType', 'boatType'],
  ['year', 'yearBuilt'],
  ['year', 'year'],
  ['length', 'boatLength'],
  ['overview', 'overview'],
  ['berths', 'noOfBerths'],
  ['sternType', 'sternType'],
  ['steelSpec', 'steelSpec'],
  ['fitOut', 'fitOut'],
  ['lastService', 'lastService'],
  ['recentSurvey', 'recentSurvey'],
  ['blacking', 'blacking'],
  ['boatSafety', 'boatSafety'],
  ['cin', 'cinNumber'],
  ['crt', 'crtNumber'],
  ['licence', 'licenseNumber'],
  ['previousOwners', 'previousOwners'],
  ['engineService', 'engineServiceHistory'],
  ['boilerService', 'boilerServiceHistory'],
  ['anodes', 'anodes'],
  ['documentation', 'documentationAvailable'],
  ['draft', 'draft'],
  ['internalHeadroom', 'internalHeadroom'],
  ['saloonLength', 'saloonLength'],
  ['galleyLength', 'galleyLength'],
  ['engineModel', 'engine'],
  ['engineHours', 'hours'],
  ['gearbox', 'gearbox'],
  ['fuelCapacity', 'dieselTankCapacity'],
  ['centralHeating', 'centralHeating'],
  ['hotWater', 'sourceOfHotWater'],
  ['waterCapacity', 'waterTankCapacity'],
  ['batteries', 'batteries'],
  ['inverter', 'inverterCharger'],
  ['solarPanels', 'solarPanels'],
  ['insulation', 'insulation'],
  ['saloonSeating', 'saloonSeating'],
  ['galleyEquipment', 'appliances'],
  ['interiorNotes', 'interiorExtraNotes'],
  ['videoUrl', 'videoUrl'],
  ['virtualTourUrl', 'virtualTourUrl'],
  ['city', 'location'],
]

// Wizard fields with no Boat column ride along as fixed-label custom fields.
const CUSTOM_FIELD_LABELS: Partial<Record<WizardKey, string>> = {
  ownershipHistory: 'Ownership history',
  hullMaintenance: 'Hull maintenance',
  shorePower: 'Shore power',
}

// Older listings were saved with the previous portal's option values.
const LEGACY_TIMELINES: Record<string, string> = { ASAP: 'As soon as possible', '1-3 months': '1–3 months' }

const shortDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' })

function text(value: unknown): string {
  return value === null || value === undefined ? '' : String(value)
}

// lengthBeam is one free-text column ("60 ft × 6.8 ft"); the wizard edits
// length and beam separately.
function composeLengthBeam(length: string, beam: string) {
  if (!length && !beam) return ''
  if (!beam) return `${length} ft`
  return `${length || '?'} ft × ${beam} ft`
}

function parseLengthBeam(value: string) {
  const [length = '', beam = ''] = value.split(/[x×]/i).map((part) => part.match(/[\d.]+/)?.[0] ?? '')
  return { length, beam }
}

function flattenComments(comments: ApiListingComment[], listingId: string): ClientComment[] {
  return comments
    .flatMap((comment) => [comment, ...comment.replies])
    .map((comment) => ({
      id: String(comment.id),
      commentId: comment.id,
      listingId,
      author: comment.author || (comment.fromSeller ? 'You' : 'The Boat Brokers'),
      date: shortDate.format(new Date(comment.createdAt)),
      text: comment.content,
      fromSeller: comment.fromSeller,
      parentId: comment.parentId,
      createdAt: comment.createdAt,
    }))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

const STATUS: Record<ApiBoatListing['status'], ClientStatus> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
}

export function listingFromApi(listing: ApiBoatListing): ClientListing {
  const boat = listing.boat
  const id = String(listing.id)
  const details: WizardData = { ...initialData }
  for (const [key, column] of COLUMNS) {
    if (!details[key] && key !== 'additionalDetails') (details as Record<string, unknown>)[key] = text(boat[column])
  }
  const lengthBeam = parseLengthBeam(text(boat.lengthBeam))
  details.length ||= lengthBeam.length
  details.beam = lengthBeam.beam
  details.boatName = boat.name
  details.askingPrice = text(boat.price)
  details.brochureName = boat.brochureUrl ? 'Boat brochure (PDF)' : ''
  details.contactName = listing.seller.name
  details.email = listing.seller.email
  details.phone = text(listing.seller.phone)
  details.city ||= text(listing.seller.location)
  details.sellTimeline = LEGACY_TIMELINES[text(listing.sellTimeline)] ?? text(listing.sellTimeline)
  details.contactTime = text(listing.contactTime)
  details.sellerType = text(listing.listerType)
  details.notes = text(listing.additionalNotes)

  const fixedLabels = Object.entries(CUSTOM_FIELD_LABELS) as [WizardKey, string][]
  const additional: AdditionalDetail[] = []
  for (const field of [...boat.customFields].sort((a, b) => a.position - b.position)) {
    const fixed = fixedLabels.find(([, label]) => label === field.label)
    if (fixed) (details as Record<string, unknown>)[fixed[0]] = field.value
    else additional.push({ id: `field-${field.id}`, name: field.label, description: field.value })
  }
  details.additionalDetails = additional

  const comments = flattenComments(listing.comments, id)
  const status = STATUS[listing.status]
  const lastBrokerNote = [...comments].reverse().find((comment) => !comment.fromSeller)
  return {
    id,
    listingId: listing.id,
    boatId: boat.id,
    name: boat.name,
    type: details.boatType,
    price: boat.price,
    submittedAt: listing.createdAt.slice(0, 10),
    updatedAt: typeof boat.updatedAt === 'string' ? boat.updatedAt.slice(0, 10) : undefined,
    status,
    // The API has no rejection-reason field; the broker's latest comment is the feedback.
    statusReason: status === 'Rejected' ? lastBrokerNote?.text : undefined,
    details,
    photos: [...boat.images]
      .sort((a, b) => a.position - b.position)
      .filter((image) => image.path)
      .map((image) => ({
        id: `image-${image.id}`,
        imageId: image.id,
        name: `${boat.name} photo ${image.position + 1}`,
        src: image.path as string,
      })),
    brochureUrl: boat.brochureUrl ?? undefined,
    comments,
  }
}

export function sellerListings(listings: ApiBoatListing[], seller: ApiSeller): ClientListing[] {
  return listings
    .filter((listing) => listing.seller.id === seller.id && !listing.boat.isDeleted)
    .map(listingFromApi)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
}

// Whole pounds: the price column is an integer.
export function parsePrice(value: string): number | null {
  const amount = Math.round(Number(value.replace(/,/g, '')))
  return Number.isFinite(amount) && amount > 0 ? amount : null
}

type BoatFormInput = {
  data: WizardData
  photos: ClientPhoto[]
  brochure: File | null
  sellerId: number
  // Edit mode sends every field so a cleared value actually clears the column.
  editing: boolean
}

export function boatFormData({ data, photos, brochure, sellerId, editing }: BoatFormInput): FormData {
  const form = new FormData()
  const put = (key: string, value: string) => {
    if (editing || value) form.set(key, value)
  }
  if (!editing) form.set('sellerId', String(sellerId))
  form.set('name', data.boatName.trim())
  const price = parsePrice(data.askingPrice)
  put('price', price === null ? '' : String(price))
  for (const [key, column] of COLUMNS) put(column, String(data[key]).trim())
  put('lengthBeam', composeLengthBeam(data.length.trim(), data.beam.trim()))

  const fixed = (Object.entries(CUSTOM_FIELD_LABELS) as [WizardKey, string][])
    .map(([key, label]) => ({ label, value: String(data[key]).trim() }))
    .filter((field) => field.value)
  const extra = completedAdditionalDetails(data.additionalDetails).map((item) => ({ label: item.name, value: item.description }))
  const customFields = [...fixed, ...extra]
  if (editing || customFields.length) form.set('customFields', JSON.stringify(customFields))

  put('sellTimeline', data.sellTimeline)
  put('contactTime', data.contactTime)
  put('listerType', data.sellerType)
  put('additionalNotes', data.notes.trim())
  // The Key details step only collects these from sellers happy to be contacted.
  form.set('agreedToContact', 'true')

  const newPhotos = photos.filter((photo) => photo.file)
  for (const photo of newPhotos) form.append('photos', photo.file as File, photo.name)
  // The first photo is the cover; on edit tell the server which one that is.
  const cover = photos[0]
  if (editing && cover?.imageId) form.set('mainImageId', String(cover.imageId))
  if (editing && cover?.file) form.set('mainNewPhotoIndex', String(newPhotos.indexOf(cover)))
  if (brochure) form.set('brochure', brochure, brochure.name)
  return form
}

export function readIdsKey(seller: ApiSeller) {
  return `seller-portal:read-comments:${seller.id}`
}
