import { useState } from 'react'
import AdminShell from '../../components/AdminShell/AdminShell'
import { useAdminSession } from '../../data/useAdminSession'
import { useBuyers, invalidateBuyersCache } from '../../data/useBuyers'
import { deleteBuyer, updateBuyerStatus, type BuyerStatus } from '../../lib/api'
import BuyerInfoCard from './sections/BuyerInfoCard/BuyerInfoCard'
import BuyerBookingsTable from './sections/BuyerBookingsTable/BuyerBookingsTable'

type BuyerDetailProps = {
  buyerId: number
}

export default function BuyerDetail({ buyerId }: BuyerDetailProps) {
  const { checkedSession } = useAdminSession()
  const { buyers, loading, error, refetch } = useBuyers()
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const buyer = buyers.find((b) => b.id === buyerId) ?? null

  async function handleStatusChange(status: BuyerStatus) {
    setUpdatingStatus(true)
    setActionError(null)
    try {
      await updateBuyerStatus(buyerId, status)
      invalidateBuyersCache()
      refetch()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update status.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  async function handleDelete() {
    if (!buyer) return
    if (!window.confirm(`Delete buyer "${buyer.firstName} ${buyer.surname}"? This can't be undone.`)) return
    try {
      await deleteBuyer(buyer.id)
      invalidateBuyersCache()
      window.location.href = '/admin-portal/buyers'
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to delete buyer.')
    }
  }

  if (!checkedSession) return null

  return (
    <AdminShell mainClassName="bg-frost">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <a href="/admin-portal/buyers" className="w-fit text-sm font-semibold text-[#64748b] hover:text-[#0f172a]">
          ← Back to Boat Buyers
        </a>

        {error ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#fca5a5] bg-[#fef2f2] py-16 text-center text-[#b91c1c]">
            <p>Couldn&rsquo;t load this buyer from the server: {error}</p>
          </div>
        ) : loading ? (
          <div className="flex flex-col gap-6">
            <div className="h-56 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
            <div className="h-64 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
          </div>
        ) : !buyer ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#e2e8f0] bg-white py-16 text-center text-[#64748b]">
            <p>This buyer couldn&rsquo;t be found.</p>
          </div>
        ) : (
          <>
            {actionError && (
              <p className="rounded-md border border-[#fecaca] bg-[#fef2f2] px-4 py-2 text-sm font-medium text-[#dc2626]">
                {actionError}
              </p>
            )}
            <BuyerInfoCard
              buyer={buyer}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              updatingStatus={updatingStatus}
            />
            <BuyerBookingsTable bookings={buyer.bookings} />
          </>
        )}
      </div>
    </AdminShell>
  )
}
