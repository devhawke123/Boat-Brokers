import arrowRightExplore from '../../../../assets/icons/arrow-right-explore.svg'
import ellipseIcon from '../../../../assets/Ellipse 6.png'
import Button from '../../../../components/Button/Button'

type Step = {
  number: string
  title: string
  description: string
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Boat Valuation',
    description:
      "We will assess the boat's condition, specifications, and market value. We'll also take photos and gather relevant documentation to create an attractive listing.",
  },
  {
    number: '02',
    title: 'Marketing and Advertising',
    description:
      "We employ various marketing strategies to generate interest in your boat. We'll advertise through websites, social media, boat shows, and other relevant platforms to reach a wider audience of potential buyers.",
  },
  {
    number: '03',
    title: 'Buyer Screening',
    description:
      "When potential buyers express interest in your particular boat, we'll conduct a screening process to ensure they are qualified and serious buyers.",
  },
  {
    number: '04',
    title: 'Viewing',
    description:
      "We'll arrange for serious buyers. Answer any questions and provide additional information and handle any negotiations.",
  },
  {
    number: '05',
    title: 'Negotiations and Offers',
    description:
      "If a buyer is interested in purchasing the boat, we will help facilitate negotiations. We'll relay offers and counteroffers, assist in price discussions, and help both parties reach an agreement.",
  },
  {
    number: '06',
    title: 'Documents and Closing',
    description:
      "Once you've agreed on a price, we'll handle the necessary paperwork and documentation. This will include sales contracts, titles, registrations, and other legal requirements. We'll ensure the transaction proceeds smoothly and guides both parties through the closing process.",
  },
  {
    number: '07',
    title: 'Commission',
    description:
      'We earn our commission based on the final sale price of the boat which is deducted from the sales proceeds.',
  },
  {
    number: '08',
    title: 'Payment',
    description:
      'Once we have received cleared funds and all parties are ready to complete, we transfer funds within 24 hours.',
  },
]

export default function SellingProcessSteps() {
  return (
    <section className="flex flex-col items-center gap-12 px-6 py-16 sm:px-16 sm:py-24">
      <div className="flex max-w-[42rem] flex-col items-center gap-3 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#e3f7fe] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-[#14b2ef] uppercase">
          <span className="size-2 rounded-full bg-blue" />
          Selling Process
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
            viewBox="0 0 217 15"
            fill="none"
            aria-hidden="true"
            className="h-4 w-[13.5rem] text-[#6e6e6e] transition-colors duration-200 hover:text-blue"
          >
            <path
              d="M216.709 8.07429C217.1 7.68377 217.1 7.0506 216.709 6.66008L210.345 0.29612C209.955 -0.0944047 209.322 -0.0944047 208.931 0.29612C208.541 0.686644 208.541 1.31981 208.931 1.71033L214.588 7.36719L208.931 13.024C208.541 13.4146 208.541 14.0477 208.931 14.4383C209.322 14.8288 209.955 14.8288 210.345 14.4383L216.709 8.07429ZM0 7.36719V8.36719H216.002V7.36719V6.36719H0V7.36719Z"
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
