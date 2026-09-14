import { Fragment } from 'react'
import whyUsImage from '../../../../../assets/west-midlands-why-us.png'

const stats = [
  { value: '25+', label: 'Years of exceptional experience and excellence' },
  { value: '450+', label: 'Happy Customers Worldwide' },
  { value: '500+', label: 'Boats Sold Succesfully' },
  { value: '98%', label: 'Client satisfaction rate aross all stays' },
]

export default function WestMidlandsWhyUs() {
  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto flex max-w-[87.5rem] flex-col gap-14 lg:gap-16">
        <h2 className="font-display text-[2.375rem] leading-[1.3] tracking-[-2px] text-black capitalize sm:max-w-[43rem] sm:text-[3.375rem]">
          Why the West Midlands?
        </h2>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="aspect-square w-full overflow-hidden rounded-2xl">
            <img
              src={whyUsImage}
              alt="A narrowboat on a canal at sunrise in the West Midlands"
              className="size-full scale-x-[-1] object-cover"
            />
          </div>

          <div className="flex flex-col gap-8">
            <h3 className="font-display text-[1.75rem] leading-[1.3] tracking-[-2px] text-[#1a1a1a] capitalize sm:text-[2.375rem]">
              Your Boat Journey, Made Simple
            </h3>
            <div className="flex flex-col gap-4 text-base leading-[26px] text-text-body sm:text-xl sm:leading-[30px]">
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

        <ul className="grid grid-cols-4 items-start gap-2 sm:flex sm:flex-wrap sm:justify-between sm:gap-6">
          {stats.map((stat, index) => (
            <Fragment key={stat.value}>
              <li className="flex flex-col items-center gap-1 text-center sm:flex-row sm:items-center sm:gap-1.5 sm:text-left">
                <span className="font-display text-xl tracking-[-1px] text-black capitalize sm:text-[3.375rem] sm:tracking-[-2px]">
                  {stat.value}
                </span>
                <span className="font-body text-[10px] leading-[14px] text-[#6e6e6e] sm:max-w-[8.125rem] sm:text-sm sm:leading-normal sm:font-light">
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
