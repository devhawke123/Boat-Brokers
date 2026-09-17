import type { ApiBoatListing } from './api'

export function computeListingStats(listings: ApiBoatListing[]) {
  return {
    approved: listings.filter((listing) => listing.status === 'APPROVED').length,
    pending: listings.filter((listing) => listing.status === 'PENDING').length,
    rejected: listings.filter((listing) => listing.status === 'REJECTED').length,
    commentCount: listings.reduce(
      (sum, listing) => sum + listing.comments.reduce((count, comment) => count + 1 + comment.replies.length, 0),
      0,
    ),
  }
}
