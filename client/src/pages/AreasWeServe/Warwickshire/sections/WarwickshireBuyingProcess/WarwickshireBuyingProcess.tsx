import { useState } from 'react'
import ellipseIcon from '../../../../../assets/Ellipse 6.png'
import arrowRightWhite from '../../../../../assets/ArrowRight.png'
import arrowRightExplore from '../../../../../assets/icons/arrow-right-explore.svg'
import buyingProcessArrow from '../../../../../assets/BuyingProcessWarwickshire.png'

type Step = {
  number: string
  title: string
  description: string
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Free Market Valuation',
    description: 'We carry out a free, market-led valuation of your narrowboat...',
  },
  {
    number: '02',
    title: 'Create Your Listing',
    description: 'Our team produces professional photography...',
  },
  {
    number: '03',
    title: 'Wide Buyer Exposure',
    description: 'We distribute your listing across all major...',
  },
  {
    number: '04',
    title: 'Handle Buyer Enquiries',
    description: 'We manage every buyer enquiry on your...',
  },
  {
    number: '05',
    title: 'Professional Boat Viewings',
    description: 'Our team organises and attends every...',
  },
  {
    number: '06',
    title: 'Finalization the Deal',
    description: 'When offers are received, we negotiate on your...',
  },
]

export default function WarwickshireBuyingProcess() {
  const [activeMobileStep, setActiveMobileStep] = useState(0)

  return (
    <section className="flex flex-col items-center gap-12 px-6 py-16 sm:px-16 sm:py-24">
      {/* Mobile version — matches West Midlands mobile pattern */}
      <div className="flex w-full flex-col items-center gap-5 lg:hidden">
        <div className="flex w-full flex-col items-start gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e3f7fe] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-[#14b2ef] uppercase">
            <span className="size-2 rounded-full bg-blue" />
            Selling Process
          </span>
          <h2 className="font-display text-[2.125rem] leading-[1.2] tracking-[-2px] text-[#020f17] capitalize">
            The Narrowboat Will Choose You,
            <br />
            Rather Than The Other Way
          </h2>
          <p className="text-sm leading-[26px] text-[#6e6e6e]">
            At The Boat Brokers, we specialise in narrowboat sales, blending modern technology
            with personal service.
          </p>
          <div className="mt-2 flex w-full items-center gap-1.5 self-start text-xs tracking-[0.5px] text-blue uppercase">
            <span>01</span>
            <img src={buyingProcessArrow} alt="" aria-hidden="true" className="h-3.5 w-40 shrink-0 object-contain" />
            <span>06</span>
          </div>
        </div>

        <div className="flex w-full flex-col divide-y divide-[#d0c7c7] overflow-hidden rounded-2xl border border-[#d0c7c7]">
          {steps.map((step, index) => {
            const isActive = index === activeMobileStep
            return (
              <div
                key={step.number}
                role="button"
                tabIndex={0}
                onClick={() => setActiveMobileStep(index)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setActiveMobileStep(index)
                  }
                }}
                aria-pressed={isActive}
                className={`flex flex-col gap-3 p-5 text-left transition-colors duration-200 ${isActive ? 'bg-[#e8f9ff]' : 'bg-transparent'}`}
              >
                <div className="flex w-full items-start justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <img src={ellipseIcon} alt="" aria-hidden="true" className="size-3.5 shrink-0" />
                      <h3 className="font-display text-xl leading-[1.3] tracking-[-2px] text-ink capitalize">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-[26px] text-[rgba(0,0,0,0.63)]">
                      {step.description}
                    </p>
                  </div>
                  <span
                    className={`font-display shrink-0 text-[4.1875rem] leading-none transition-colors duration-200 ${
                      isActive ? 'text-[#169acc]' : 'text-blue-active'
                    }`}
                  >
                    {step.number}
                  </span>
                </div>
                <a
                  href="/about"
                  onClick={(event) => event.stopPropagation()}
                  className="inline-flex items-center gap-1 text-xs text-ink"
                >
                  <img src={arrowRightExplore} alt="" aria-hidden="true" className="size-2.5" />
                  More About Us
                </a>
              </div>
            )
          })}
        </div>

        <a
          href="/boats-for-sale"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#073040] px-5 py-3 text-base font-semibold text-white shadow-btn transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.98]"
        >
          Buy Boats Now
          <img src={arrowRightWhite} alt="" aria-hidden="true" className="size-[18px]" />
        </a>
      </div>

      {/* Desktop version */}
      <div className="hidden max-w-[51.5rem] flex-col items-center gap-3 text-center lg:flex">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#e3f7fe] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-[#14b2ef] uppercase">
          <span className="size-2 rounded-full bg-blue" />
          Selling Process
        </span>
        <h2 className="font-display text-[34px] leading-[1.3] tracking-[-2px] text-[#020f17] capitalize sm:text-[3.375rem]">
          The Narrowboat Will Choose You, Rather Than The Other Way
        </h2>
        <p className="max-w-[51.5rem] text-base leading-[26px] text-[#929292]">
          At The Boat Brokers, we specialise in narrowboat sales, blending modern technology with
          personal service.
        </p>
        <div className="mt-2 flex items-center justify-center gap-1.5 text-xs tracking-[0.5px] text-blue uppercase">
          <span>01</span>
          <svg
            viewBox="0 0 217.002 14.7279"
            fill="none"
            aria-hidden="true"
            className="h-3.5 w-54 text-[#6e6e6e] transition-colors duration-200 hover:text-blue"
          >
            <path
              d="M216.709 8.07107C217.1 7.68054 217.1 7.04738 216.709 6.65685L210.345 0.292893C209.955 -0.097631 209.322 -0.097631 208.931 0.292893C208.541 0.683418 208.541 1.31658 208.931 1.70711L214.588 7.36396L208.931 13.0208C208.541 13.4113 208.541 14.0445 208.931 14.435C209.322 14.8256 209.955 14.8256 210.345 14.435L216.709 8.07107ZM0 7.36396V8.36396H216.002V7.36396V6.36396H0V7.36396Z"
              fill="currentColor"
            />
          </svg>
          <span>06</span>
        </div>
      </div>

      <div className="hidden w-full max-w-[78.5rem] grid-cols-2 divide-x divide-y divide-[#e5e7eb] rounded-2xl border border-[#e5e7eb] lg:grid">
        {steps.map((step) => (
          <div
            key={step.number}
            className="group flex flex-col gap-6 bg-white p-8 transition-colors duration-200 hover:bg-[#e8f9ff]"
          >
            <div className="flex items-start justify-between gap-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <img src={ellipseIcon} alt="" aria-hidden="true" className="size-6 shrink-0" />
                  <h3 className="font-display text-[1.75rem] leading-[1.3] tracking-[-2px] text-ink capitalize">
                    {step.title}
                  </h3>
                </div>
                <p className="max-w-[23rem] text-base leading-[28px] text-[rgba(0,0,0,0.63)]">
                  {step.description}
                </p>
              </div>
              <span className="font-display shrink-0 text-[7.5rem] leading-none text-blue-active transition-colors duration-200 group-hover:text-[#169acc]">
                {step.number}
              </span>
            </div>
          </div>
        ))}
      </div>

      <a
        href="/selling"
        className="hidden items-center gap-1.5 rounded-xl bg-[#0d5673] px-5 py-3 text-base font-semibold text-white shadow-btn transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.98] lg:inline-flex"
      >
        Book a Free Valuation
        <img src={arrowRightWhite} alt="" aria-hidden="true" className="size-[18px]" />
      </a>
    </section>
  )
}
