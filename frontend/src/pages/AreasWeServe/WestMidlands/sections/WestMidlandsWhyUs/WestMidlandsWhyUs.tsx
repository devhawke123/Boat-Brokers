import { Fragment } from 'react'
import whyUsImage from '../../../../../assets/west-midlands-why-us.png'
import whyUsImageMobile from '../../../../../assets/west-midlands-why-us-mobile.png'

const stats = [
  { value: '25+', label: 'Years of exceptional experience and excellence' },
  { value: '450+', label: 'Happy Customers Worldwide' },
  { value: '500+', label: 'Boats Sold Succesfully' },
  { value: '98%', label: 'Client satisfaction rate aross all stays' },
]

const mobileStats = [
  { value: '25+', label: 'Years of experience' },
  { value: '450+', label: 'Happy Customers Worldwide' },
  { value: '25+', label: 'Boats Sold Succesfully' },
]

export default function WestMidlandsWhyUs() {
  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto flex max-w-[87.5rem] flex-col gap-14 lg:gap-16">
        <h2 className="font-display text-[2.125rem] leading-[1.2] tracking-[-2px] text-black capitalize sm:max-w-[43rem] sm:text-[2.375rem] sm:leading-[1.3] lg:text-[3.375rem]">
          Why the West Midlands?
        </h2>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 aspect-[350/502] w-full overflow-hidden rounded-2xl lg:order-1 lg:aspect-square">
            <img
              src={whyUsImageMobile}
              alt="A narrowboat on a canal at sunrise in the West Midlands"
              className="size-full scale-x-[-1] object-cover lg:hidden"
            />
            <img
              src={whyUsImage}
              alt="A narrowboat on a canal at sunrise in the West Midlands"
              className="hidden size-full object-cover lg:block"
            />
          </div>

          <div className="order-1 flex flex-col gap-8 lg:order-2">
            <h3 className="font-display text-[1.5rem] leading-[1.3] tracking-[-2px] text-[#1a1a1a] capitalize sm:max-w-[39.25rem] sm:text-[1.75rem] lg:text-[2.375rem]">
              Your Boat Journey, Made Simple
            </h3>
            <div className="flex flex-col gap-4 text-sm leading-[26px] text-text-body sm:text-base lg:text-xl lg:leading-[30px]">
              <p>
                The West Midlands sits at the centre of the finest canal network in England. With
                over 100 miles of navigable waterway threading through the region, from Gas
                Street Basin in Birmingham to the rural reaches of Worcestershire and
                Warwickshire, this is one of the most active canal boat markets in the country.
              </p>
              <p>
                The Birmingham Canal Navigations alone covers over 100 miles of channel through
                the heart of the city.
              </p>
              <p>
                From there, the Staffordshire and Worcestershire Canal heads south toward the
                River Severn, the Grand Union Canal stretches east into Warwickshire toward
                London, and the Coventry Canal links north to the Trent and Mersey. Whether you
                are buying, selling or cruising, the West Midlands gives you unmatched access to
                the national network.
              </p>
            </div>
          </div>
        </div>

        <ul className="flex items-start justify-between gap-4 lg:hidden">
          {mobileStats.map((stat, index) => (
            <li key={index} className="flex flex-col gap-1.5 p-3">
              <span className="font-display text-[2.125rem] leading-[1.2] tracking-[-2px] text-black capitalize">
                {stat.value}
              </span>
              <span className="w-[5.5625rem] font-body text-[0.625rem] leading-[19px] text-[#6e6e6e]">
                {stat.label}
              </span>
            </li>
          ))}
        </ul>

        <ul className="hidden flex-wrap items-start justify-between gap-6 lg:flex">
          {stats.map((stat, index) => (
            <Fragment key={stat.value}>
              <li className="flex items-center gap-1.5">
                <span className="font-display text-[3.375rem] tracking-[-2px] text-black capitalize">
                  {stat.value}
                </span>
                <span className="max-w-[130px] font-body text-sm font-light text-[#6e6e6e]">
                  {stat.label}
                </span>
              </li>
              {index < stats.length - 1 && (
                <li
                  className="hidden self-center font-accent text-[2rem] text-black opacity-50 sm:block"
                  aria-hidden="true"
                >
                  /
                </li>
              )}
            </Fragment>
          ))}
        </ul>
      </div>
    </section>
  )
}
