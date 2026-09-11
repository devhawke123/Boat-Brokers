import { Fragment } from 'react'
import mainImage from '../../../../assets/areas-we-serve-main.png'
import accentImage from '../../../../assets/areas-we-serve-accent.png'
import Button from '../../../../components/Button/Button'

const stats = [
  { value: '25+', label: 'Years of exceptional experience and excellence' },
  { value: '450+', label: 'Happy Customers Worldwide' },
  { value: '500+', label: 'Boats Sold Succesfully' },
  { value: '98%', label: 'Client satisfaction rate aross all stays' },
]

const mobileStats = [
  { value: '25+', label: 'Years of experience' },
  { value: '450+', label: 'Happy Customers Worldwide' },
  { value: '500+', label: 'Boats Sold Succesfully' },
  { value: '98%', label: 'Client satisfaction rate' },
]

export default function AreasWeServeAbout() {
  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto flex max-w-[87.5rem] flex-col gap-14 lg:gap-16">
        <div className="flex flex-col gap-5 lg:hidden">
          <div className="h-[8.5625rem] w-[9.125rem] overflow-hidden rounded-lg">
            <img
              src={accentImage}
              alt="Narrowboats moored along a misty canal towpath"
              className="size-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e3f7fe] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-[#14b2ef] uppercase">
              <span className="size-2 rounded-full bg-blue" />
              A Few Words About Us
            </span>
            <h2 className="font-display text-[2.125rem] leading-[1.2] tracking-[-2px] text-[#020f17] capitalize">
              About The Boat Brokers
            </h2>
            <p className="text-sm leading-[26px] text-text-body">
              We are passionate about boating and dedicated to providing our clients with
              exceptional service. Whether you are a seasoned boater or new to the industry, we
              are here to help you navigate the waters of buying or selling.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="dark" label="Buy Boats Now" href="/boats-for-sale" />
            <Button variant="outline-dark" label="Sell Your Boats" href="/sell" />
          </div>

          <div className="h-[31.375rem] w-full overflow-hidden rounded-lg">
            <img
              src={mainImage}
              alt="A narrowboat on a Midlands canal at sunset"
              className="size-full object-cover"
            />
          </div>
        </div>

        <div className="hidden grid-cols-1 gap-10 lg:grid lg:grid-cols-[25rem_1fr] lg:items-stretch lg:gap-12">
          <div className="h-[280px] overflow-hidden rounded-2xl sm:h-[24rem] lg:h-[34.375rem]">
            <img
              src={mainImage}
              alt="A narrowboat on a Midlands canal at sunset"
              className="size-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-8 lg:h-[34.375rem] lg:justify-between">
            <div className="flex flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e3f7fe] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-[#14b2ef] uppercase">
                <span className="size-2 rounded-full bg-blue" />
                A Few Words About Us
              </span>
              <h2 className="font-display text-[2.375rem] leading-[1.3] tracking-[-2px] text-[#020f17] capitalize sm:text-[3.375rem]">
                About The
                <br className="hidden lg:block" /> Boat Brokers
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_21rem] lg:items-stretch lg:gap-8">
              <div className="flex flex-col gap-8">
                <div className="flex max-w-[30.25rem] flex-col gap-4 text-base leading-[26px] text-text-body">
                  <p>
                    We cover the full canal network across the West Midlands region, including the
                    Birmingham Canal Navigations, the Staffordshire and Worcestershire Canal, the
                    Worcester and Birmingham Canal, the Coventry Canal, the Grand Union Canal, the
                    Oxford Canal and the Shropshire Union Canal from Autherley Junction. If your
                    narrowboat is moored anywhere within or connected to this network, we can
                    represent you.
                  </p>
                  <p>Our service area covers four cities and three counties across the Midlands:</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="dark" label="Buy Boats Now" href="/boats-for-sale" />
                  <Button variant="outline-dark" label="Sell Your Boat" href="/sell" />
                </div>
              </div>

              <div className="h-[260px] w-full overflow-hidden rounded-2xl sm:h-[19rem] lg:h-full lg:w-[21rem]">
                <img
                  src={accentImage}
                  alt="Narrowboats moored along a misty canal towpath"
                  className="size-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <ul className="flex gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
          {mobileStats.map((stat) => (
            <li key={stat.value} className="flex w-[6.3125rem] shrink-0 flex-col gap-1.5 p-3">
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
