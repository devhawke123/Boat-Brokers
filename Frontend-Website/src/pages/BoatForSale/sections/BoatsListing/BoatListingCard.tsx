import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { boatStatusStyles, type BoatListing } from '../../../../data/boats'
import { IconBed, IconCalendar, IconFuel, IconMapPin, IconRuler } from './icons'

type BoatListingCardProps = {
  boat: BoatListing
}

export default function BoatListingCard({ boat }: BoatListingCardProps) {
  const status = boat.status ? boatStatusStyles[boat.status] : null
  const [isEnlarged, setIsEnlarged] = useState(false)

  useEffect(() => {
    if (!isEnlarged) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsEnlarged(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isEnlarged])

  return (
    <article className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-1px_rgba(0,0,0,0.06)]">
      <div className="relative h-[300px] w-full shrink-0 overflow-hidden">
        <img src={boat.image} alt={boat.name} className="size-full object-cover" />
        {status && (
          <span
            className={`absolute top-3 left-3 rounded-md px-2.5 py-1 font-bold tracking-[0.6px] text-white uppercase shadow-sm ${
              boat.status === 'sold' ? 'bg-red-600 text-sm' : `text-xs ${status.className}`
            }`}
          >
            {status.label}
          </span>
        )}
       
      </div>

      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-2xl leading-[1.3] tracking-[-1px] text-[#1e293b] capitalize">
            {boat.name}
          </h3>
          <div className="flex items-center gap-1.5 text-[#6b7280]">
            <IconMapPin className="size-3.5 shrink-0 text-[#9ca3af]" />
            <span className="text-sm">{boat.location}</span>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-[#e2e8f0] pb-4">
          <div className="flex items-center gap-2 text-sm text-[#4b5563]">
            <IconRuler className="size-3.5 shrink-0 text-[#9ca3af]" />
            <dt className="sr-only">Length</dt>
            <dd>{boat.length}</dd>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#4b5563]">
            <IconBed className="size-3.5 shrink-0 text-[#9ca3af]" />
            <dt className="sr-only">Berths</dt>
            <dd>{boat.berths} Berths</dd>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#4b5563]">
            <IconCalendar className="size-3.5 shrink-0 text-[#9ca3af]" />
            <dt className="sr-only">Year built</dt>
            <dd>{boat.yearBuilt}</dd>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#4b5563]">
            <IconFuel className="size-3.5 shrink-0 text-[#9ca3af]" />
            <dt className="sr-only">Fuel</dt>
            <dd>{boat.fuel}</dd>
          </div>
        </dl>

        <div className="flex items-center justify-between">
          <p
            className={`font-body font-bold ${
              boat.status === 'sold' ? 'text-3xl text-red-600' : 'text-2xl text-navy-dark'
            }`}
          >
            {boat.price}
          </p>
          <a
            href={`/boats/${boat.slug}`}
            className="relative z-10 text-base font-medium text-navy-dark hover:underline"
            aria-label={`View details for ${boat.name}`}
          >
            View Details
          </a>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsEnlarged(true)}
        aria-label={`Enlarge image of ${boat.name}`}
        className="absolute inset-0 cursor-zoom-in"
      />

      {isEnlarged &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${boat.name} image`}
            onClick={() => setIsEnlarged(false)}
            className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/80 p-4 sm:p-10"
          >
            <img
              src={boat.image}
              alt={boat.name}
              className="max-h-full max-w-full rounded-2xl object-contain shadow-btn"
            />
          </div>,
          document.body,
        )}
    </article>
  )
}
