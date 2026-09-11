import { useRef, useState } from 'react'
import arrowLeft from '../../../../assets/icons/arrow-left.svg'
import BoatCard, { type Boat } from './BoatCard'

type BoatCarouselProps = {
  boats: Boat[]
  className?: string
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function BoatCarousel({ boats, className }: BoatCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(boats.length - 1, index))
    setActiveIndex(clamped)
    const track = trackRef.current
    const card = track?.children[clamped] as HTMLElement | undefined
    card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }

  return (
    <div className={['flex w-full flex-col items-center gap-6', className].filter(Boolean).join(' ')}>
      <div
        ref={trackRef}
        className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={(e) => {
          const track = e.currentTarget
          const index = Math.round(track.scrollLeft / track.clientWidth)
          setActiveIndex(Math.max(0, Math.min(boats.length - 1, index)))
        }}
      >
        {boats.map((boat) => (
          <div key={boat.name} className="w-full shrink-0 snap-center">
            <BoatCard boat={boat} />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Previous boat"
          className="flex size-8 items-center justify-center rounded bg-[#1b5b74] disabled:opacity-40"
        >
          <img src={arrowLeft} alt="" aria-hidden="true" className="size-4" />
        </button>

        <div className="flex flex-col items-center gap-1.5">
          <p className="font-accent text-sm text-blue">
            {pad(activeIndex + 1)}
            <span className="text-text-muted"> / {pad(boats.length)}</span>
          </p>
          <div className="flex items-center gap-1" aria-hidden="true">
            {boats.map((boat, index) => (
              <span
                key={boat.name}
                className={`h-[2px] rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'w-6 bg-blue' : 'w-1.5 bg-blue/20'
                }`}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex === boats.length - 1}
          aria-label="Next boat"
          className="flex size-8 items-center justify-center rounded bg-blue disabled:opacity-40"
        >
          <img src={arrowLeft} alt="" aria-hidden="true" className="size-4 rotate-180" />
        </button>
      </div>
    </div>
  )
}
