import AdminShell from '../../components/AdminShell/AdminShell'
import { useAdminSession } from '../../data/useAdminSession'
import { useSales, invalidateSalesCache } from '../../data/useSales'
import { deleteSale, type ApiSale } from '../../lib/api'
import SalesTable from './sections/SalesTable/SalesTable'

export default function Sales() {
  const { checkedSession } = useAdminSession()
  const { sales, loading, error, refetch } = useSales()

  async function handleDelete(sale: ApiSale) {
    if (!window.confirm(`Delete this sale of "${sale.boat.name}"? This can't be undone.`)) return
    try {
      await deleteSale(sale.id)
      invalidateSalesCache()
      refetch()
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to delete sale.')
    }
  }

  if (!checkedSession) return null

  return (
    <AdminShell mainClassName="bg-frost">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Sales</h1>

        {error ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#fca5a5] bg-[#fef2f2] py-16 text-center text-[#b91c1c]">
            <p>Couldn&rsquo;t load sales from the server: {error}</p>
            <p className="text-sm text-[#6b7280]">Make sure the API server is running at http://localhost:4000.</p>
          </div>
        ) : loading ? (
          <div className="h-80 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
        ) : (
          <SalesTable sales={sales} onDelete={handleDelete} />
        )}
      </div>
    </AdminShell>
  )
}
