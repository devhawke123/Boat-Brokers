import { useBoatListings, formatPrice, type BoatListing } from '../../../../data/boats'
import Button from '../../../../components/Button/Button'
import BoatCard, { type Boat } from './BoatCard'
import BoatCarousel from './BoatCarousel'

const MAX_FEATURED = 4

function toCardBoat(boat: BoatListing): Boat {
  return {
    name: boat.name,
    price: boat.priceValue > 0 ? formatPrice(boat.priceValue) : boat.price,
    image: boat.image,
    lengthBeam: boat.length,
    stern: boat.sternType,
    yearBuilt: boat.yearBuilt,
    builder: boat.builder,
    href: `/boats/${boat.slug}`,
  }
}

export default function FeaturedBoats() {
  const { boats: listings, loading } = useBoatListings()
  const boats = listings
    .filter((boat) => boat.status === 'featured')
    .slice(0, MAX_FEATURED)
    .map(toCardBoat)

  return (
    <section className="section flex flex-col items-center gap-12 short:gap-6 rounded-2xl bg-navy-darkest px-section-x">
      <div className="flex max-w-[39.25rem] flex-col items-center gap-4 short:gap-2 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[linear-gradient(45deg,rgba(108,214,255,0.30)_0%,rgba(108,214,255,0.18)_50%,rgba(108,214,255,0.10)_100%)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md px-4 py-1.5 text-label font-medium text-blue-light uppercase">
          <span className="size-2 rounded-full bg-blue-light" />
          Featured Boats
        </span>
        <h2 className="font-display text-h2 text-white capitalize">
          Find Your Perfect Boat
        </h2>
        <p className="text-body text-text-muted">
          Explore our handpicked selection of quality narrowboats, carefully chosen for their
          character, condition, and value.
        </p>
      </div>

      {loading ? (
        <div className="grid w-full grid-cols-1 justify-center gap-16 lg:grid-cols-[repeat(2,minmax(0,clamp(20rem,45%,38rem)))]">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="aspect-[16/9] animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : (
        boats.length > 0 && (
          <>
            <div className="hidden w-full grid-cols-1 justify-center gap-16 lg:grid lg:grid-cols-[repeat(2,minmax(0,clamp(20rem,45%,38rem)))]">
              {boats.map((boat) => (
                <BoatCard key={boat.href} boat={boat} />
              ))}
            </div>

            <BoatCarousel boats={boats} className="lg:hidden" />
          </>
        )
      )}

      <Button variant="light" label="Explore All Boats" href="/boats-for-sale" />
    </section>
  )
}
