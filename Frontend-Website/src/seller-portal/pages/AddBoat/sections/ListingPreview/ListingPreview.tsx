type ListingPreviewProps = {
  length: string
  year: string
  price: string
  percentComplete: number
}

export default function ListingPreview({ length, year, price, percentComplete }: ListingPreviewProps) {
  return (
    <div className="relative w-full overflow-clip rounded-2xl border border-[#0e2136]/80 bg-[#0e2136]">
      <div className="flex items-center justify-between border-b border-white/10 p-5">
        <span className="text-[14px] font-medium tracking-[0.06em] text-white/70 uppercase">Listing Preview</span>
        <span className="rounded-md border border-[#2f8fd1]/20 bg-[#2f8fd1]/10 px-2.5 py-0.5 font-mono text-[12px] text-[#2f8fd1]">
          {percentComplete}% Complete
        </span>
      </div>

      <div className="relative flex h-[211px] items-center justify-center overflow-hidden bg-[#0e2136]">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(255,255,255,0.04) 6.25%, rgba(255,255,255,0) 6.25%), linear-gradient(180deg, rgba(255,255,255,0.04) 6.25%, rgba(255,255,255,0) 6.25%)',
            backgroundSize: '16px 16px',
          }}
        />

        <span className="absolute top-[49px] left-[29px] font-mono text-[12px] tracking-[0.15px] text-white/50">
          LENGTH: {length.trim() || '--'}
        </span>

        <div className="relative h-[117px] w-[195px] overflow-hidden rounded-t-sm rounded-b-full border-2 border-white/20">
          <div className="absolute inset-x-0 top-[84px] bottom-0 bg-gradient-to-t from-[#2f8fd1] to-[#2f8fd1]/40" />
          <div className="absolute inset-0 flex flex-col items-stretch justify-between px-1.5 py-2.5 opacity-30">
            <div className="h-px w-full border-b border-dashed border-white" />
            <div className="h-px w-full border-b border-dashed border-white" />
            <div className="h-px w-full border-b border-dashed border-white" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 bg-[#0e2136]/95 p-6">
        <h3 className="font-display text-[28px] capitalize text-white">Untitled Boat</h3>
        <p className="text-[16px] text-white/50">Complete form to update title</p>

        <div className="flex flex-col gap-3 pt-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-[14px] text-white/50">Vessel Type</span>
            <span className="text-[14px] font-medium text-white">--</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-[14px] text-white/50">Year &amp; Length</span>
            <span className="font-mono text-[14px] text-white">
              {year.trim() || '--'} / {length.trim() || '--'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-white/50">Est. Price</span>
            <span className="font-mono text-[16px] font-bold text-[#2f8fd1]">
              {price.trim() ? `$${price.trim()}` : '--'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
