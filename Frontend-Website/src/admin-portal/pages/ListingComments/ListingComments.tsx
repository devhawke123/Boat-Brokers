import AdminShell from '../../components/AdminShell/AdminShell'
import { useAdminSession } from '../../data/useAdminSession'
import { useBoatListings } from '../../../seller-portal/data/useBoatListings'
import CommentThreadCard from '../../../seller-portal/pages/CommentThread/sections/CommentThreadCard/CommentThreadCard'
import ListingCommentsHeader from './sections/ListingCommentsHeader/ListingCommentsHeader'

type ListingCommentsProps = {
  listingId: number
}

export default function ListingComments({ listingId }: ListingCommentsProps) {
  const { admin, checkedSession } = useAdminSession()
  const { listings, loading, error, refetch } = useBoatListings()
  const listing = listings.find((l) => l.id === listingId) ?? null

  if (!checkedSession) return null

  return (
    <AdminShell mainClassName="bg-frost">
      <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
        {error ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#fca5a5] bg-[#fef2f2] py-16 text-center text-[#b91c1c]">
            <p>Couldn&rsquo;t load this listing from the server: {error}</p>
          </div>
        ) : loading ? (
          <div className="flex flex-col gap-8">
            <div className="h-24 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
            <div className="h-80 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
          </div>
        ) : !listing ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#e2e8f0] bg-white py-16 text-center text-[#64748b]">
            <p>This listing couldn&rsquo;t be found.</p>
            <a href="/admin-portal/sellers" className="text-sm font-semibold text-[#2563eb]">
              Back to Boat Sellers
            </a>
          </div>
        ) : (
          <>
            <ListingCommentsHeader
              boatName={listing.boat.name}
              boatImageUrl={listing.boat.imageUrl}
              sellerId={listing.seller.id}
            />
            <CommentThreadCard
              listingId={listing.id}
              comments={listing.comments}
              sellerName={admin?.name ?? 'Admin'}
              fromSeller={false}
              onCommentPosted={refetch}
            />
          </>
        )}
      </div>
    </AdminShell>
  )
}
