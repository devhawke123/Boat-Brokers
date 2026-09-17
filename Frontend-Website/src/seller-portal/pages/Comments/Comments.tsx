import SellerPortalShell from '../../components/SellerPortalShell/SellerPortalShell'
import { useSellerSession } from '../../data/useSellerSession'
import { useBoatListings } from '../../data/useBoatListings'
import CommentsList from './sections/CommentsList/CommentsList'

export default function Comments() {
  const { seller, checkedSession } = useSellerSession()
  const { listings, loading, error } = useBoatListings()
  const sellerListings = seller ? listings.filter((listing) => listing.seller.id === seller.id) : []

  // Redirecting — render nothing rather than flashing page content.
  if (!checkedSession) return null

  return (
    <SellerPortalShell mainClassName="bg-frost">
      <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-h4 capitalize text-[#0f172a]">Comments</h1>
          <p className="text-base text-[#64748b]">View and manage comments related to your boat listings.</p>
        </div>

        {error ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#fca5a5] bg-[#fef2f2] py-16 text-center text-[#b91c1c]">
            <p>Couldn&rsquo;t load your comments from the server: {error}</p>
            <p className="text-sm text-[#6b7280]">Make sure the API server is running at http://localhost:4000.</p>
          </div>
        ) : loading ? (
          <div className="h-80 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
        ) : (
          <CommentsList listings={sellerListings} />
        )}
      </div>
    </SellerPortalShell>
  )
}
