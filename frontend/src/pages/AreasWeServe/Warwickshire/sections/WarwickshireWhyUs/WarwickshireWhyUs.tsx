import { Fragment } from 'react'
import whyUsImage from '../../../../../assets/confidence-buyers.png'

const waterways = [
  'Grand Union Canal — through Leamington Spa and Warwick toward London',
  'Coventry Canal — north through Nuneaton and Atherstone to Fradley Junction',
  'Oxford Canal — from Napton Junction toward Oxford and the south',
  'Napton Junction — one of the Midlands’ most significant canal crossings, opening routes in three directions',
]

const stats = [
  { value: '25+', label: 'Years of exceptional experience and excellence' },
  { value: '450+', label: 'Happy Customers Worldwide' },
  { value: '500+', label: 'Boats Sold Succesfully' },
  { value: '98%', label: 'Client satisfaction rate aross all stays' },
]

export default function WarwickshireWhyUs() {
  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto flex max-w-[87.5rem] flex-col gap-14 lg:gap-16">
        <h2 className="font-display text-[2.375rem] leading-[1.3] tracking-[-2px] text-black capitalize sm:max-w-[43rem] sm:text-[3.375rem]">
          Why Warwickshire?
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
              Your Boat Journey, Made Simple
            </h3>
            <div className="flex flex-col gap-4 text-base leading-[26px] text-text-body sm:text-xl sm:leading-[30px]">
              <p>
                Warwickshire sits at a remarkable crossroads of the English canal network, giving
                boat owners access to routes in every direction.
              </p>
              <p>Key waterways include:</p>
              <ul className="list-disc pl-5">
                {waterways.map((waterway) => (
                  <li key={waterway}>{waterway}</li>
                ))}
              </ul>
              <p>
                Demand for{' '}
                <a
                  href="https://theboatbrokers.co.uk/boats-for-sale/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  canal boats for sale in Warwickshire
                </a>{' '}
                is consistently strong year-round thanks to this exceptional connectivity.
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
