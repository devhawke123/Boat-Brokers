import rightboat from '../../assets/rightboot.svg'
import droitwichSpaMarina from '../../assets/droitwich-spa-marina.png'
import apolloDuck from '../../assets/apollo duck.svg'
import narrowboats from '../../assets/narrowboats.svg'
import towpath from '../../assets/towpath.svg'

const brands = [
  { name: 'Rightboat', logo: rightboat },
  { name: 'Droitwich Spa Marina', logo: droitwichSpaMarina },
  { name: 'Apollo Duck', logo: apolloDuck },
  { name: 'Narrowboats.uk', logo: narrowboats },
  { name: 'Towpath Talk', logo: towpath },
]

// Repeat logos inside each half so the strip stays full on wide screens
const sequence = [...brands, ...brands]

function BrandTrack({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center gap-16 pr-16 sm:gap-24 sm:pr-24"
      aria-hidden={ariaHidden || undefined}
    >
      {sequence.map((brand, index) => (
        <li key={`${brand.name}-${index}`} className="shrink-0">
          <img
            src={brand.logo}
            alt={ariaHidden ? '' : brand.name}
            className="h-[41px] w-auto opacity-90 sm:h-[49px]"
          />
        </li>
      ))}
    </ul>
  )
}

export default function BrandsCarousel() {
  return (
    <section className="overflow-hidden rounded-2xl bg-navy-darkest px-6 py-10 sm:px-10">
      <div className="flex w-max animate-marquee items-center">
        <BrandTrack />
        <BrandTrack ariaHidden />
      </div>
    </section>
  )
}
