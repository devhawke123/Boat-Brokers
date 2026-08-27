import aboutBroker from '../../../../assets/people/about-broker.png'
import britishMarine from '../../../../assets/icons/british-marine.png'
import Button from '../../../../components/Button/Button'

export default function TeamLead() {
  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto grid max-w-[87.5rem] grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,25.75rem)_minmax(0,1fr)] lg:gap-16">
        <div className="h-[280px] overflow-hidden rounded-2xl sm:h-[24rem] lg:h-[33.25rem]">
          <img
            src={aboutBroker}
            alt="Noel Creary, Managing Director of The Boat Brokers"
            className="size-full object-cover"
          />
        </div>

        <div className="flex max-w-[38.125rem] flex-col gap-8">
          <div className="flex flex-col">
            <p className="font-display text-[2.375rem] leading-[1.3] tracking-[-2px] text-blue capitalize sm:text-[3.375rem]">
              &ldquo;Noel Creary&rdquo;
            </p>
            <p className="font-display text-[2.375rem] leading-[1.3] tracking-[-2px] text-black capitalize sm:text-[3.375rem]">
              Managing Director
            </p>
          </div>

          <p className="text-base leading-[26px] text-text-body sm:text-xl sm:leading-[30px]">
            &ldquo;I&rsquo;ve been involved in building canal boats for over 20 years, having
            successfully managed two top quality canal boat builders, Amber Boats and Heritage
            Boats of Evesham. I&rsquo;ve also bought and sold hundreds of used boats in my time. I
            certainly feel passionate about canal boats and strive to give our customers the very
            best service with candid honesty.&rdquo;
          </p>

          <div className="flex flex-wrap items-center gap-7">
            <Button variant="dark" label="More About Me" href="/about/noel-creary" />
            <img
              src={britishMarine}
              alt="British Marine - Leading the Industry"
              className="h-auto w-[13.25rem]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
