import { useState } from 'react'
import AdminShell from '../../components/AdminShell/AdminShell'
import { useAdminSession } from '../../data/useAdminSession'
import { useBoatListings, invalidateListingsCache } from '../../../seller-portal/data/useBoatListings'
import { updateListingStatus, type ListingStatus } from '../../../seller-portal/lib/api'
import ListingsTable from './sections/ListingsTable/ListingsTable'

export default function Listings() {
  const { checkedSession } = useAdminSession()
  const { listings, loading, error, refetch } = useBoatListings()
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  async function handleStatusChange(listingId: number, status: ListingStatus) {
    setUpdatingId(listingId)
    setActionError(null)
    try {
      await updateListingStatus(listingId, status)
      invalidateListingsCache()
      refetch()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update listing status.')
    } finally {
      setUpdatingId(null)
    }
  }

  if (!checkedSession) return null

  return (
    <AdminShell mainClassName="bg-frost">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Listings</h1>

        {actionError && (
          <p className="rounded-md border border-[#fecaca] bg-[#fef2f2] px-4 py-2 text-sm font-medium text-[#dc2626]">
            {actionError}
          </p>
        )}

        {error ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#fca5a5] bg-[#fef2f2] py-16 text-center text-[#b91c1c]">
            <p>Couldn&rsquo;t load listings from the server: {error}</p>
            <p className="text-sm text-[#6b7280]">Make sure the API server is running at http://localhost:4000.</p>
          </div>
        ) : loading ? (
          <div className="h-80 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
        ) : (
          <ListingsTable listings={listings} onStatusChange={handleStatusChange} updatingId={updatingId} />
        )}
      </div>
    </AdminShell>
  )
}
