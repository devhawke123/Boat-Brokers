import AdminShell from '../../components/AdminShell/AdminShell'
import { useAdminSession } from '../../data/useAdminSession'
import { useBuyers, invalidateBuyersCache } from '../../data/useBuyers'
import { deleteBuyer, type ApiBuyer } from '../../lib/api'
import BuyersTable from './sections/BuyersTable/BuyersTable'

export default function Buyers() {
  const { checkedSession } = useAdminSession()
  const { buyers, loading, error, refetch } = useBuyers()

  async function handleDelete(buyer: ApiBuyer) {
    if (!window.confirm(`Delete buyer "${buyer.firstName} ${buyer.surname}"? This can't be undone.`)) return
    try {
      await deleteBuyer(buyer.id)
      invalidateBuyersCache()
      refetch()
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to delete buyer.')
    }
  }

  if (!checkedSession) return null

  return (
    <AdminShell mainClassName="bg-frost">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Boat Buyers</h1>

        {error ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#fca5a5] bg-[#fef2f2] py-16 text-center text-[#b91c1c]">
            <p>Couldn&rsquo;t load buyers from the server: {error}</p>
            <p className="text-sm text-[#6b7280]">Make sure the API server is running at http://localhost:4000.</p>
          </div>
        ) : loading ? (
          <div className="h-80 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
        ) : (
          <BuyersTable buyers={buyers} onDelete={handleDelete} />
        )}
      </div>
    </AdminShell>
  )
}
