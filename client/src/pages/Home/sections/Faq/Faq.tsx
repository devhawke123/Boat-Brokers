import { useState } from 'react'
import plus from '../../../../assets/icons/plus.svg'
import arrowRightWhite from '../../../../assets/icons/arrow-right-white.svg'

type FaqItem = {
  question: string
  answer: string
}

const faqs: FaqItem[] = [
  {
    question: 'Can I finance the purchase of a narrowboat?',
    answer:
      "Yes, there are financing options available for purchasing a narrowboat. Banks, specialized marine lenders, and narrowboat brokers can provide information on loans and financing plans tailored for boat purchases. It's advisable to compare interest rates, terms, and conditions to find the most suitable financing option for your needs.",
  },
  {
    question: 'What should I inspect before buying a used narrowboat?',
    answer:
      'Check the hull for corrosion, have a full marine survey carried out, test the engine and electrics, and review the boat safety certificate and service history before making an offer.',
  },
  {
    question: 'How do I choose the right narrowboat for me?',
    answer:
      'Think about how you plan to use the boat, how many people will be aboard, your budget, and whether you prefer a traditional, cruiser, or semi-traditional stern before shortlisting boats.',
  },
  {
    question: 'What is a boat safety certificate, and do I need one?',
    answer:
      "A Boat Safety Certificate confirms the boat's gas, electrical, and fuel systems meet safety standards. It's required by most marinas and waterway authorities and is renewed every four years.",
  },
  {
    question: 'How long does the buying process usually take?',
    answer:
      'From initial appointment to completion, most sales take between four and eight weeks, depending on surveys, financing, and mooring arrangements.',
  },
]

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index))
  }

  const left = faqs.slice(0, 2)
  const right = faqs.slice(2)

  const renderItem = (faq: FaqItem, index: number) => {
    const isOpen = openIndex === index
    return (
      <div key={faq.question} className="w-full overflow-hidden rounded-lg bg-white">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-4 border-none bg-transparent p-6 text-left"
          onClick={() => toggle(index)}
          aria-expanded={isOpen}
        >
          <span
            className={`font-display text-[1.75rem] leading-[1.3] tracking-[-1px] capitalize ${
              isOpen ? 'text-[#0b3a58]' : 'text-[#020f17]'
            }`}
          >
            {faq.question}
          </span>
          <img
            src={plus}
            alt=""
            aria-hidden="true"
            className={`size-7 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
          />
        </button>
        {isOpen && (
          <div className="px-6 pb-6">
            <p className="text-sm leading-[1.5] text-text-body">{faq.answer}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <section className="flex flex-col items-center gap-12 py-16 lg:py-24">
      <div className="flex max-w-[34.25rem] flex-col items-center gap-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#e3f7fe] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-[#14b2ef] uppercase">
          <span className="size-2 rounded-full bg-blue" />
          FAQ
        </span>
        <h2 className="font-accent text-[2.5rem] leading-[1.2] tracking-[-0.07rem] text-[#020f17] sm:text-[3.5rem]">
          Frequently Asked Question
        </h2>
      </div>

      <div className="flex w-full max-w-[75rem] flex-wrap items-start gap-6">
        <div className="flex min-w-72 flex-1 flex-col gap-6" style={{ flexBasis: '22rem' }}>
          {left.map((faq, i) => renderItem(faq, i))}
        </div>
        <div className="flex min-w-72 flex-1 flex-col gap-6" style={{ flexBasis: '22rem' }}>
          {right.map((faq, i) => renderItem(faq, i + left.length))}
        </div>
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-xl border-none bg-navy-dark px-5 py-3 text-base font-semibold text-white shadow-btn"
      >
        View More FAQs
        <img src={arrowRightWhite} alt="" aria-hidden="true" className="size-[18px]" />
      </button>
    </section>
  )
}
