import SellerPortalShell from '../../components/SellerPortalShell/SellerPortalShell'
import { useSellerSession } from '../../data/useSellerSession'
import { useBoatListings } from '../../data/useBoatListings'
import CommentThreadHeader from './sections/CommentThreadHeader/CommentThreadHeader'
import CommentThreadCard from './sections/CommentThreadCard/CommentThreadCard'

type CommentThreadProps = {
  listingId: number
}

export default function CommentThread({ listingId }: CommentThreadProps) {
  const { seller, checkedSession } = useSellerSession()
  const { listings, loading, error, refetch } = useBoatListings()
  const listing = seller ? (listings.find((l) => l.id === listingId && l.seller.id === seller.id) ?? null) : null

  // Redirecting — render nothing rather than flashing page content.
  if (!checkedSession) return null

  return (
    <SellerPortalShell mainClassName="bg-frost">
      <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
        {error ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#fca5a5] bg-[#fef2f2] py-16 text-center text-[#b91c1c]">
            <p>Couldn&rsquo;t load this listing from the server: {error}</p>
            <p className="text-sm text-[#6b7280]">Make sure the API server is running at http://localhost:4000.</p>
          </div>
        ) : loading ? (
          <div className="flex flex-col gap-8">
            <div className="h-24 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
            <div className="h-80 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
          </div>
        ) : !listing ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#e2e8f0] bg-white py-16 text-center text-[#64748b]">
            <p>This listing couldn&rsquo;t be found.</p>
            <a href="/seller-portal/comments" className="text-sm font-semibold text-[#2563eb]">
              Back to Comments
            </a>
          </div>
        ) : (
          <>
            <CommentThreadHeader boatName={listing.boat.name} boatImageUrl={listing.boat.imageUrl} />
            <CommentThreadCard
              listingId={listing.id}
              comments={listing.comments}
              sellerName={seller?.name ?? 'Seller'}
              onCommentPosted={refetch}
            />
          </>
        )}
      </div>
    </SellerPortalShell>
  )
}
