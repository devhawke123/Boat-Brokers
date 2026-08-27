import arrowUpRightLight from '../../../../assets/icons/arrow-up-right.svg'
import arrowUpRightDark from '../../../../assets/icons/arrow-up-right-dark.svg'

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
    <article className="group flex flex-col gap-8 rounded-xl transition-colors duration-300 hover:bg-[#e8f6ff] hover:pb-8">
      <div className="relative flex aspect-[608/650] max-h-[88vh] flex-col overflow-hidden rounded-xl border border-[#639dbf] p-5 transition-colors duration-300 group-hover:border-transparent">
        <img src={boat.image} alt={boat.name} className="absolute inset-0 size-full object-cover" />
        <dl className="relative z-[1] mt-auto flex w-full max-w-[19.5rem] flex-col gap-2 self-end rounded-lg bg-[rgba(235,242,255,0.08)] px-6 py-4 text-sm backdrop-blur-[2px]">
          <div className="flex w-full items-center gap-3">
            <dt className="w-[123px] font-normal text-[#f8fcff] uppercase tracking-[0.84px]">Length/Beam:</dt>
            <dd className="m-0 w-[153px] font-light text-[#d2c8c8]">{boat.lengthBeam}</dd>
          </div>
          <div className="flex w-full items-center gap-3">
            <dt className="w-[123px] font-normal text-[#f8fcff] uppercase tracking-[0.84px]">Stern:</dt>
            <dd className="m-0 w-[153px] font-light text-[#d2c8c8]">{boat.stern}</dd>
          </div>
          <div className="flex w-full items-center gap-3">
            <dt className="w-[123px] font-normal text-[#f8fcff] uppercase tracking-[0.84px]">Year Built:</dt>
            <dd className="m-0 w-[153px] font-light text-[#d2c8c8]">{boat.yearBuilt}</dd>
          </div>
          <div className="flex w-full items-center gap-3">
            <dt className="w-[123px] font-normal text-[#f8fcff] uppercase tracking-[0.84px]">Builder:</dt>
            <dd className="m-0 w-[153px] font-light text-[#d2c8c8]">{boat.builder}</dd>
          </div>
        </dl>
      </div>

      <div className="flex items-end justify-between px-0 transition-[padding] duration-300 group-hover:px-7">
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-[2.375rem] leading-[1.3] tracking-[-2px] text-[#f8fcff] capitalize transition-colors duration-300 group-hover:text-[2.125rem] group-hover:text-[#171717]">
            {boat.name}
          </h3>
          <p className="text-2xl text-gold transition-colors duration-300 group-hover:text-[#0a5928]">
            {boat.price}
          </p>
        </div>
        <a
          href={boat.href}
          className="relative flex size-20 shrink-0 items-center justify-center rounded-full border border-blue-lighter transition-colors duration-300 group-hover:border-transparent group-hover:bg-blue"
          aria-label={`View ${boat.name}`}
        >
          <img
            src={arrowUpRightLight}
            alt=""
            aria-hidden="true"
            className="absolute size-12 group-hover:hidden"
          />
          <img
            src={arrowUpRightDark}
            alt=""
            aria-hidden="true"
            className="absolute hidden size-8 group-hover:block"
          />
        </a>
      </div>
    </article>
  )
}
