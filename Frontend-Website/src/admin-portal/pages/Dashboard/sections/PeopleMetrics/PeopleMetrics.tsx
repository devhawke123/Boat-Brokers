import StatCard from '../../../../components/StatCard/StatCard'
import totalSellersIcon from '../../../../assets/icons/total-sellers.svg'
import totalBuyersIcon from '../../../../assets/icons/total-buyers.svg'

type PeopleMetricsProps = {
  totalSellers: number
  totalBuyers: number
}

export default function PeopleMetrics({ totalSellers, totalBuyers }: PeopleMetricsProps) {
  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-lg border border-[#e2e8f0] bg-white p-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold text-[#0f172a]">People Metrics</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={totalSellersIcon} label="Total Sellers" value={totalSellers} />
        <StatCard icon={totalBuyersIcon} label="Total Buyers" value={totalBuyers} />
      </div>
    </div>
  )
}
