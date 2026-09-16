import arrowUpRightLight from '../../../../assets/icons/arrow-up-right.svg'
import arrowUpRightDark from '../../../../assets/icons/arrow-up-right-white.svg'

export type Boat = {
  name: string
  price: string
  image: string
  lengthBeam: string
  stern: string
  yearBuilt: string
  builder: string
  href: string
}

type BoatCardProps = {
  boat: Boat
}

export default function BoatCard({ boat }: BoatCardProps) {
  return (
    <article className="group flex flex-col gap-4 rounded-xl transition-colors duration-300 lg:gap-8 lg:hover:bg-[#e8f6ff] lg:hover:pb-8">
      <div className="relative flex aspect-[608/650] max-h-[88vh] flex-col overflow-hidden rounded-xl border border-slate p-3 transition-colors duration-300 lg:p-5 lg:group-hover:border-transparent">
        <img src={boat.image} alt={boat.name} className="absolute inset-0 size-full object-cover" />
        <dl className="relative z-[1] mt-auto flex w-full max-w-[19.5rem] flex-col gap-1 self-start rounded-lg border border-white/15 bg-[linear-gradient(45deg,rgba(210,200,200,0.12)_0%,rgba(248,252,255,0.10)_50%,rgba(235,242,255,0.08)_100%)] px-3 py-2 text-[10px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md transition-[background,box-shadow,border-color,backdrop-filter] duration-300 lg:gap-2 lg:px-6 lg:py-4 lg:text-sm lg:group-hover:border-white/10 lg:group-hover:bg-[#EBF2FF0A] lg:group-hover:shadow-none lg:group-hover:backdrop-blur-[2px]">
          <div className="flex w-full items-center gap-2 lg:gap-3">
            <dt className="w-[4.6875rem] font-normal text-frost uppercase tracking-[0.5px] lg:w-[7.6875rem] lg:tracking-[0.84px]">Length/Beam:</dt>
            <dd className="m-0 w-[5.625rem] font-light text-taupe lg:w-[9.5625rem]">{boat.lengthBeam}</dd>
          </div>
          <div className="flex w-full items-center gap-2 lg:gap-3">
            <dt className="w-[4.6875rem] font-normal text-frost uppercase tracking-[0.5px] lg:w-[7.6875rem] lg:tracking-[0.84px]">Stern:</dt>
            <dd className="m-0 w-[5.625rem] font-light text-taupe lg:w-[9.5625rem]">{boat.stern}</dd>
          </div>
          <div className="flex w-full items-center gap-2 lg:gap-3">
            <dt className="w-[4.6875rem] font-normal text-frost uppercase tracking-[0.5px] lg:w-[7.6875rem] lg:tracking-[0.84px]">Year Built:</dt>
            <dd className="m-0 w-[5.625rem] font-light text-taupe lg:w-[9.5625rem]">{boat.yearBuilt}</dd>
          </div>
          <div className="flex w-full items-center gap-2 lg:gap-3">
            <dt className="w-[4.6875rem] font-normal text-frost uppercase tracking-[0.5px] lg:w-[7.6875rem] lg:tracking-[0.84px]">Builder:</dt>
            <dd className="m-0 w-[5.625rem] font-light text-taupe lg:w-[9.5625rem]">{boat.builder}</dd>
          </div>
        </dl>
      </div>

      <div className="flex items-end justify-between px-0 transition-[padding] duration-300 lg:group-hover:px-7">
        <div className="flex flex-col gap-1 lg:gap-2">
          <h3 className="font-display text-h3 text-frost capitalize transition-colors duration-300 lg:group-hover:text-[2.125rem] lg:group-hover:text-ink">
            {boat.name}
          </h3>
          <p className="text-base text-gold transition-colors duration-300 lg:text-2xl lg:group-hover:text-[#0a5928]">
            {boat.price}
          </p>
        </div>
        <a
          href={boat.href}
          className="relative flex size-11 shrink-0 items-center justify-center rounded-full border border-blue-lighter transition-colors duration-300 lg:size-20 lg:group-hover:border-transparent lg:group-hover:bg-blue"
          aria-label={`View ${boat.name}`}
        >
          <img
            src={arrowUpRightLight}
            alt=""
            aria-hidden="true"
            className="absolute size-6 lg:size-12 lg:group-hover:hidden"
          />
          <img
            src={arrowUpRightDark}
            alt=""
            aria-hidden="true"
            className="absolute hidden lg:size-8 lg:group-hover:block"
          />
        </a>
      </div>
    </article>
  )
}
