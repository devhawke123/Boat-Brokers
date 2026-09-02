import { useState } from 'react'
import anchorIcon from '../../../../assets/icons/anchor.svg'
import nextArrowIcon from '../../../../assets/icons/arrow-right-dark2.svg'
import checkIcon from '../../../../assets/icons/check-blue.svg'
import quoteIcon from '../../../../assets/icons/minimumfee.svg'

type GuideStep = {
  label: string
  title: string
  items: { heading: string; description: string }[]
}

const steps: GuideStep[] = [
  {
    label: 'Market Value',
    title: 'Determine the Market Value',
    items: [
      {
        heading: 'Research the market:',
        description:
          "We'll start by researching the current market trends and prices for narrowboats similar to yours. We consider factors such as age, condition, size, equipment, and location. Get a professional appraisal: Your Boat Brokers broker is a professional and will assess your boat's value. Their expertise will help you set a realistic asking price.",
      },
    ],
  },
  {
    label: 'Prepare',
    title: 'Prepare Your Boat',
    items: [
      {
        heading: 'Get it viewing-ready:',
        description:
          "Give the boat a thorough clean inside and out and complete any minor repairs. We'll gather documentation such as your service history, Boat Safety Certificate, and engine logs so everything is ready for photography and viewings.",
      },
    ],
  },
  {
    label: 'Documentation',
    title: 'Gather Your Documentation',
    items: [
      {
        heading: 'Collect the paperwork:',
        description:
          'Proof of ownership, Boat Safety Certificate, insurance details, engine and equipment manuals, and any warranty information should all be collected in advance so the sale can proceed smoothly once a buyer is found.',
      },
    ],
  },
  {
    label: 'Listing',
    title: 'Create Your Listing',
    items: [
      {
        heading: 'Show your boat at its best:',
        description:
          "We'll photograph and video your boat and write a detailed description highlighting its features and condition, before listing it across our website and partner platforms.",
      },
    ],
  },
  {
    label: 'Advertise',
    title: 'Advertise to the Right Buyers',
    items: [
      {
        heading: 'Get seen in the right places:',
        description:
          'Your listing is promoted across online marketplaces, social media, boating forums, publications, and marinas to reach as wide an audience of serious buyers as possible.',
      },
    ],
  },
  {
    label: 'Enquiries',
    title: 'Manage Buyer Enquiries',
    items: [
      {
        heading: 'Leave it to us:',
        description:
          "We handle all enquiries on your behalf, qualifying interested buyers, arranging viewings, and keeping you updated on interest and offers every step of the way.",
      },
    ],
  },
  {
    label: 'Closing',
    title: 'Close the Sale',
    items: [
      {
        heading: 'Complete with confidence:',
        description:
          'Once a buyer is confirmed, we handle the paperwork, negotiate terms, and ensure funds are transferred securely before handing over the keys.',
      },
    ],
  },
]

export default function SellingGuide() {
  const [current, setCurrent] = useState(0)
  const step = steps[current]
  const isFirst = current === 0
  const isLast = current === steps.length - 1

  return (
    <section className="flex flex-col items-center gap-12 rounded-3xl bg-[#f5f8fa] px-6 py-16 sm:px-16 sm:py-24">
      <div className="flex max-w-[61.25rem] flex-col items-center gap-3 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#e3f7fe] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-[#14b2ef] uppercase">
          <span className="size-2 rounded-full bg-blue" />
          Guide to Selling
        </span>
        <h2 className="font-display text-[34px] leading-[1.3] tracking-[-2px] text-ink capitalize sm:text-[3.375rem]">
          The Boat Brokers Guide
          <br />
          to Selling a Boat
        </h2>
        <p className="max-w-[45rem] text-base leading-[26px] text-[#64798c] sm:text-lg">
          Selling a narrowboat can be an exciting and rewarding experience. Whether you&rsquo;re
          upgrading to a new boat or moving on from the narrowboat lifestyle, it&rsquo;s essential
          to approach the selling process with careful planning and preparation. Our guide aims to
          provide you with a step-by-step overview of the key considerations and actions required
          to successfully sell your narrowboat.
        </p>
      </div>

      <div className="w-full max-w-[61.25rem] overflow-x-auto pb-2">
        <div className="relative flex min-w-[42rem] items-start justify-between px-2">
          <div className="absolute top-5 right-6 left-6 h-0.5 bg-[#e5e7eb]" />
          {steps.map((s, index) => {
            const isActive = index === current
            const isDone = index < current
            return (
              <button
                key={s.label}
                type="button"
                onClick={() => setCurrent(index)}
                className="relative flex w-24 flex-col items-center gap-4"
              >
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full text-base font-bold ${
                    isActive || isDone
                      ? 'bg-navy-dark text-white ring-4 ring-[#f5f8fa] ring-offset-2 ring-offset-navy-dark'
                      : 'border-2 border-[#e5e7eb] bg-white text-[#9ca3af]'
                  }`}
                >
                  {index + 1}
                </span>
                <span
                  className={`text-center text-xs font-bold tracking-[0.6px] uppercase ${
                    isActive || isDone ? 'text-navy-dark' : 'font-medium text-[#9ca3af]'
                  }`}
                >
                  {s.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="w-full max-w-[45rem] overflow-hidden rounded-[22px] border border-[rgba(11,58,88,0.05)] bg-white shadow-[0px_40px_80px_-20px_rgba(11,58,88,0.12)]">
        <div className="flex items-center gap-6 border-b border-[#f3f4f6] px-8 pt-8 pb-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#0b3a58_0%,#082b42_100%)]">
            <img src={anchorIcon} alt="" aria-hidden="true" className="size-8" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold tracking-[1.2px] text-[#64798c] uppercase">
              Step {current + 1} of {steps.length}
            </span>
            <h3 className="font-display text-2xl leading-[1.3] tracking-[-2px] text-navy-dark capitalize sm:text-[2.125rem]">
              {step.title}
            </h3>
          </div>
        </div>

        <div className="flex flex-col gap-6 px-8 pt-4 pb-8">
          {step.items.map((item) => (
            <div key={item.heading} className="flex items-start gap-6">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[rgba(28,192,255,0.1)] text-sm font-bold text-blue">
                1
              </span>
              <div className="flex flex-col gap-2">
                <h4 className="font-display text-xl text-navy-dark capitalize">{item.heading}</h4>
                <p className="text-base leading-[26px] text-[#64798c]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-[#f3f4f6] bg-[#fcfdfe] px-8 py-6">
          <button
            type="button"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={isFirst}
            className={`rounded-full border border-[#e5e7eb] px-8 py-3 text-base font-semibold tracking-[0.3px] ${
              isFirst ? 'cursor-not-allowed text-[#d1d5db]' : 'text-[#9ca3af] hover:text-navy-dark'
            }`}
          >
            Back
          </button>
          <span className="text-sm font-bold tracking-[-0.04px] text-[#64798c]">
            {current + 1} / {steps.length}
          </span>
          <button
            type="button"
            onClick={() => setCurrent((c) => Math.min(steps.length - 1, c + 1))}
            disabled={isLast}
            className={`inline-flex items-center gap-3 rounded-full px-10 py-3 text-base font-semibold tracking-[0.25px] text-white ${
              isLast ? 'cursor-not-allowed bg-[#9ca3af]' : 'bg-navy-dark hover:opacity-90'
            }`}
          >
            Next
            <img src={nextArrowIcon} alt="" aria-hidden="true" className="size-3" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <span className="inline-flex items-center gap-2 self-stretch rounded-full border border-[rgba(11,58,88,0.08)] bg-white px-4 py-2 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
          <img src={checkIcon} alt="" aria-hidden="true" className="h-3 w-[10.5px]" />
          <span className="text-[13px] font-medium text-navy-dark">Expert Market Insights</span>
        </span>
        <span className="inline-flex items-center gap-2 self-stretch rounded-full border border-[rgba(11,58,88,0.08)] bg-white px-4 py-2 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
          <img src={quoteIcon} alt="" aria-hidden="true" className="h-4 w-3" />
          <span className="text-[13px] font-medium text-navy-dark">No Obligation Quote</span>
        </span>
      </div>
    </section>
  )
}
