import { useState } from 'react'
import AdminShell from '../../components/AdminShell/AdminShell'
import { useAdminSession } from '../../data/useAdminSession'
import { useDashboardStats } from '../../data/useDashboardStats'
import DashboardHeader from './sections/DashboardHeader/DashboardHeader'
import PeopleMetrics from './sections/PeopleMetrics/PeopleMetrics'
import SalesOverview from './sections/SalesOverview/SalesOverview'

export default function Dashboard() {
  const { admin, checkedSession } = useAdminSession()
  const { data, loading, error } = useDashboardStats()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Redirecting — render nothing rather than flashing dashboard content.
  if (!checkedSession) return null

  return (
    <AdminShell mainClassName="bg-frost">
      <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
        <DashboardHeader
          name={admin?.name}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        {error ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#fca5a5] bg-[#fef2f2] py-16 text-center text-[#b91c1c]">
            <p>Couldn&rsquo;t load dashboard stats from the server: {error}</p>
            <p className="text-sm text-[#6b7280]">Make sure the API server is running at http://localhost:4000.</p>
          </div>
        ) : loading || !data ? (
          <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="h-64 animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
            <div className="h-64 animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-2">
            <PeopleMetrics
              totalVendors={data.peopleMetrics.totalVendors}
              totalBuyers={data.peopleMetrics.totalBuyers}
              vendorsWon={data.peopleMetrics.vendorsWon}
              buyersWon={data.peopleMetrics.buyersWon}
            />
            <SalesOverview
              listings={data.salesOverview.listings}
              underOffer={data.salesOverview.underOffer}
              totalSales={data.salesOverview.totalSales}
              completedSales={data.salesOverview.completedSales}
            />
          </div>
        )}
      </div>
    </AdminShell>
  )
}
