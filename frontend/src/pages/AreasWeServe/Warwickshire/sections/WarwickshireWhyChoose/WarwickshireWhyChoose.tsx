import type { ReactNode } from 'react'
import image1 from '../../../../../assets/warwickshire-why-choose-1.png'
import image2 from '../../../../../assets/warwickshire-why-choose-2.png'
import arrowRight from '../../../../../assets/ArrowRight2.png'
import bulletIcon from '../../../../../assets/Rectangle 11912.png'

const rows: { items: ReactNode[]; image: string; imageAlt: string; textFirst: boolean }[] = [
  {
    items: [
      <>
        Specialist{' '}
        <a
          href="https://theboatbrokers.co.uk/selling/"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          narrowboat broker Warwickshire
        </a>{' '}
        with deep local waterway knowledge
      </>,
      'Honest market pricing, not inflated figures designed to win your instruction',
      '25+ years of combined canal boat brokerage experience',
    ],
    image: image1,
    imageAlt: 'A narrowboat moored on the water at sunset',
    textFirst: true,
  },
  {
    items: [
      'Strong buyer database actively searching for Warwickshire vessels',
      'No upfront fees, you pay only when your boat sells',
    ],
    image: image2,
    imageAlt: 'A narrowboat moored beside a green riverbank at golden hour',
    textFirst: false,
  },
]

export default function WarwickshireWhyChoose() {
  return (
    <section className="flex flex-col items-center gap-12 rounded-2xl bg-navy-darkest px-6 py-14 sm:gap-16 sm:px-16 sm:py-20">
      <div className="flex w-full max-w-[80rem] flex-col gap-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[rgba(108,214,255,0.22)] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-blue-light uppercase">
          <span className="size-2 rounded-full bg-blue-light" />
          Built on Commitment
        </span>
        <h2 className="font-display text-[2.375rem] leading-[1.3] tracking-[-2px] text-white capitalize sm:text-[3.375rem]">
          Why Choose The Boat Brokers in Warwickshire?
        </h2>
        <p className="max-w-[62rem] text-base leading-[26px] text-[#e3e3e3]">
          We are a dedicated narrowboat and canal boat brokerage with deep knowledge of the
          Warwickshire waterway market. Our registered buyer database includes active purchasers
          specifically searching for narrowboats along the Grand Union through Leamington and
          Warwick, and others targeting the quieter Coventry Canal further north, so the right
          buyers see your listing from day one.
        </p>
      </div>

      <div className="flex w-full max-w-[80rem] flex-col gap-8 border-t border-white/15 pt-12 sm:gap-16">
        {rows.map((row, index) => (
          <div key={index} className="flex flex-col items-center gap-8 lg:flex-row lg:gap-24">
            <ul
              className={`flex flex-col gap-4 text-base leading-[1.5] text-[#b5b5b5] lg:flex-1 ${
                row.textFirst ? 'lg:order-1' : 'lg:order-2'
              }`}
            >
              {row.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-3">
                  <img src={bulletIcon} alt="" aria-hidden="true" className="mt-1 size-4 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div
              className={`aspect-[2.89/1] w-full overflow-hidden rounded-2xl lg:w-[35rem] lg:flex-none ${
                row.textFirst ? 'lg:order-2' : 'lg:order-1'
              }`}
            >
              <img src={row.image} alt={row.imageAlt} className="size-full object-cover" />
            </div>
          </div>
        ))}
      </div>

      <a
        href="/boats-for-sale"
        className="inline-flex items-center gap-1.5 rounded-xl bg-white px-6 py-3 text-base font-medium tracking-[-0.32px] text-[#073040] shadow-btn transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.98]"
      >
        Explore All Boats
        <img src={arrowRight} alt="" aria-hidden="true" className="size-[18px]" />
      </a>
    </section>
  )
}
