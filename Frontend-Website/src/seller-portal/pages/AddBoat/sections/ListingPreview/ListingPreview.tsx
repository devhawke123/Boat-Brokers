type ListingPreviewProps = {
  boatName: string
  length: string
  year: string
  price: string
  percentComplete: number
  mainPhotoUrl?: string
}

export default function ListingPreview({
  boatName,
  length,
  year,
  price,
  percentComplete,
  mainPhotoUrl,
}: ListingPreviewProps) {
  return (
    <div className="relative w-full overflow-clip rounded-2xl border border-[#0e2136]/80 bg-[#0e2136]">
      <div className="flex items-center justify-between border-b border-white/10 p-5">
        <span className="text-[14px] font-medium tracking-[0.06em] text-white/70 uppercase">Listing Preview</span>
        <span className="rounded-md border border-[#2f8fd1]/20 bg-[#2f8fd1]/10 px-2.5 py-0.5 font-mono text-[12px] text-[#2f8fd1]">
          {percentComplete}% Complete
        </span>
      </div>

      <div className="relative flex h-[211px] items-center justify-center overflow-hidden bg-[#0e2136]">
        {mainPhotoUrl ? (
          <img src={mainPhotoUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <>
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

            <div className="relative flex flex-col items-center gap-2 text-white/30">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-10 w-10">
                <rect x="2.5" y="4.5" width="19" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="8" cy="10" r="1.75" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M3 16.5L8.5 12.5C9.02 12.12 9.73 12.14 10.23 12.55L13 14.8L16.09 12.6C16.62 12.22 17.33 12.24 17.83 12.66L21 15.3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-mono text-[11px] tracking-[0.1em] text-white/30 uppercase">No photo uploaded</span>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-2 bg-[#0e2136]/95 p-6">
        <h3 className="font-display text-[28px] capitalize text-white">{boatName.trim() || 'Untitled Boat'}</h3>
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
