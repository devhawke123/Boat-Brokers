import { boatStatusStyles, type BoatListing } from '../../../../data/boats'
import Navbar from '../../../../components/Navbar/Navbar'

type BoatDetailHeroProps = {
  boat: BoatListing
}

export default function BoatDetailHero({ boat }: BoatDetailHeroProps) {
  const status = boat.status ? boatStatusStyles[boat.status] : null

  return (
    <section
      className="relative flex min-h-[min(34rem,70vh)] flex-col justify-end overflow-hidden rounded-3xl bg-cover bg-center p-8 max-[900px]:min-h-[min(26rem,60vh)] max-[900px]:p-5 sm:p-14"
      style={{ backgroundImage: `url(${boat.image})` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.05)_35%,rgba(0,0,0,0.55)_100%)]" />
      <Navbar activeLabel="Boats for Sale" />

      {status && (
        <span
          className={`absolute top-24 left-8 z-[5] flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold tracking-[0.35px] text-white shadow-sm max-[900px]:top-20 max-[900px]:left-5 sm:top-32 sm:left-14 ${status.className}`}
        >
          <span className="size-2 rounded-full bg-white" />
          {status.label}
        </span>
      )}

      <div className="relative z-[5] flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-accent text-[40px] leading-[1.2] tracking-[-1.6px] text-white capitalize sm:text-[3rem]">
            {boat.name}
          </h1>
          <p className="flex flex-wrap items-center gap-2 text-base text-[rgba(255,255,255,0.9)]">
            <span>{boat.detail.subtitle}</span>
            <span className="text-blue">•</span>
            <span>{boat.detail.registration}</span>
          </p>
        </div>
        <p className="font-body text-3xl font-bold text-white sm:text-[2.25rem]">{boat.price}</p>
      </div>
    </section>
  )
}
