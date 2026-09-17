const FEATURES = [
  { label: 'Fast Response', dot: 'bg-[#0176d3]' },
  { label: 'Secure & Reliable', dot: 'bg-[#10b981]' },
  { label: 'Expert Support', dot: 'bg-[#8b5cf6]' },
]

export default function StillNeedHelpCard() {
  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-5 rounded-lg border border-[#e2e8f0] bg-white p-8">
      <div className="flex flex-col gap-3">
        <h3 className="font-display text-h6 capitalize text-[#0f172a]">Still Need Help?</h3>
        <p className="max-w-[34rem] text-base text-[#6e6e6e]">
          Our dedicated team is always ready to assist you with any questions or issues you might have while
          managing your listings.
        </p>
      </div>

      <div className="flex flex-wrap gap-x-10 gap-y-3">
        {FEATURES.map((feature) => (
          <div key={feature.label} className="flex items-center gap-2.5">
            <span className={`size-2.5 shrink-0 rounded-full ${feature.dot}`} />
            <span className="text-sm font-medium text-[#0f172a]">{feature.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
