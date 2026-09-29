import type { ApiBoatListing } from './api'

export function computeListingStats(listings: ApiBoatListing[]) {
  // A deleted boat's listing keeps whatever status it had (e.g. still
  // "APPROVED"), but it's no longer live/pending/rejected in any meaningful
  // sense — it shouldn't inflate those counts. See BoatsTable/BoatListingTable
  // for the matching "Deleted" badge treatment.
  const active = listings.filter((listing) => !listing.boat.isDeleted)
  return {
    approved: active.filter((listing) => listing.status === 'APPROVED').length,
    pending: active.filter((listing) => listing.status === 'PENDING').length,
    rejected: active.filter((listing) => listing.status === 'REJECTED').length,
    commentCount: listings.reduce(
      (sum, listing) => sum + listing.comments.reduce((count, comment) => count + 1 + comment.replies.length, 0),
      0,
    ),
  }
}
