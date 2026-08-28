import arrowRightExplore from '../../../../assets/icons/arrow-right-explore.svg'
import ellipseIcon from '../../../../assets/icons/Ellipse 6.svg'
import Button from '../../../../components/Button/Button'

type Step = {
  number: string
  title: string
  description: string
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Search',
    description: "Firstly, search our website to find a boat that's suits your needs.",
  },
  {
    number: '02',
    title: 'Register',
    description:
      "If you don't see something you like be sure to register here and we'll inform you of any boats that match your criteria.",
  },
  {
    number: '03',
    title: 'Get in touch',
    description:
      "We can't get everything about a boat on the sales particulars. So, if you see a boat you like, then it's best to get in touch.",
  },
  {
    number: '04',
    title: 'Viewing',
    description:
      'This could be the boat for you. So why not arrange a viewing. We will always accompany you on a visit.',
  },
  {
    number: '05',
    title: 'Make an offer',
    description:
      "So, you've viewed the boat you want now it's time to get serious and make an offer. Offers are made subject to survey.",
  },
  {
    number: '06',
    title: 'Deposit',
    description:
      'If your offer is accepted, you pay a 5% deposit which secures the sale, prevents further bids and takes the boat off the market.',
  },
  {
    number: '07',
    title: 'Survey',
    description:
      'We will wait to have the survey back in writing before we talk through the technical stuff and agree next steps.',
  },
  {
    number: '08',
    title: 'Completion',
    description:
      'Once all parties agree and the final price is re-confirmed, all that remains is for you to pay the balance and take ownership.',
  },
]

export default function BuyingProcessSteps() {
  return (
    <section className="flex flex-col items-center gap-12 px-6 py-16 sm:px-16 sm:py-24">
      <div className="flex max-w-[42rem] flex-col items-center gap-3 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#e3f7fe] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-[#14b2ef] uppercase">
          <span className="size-2 rounded-full bg-blue" />
          Buying Process
        </span>
        <h2 className="font-display text-[34px] leading-[1.3] tracking-[-2px] text-ink capitalize sm:text-[3.375rem]">
          The Narrowboat Will Choose You, Rather Than The Other Way
        </h2>
        <p className="max-w-[33rem] text-base leading-[26px] text-[#929292]">
          At The Boat Brokers, we specialise in narrowboat sales, blending modern technology with
          personal service.
        </p>
        <div className="mt-2 flex items-center gap-3 text-xs tracking-[0.5px] text-blue uppercase">
          <span>01</span>
          <svg
            viewBox="0 0 217.002 14.7279"
            fill="none"
            aria-hidden="true"
            className="h-3.5 w-32 text-black transition-colors duration-200 hover:text-blue sm:w-54"
          >
            <path
              d="M216.709 8.07107C217.1 7.68054 217.1 7.04738 216.709 6.65685L210.345 0.292893C209.955 -0.097631 209.322 -0.097631 208.931 0.292893C208.541 0.683418 208.541 1.31658 208.931 1.70711L214.588 7.36396L208.931 13.0208C208.541 13.4113 208.541 14.0445 208.931 14.435C209.322 14.8256 209.955 14.8256 210.345 14.435L216.709 8.07107ZM0 7.36396V8.36396H216.002V7.36396V6.36396H0V7.36396Z"
              fill="currentColor"
            />
          </svg>
          <span>08</span>
        </div>
      </div>

      <div className="grid w-full max-w-[78.5rem] grid-cols-1 divide-y divide-[#e5e7eb] rounded-2xl border border-[#e5e7eb] sm:grid-cols-2 sm:divide-x">
        {steps.map((step) => (
          <div
            key={step.number}
            className="group flex flex-col justify-between gap-8 bg-white p-8 transition-colors duration-200 hover:bg-[#e8f9ff]"
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
            <a href="/about" className="inline-flex items-center gap-1.5 text-base text-ink">
              More About Us
              <img src={arrowRightExplore} alt="" aria-hidden="true" className="size-[18px]" />
            </a>
          </div>
        ))}
      </div>

      <Button variant="dark" label="Back to Boats for Sale" href="/boats-for-sale" />
    </section>
  )
}
