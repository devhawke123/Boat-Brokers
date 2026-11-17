import type { ApiBoat } from '../../lib/api'

export type AvailabilityBoatOption = {
  id: number
  name: string
  type: string
  builder: string | null
  year: string | null
  price: number | null
  image: string | null
}

// Published / bookable inventory for the availability picker — live catalog
// boats that aren't archived or sold.
export function availabilityBoatOptions(boats: ApiBoat[]): AvailabilityBoatOption[] {
  return boats
    .filter((boat) => !boat.isDeleted && !boat.isSold)
    .map((boat) => ({
      id: boat.id,
      name: boat.name,
      type: boat.boatType || 'Boat',
      builder: boat.builder ?? null,
      year: boat.yearBuilt ?? boat.year ?? null,
      price: boat.price,
      image: boat.imageUrl,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function normaliseSlotBoatIds(value: number[] | null = null): number[] | null {
  if (value === null) return null
  if (!Array.isArray(value) || !value.length || value.some((id) => !Number.isInteger(id) || id <= 0)) {
    throw new Error('Select at least one boat, or choose All boats.')
  }
  return [...new Set(value)]
}

export function slotBoatDetails(slot: { boatIds?: number[] | null }, boats: AvailabilityBoatOption[]) {
  if (slot.boatIds == null) return null
  return slot.boatIds.map((id) => {
    const match = boats.find((boat) => boat.id === id)
    return match || { id, name: 'Unavailable boat', type: 'Boat', builder: null, year: null, price: null, image: null }
  })
}

export function slotBoatLabel(slot: { boatIds?: number[] | null }, boats: AvailabilityBoatOption[]) {
  const scoped = slotBoatDetails(slot, boats)
  return scoped === null ? 'All boats' : scoped.map((boat) => boat.name).join(', ')
}
