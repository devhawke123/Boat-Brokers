export type ApiBoatImage = {
  id: number
  path: string | null
  position: number
}

export type ApiSeller = {
  id: number
  name: string
  email: string
  phone: string | null
}

// Mirrors the Prisma `Boat` model (server/prisma/schema.prisma). Every field
// beyond the core ones is a free-text catalogue detail and may be null.
export type ApiBoat = {
  id: number
  name: string
  cost: string
  price: number | null
  isSold: boolean
  isUnderOffer: boolean
  isFeatured: boolean
  imageUrl: string | null
  sellerId: number
  seller: ApiSeller
  images: ApiBoatImage[]

  cinNumber: string | null
  crtNumber: string | null
  licenseNumber: string | null
  previousOwners: string | null
  engineServiceHistory: string | null
  boilerServiceHistory: string | null
  survey: string | null
  blacking: string | null
  anodes: string | null
  documentationAvailable: string | null

  draft: string | null
  internalHeadroom: string | null
  saloonLength: string | null
  galleyLength: string | null
  bathroomLength: string | null
  bedroomLength: string | null

  engine: string | null
  hours: string | null
  gearbox: string | null
  bowthruster: string | null
  weedhatch: string | null
  dieselTankCapacity: string | null
  engineExtraNotes: string | null

  centralHeating: string | null
  solidFuelStove: string | null
  sourceOfHotWater: string | null
  waterTank: string | null
  waterTankCapacity: string | null
  heatingExtraNotes: string | null

  alternator: string | null
  batteries: string | null
  lighting: string | null
  inverterCharger: string | null
  landlineSocket: string | null
  galvanicIsolator: string | null
  electricalExtraNotes: string | null

  gasBottles: string | null
  appliances: string | null
  gasExtraNotes: string | null

  insulation: string | null
  ballast: string | null
  ceiling: string | null
  cabinSides: string | null
  hullSides: string | null
  flooring: string | null
  sideDoors: string | null
  windows: string | null
  interiorExtraNotes: string | null

  saloonSeating: string | null
  saloonDinette: string | null

  galleyCooker: string | null
  galleyFridgeFreezer: string | null
  galleyMicrowave: string | null
  galleyWashingMachine: string | null
  galleyExtraNotes: string | null

  bathroomToilet: string | null
  bathroomWasteTankCapacity: string | null
  bathroomBathShower: string | null
  bathroomVanityBasin: string | null
  bathroomExtraNotes: string | null

  bedroomBed: string | null
  bedroomDinette: string | null
  bedroomExtraNotes: string | null

  tv: string | null
  covers: string | null
  navigationEquipment: string | null
  hullBuilder: string | null
  fitOut: string | null
  year: string | null
  steelSpec: string | null
  lastService: string | null
  boatSafety: string | null
  recentSurvey: string | null

  boatName: string | null
  location: string | null
  lengthBeam: string | null
  noOfBerths: string | null
  sternType: string | null
  yearBuilt: string | null
  builder: string | null
  boatType: string | null
  overview: string | null

  createdAt: string
  updatedAt: string
}

const API_BASE = '/api'

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with ${res.status}`)
  }
  return res.json() as Promise<T>
}

export function fetchBoats(): Promise<ApiBoat[]> {
  return apiGet<ApiBoat[]>('/boats')
}

export function fetchBoat(id: number): Promise<ApiBoat> {
  return apiGet<ApiBoat>(`/boats/${id}`)
}
