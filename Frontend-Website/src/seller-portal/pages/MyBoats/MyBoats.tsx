import SellerPortalShell from '../../components/SellerPortalShell/SellerPortalShell'
import { useSellerSession } from '../../data/useSellerSession'
import { useBoatListings } from '../../data/useBoatListings'
import { computeListingStats } from '../../lib/listingStats'
import StatsOverview from '../Dashboard/sections/StatsOverview/StatsOverview'
import BoatsTable from './sections/BoatsTable/BoatsTable'

export default function MyBoats() {
  const { seller, checkedSession } = useSellerSession()
  const { listings, loading, error } = useBoatListings()
  const sellerListings = seller ? listings.filter((listing) => listing.seller.id === seller.id) : []
  const { approved, pending, rejected, commentCount } = computeListingStats(sellerListings)

  // Redirecting — render nothing rather than flashing page content.
  if (!checkedSession) return null

  return (
    <SellerPortalShell mainClassName="bg-frost">
      <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-h4 capitalize text-[#0f172a]">My Boats</h1>
          <p className="text-base text-[#64748b]">Here&rsquo;s what&rsquo;s happening with your listings today.</p>
        </div>

        {error ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#fca5a5] bg-[#fef2f2] py-16 text-center text-[#b91c1c]">
            <p>Couldn&rsquo;t load your listings from the server: {error}</p>
            <p className="text-sm text-[#6b7280]">Make sure the API server is running at http://localhost:4000.</p>
          </div>
        ) : loading ? (
          <div className="flex flex-col gap-8">
            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
              ))}
            </div>
            <div className="h-80 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
          </div>
        ) : (
          <>
            <StatsOverview
              totalBoats={sellerListings.length}
              liveBoats={approved}
              pending={pending}
              rejected={rejected}
              comments={commentCount}
            />

            <BoatsTable listings={sellerListings} />
          </>
        )}
      </div>
    </SellerPortalShell>
  )
}
