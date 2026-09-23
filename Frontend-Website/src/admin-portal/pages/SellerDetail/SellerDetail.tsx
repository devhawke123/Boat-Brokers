import { useState } from 'react'
import AdminShell from '../../components/AdminShell/AdminShell'
import { useAdminSession } from '../../data/useAdminSession'
import { useSellers, invalidateSellersCache } from '../../../seller-portal/data/useSellers'
import { useBoatListings, invalidateListingsCache } from '../../../seller-portal/data/useBoatListings'
import { deleteSeller, updateListingStatus, type ListingStatus, type SellerStatus } from '../../../seller-portal/lib/api'
import { updateSellerStatus } from '../../lib/api'
import SellerInfoCard from './sections/SellerInfoCard/SellerInfoCard'
import SellerListingsTable from './sections/SellerListingsTable/SellerListingsTable'

type SellerDetailProps = {
  sellerId: number
}

export default function SellerDetail({ sellerId }: SellerDetailProps) {
  const { checkedSession } = useAdminSession()
  const { sellers, loading, error, refetch } = useSellers()
  const { listings, loading: listingsLoading, refetch: refetchListings } = useBoatListings()
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [updatingListingId, setUpdatingListingId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const seller = sellers.find((s) => s.id === sellerId) ?? null
  const sellerListings = listings.filter((l) => l.seller.id === sellerId)

  async function handleStatusChange(status: SellerStatus) {
    setUpdatingStatus(true)
    setActionError(null)
    try {
      await updateSellerStatus(sellerId, status)
      invalidateSellersCache()
      refetch()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update status.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  async function handleListingStatusChange(listingId: number, status: ListingStatus) {
    setUpdatingListingId(listingId)
    setActionError(null)
    try {
      await updateListingStatus(listingId, status)
      invalidateListingsCache()
      refetchListings()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update listing status.')
    } finally {
      setUpdatingListingId(null)
    }
  }

  async function handleDelete() {
    if (!seller) return
    if (!window.confirm(`Delete seller "${seller.name}"? This can't be undone.`)) return
    try {
      await deleteSeller(seller.id)
      invalidateSellersCache()
      window.location.href = '/admin-portal/sellers'
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to delete seller.')
    }
  }

  if (!checkedSession) return null

  return (
    <AdminShell mainClassName="bg-frost">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <a href="/admin-portal/sellers" className="w-fit text-sm font-semibold text-[#64748b] hover:text-[#0f172a]">
          ← Back to Boat Sellers
        </a>

        {error ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#fca5a5] bg-[#fef2f2] py-16 text-center text-[#b91c1c]">
            <p>Couldn&rsquo;t load this seller from the server: {error}</p>
          </div>
        ) : loading || listingsLoading ? (
          <div className="flex flex-col gap-6">
            <div className="h-56 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
            <div className="h-64 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
          </div>
        ) : !seller ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#e2e8f0] bg-white py-16 text-center text-[#64748b]">
            <p>This seller couldn&rsquo;t be found.</p>
          </div>
        ) : (
          <>
            {actionError && (
              <p className="rounded-md border border-[#fecaca] bg-[#fef2f2] px-4 py-2 text-sm font-medium text-[#dc2626]">
                {actionError}
              </p>
            )}
            <SellerInfoCard
              seller={seller}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              updatingStatus={updatingStatus}
            />
            <SellerListingsTable
              listings={sellerListings}
              onStatusChange={handleListingStatusChange}
              updatingId={updatingListingId}
            />
          </>
        )}
      </div>
    </AdminShell>
  )
}
