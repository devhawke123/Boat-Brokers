import StatCard from '../../../../components/StatCard/StatCard'
import totalVendorsIcon from '../../../../assets/icons/total-vendors.svg'
import totalBuyersIcon from '../../../../assets/icons/total-buyers.svg'
import vendorsWonIcon from '../../../../assets/icons/vendors-won.svg'
import buyersWonIcon from '../../../../assets/icons/buyers-won.svg'

type PeopleMetricsProps = {
  totalVendors: number
  totalBuyers: number
  vendorsWon: number
  buyersWon: number
}

export default function PeopleMetrics({ totalVendors, totalBuyers, vendorsWon, buyersWon }: PeopleMetricsProps) {
  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-lg border border-[#e2e8f0] bg-white p-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold text-[#0f172a]">People Metrics</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={totalVendorsIcon} label="Total Vendors" value={totalVendors} />
        <StatCard icon={totalBuyersIcon} label="Total Buyers" value={totalBuyers} />
        <StatCard icon={vendorsWonIcon} label="Vendors Won" value={vendorsWon} />
        <StatCard icon={buyersWonIcon} label="Buyers Won" value={buyersWon} />
      </div>
    </div>
  )
}
