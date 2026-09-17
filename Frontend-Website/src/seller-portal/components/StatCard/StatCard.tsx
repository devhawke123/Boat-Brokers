type StatCardProps = {
  icon: string
  label: string
  value: string | number
}

export default function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="flex min-w-0 items-center gap-5 rounded-lg border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
      <img src={icon} alt="" className="size-14 shrink-0" />

      <div className="flex min-w-0 flex-col gap-1">
        <p className="truncate text-sm font-medium text-[#64748b]">{label}</p>
        <p className="text-2xl font-bold tracking-[-0.05em] text-[#0f172a]">{value}</p>
      </div>
    </div>
  )
}
