import type { ClientListing } from './listingAdapter'

type BoatFilters = { query?: string; status?: string; sort?: string }

export function filterBoats(listings: ClientListing[], { query = '', status = 'All boats', sort = 'Newest first' }: BoatFilters = {}) {
  const needle = query.trim().toLocaleLowerCase()
  return listings
    .filter((listing) => {
      const data = listing.details
      return (
        (status === 'All boats' || listing.status === status) &&
        (!needle || `${listing.name} ${listing.type} ${data.builder || ''} ${data.year || ''}`.toLocaleLowerCase().includes(needle))
      )
    })
    .sort((a, b) => {
      if (sort === 'Price: high to low') return (b.price || 0) - (a.price || 0)
      if (sort === 'Price: low to high') return (a.price || 0) - (b.price || 0)
      if (sort === 'Name A–Z') return a.name.localeCompare(b.name)
      const dateA = a.updatedAt || a.submittedAt || ''
      const dateB = b.updatedAt || b.submittedAt || ''
      return sort === 'Oldest first' ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA)
    })
}
