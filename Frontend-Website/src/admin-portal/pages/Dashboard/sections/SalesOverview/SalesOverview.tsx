import StatCard from '../../../../components/StatCard/StatCard'
import listingsIcon from '../../../../assets/icons/listings.svg'
import underOfferIcon from '../../../../assets/icons/under-offer.svg'
import totalSalesIcon from '../../../../assets/icons/total-sales.svg'
import completedSalesIcon from '../../../../assets/icons/completed-sales.svg'

type SalesOverviewProps = {
  listings: number
  underOffer: number
  totalSales: number
  completedSales: number
}

export default function SalesOverview({ listings, underOffer, totalSales, completedSales }: SalesOverviewProps) {
  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-lg border border-[#e2e8f0] bg-white p-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold text-[#0f172a]">Sales Overview</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={listingsIcon} label="Listings" value={listings} />
        <StatCard icon={underOfferIcon} label="Under Offer" value={underOffer} />
        <StatCard icon={totalSalesIcon} label="Total Sales" value={totalSales} />
        <StatCard icon={completedSalesIcon} label="Completed Sales" value={completedSales} />
      </div>
    </div>
  )
}
