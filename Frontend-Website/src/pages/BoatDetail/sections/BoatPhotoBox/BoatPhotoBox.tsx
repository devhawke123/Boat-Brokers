import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { BoatListing } from '../../../../data/boats'
import { IconChevronLeft, IconChevronRight, IconClose } from '../../icons'

type BoatPhotoBoxProps = {
  boat: BoatListing
}

export default function BoatPhotoBox({ boat }: BoatPhotoBoxProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const images = boat.images.length > 0 ? boat.images : [boat.image]
  const activeImage = images[activeIndex] ?? boat.image
  const hasMany = images.length > 1

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
    <div className="relative mx-auto aspect-square w-56 overflow-hidden rounded-2xl bg-navy-darkest shadow-[0px_10px_40px_-10px_rgba(11,58,88,0.15)]">
      <button
        type="button"
        onClick={() => setIsLightboxOpen(true)}
        aria-label="View full-size photo"
        className="absolute inset-0 size-full cursor-zoom-in"
      >
        <img src={activeImage} alt={`${boat.name} photo ${activeIndex + 1}`} className="size-full object-cover" />
      </button>

      {hasMany && (
        <>
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Previous photo"
            className="absolute top-1/2 left-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
          >
            <IconChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Next photo"
            className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
          >
            <IconChevronRight className="size-5" />
          </button>
          <span className="pointer-events-none absolute right-2 bottom-2 rounded-full bg-black/50 px-2 py-0.5 text-xs font-medium text-white">
            {activeIndex + 1} / {images.length}
          </span>
        </>
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
              className="absolute top-section-y right-section-x flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
            >
              <IconClose className="size-6" />
            </button>

            {hasMany && (
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

            {hasMany && (
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
