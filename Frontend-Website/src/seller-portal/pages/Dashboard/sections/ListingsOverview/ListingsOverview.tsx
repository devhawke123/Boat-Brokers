type Segment = {
  label: string
  value: number
  color: string
}

type ListingsOverviewProps = {
  approved: number
  pending: number
  rejected: number
}

const RADIUS = 70
const STROKE = 24
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const GAP = 3

function withOffsets(items: Segment[], total: number) {
  let cumulative = 0
  return items.map((segment) => {
    const offset = -(cumulative / total) * CIRCUMFERENCE
    cumulative += segment.value
    return { ...segment, offset }
  })
}

export default function ListingsOverview({ approved, pending, rejected }: ListingsOverviewProps) {
  // Approved/Pending/Rejected are the only real states BoatListing.status has —
  // mapped to the reserved good/warning/critical status hues.
  const segments: Segment[] = [
    { label: 'Approved', value: approved, color: '#0ca30c' },
    { label: 'Pending', value: pending, color: '#fab219' },
    { label: 'Rejected', value: rejected, color: '#d03b3b' },
  ]

  const total = approved + pending + rejected
  const arcs = total > 0 ? withOffsets(segments, total) : []

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
      <h2 className="text-lg font-bold text-[#0f172a]">Listings Overview</h2>

      <div className="flex flex-col items-center gap-6">
        <div className="relative flex h-60 w-60 items-center justify-center">
          <svg viewBox="0 0 200 200" className="h-60 w-60 -rotate-90" role="img" aria-label="Listings by status">
            <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="#f1f5f9" strokeWidth={STROKE} />
            {arcs.map((segment) => {
              const fraction = segment.value / total
              const dash = Math.max(fraction * CIRCUMFERENCE - GAP, 0)

              return (
                <circle
                  key={segment.label}
                  cx="100"
                  cy="100"
                  r={RADIUS}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                  strokeDashoffset={segment.offset}
                  strokeLinecap="round"
                >
                  <title>{`${segment.label}: ${segment.value}`}</title>
                </circle>
              )
            })}
          </svg>

          {total === 0 && <p className="absolute px-8 text-center text-sm text-[#64748b]">No listings yet.</p>}
        </div>

        {total > 0 && (
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
            {segments.map((segment) => (
              <li key={segment.label} className="flex items-center gap-2 text-sm text-[#334155]">
                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: segment.color }} />
                {segment.label} ({segment.value})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
