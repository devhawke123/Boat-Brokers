import SellerPortalShell from '../../components/SellerPortalShell/SellerPortalShell'
import { useSellerSession } from '../../data/useSellerSession'
import { useBoatListings } from '../../data/useBoatListings'
import { computeListingStats } from '../../lib/listingStats'
import DashboardHeader from './sections/DashboardHeader/DashboardHeader'
import StatsOverview from './sections/StatsOverview/StatsOverview'
import BoatListingTable from './sections/BoatListingTable/BoatListingTable'
import RecentComments from './sections/RecentComments/RecentComments'
import ListingsOverview from './sections/ListingsOverview/ListingsOverview'
import AddBoatCta from './sections/AddBoatCta/AddBoatCta'

export default function Dashboard() {
  const { seller, checkedSession } = useSellerSession()
  const { listings, loading, error } = useBoatListings()
  const sellerListings = seller ? listings.filter((listing) => listing.seller.id === seller.id) : []
  const { approved, pending, rejected, commentCount } = computeListingStats(sellerListings)

  // Redirecting — render nothing rather than flashing dashboard content.
  if (!checkedSession) return null

  return (
    <SellerPortalShell mainClassName="bg-frost">
      <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
        <DashboardHeader name={seller?.name} />

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

            <div className="grid w-full grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_21.8rem]">
              <div className="flex min-w-0 flex-col gap-6">
                <BoatListingTable listings={sellerListings} />
                <RecentComments listings={sellerListings} />
              </div>

              <div className="flex min-w-0 flex-col gap-8">
                <ListingsOverview approved={approved} pending={pending} rejected={rejected} />
                <AddBoatCta />
              </div>
            </div>
          </>
        )}
      </div>
    </SellerPortalShell>
  )
}
