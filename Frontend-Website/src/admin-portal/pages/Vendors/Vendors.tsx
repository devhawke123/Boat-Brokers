import AdminShell from '../../components/AdminShell/AdminShell'
import { useAdminSession } from '../../data/useAdminSession'
import { useSellers, invalidateSellersCache } from '../../../seller-portal/data/useSellers'
import { useBoatListings } from '../../../seller-portal/data/useBoatListings'
import { deleteSeller, type ApiSeller } from '../../../seller-portal/lib/api'
import VendorsTable from './sections/VendorsTable/VendorsTable'

export default function Vendors() {
  const { checkedSession } = useAdminSession()
  const { sellers, loading, error, refetch } = useSellers()
  const { listings } = useBoatListings()

  const boatCounts = listings.reduce<Record<number, number>>((counts, listing) => {
    counts[listing.seller.id] = (counts[listing.seller.id] ?? 0) + 1
    return counts
  }, {})

  async function handleDelete(vendor: ApiSeller) {
    if (!window.confirm(`Delete vendor "${vendor.name}"? This can't be undone.`)) return
    try {
      await deleteSeller(vendor.id)
      invalidateSellersCache()
      refetch()
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to delete vendor.')
    }
  }

  if (!checkedSession) return null

  return (
    <AdminShell mainClassName="bg-frost">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Boat Vendors</h1>

        {error ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#fca5a5] bg-[#fef2f2] py-16 text-center text-[#b91c1c]">
            <p>Couldn&rsquo;t load vendors from the server: {error}</p>
            <p className="text-sm text-[#6b7280]">Make sure the API server is running at http://localhost:4000.</p>
          </div>
        ) : loading ? (
          <div className="h-80 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
        ) : (
          <VendorsTable vendors={sellers} boatCounts={boatCounts} onDelete={handleDelete} />
        )}
      </div>
    </AdminShell>
  )
}
