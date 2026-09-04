import ellipseIcon from '../../../../../assets/Ellipse 6.png'
import arrowRightWhite from '../../../../../assets/ArrowRight.png'
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
    description:
      'We carry out a free, market-led valuation of your narrowboat based on real transaction data from the local canal boat market.',
  },
  {
    number: '02',
    title: 'Create Your Listing',
    description:
      'Our team produces professional photography and compelling listing copy that presents your boat accurately and attractively to serious buyers.',
  },
  {
    number: '03',
    title: 'Wide Buyer Exposure',
    description:
      'We distribute your listing across all major inland waterways platforms to ensure it reaches the widest possible audience of active buyers.',
  },
  {
    number: '04',
    title: 'Handle Buyer Enquiries',
    description:
      'We manage every buyer enquiry on your behalf, filtering serious interest and keeping you informed at every stage of the process.',
  },
  {
    number: '05',
    title: 'Professional Boat Viewings',
    description:
      'Our team organises and attends every viewing in person, presenting your boat professionally and answering buyer questions with confidence.',
  },
  {
    number: '06',
    title: 'Finalization the Deal',
    description:
      'When offers are received, we negotiate on your behalf to achieve the best possible price while keeping the process straightforward for both parties.',
  },
]

export default function WarwickshireSellingProcess() {
  return (
    <section className="flex flex-col items-center gap-12 px-6 py-16 sm:px-16 sm:py-24">
      <div className="flex max-w-[42rem] flex-col items-center gap-3 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#e3f7fe] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-[#14b2ef] uppercase">
          <span className="size-2 rounded-full bg-blue" />
          Selling Process
        </span>
        <h2 className="font-display text-[34px] leading-[1.3] tracking-[-2px] text-ink capitalize sm:text-[3.375rem]">
          Sell Your Narrowboat in Warwickshire
        </h2>
        <p className="max-w-[51.5rem] text-base leading-[26px] text-[#929292]">
          Looking to{' '}
          <a
            href="https://theboatbrokers.co.uk/selling/"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            sell your narrowboat in Warwickshire
          </a>
          ? We handle the entire process from free valuation to completed sale, with no upfront
          costs and no fees unless your boat sells.
        </p>
        <div className="mt-2 flex items-center gap-3 text-xs tracking-[0.5px] text-blue uppercase">
          <span>01</span>
          <img
            src={buyingProcessArrow}
            alt=""
            aria-hidden="true"
            className="h-4 w-[30rem] object-contain"
          />
          <span>06</span>
        </div>
      </div>

      <div className="grid w-full max-w-[78.5rem] grid-cols-1 divide-y divide-[#e5e7eb] rounded-2xl border border-[#e5e7eb] sm:grid-cols-2 sm:divide-x">
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
              <span className="font-display shrink-0 text-[5rem] leading-none text-blue-active transition-colors duration-200 group-hover:text-[#169acc] sm:text-[7.5rem]">
                {step.number}
              </span>
            </div>
          </div>
        ))}
      </div>

      <a
        href="/selling"
        className="inline-flex items-center gap-1.5 rounded-xl bg-[#0d5673] px-5 py-3 text-base font-semibold text-white shadow-btn transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.98]"
      >
        Book a Free Valuation
        <img src={arrowRightWhite} alt="" aria-hidden="true" className="size-[18px]" />
      </a>
    </section>
  )
}
