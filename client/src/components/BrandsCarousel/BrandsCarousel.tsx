import rightboat from '../../assets/rightboot.svg'
import apolloDuck from '../../assets/apollo duck.svg'
import narrowboats from '../../assets/narrowboats.svg'
import towpath from '../../assets/towpath.svg'

const brands = [
  { name: 'Rightboat', logo: rightboat },
  { name: 'Apollo Duck', logo: apolloDuck },
  { name: 'Narrowboats.uk', logo: narrowboats },
  { name: 'Towpath Talk', logo: towpath },
]

const track = [...brands, ...brands]

export default function BrandsCarousel() {
  return (
    <section className="overflow-hidden rounded-2xl bg-navy-darkest px-6 py-10 sm:px-10">
      <div className="flex w-max animate-marquee items-center gap-16 sm:gap-24">
        {track.map((brand, index) => (
          <img
            key={`${brand.name}-${index}`}
            src={brand.logo}
            alt={brand.name}
            className="h-9 w-auto shrink-0 opacity-90 sm:h-11"
          />
        ))}
      </div>
    </section>
  )
}
