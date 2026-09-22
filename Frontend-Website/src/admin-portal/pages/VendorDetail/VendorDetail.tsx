import { useState } from 'react'
import AdminShell from '../../components/AdminShell/AdminShell'
import { useAdminSession } from '../../data/useAdminSession'
import { useSellers, invalidateSellersCache } from '../../../seller-portal/data/useSellers'
import { useBoatListings, invalidateListingsCache } from '../../../seller-portal/data/useBoatListings'
import { deleteSeller, updateListingStatus, type ListingStatus, type VendorStatus } from '../../../seller-portal/lib/api'
import { updateSellerStatus } from '../../lib/api'
import VendorInfoCard from './sections/VendorInfoCard/VendorInfoCard'
import VendorListingsTable from './sections/VendorListingsTable/VendorListingsTable'

type VendorDetailProps = {
  vendorId: number
}

export default function VendorDetail({ vendorId }: VendorDetailProps) {
  const { checkedSession } = useAdminSession()
  const { sellers, loading, error, refetch } = useSellers()
  const { listings, loading: listingsLoading, refetch: refetchListings } = useBoatListings()
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [updatingListingId, setUpdatingListingId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const vendor = sellers.find((s) => s.id === vendorId) ?? null
  const vendorListings = listings.filter((l) => l.seller.id === vendorId)

  async function handleStatusChange(status: VendorStatus) {
    setUpdatingStatus(true)
    setActionError(null)
    try {
      await updateSellerStatus(vendorId, status)
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
    if (!vendor) return
    if (!window.confirm(`Delete vendor "${vendor.name}"? This can't be undone.`)) return
    try {
      await deleteSeller(vendor.id)
      invalidateSellersCache()
      window.location.href = '/admin-portal/vendors'
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to delete vendor.')
    }
  }

  if (!checkedSession) return null

  return (
    <AdminShell mainClassName="bg-frost">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <a href="/admin-portal/vendors" className="w-fit text-sm font-semibold text-[#64748b] hover:text-[#0f172a]">
          ← Back to Boat Vendors
        </a>

        {error ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#fca5a5] bg-[#fef2f2] py-16 text-center text-[#b91c1c]">
            <p>Couldn&rsquo;t load this vendor from the server: {error}</p>
          </div>
        ) : loading || listingsLoading ? (
          <div className="flex flex-col gap-6">
            <div className="h-56 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
            <div className="h-64 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
          </div>
        ) : !vendor ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#e2e8f0] bg-white py-16 text-center text-[#64748b]">
            <p>This vendor couldn&rsquo;t be found.</p>
          </div>
        ) : (
          <>
            {actionError && (
              <p className="rounded-md border border-[#fecaca] bg-[#fef2f2] px-4 py-2 text-sm font-medium text-[#dc2626]">
                {actionError}
              </p>
            )}
            <VendorInfoCard
              vendor={vendor}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              updatingStatus={updatingStatus}
            />
            <VendorListingsTable
              listings={vendorListings}
              onStatusChange={handleListingStatusChange}
              updatingId={updatingListingId}
            />
          </>
        )}
      </div>
    </AdminShell>
  )
}
