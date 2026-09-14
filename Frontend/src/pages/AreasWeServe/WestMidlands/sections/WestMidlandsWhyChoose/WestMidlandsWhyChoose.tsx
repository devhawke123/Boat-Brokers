import type { ReactNode } from 'react'
import image1 from '../../../../../assets/west-midlands-why-choose-1.png'
import image2 from '../../../../../assets/west-midlands-why-choose-2.png'
import arrowRight from '../../../../../assets/icons/arrow-right-white.svg'
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
          narrowboat broker West Midlands
        </a>{' '}
        — a dedicated narrowboat and canal boat brokerage, not a general agent
      </>,
      'Over 500 canal boat sales completed across the region',
      'Business grows primarily through personal recommendation rather than advertising',
    ],
    image: image1,
    imageAlt: 'A narrowboat moored on the water at sunset',
    textFirst: true,
  },
  {
    items: [
      'Deep local knowledge of Gas Street Basin, the Grand Union and the Staffordshire and Worcestershire corridor',
      'Listings and viewings tailored to both first-time buyers and experienced long-distance cruisers',
    ],
    image: image2,
    imageAlt: 'A narrowboat moored beside a green riverbank at golden hour',
    textFirst: false,
  },
]

export default function WestMidlandsWhyChoose() {
  return (
    <section className="flex flex-col items-center gap-12 rounded-2xl bg-navy-darkest px-6 py-14 sm:gap-16 sm:px-16 sm:py-20">
      <div className="flex w-full max-w-[80rem] flex-col gap-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[rgba(108,214,255,0.22)] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-blue-light uppercase">
          <span className="size-2 rounded-full bg-blue-light" />
          Built on Commitment
        </span>
        <h2 className="font-display text-[2.375rem] leading-[1.3] tracking-[-2px] text-white capitalize sm:text-[3.375rem]">
          Why Choose The Boat Brokers in the West Midlands?
        </h2>
        <p className="max-w-[62rem] text-base leading-[26px] text-[#e3e3e3]">
          As a specialist narrowboat and canal boat brokerage, The Boat Brokers combines deep
          local knowledge with honest advice, professional presentation and a personal approach.
          With over 500 canal boat sales across the region, we understand the West Midlands
          market and the buyers it attracts.
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
              <img
                src={row.image}
                alt={row.imageAlt}
                className={`size-full object-cover ${index === 0 ? 'scale-x-[-1] object-[35%_85%] lg:object-[center_85%]' : ''}`}
              />
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
