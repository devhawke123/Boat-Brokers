import { useState } from 'react'
import { boatStatusStyles, type BoatListing } from '../../../../data/boats'
import { IconBed, IconCalendar, IconFuel, IconHeart, IconMapPin, IconRuler } from './icons'

type BoatListingCardProps = {
  boat: BoatListing
}

export default function BoatListingCard({ boat }: BoatListingCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const status = boat.status ? boatStatusStyles[boat.status] : null

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-1px_rgba(0,0,0,0.06)]">
      <div className="relative h-[200px] w-full shrink-0 overflow-hidden">
        <img src={boat.image} alt={boat.name} className="size-full object-cover" />
        {status && (
          <span
            className={`absolute top-3 left-3 rounded-md px-2.5 py-1 text-xs font-bold tracking-[0.6px] text-white uppercase shadow-sm ${status.className}`}
          >
            {status.label}
          </span>
        )}
        <button
          type="button"
          onClick={() => setIsFavorited((v) => !v)}
          aria-pressed={isFavorited}
          aria-label={isFavorited ? `Remove ${boat.name} from favourites` : `Add ${boat.name} to favourites`}
          className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-[4px]"
        >
          <IconHeart className={`size-4 ${isFavorited ? 'fill-[#ef4444] text-[#ef4444]' : 'text-[#9ca3af]'}`} />
        </button>
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
          <p className="font-body text-2xl font-bold text-navy-dark">{boat.price}</p>
          <a href={`/boats/${boat.slug}`} className="text-base font-medium text-navy-dark hover:underline">
            View Details
          </a>
        </div>
      </div>
    </article>
  )
}
