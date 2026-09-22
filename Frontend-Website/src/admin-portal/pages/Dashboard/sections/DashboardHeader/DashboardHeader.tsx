type DashboardHeaderProps = {
  name?: string
}

export default function DashboardHeader({ name = 'Admin' }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="flex flex-wrap items-baseline gap-1.5 text-2xl font-bold text-[#0f172a]">
        <span>Welcome back,</span>
        <span className="font-display text-h4 capitalize">{name}!</span>
      </h1>
      <p className="text-base text-[#64748b]">Your business at a glance</p>
    </div>
  )
}
