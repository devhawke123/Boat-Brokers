import chevronLeft from '../../../../assets/MyBoats/chevron-left.svg'

type CommentThreadHeaderProps = {
  boatName: string
  boatImageUrl: string | null
}

export default function CommentThreadHeader({ boatName, boatImageUrl }: CommentThreadHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#e5e7eb] bg-white px-6 py-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-4">
        {boatImageUrl ? (
          <img src={boatImageUrl} alt="" className="size-14 shrink-0 rounded-lg object-cover" />
        ) : (
          <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#f1f5f9] text-[10px] text-[#94a3b8]">
            No photo
          </span>
        )}
        <span className="font-display text-xl text-[#0a192f]">{boatName}</span>
      </div>

      <a
        href="/seller-portal/comments"
        className="flex items-center gap-2 text-base font-medium text-[#243b53] transition-colors duration-300 hover:text-[#0b3a58]"
      >
        <img src={chevronLeft} alt="" aria-hidden="true" className="h-3 w-[0.47rem]" />
        Back to Comments
      </a>
    </div>
  )
}
