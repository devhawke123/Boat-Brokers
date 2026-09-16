import { useEffect, useState } from 'react'
import { fetchBoats, type ApiBoat } from '../lib/api'

export type BoatStatus = 'featured' | 'under-offer' | 'sold' | null
export type FuelType = 'Diesel' | 'Petrol' | 'Electric' | 'Hybrid'

export type BoatSpec = {
  label: string
  value: string
}

export type BoatDetail = {
  subtitle: string
  registration: string
  sternType: string
  hullThickness: string
  engineMake: string
  tags: string[]
  overview: string[]
  keySpecs: BoatSpec[]
  history: BoatSpec[]
  dimensions: BoatSpec[]
  engineDetails: BoatSpec[]
  heating: BoatSpec[]
  electrical: BoatSpec[]
  gas: BoatSpec[]
  interior: BoatSpec[]
  other: BoatSpec[]
  brochureUrl?: string
  videoUrl?: string
  virtualTourUrl?: string
}

export type BoatListing = {
  id: number
  slug: string
  name: string
  location: string
  price: string
  // Parsed numeric asking price. 0 when the catalogue has no real price yet
  // (sold/under offer/blank) — an admin portal will manage real prices later.
  priceValue: number
  image: string
  images: string[]
  length: string
  // Parsed feet from `length`, for range filtering. Null when unparseable.
  lengthFeet: number | null
  berths: string
  // Total berth count parsed from `berths` (e.g. "2 + 2" -> 4). Null when unparseable.
  berthsCount: number | null
  // The catalogue has no boat-type data yet — every boat defaults to
  // "Narrowboats" until an admin categorises them individually.
  boatType: string
  yearBuilt: string
  fuel: FuelType
  status: BoatStatus
  detail: BoatDetail
  // Lowercased blob of name/builder/location/overview text for search matching.
  searchText: string
}

export const boatStatusStyles: Record<Exclude<BoatStatus, null>, { label: string; className: string }> = {
  featured: { label: 'Featured', className: 'bg-navy-dark' },
  'under-offer': { label: 'Under Offer', className: 'bg-[#f59e0b]' },
  sold: { label: 'Sold', className: 'bg-[#1e293b]' },
}

export const boatAvailabilityBadge: { label: string; className: string } = {
  label: 'Available Now',
  className: 'bg-blue',
}

export function formatPrice(value: number) {
  return `£${value.toLocaleString('en-GB')}`
}

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="%23e2e8f0"/></svg>',
  )

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// The seed data pulls numeric-looking reference numbers (CRT numbers, service
// hours, etc.) out of a spreadsheet, so integers often arrive as "63972.0".
function clean(value: string | null | undefined): string | null {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return /^\d+\.0$/.test(trimmed) ? trimmed.slice(0, -2) : trimmed
}

// Most values are clean ("70ft"), but a few carry extra text ("62ft with
// Josher style bow") or a beam measurement ("68ft x 12ft") — take the first
// foot figure. Returns null when nothing parseable is present (e.g. one
// record has "Narrowboat" in this field instead of a length).
function parseLengthFeet(value: string | null | undefined): number | null {
  const cleaned = clean(value)
  if (!cleaned) return null
  const match = cleaned.match(/(\d+(?:\.\d+)?)\s*ft/i)
  return match ? Number(match[1]) : null
}

// "2 + 2" / "2+2" style berth counts mean total sleeping capacity — sum the
// numbers. Returns null when unparseable.
function parseBerthsCount(value: string | null | undefined): number | null {
  const cleaned = clean(value)
  if (!cleaned) return null
  const numbers = cleaned.match(/\d+/g)
  if (!numbers) return null
  return numbers.reduce((sum, n) => sum + Number(n), 0)
}

function specs(entries: [string, string | null | undefined][]): BoatSpec[] {
  return entries
    .map(([label, value]) => ({ label, value: clean(value) }))
    .filter((spec): spec is BoatSpec => Boolean(spec.value))
}

function deriveStatus(boat: ApiBoat): { status: BoatStatus; price: string } {
  if (boat.isSold) return { status: 'sold', price: 'Sold' }
  if (boat.isUnderOffer) return { status: 'under-offer', price: 'Under Offer' }
  if (boat.isFeatured) return { status: 'featured', price: boat.cost }
  return { status: null, price: boat.cost }
}

const SOLD_OVERVIEW = ['This boat has been sold, but we can help you find a similar one!']

function deriveOverview(boat: ApiBoat): string[] {
  if (boat.isSold) return SOLD_OVERVIEW

  if (boat.overview && boat.overview.trim()) {
    // Long-form paragraphs are stored as one block of text; split on sentence
    // boundaries so they read as paragraphs rather than a wall of text.
    const sentences = boat.overview.trim().match(/[^.!?]+[.!?]+(\s+|$)/g) ?? [boat.overview.trim()]
    const paragraphs: string[] = []
    for (let i = 0; i < sentences.length; i += 3) {
      paragraphs.push(sentences.slice(i, i + 3).join('').trim())
    }
    return paragraphs.filter(Boolean)
  }

  const builder = clean(boat.builder) ?? clean(boat.hullBuilder)
  const parts = [
    boat.name,
    'is a',
    clean(boat.yearBuilt) ? `${clean(boat.yearBuilt)}` : null,
    clean(boat.lengthBeam),
    clean(boat.sternType),
    clean(boat.boatType) ?? 'narrowboat',
    builder ? `built by ${builder}` : null,
  ].filter(Boolean)
  return [`${parts.join(' ')}. Full details are available from the broker on request.`]
}

export function mapApiBoatToListing(boat: ApiBoat): BoatListing {
  const { status, price } = deriveStatus(boat)
  const images = boat.images.map((img) => img.path).filter((p): p is string => Boolean(p))
  const image = boat.imageUrl ?? images[0] ?? FALLBACK_IMAGE
  const crt = clean(boat.crtNumber)
  const searchText = [boat.name, boat.builder, boat.hullBuilder, boat.location, boat.overview]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return {
    id: boat.id,
    slug: slugify(boat.name) || String(boat.id),
    name: boat.name,
    location: clean(boat.location) ?? 'Location available on request',
    price,
    priceValue: boat.price ?? 0,
    image,
    images: images.length ? images : [image],
    length: clean(boat.lengthBeam) ?? 'N/A',
    lengthFeet: parseLengthFeet(boat.lengthBeam),
    berths: clean(boat.noOfBerths) ?? 'N/A',
    berthsCount: parseBerthsCount(boat.noOfBerths),
    boatType: clean(boat.boatType) ?? 'Narrowboats',
    searchText,
    yearBuilt: clean(boat.yearBuilt) ?? 'N/A',
    // The catalogue doesn't record fuel type; these are canal narrowboats,
    // which are diesel-powered in practice.
    fuel: 'Diesel',
    status,
    detail: {
      subtitle: [clean(boat.lengthBeam), clean(boat.sternType), clean(boat.boatType) ?? 'Narrowboat']
        .filter(Boolean)
        .join(' '),
      registration: crt ? `CRT №${crt}` : 'Registration available on request',
      sternType: clean(boat.sternType) ?? 'N/A',
      hullThickness: clean(boat.steelSpec) ?? 'N/A',
      engineMake: clean(boat.engine) ?? 'N/A',
      tags: [
        clean(boat.sternType) ? `${clean(boat.sternType)} Stern` : null,
        clean(boat.recentSurvey) ? 'Recent Survey' : null,
        clean(boat.centralHeating) === 'Yes' ? 'Central Heating' : null,
        clean(boat.bowthruster) === 'Yes' ? 'Bowthruster' : null,
      ].filter((tag): tag is string => Boolean(tag)),
      overview: deriveOverview(boat),
      keySpecs: specs([
        ['Hull Builder', boat.hullBuilder],
        ['Fit Out', boat.fitOut],
        ['Last Service', boat.lastService],
        ['Blacking', boat.blacking],
        ['Boat Safety', boat.boatSafety],
        ['Recent Survey', boat.recentSurvey],
      ]),
      history: specs([
        ['CIN number', boat.cinNumber],
        ['CRT number', boat.crtNumber],
        ['License number', boat.licenseNumber],
        ['Previous owners', boat.previousOwners],
        ['Engine service history', boat.engineServiceHistory],
        ['Boiler service history', boat.boilerServiceHistory],
        ['Blacking', boat.blacking],
        ['Survey', boat.survey],
        ['Anodes', boat.anodes],
        ['Documentation available', boat.documentationAvailable],
      ]),
      dimensions: specs([
        ['Draft', boat.draft],
        ['Internal headroom', boat.internalHeadroom],
        ['Saloon length', boat.saloonLength],
        ['Galley length', boat.galleyLength],
        ['Bathroom length', boat.bathroomLength],
        ['Bedroom length', boat.bedroomLength],
      ]),
      engineDetails: specs([
        ['Engine', boat.engine],
        ['Hours', boat.hours],
        ['Gearbox', boat.gearbox],
        ['Bowthruster', boat.bowthruster],
        ['Weedhatch', boat.weedhatch],
        ['Diesel tank capacity', boat.dieselTankCapacity],
        ['Notes', boat.engineExtraNotes],
      ]),
      heating: specs([
        ['Central heating', boat.centralHeating],
        ['Solid fuel stove', boat.solidFuelStove],
        ['Source of hot water', boat.sourceOfHotWater],
        ['Water tank', boat.waterTank],
        ['Water tank capacity', boat.waterTankCapacity],
        ['Notes', boat.heatingExtraNotes],
      ]),
      electrical: specs([
        ['Alternator', boat.alternator],
        ['Batteries', boat.batteries],
        ['Lighting', boat.lighting],
        ['Inverter/charger', boat.inverterCharger],
        ['Landline socket', boat.landlineSocket],
        ['Galvanic isolator', boat.galvanicIsolator],
        ['Notes', boat.electricalExtraNotes],
      ]),
      gas: specs([
        ['Gas bottles', boat.gasBottles],
        ['Appliances', boat.appliances],
        ['Notes', boat.gasExtraNotes],
      ]),
      interior: specs([
        ['Insulation', boat.insulation],
        ['Ballast', boat.ballast],
        ['Ceiling', boat.ceiling],
        ['Cabin sides', boat.cabinSides],
        ['Hull sides', boat.hullSides],
        ['Flooring', boat.flooring],
        ['Side doors', boat.sideDoors],
        ['Windows', boat.windows],
        ['Saloon seating', boat.saloonSeating],
        ['Saloon dinette', boat.saloonDinette],
        ['Galley cooker', boat.galleyCooker],
        ['Galley fridge/freezer', boat.galleyFridgeFreezer],
        ['Galley microwave', boat.galleyMicrowave],
        ['Galley washing machine', boat.galleyWashingMachine],
        ['Bathroom toilet', boat.bathroomToilet],
        ['Bathroom waste tank capacity', boat.bathroomWasteTankCapacity],
        ['Bathroom bath/shower', boat.bathroomBathShower],
        ['Bathroom vanity basin', boat.bathroomVanityBasin],
        ['Bedroom bed', boat.bedroomBed],
        ['Bedroom dinette', boat.bedroomDinette],
        ['Notes', boat.interiorExtraNotes ?? boat.galleyExtraNotes ?? boat.bathroomExtraNotes ?? boat.bedroomExtraNotes],
      ]),
      other: specs([
        ['TV', boat.tv],
        ['Covers', boat.covers],
        ['Navigation equipment', boat.navigationEquipment],
        ['Hull builder', boat.hullBuilder],
        ['Fit out', boat.fitOut],
        ['Steel spec', boat.steelSpec],
        ['Last service', boat.lastService],
        ['Boat safety', boat.boatSafety],
        ['Recent survey', boat.recentSurvey],
      ]),
      brochureUrl: `mailto:info@theboatbrokers.co.uk?subject=${encodeURIComponent(`Brochure request - ${boat.name}`)}`,
      videoUrl: '/selling#virtual-tour',
      virtualTourUrl: '/selling#virtual-tour',
    },
  }
}

type BoatsState = {
  boats: BoatListing[]
  loading: boolean
  error: string | null
}

let cache: BoatListing[] | null = null
let inflight: Promise<BoatListing[]> | null = null

function loadBoats(): Promise<BoatListing[]> {
  if (cache) return Promise.resolve(cache)
  if (!inflight) {
    inflight = fetchBoats()
      .then((boats) => {
        cache = boats.map(mapApiBoatToListing)
        return cache
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

export function useBoatListings(): BoatsState {
  const [state, setState] = useState<BoatsState>({ boats: cache ?? [], loading: !cache, error: null })

  useEffect(() => {
    if (cache) {
      setState({ boats: cache, loading: false, error: null })
      return
    }
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    loadBoats()
      .then((boats) => {
        if (!cancelled) setState({ boats, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({ boats: [], loading: false, error: err instanceof Error ? err.message : 'Failed to load boats' })
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

export function useBoatBySlug(slug: string) {
  const { boats, loading, error } = useBoatListings()
  const boat = boats.find((b) => b.slug === slug) ?? null
  return { boat, loading, error }
}
