import StatCard from '../../../../components/StatCard/StatCard'
import totalBoatsIcon from '../../../../assets/icons/totalboats.svg'
import liveBoatsIcon from '../../../../assets/icons/liveboats.svg'
import pendingIcon from '../../../../assets/icons/pending.svg'
import rejectedIcon from '../../../../assets/icons/rejected.svg'
import commentsIcon from '../../../../assets/icons/comments.svg'

type StatsOverviewProps = {
  totalBoats?: number
  liveBoats?: number
  pending?: number
  rejected?: number
  comments?: number
}

export default function StatsOverview({
  totalBoats = 12,
  liveBoats = 7,
  pending = 3,
  rejected = 2,
  comments = 18,
}: StatsOverviewProps) {
  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      <StatCard icon={totalBoatsIcon} label="Total Boats" value={totalBoats} />
      <StatCard icon={liveBoatsIcon} label="Live Boats" value={liveBoats} />
      <StatCard icon={pendingIcon} label="Pending" value={pending} />
      <StatCard icon={rejectedIcon} label="Rejected" value={rejected} />
      <StatCard icon={commentsIcon} label="Comments" value={comments} />
    </div>
  )
}
