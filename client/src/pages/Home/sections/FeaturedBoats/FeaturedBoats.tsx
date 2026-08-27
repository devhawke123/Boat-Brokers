import sentinelImg from '../../../../assets/sentinel.jpg'
import berylImg from '../../../../assets/beryl.jpg'
import sunflowerImg from '../../../../assets/sunflower.jpg'
import missSassyLadyImg from '../../../../assets/miss sassy lady.jpg'
import Button from '../../../../components/Button/Button'
import BoatCard, { type Boat } from './BoatCard'
import BoatCarousel from './BoatCarousel'

const boats: Boat[] = [
  {
    name: 'Sentinel',
    price: '£69,950',
    image: sentinelImg,
    lengthBeam: '70ft narrowboat',
    stern: 'Traditional',
    yearBuilt: '1976',
    builder: 'Brian Duvall',
    href: '/boats/sentinel',
  },
  {
    name: 'Beryl',
    price: '£54,950',
    image: berylImg,
    lengthBeam: '58ft 6in narrowboat',
    stern: 'Cruiser',
    yearBuilt: '1990',
    builder: 'Tayberg Boats',
    href: '/boats/beryl',
  },
  {
    name: 'Sunflower',
    price: '£129,950',
    image: sunflowerImg,
    lengthBeam: '70ft narrowboat',
    stern: '62ft narrowboat',
    yearBuilt: '2022',
    builder: 'Tim Tyler',
    href: '/boats/sunflower',
  },
  {
    name: 'Miss Sassy Lady',
    price: '£69,950',
    image: missSassyLadyImg,
    lengthBeam: '70ft narrowboat',
    stern: '62ft narrowboat',
    yearBuilt: '2022',
    builder: 'Tim Tyler',
    href: '/boats/miss-sassy-lady',
  },
]

export default function FeaturedBoats() {
  return (
    <section className="flex flex-col items-center gap-12 rounded-2xl bg-navy-darkest px-6 py-14 sm:px-20 sm:py-20">
      <div className="flex max-w-[39.25rem] flex-col items-center gap-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(108,214,255,0.22)] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-blue-light uppercase">
          <span className="size-2 rounded-full bg-blue-light" />
          Featured Boats
        </span>
        <h2 className="font-display text-[34px] leading-[1.2] tracking-[-2px] text-white capitalize sm:text-[3.375rem] sm:leading-[1.3]">
          Find Your Perfect Boat
        </h2>
        <p className="text-base leading-[26px] text-text-muted">
          Explore our handpicked selection of quality narrowboats, carefully chosen for their
          character, condition, and value.
        </p>
      </div>

      <div className="hidden w-full grid-cols-1 justify-center gap-16 lg:grid lg:grid-cols-[repeat(2,minmax(0,clamp(20rem,45%,38rem)))]">
        {boats.map((boat) => (
          <BoatCard key={boat.name} boat={boat} />
        ))}
      </div>

      <BoatCarousel boats={boats} className="lg:hidden" />

      <Button variant="light" label="Explore All Boats" href="/boats-for-sale" />
    </section>
  )
}
