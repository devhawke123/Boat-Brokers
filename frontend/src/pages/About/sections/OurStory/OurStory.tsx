import { Fragment } from 'react'
import storyMain from '../../../../assets/about-story-main.png'
import storyAccent from '../../../../assets/about-story-accent.png'
import Button from '../../../../components/Button/Button'

const stats = [
  { value: '25+', label: 'Years of exceptional experience and excellence' },
  { value: '450+', label: 'Happy Customers Worldwide' },
  { value: '500+', label: 'Boats Sold Succesfully' },
  { value: '98%', label: 'Client satisfaction rate aross all stays' },
]

export default function OurStory() {
  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto flex max-w-[87.5rem] flex-col gap-14 lg:gap-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[auto_1fr_auto] lg:items-stretch lg:gap-12">
          <div className="h-[280px] overflow-hidden rounded-2xl sm:h-[24rem] lg:h-[34.375rem] lg:w-[22rem]">
            <img
              src={storyMain}
              alt="A narrowboat moored on a canal at sunset"
              className="size-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-8 lg:h-[34.375rem] lg:min-w-[22rem] lg:justify-between">
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

            <div className="flex flex-col gap-8 lg:flex-1 lg:justify-between">
              <p className="max-w-[27.3125rem] text-base leading-[26px] text-text-body">
                We are passionate about boating and dedicated to providing our clients with
                exceptional service. Whether you are a seasoned boater or new to the industry, we
                are here to help you navigate the waters of buying or selling.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Button variant="dark" label="Buy Boats Now" href="/boats-for-sale" />
                <Button variant="outline-dark" label="Sell Your Boat" href="/sell" />
              </div>
            </div>
          </div>

          <div className="hidden self-end overflow-hidden rounded-2xl lg:block lg:h-[15rem] lg:w-[15rem]">
            <img
              src={storyAccent}
              alt="Boats moored along a canal towpath"
              className="size-full object-cover"
            />
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
