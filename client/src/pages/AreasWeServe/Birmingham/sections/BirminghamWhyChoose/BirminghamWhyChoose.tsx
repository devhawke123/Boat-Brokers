import type { ReactNode } from 'react'
import image1 from '../../../../../assets/birmingham pic1 (3).jpg'
import image2 from '../../../../../assets/birminghamabout.jpg'
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
          narrowboat broker Birmingham
        </a>{' '}
        with deep knowledge of the Birmingham Canal Navigations
      </>,
      '25+ years of combined experience in the local canal boat market',
      '500+ narrowboat and canal boat sales completed across the region',
    ],
    image: image1,
    imageAlt: 'A narrowboat moored on a canal in Birmingham at sunset',
    textFirst: true,
  },
  {
    items: [
      'No sale, no fee, you pay nothing unless your boat sells',
      'Seven days a week availability 9am to 8pm',
    ],
    image: image2,
    imageAlt: 'A narrowboat moored on a canal in Birmingham',
    textFirst: false,
  },
]

export default function BirminghamWhyChoose() {
  return (
    <section className="flex flex-col items-center gap-12 rounded-2xl bg-navy-darkest px-6 py-14 sm:gap-16 sm:px-16 sm:py-20">
      <div className="flex w-full max-w-[80rem] flex-col gap-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[rgba(108,214,255,0.22)] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-blue-light uppercase">
          <span className="size-2 rounded-full bg-blue-light" />
          Built on Commitment
        </span>
        <h2 className="font-display text-[2.375rem] leading-[1.3] tracking-[-2px] text-white capitalize sm:text-[3.375rem]">
          Why Choose The Boat Brokers in Birmingham?
        </h2>
        <p className="max-w-[62rem] text-base leading-[26px] text-[#e3e3e3]">
          We are not a general agent who handles a bit of everything. The Boat Brokers is a
          dedicated narrowboat and canal boat brokerage, and the Birmingham canal network is a
          market we know inside out. The BCN is one of the most complex waterway systems in
          England and understanding it — which moorings attract buyers, which stretches command
          higher prices, how liveaboard demand differs from leisure cruising demand — is what
          makes us the right choice for Birmingham sellers.
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
