import { Fragment } from 'react'
import aboutBroker from '../../../../assets/people/about-broker.png'
import playIcon from '../../../../assets/icons/play.svg'
import Button from '../../../../components/Button/Button'

const stats = [
  { value: '25+', label: 'Years of exceptional experience and excellence' },
  { value: '450+', label: 'Happy Customers Worldwide' },
  { value: '500+', label: 'Boats Sold Succesfully' },
  { value: '98%', label: 'Client satisfaction rate aross all stays' },
]

export default function AboutUs() {
  return (
    <section className="grid grid-cols-1 items-start justify-center gap-x-11 gap-y-10 py-14 lg:grid-cols-[minmax(0,clamp(20rem,45%,36.75rem))_minmax(0,clamp(20rem,48%,39.25rem))] lg:py-20">
      <div className="relative grid grid-cols-2 gap-2">
        <div className="col-span-2 h-[301px] overflow-hidden rounded-2xl">
          <img
            src={aboutBroker}
            alt="The Boat Brokers team member beside a narrowboat"
            className="size-full object-cover"
          />
        </div>
        <div className="contents">
          <div className="h-[220px] overflow-hidden rounded-2xl">
            <img
              src={aboutBroker}
              alt=""
              className="size-full object-cover"
              style={{ objectPosition: '30% 70%' }}
            />
          </div>
          <div className="h-[220px] overflow-hidden rounded-2xl">
            <img
              src={aboutBroker}
              alt=""
              className="size-full object-cover"
              style={{ objectPosition: '75% 40%' }}
            />
          </div>
        </div>
        <button
          type="button"
          className="absolute top-[301px] left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 border-none bg-transparent p-0"
          aria-label="Play video"
        >
          <img src={playIcon} alt="" aria-hidden="true" className="size-full" />
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e3f7fe] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-[#14b2ef] uppercase">
              <span className="size-2 rounded-full bg-blue" />
              About Us
            </span>
            <h2 className="font-display text-[3.375rem] leading-[1.3] tracking-[-2px] text-[#1a1a1a] capitalize">
              The Boat Brokers
            </h2>
          </div>
          <p className="text-base leading-[26px] text-text-body">
            At The Boat Brokers, we specialise in narrowboat sales, blending modern technology
            with personal service. While we&rsquo;ve invested heavily in streamlining the boat
            sales process, we haven&rsquo;t replaced everything with automation. We keep costs
            low by avoiding expensive marina branches and branded vehicles—allowing us to offer a
            premium service at a fraction of the price.
          </p>
        </div>

        <hr className="m-0 border-t border-t-border" />

        <p className="text-base leading-[26px] text-text-body">
          With years of hands-on experience in the narrowboat and canal boat industry. We pride
          ourselves on connecting buyers and sellers quickly and smoothly, making narrowboat
          sales simple and stress-free. From the initial appointment to final completion,
          we&rsquo;re here to guide you every step of the way.
        </p>

        <Button variant="dark" label="Learn More" href="/about" />
      </div>

      <ul className="col-span-full flex flex-wrap items-start justify-between gap-6 pt-14">
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
              <li className="self-center font-accent text-[2rem] text-black opacity-50" aria-hidden="true">
                /
              </li>
            )}
          </Fragment>
        ))}
      </ul>
    </section>
  )
}
