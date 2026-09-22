type DashboardHeaderProps = {
  name?: string
  startDate: string
  endDate: string
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
}

// ponytail: the date filter is visual-only for now — nothing behind the
// dashboard stats has a date to filter on until later modules (Sales,
// Leads, Bookings) exist. Trivial to wire up later: pass startDate/endDate
// as from/to query params to GET /api/admin/dashboard-stats.
export default function DashboardHeader({
  name = 'Admin',
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="flex flex-wrap items-baseline gap-1.5 text-2xl font-bold text-[#0f172a]">
          <span>Welcome back,</span>
          <span className="font-display text-h4 capitalize">{name}!</span>
        </h1>
        <p className="text-base text-[#64748b]">Your business at a glance</p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-[#64748b]">Start Date</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="h-10 rounded-md border border-[#e2e8f0] bg-white px-3 text-sm text-[#0f172a] focus:border-navy-dark focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-[#64748b]">End Date</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="h-10 rounded-md border border-[#e2e8f0] bg-white px-3 text-sm text-[#0f172a] focus:border-navy-dark focus:outline-none"
          />
        </label>
      </div>
    </div>
  )
}
