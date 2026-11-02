import storyMain from '../../../../assets/about-story-main.png'
import storyAccent from '../../../../assets/about-story-accent.png'
import Button from '../../../../components/Button/Button'
import { useInViewOnce } from '../../../../hooks/useInViewOnce'

const stats = [
  { value: '25+', label: 'Years of exceptional experience and excellence' },
  { value: '450+', label: 'Happy Customers Worldwide' },
  { value: '500+', label: 'Boats Sold Succesfully' },
  { value: '98%', label: 'Client satisfaction rate aross all stays' },
]

export default function OurStory() {
  const { ref: revealRef, isVisible } = useInViewOnce<HTMLDivElement>()

  return (
    <section className="overflow-x-hidden py-14 lg:py-20">
      <div className="mx-auto flex max-w-[87.5rem] flex-col gap-14 lg:gap-16">
        <div
          ref={revealRef}
          className="grid grid-cols-1 gap-10 lg:grid-cols-[auto_1fr_auto] lg:items-stretch lg:gap-12"
        >
          <div
            className={`reveal-left h-[280px] overflow-hidden rounded-2xl sm:h-[24rem] lg:h-[34.375rem] lg:w-[22rem] ${isVisible ? 'is-visible' : ''}`}
          >
            <img
              src={storyMain}
              alt="A narrowboat moored on a canal at sunset"
              className="size-full object-cover"
            />
          </div>

          <div
            className={`reveal-right reveal-delay-1 flex flex-col gap-8 lg:h-[34.375rem] lg:min-w-[22rem] lg:justify-between ${isVisible ? 'is-visible' : ''}`}
          >
            <div className="flex flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e3f7fe] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-[#14b2ef] uppercase">
                <span className="size-2 rounded-full bg-blue" />
                A Few Words About Us
              </span>
              <h2 className="font-display text-[34px] leading-[1.2] tracking-[-2px] text-[#020f17] capitalize sm:text-[3.375rem] sm:leading-[1.3]">
                About The
                <br className="hidden lg:block" /> Boat Brokers
              </h2>
            </div>

            <div className="flex flex-col gap-8 lg:flex-1 lg:justify-between">
              <p className="max-w-[27.3125rem] text-sm leading-[26px] text-text-body sm:text-base">
                We are passionate about boating and dedicated to providing our clients with
                exceptional service. Whether you are a seasoned boater or new to the industry, we
                are here to help you navigate the waters of buying or selling.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Button variant="dark" label="Buy Boats Now" href="/boats-for-sale" />
                <Button variant="outline-dark" label="Sell Your Boat" href="/selling" />
              </div>
            </div>
          </div>

          <div
            className={`reveal-right reveal-delay-2 hidden self-end overflow-hidden rounded-2xl lg:block lg:h-[25rem] lg:w-[25rem] ${isVisible ? 'is-visible' : ''}`}
          >
            <img
              src={storyAccent}
              alt="Boats moored along a canal towpath"
              className="size-full object-cover"
            />
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {stats.map((stat) => (
            <li
              key={stat.value}
              className="flex flex-col gap-2 rounded-xl border border-border bg-frost/40 p-5 sm:gap-3 sm:p-6"
            >
              <span className="font-display text-[2.125rem] leading-none tracking-[-2px] text-ink capitalize sm:text-h2">
                {stat.value}
              </span>
              <span className="font-body text-body-sm text-text-body sm:text-body">
                {stat.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
