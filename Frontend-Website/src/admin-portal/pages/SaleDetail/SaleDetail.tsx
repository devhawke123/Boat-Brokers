import { useState } from 'react'
import AdminShell from '../../components/AdminShell/AdminShell'
import { useAdminSession } from '../../data/useAdminSession'
import { useSales, invalidateSalesCache } from '../../data/useSales'
import { deleteSale, updateSaleStatus, type SaleStatus } from '../../lib/api'
import { formatDate, formatPrice } from '../../../seller-portal/lib/formatDate'

type SaleDetailProps = {
  saleId: number
}

const statusOptions: { value: SaleStatus; label: string }[] = [
  { value: 'CURRENT', label: 'Current' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

export default function SaleDetail({ saleId }: SaleDetailProps) {
  const { checkedSession } = useAdminSession()
  const { sales, loading, error, refetch } = useSales()
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const sale = sales.find((s) => s.id === saleId) ?? null

  async function handleStatusChange(status: SaleStatus) {
    setUpdatingStatus(true)
    setActionError(null)
    try {
      await updateSaleStatus(saleId, status)
      invalidateSalesCache()
      refetch()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update status.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  async function handleDelete() {
    if (!sale) return
    if (!window.confirm(`Delete this sale of "${sale.boat.name}"? This can't be undone.`)) return
    try {
      await deleteSale(sale.id)
      invalidateSalesCache()
      window.location.href = '/admin-portal/sales'
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to delete sale.')
    }
  }

  if (!checkedSession) return null

  return (
    <AdminShell mainClassName="bg-frost">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <a href="/admin-portal/sales" className="w-fit text-sm font-semibold text-[#64748b] hover:text-[#0f172a]">
          ← Back to Sales
        </a>

        {error ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#fca5a5] bg-[#fef2f2] py-16 text-center text-[#b91c1c]">
            <p>Couldn&rsquo;t load this sale from the server: {error}</p>
          </div>
        ) : loading ? (
          <div className="h-64 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
        ) : !sale ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#e2e8f0] bg-white py-16 text-center text-[#64748b]">
            <p>This sale couldn&rsquo;t be found.</p>
          </div>
        ) : (
          <>
            {actionError && (
              <p className="rounded-md border border-[#fecaca] bg-[#fef2f2] px-4 py-2 text-sm font-medium text-[#dc2626]">
                {actionError}
              </p>
            )}

            <div className="flex flex-col gap-5 rounded-lg border border-[#e2e8f0] bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {sale.boat.imageUrl ? (
                    <img src={sale.boat.imageUrl} alt="" className="size-14 shrink-0 rounded-lg object-cover" />
                  ) : (
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#f1f5f9] text-[10px] text-[#94a3b8]">
                      No photo
                    </span>
                  )}
                  <div>
                    <h2 className="font-display text-h5 text-[#0a192f]">{sale.boat.name}</h2>
                    <p className="text-sm text-[#64748b]">{sale.saleId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`/admin-portal/sales/${sale.id}/edit`}
                    className="rounded-md border border-[#e2e8f0] px-3 py-1.5 text-xs font-bold text-[#102a43] transition-colors duration-300 hover:bg-[#f8fafc]"
                  >
                    Edit
                  </a>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-md border border-[#fecaca] px-3 py-1.5 text-xs font-bold text-[#dc2626] transition-colors duration-300 hover:bg-[#fef2f2]"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#64748b]">Vendor</span>
                  <span className="text-sm text-[#0f172a]">
                    {sale.seller.name} ({sale.seller.email})
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#64748b]">Buyer</span>
                  <span className="text-sm text-[#0f172a]">
                    {sale.buyer.firstName} {sale.buyer.surname} ({sale.buyer.email})
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#64748b]">Sold Price</span>
                  <span className="text-sm font-bold text-[#0f172a]">{formatPrice(sale.soldPrice)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#64748b]">Deposit</span>
                  <span className="text-sm text-[#0f172a]">{formatPrice(sale.deposit)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#64748b]">Balance</span>
                  <span className="text-sm text-[#0f172a]">{formatPrice(sale.balance)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#64748b]">Commission</span>
                  <span className="text-sm text-[#0f172a]">{formatPrice(sale.commission)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#64748b]">Created</span>
                  <span className="text-sm text-[#0f172a]">{formatDate(sale.createdAt)}</span>
                </div>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-[#64748b]">Status</span>
                <select
                  value={sale.status}
                  disabled={updatingStatus}
                  onChange={(event) => handleStatusChange(event.target.value as SaleStatus)}
                  className="h-10 w-fit min-w-[10rem] rounded-md border border-[#e2e8f0] bg-white px-3 text-sm font-medium text-[#0f172a] focus:border-navy-dark focus:outline-none disabled:opacity-60"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </>
        )}
      </div>
    </AdminShell>
  )
}
