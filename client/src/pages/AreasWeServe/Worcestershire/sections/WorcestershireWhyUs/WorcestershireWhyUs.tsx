import { Fragment } from 'react'
import whyUsImage from '../../../../../assets/confidence-buyers.png'

const waterways = [
  'Staffordshire & Worcestershire Canal — from Stourport-on-Severn through Kidderminster and into the Midlands network',
  'Worcester & Birmingham Canal — 58 locks linking Worcester directly to Birmingham through outstanding rural scenery',
  'River Severn — navigable waterway for vessels licensed for river use',
]

const stats = [
  { value: '25+', label: 'Years of exceptional experience and excellence' },
  { value: '450+', label: 'Happy Customers Worldwide' },
  { value: '500+', label: 'Boats Sold Succesfully' },
  { value: '98%', label: 'Client satisfaction rate aross all stays' },
]

export default function WorcestershireWhyUs() {
  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto flex max-w-[87.5rem] flex-col gap-14 lg:gap-16">
        <h2 className="font-display text-[2.375rem] leading-[1.3] tracking-[-2px] text-black capitalize sm:max-w-[43rem] sm:text-[3.375rem]">
          Why Worcestershire?
        </h2>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="aspect-square w-full overflow-hidden rounded-2xl">
            <img
              src={whyUsImage}
              alt="A narrowboat moored beside a green riverbank"
              className="size-full scale-x-[-1] object-cover"
            />
          </div>

          <div className="flex flex-col gap-8">
            <h3 className="font-display text-[1.75rem] leading-[1.3] tracking-[-2px] text-[#1a1a1a] capitalize sm:text-[2.375rem]">
              Waterways Worcestershire Buyers Love
            </h3>
            <div className="flex flex-col gap-4 text-base leading-[26px] text-text-body sm:text-xl sm:leading-[30px]">
              <p>
                Worcestershire is one of England&rsquo;s most beautiful counties for canal boat
                ownership, and one of the most active markets for narrowboat sales.
              </p>
              <p>Key waterways include:</p>
              <ul className="list-disc pl-5">
                {waterways.map((waterway) => (
                  <li key={waterway}>{waterway}</li>
                ))}
              </ul>
              <p>
                Quality boats at realistic prices in Worcestershire typically receive serious
                enquiries within two to three weeks of going live.
              </p>
            </div>
          </div>
        </div>

        <ul className="flex flex-wrap items-start justify-between gap-6">
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
