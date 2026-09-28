import type { ApiSale, SaleStatus } from '../../../../lib/api'
import { formatDate } from '../../../../../seller-portal/lib/formatDate'
import StatusBadge, { type BadgeTone } from '../../../../components/StatusBadge/StatusBadge'
import ActionButton from '../../../../components/ActionButton/ActionButton'
import { EyeIcon } from '../../../../components/ActionButton/icons'

const statusLabels: Record<SaleStatus, string> = {
  CURRENT: 'Current',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

const statusTones: Record<SaleStatus, BadgeTone> = {
  CURRENT: 'info',
  COMPLETED: 'success',
  CANCELLED: 'danger',
}

function formatAmount(value: number) {
  return value.toLocaleString('en-GB')
}

type RecentSalesProps = {
  sales: ApiSale[]
}

export default function RecentSales({ sales }: RecentSalesProps) {
  const recent = [...sales]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-lg border border-[#e2e8f0] bg-white p-6 xl:col-span-2">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-[#0f172a]">Recent Sales</h2>
        <ActionButton href="/admin-portal/sales" label="View All" icon={EyeIcon} />
      </div>

      {recent.length === 0 ? (
        <p className="py-8 text-center text-sm text-[#64748b]">No sales yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {recent.map((sale) => (
            <div key={sale.id} className="flex gap-3 rounded-xl border border-[#e2e8f0] p-3">
              {sale.boat.imageUrl ? (
                <img
                  src={sale.boat.imageUrl}
                  alt=""
                  className="size-14 shrink-0 rounded-lg object-cover ring-1 ring-[#e5e7eb]"
                />
              ) : (
                <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#f1f5f9] text-[10px] font-medium text-[#94a3b8]">
                  No photo
                </span>
              )}
              <div className="flex min-w-0 flex-col gap-1">
                <StatusBadge label={statusLabels[sale.status]} tone={statusTones[sale.status]} />
                <span className="truncate font-display text-sm text-[#0a192f] capitalize">{sale.boat.name}</span>
                <span className="truncate text-xs text-[#64748b]">
                  {sale.buyer.firstName} {sale.buyer.surname}
                </span>
                <span className="text-xs font-bold text-[#0a192f]">
                  £{formatAmount(sale.soldPrice)} <span className="font-normal text-[#94a3b8]">· {formatDate(sale.createdAt)}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
