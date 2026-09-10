import { useState } from 'react'
import type { BoatListing } from '../../../../data/boats'
import { IconAnchor, IconChevronLeft, IconHeart, IconShare } from '../../icons'

type BoatSubNavProps = {
  boat: BoatListing
}

export default function BoatSubNav({ boat }: BoatSubNavProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle')

  const handleShare = async () => {
    const shareData = { title: boat.name, text: `${boat.name} — ${boat.price}`, url: window.location.href }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch {
        return
      }
    }
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShareStatus('copied')
      setTimeout(() => setShareStatus('idle'), 2000)
    } catch {
      // clipboard unavailable — nothing more we can do
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#e5e7eb] bg-white px-4 py-4 sm:px-8">
      <a href="/boats-for-sale" className="inline-flex items-center gap-2 text-sm font-medium text-navy-dark hover:underline">
        <IconChevronLeft className="size-3.5" />
        Back to search
      </a>

      <div className="hidden items-center gap-2 sm:inline-flex">
        <IconAnchor className="size-5 text-blue" />
        <span className="font-body text-xl font-bold text-navy-dark capitalize">{boat.name} Brokerage</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setIsSaved((v) => !v)}
          aria-pressed={isSaved}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#6e6e6e] hover:text-navy-dark"
        >
          <IconHeart className={`size-3.5 ${isSaved ? 'fill-[#ef4444] text-[#ef4444]' : ''}`} />
          {isSaved ? 'Saved' : 'Save'}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#6e6e6e] hover:text-navy-dark"
        >
          <IconShare className="size-3.5" />
          {shareStatus === 'copied' ? 'Link copied!' : 'Share'}
        </button>
      </div>
    </div>
  )
}
