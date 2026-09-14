import { Fragment } from 'react'
import whyUsImage from '../../../../../assets/birmingham pic1 (1).jpg'

const waterways = [
  'Birmingham Canal Navigations (BCN) — over 100 miles of urban canal through the city centre and surrounding areas',
  'Worcester & Birmingham Canal — south from Gas Street Basin through Worcestershire to the River Severn',
  'Grand Union Canal — east toward Warwickshire and London',
  'Stratford-upon-Avon Canal — south from Kings Norton toward Stratford and the River Avon',
]

const stats = [
  { value: '25+', label: 'Years of exceptional experience and excellence' },
  { value: '450+', label: 'Happy Customers Worldwide' },
  { value: '500+', label: 'Boats Sold Succesfully' },
  { value: '98%', label: 'Client satisfaction rate aross all stays' },
]

export default function BirminghamWhyUs() {
  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto flex max-w-[87.5rem] flex-col gap-14 lg:gap-16">
        <h2 className="font-display text-[2.375rem] leading-[1.3] tracking-[-2px] text-black capitalize sm:max-w-[43rem] sm:text-[3.375rem]">
          Why Birmingham?
        </h2>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="aspect-square w-full overflow-hidden rounded-2xl">
            <img
              src={whyUsImage}
              alt="A narrowboat moored on a canal in Birmingham"
              className="size-full scale-x-[-1] object-cover"
            />
          </div>

          <div className="flex flex-col gap-8">
            <h3 className="font-display text-[1.75rem] leading-[1.3] tracking-[-2px] text-[#1a1a1a] capitalize sm:text-[2.375rem]">
              The Heart of the English Canal Network
            </h3>
            <div className="flex flex-col gap-4 text-base leading-[26px] text-text-body sm:text-xl sm:leading-[30px]">
              <p>
                Birmingham sits at the heart of the English canal network and has more miles of
                canal running through it than Venice. The Birmingham Canal Navigations covers over
                100 miles of navigable waterway threading through the city, making it one of the
                most active and accessible canal boat markets in the country.
              </p>
              <p>Key waterways include:</p>
              <ul className="list-disc pl-5">
                {waterways.map((waterway) => (
                  <li key={waterway}>{waterway}</li>
                ))}
              </ul>
              <p>
                Whether you are a first-time buyer drawn by the city moorings at Gas Street Basin
                or an experienced boater planning long-distance cruising from the heart of the
                Midlands, Birmingham offers a starting point unlike anywhere else in the country.
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
