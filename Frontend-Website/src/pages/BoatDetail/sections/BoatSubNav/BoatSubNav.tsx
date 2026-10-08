import type { BoatListing } from '../../../../data/boats'
import {  IconChevronLeft } from '../../icons'

type BoatSubNavProps = {
  boat: BoatListing
}

export default function BoatSubNav({ boat }: BoatSubNavProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#e5e7eb] bg-white px-4 py-4 sm:px-8">
      <a href="/boats-for-sale" className="inline-flex items-center gap-2 text-sm font-medium text-navy-dark hover:underline">
        <IconChevronLeft className="size-3.5" />
        Back to search
      </a>

      

      <div className="flex items-center gap-4">
        <a
          href={`/boats/${boat.slug}/book-viewing`}
          className="inline-flex items-center gap-2 rounded-lg border-2 border-navy-dark bg-navy-dark px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-navy-dark"
        >
          Book A Viewing
        </a>
      </div>
    </div>
  )
}
