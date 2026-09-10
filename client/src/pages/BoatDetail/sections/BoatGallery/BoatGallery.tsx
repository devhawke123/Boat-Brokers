import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { boatAvailabilityBadge, boatStatusStyles, formatPrice, type BoatListing } from '../../../../data/boats'
import { IconChevronLeft, IconChevronRight, IconClose } from '../../icons'

type BoatGalleryProps = {
  boat: BoatListing
}

const MAX_VISIBLE_THUMBS = 4

export default function BoatGallery({ boat }: BoatGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showAllThumbs, setShowAllThumbs] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const images = boat.images
  const activeImage = images[activeIndex] ?? boat.image
  const badge = boat.status ? boatStatusStyles[boat.status] : boatAvailabilityBadge

  const hasOverflow = !showAllThumbs && images.length > MAX_VISIBLE_THUMBS
  const visibleThumbs = images.slice(0, hasOverflow ? MAX_VISIBLE_THUMBS - 1 : images.length)
  const overflowCount = images.length - visibleThumbs.length

  function goTo(index: number) {
    setActiveIndex((index + images.length) % images.length)
  }

  useEffect(() => {
    if (!isLightboxOpen) return

    document.body.style.overflow = 'hidden'
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsLightboxOpen(false)
      if (e.key === 'ArrowLeft') goTo(activeIndex - 1)
      if (e.key === 'ArrowRight') goTo(activeIndex + 1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLightboxOpen, activeIndex, images.length])

  return (
    <div className="flex flex-col gap-8">
      <div className="relative h-[300px] w-full overflow-hidden rounded-lg bg-navy-darkest shadow-[0px_10px_40px_-10px_rgba(11,58,88,0.08)] sm:h-[380px] lg:h-[478px]">
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          aria-label="View full-size photo"
          className="absolute inset-0 size-full cursor-zoom-in"
        >
          <img src={activeImage} alt={`${boat.name} photo ${activeIndex + 1}`} className="size-full object-cover opacity-90" />
        </button>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(8,43,66,0.9)_0%,rgba(8,43,66,0.3)_50%,rgba(8,43,66,0)_100%)]" />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous photo"
              className="absolute top-1/2 left-4 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
            >
              <IconChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next photo"
              className="absolute top-1/2 right-4 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
            >
              <IconChevronRight className="size-6" />
            </button>
          </>
        )}

        <div className="pointer-events-none absolute top-6 left-6">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold tracking-[0.35px] text-white shadow-sm ${badge.className}`}
          >
            <span className="size-2 rounded-full bg-white" />
            {badge.label}
          </span>
        </div>

        <div className="pointer-events-none absolute right-6 bottom-6 left-6 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="font-accent text-[32px] leading-[1] tracking-[0.05px] text-white capitalize sm:text-[48px]">
              {boat.name}
            </h1>
            <p className="flex flex-wrap items-center gap-2 text-sm text-[rgba(255,255,255,0.9)] sm:text-base">
              <span>{boat.detail.subtitle}</span>
              <span className="text-blue">•</span>
              <span>{boat.detail.registration}</span>
            </p>
          </div>
          <p className="font-body text-3xl font-bold text-white sm:text-[36px]">{formatPrice(boat.priceValue)}</p>
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {visibleThumbs.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`View photo ${i + 1}`}
              aria-pressed={activeIndex === i}
              className={`h-[66px] w-[88px] shrink-0 overflow-hidden rounded-xl border-2 ${
                activeIndex === i ? 'border-blue' : 'border-transparent'
              }`}
            >
              <img src={src} alt="" className="size-full object-cover" />
            </button>
          ))}
          {hasOverflow && (
            <button
              type="button"
              onClick={() => setShowAllThumbs(true)}
              aria-label={`Show ${overflowCount} more photos`}
              className="flex h-[66px] w-[88px] shrink-0 items-center justify-center rounded-xl bg-[#dff2ff] text-sm font-medium text-navy-dark transition-colors hover:bg-[#c9e9fb]"
            >
              +{overflowCount}
            </button>
          )}
        </div>
      )}

      {isLightboxOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black/90 p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close"
              className="absolute top-6 right-6 flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
            >
              <IconClose className="size-6" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    goTo(activeIndex - 1)
                  }}
                  aria-label="Previous photo"
                  className="absolute top-1/2 left-4 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
                >
                  <IconChevronLeft className="size-7" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    goTo(activeIndex + 1)
                  }}
                  aria-label="Next photo"
                  className="absolute top-1/2 right-4 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
                >
                  <IconChevronRight className="size-7" />
                </button>
              </>
            )}

            <img
              src={activeImage}
              alt={`${boat.name} photo ${activeIndex + 1}`}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[90vw] cursor-default rounded-lg object-contain shadow-2xl"
            />

            {images.length > 1 && (
              <p className="text-sm font-medium text-white/80">
                {activeIndex + 1} / {images.length}
              </p>
            )}
          </div>,
          document.body,
        )}
    </div>
  )
}
