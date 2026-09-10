import type { BoatListing } from '../../../../data/boats'
import Navbar from '../../../../components/Navbar/Navbar'

type BoatDetailHeroProps = {
  boat: BoatListing
}

export default function BoatDetailHero({ boat }: BoatDetailHeroProps) {
  return (
    <section
      className="relative flex min-h-[min(34rem,70vh)] flex-col items-center justify-center overflow-hidden rounded-3xl bg-cover bg-center p-8 text-center max-[900px]:min-h-[min(28rem,65vh)] max-[900px]:p-5 sm:p-14"
      style={{ backgroundImage: `url(${boat.image})` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(37deg,rgba(0,0,0,0.2)_19%,rgba(102,102,102,0)_31%),linear-gradient(0deg,rgba(0,0,0,0.08),rgba(0,0,0,0.08))]" />
      <Navbar activeLabel="Boats for Sale" />

      <div className="relative z-[5] mt-20 flex max-w-[43rem] flex-col items-center gap-6 sm:mt-0">
        <h1 className="font-display text-[44px] leading-[1.2] tracking-[-1.6px] text-white capitalize sm:text-[5rem]">
          About {boat.name}
        </h1>
        <p className="max-w-[35rem] text-sm leading-[26px] text-[#ededed] sm:text-base sm:leading-[26px]">
          Take a closer look at your next boat. Explore its features, specifications, condition, and
          everything you need to know before making your move.
        </p>
      </div>
    </section>
  )
}
