import { useState } from 'react'
import plus from '../../assets/icons/plus.svg'
import arrowRightWhite from '../../assets/icons/arrow-right-dark.svg'

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
      "When purchasing a used narrowboat, it's essential to thoroughly inspect its condition. Check for signs of wear and tear, examine the hull for any damage or leaks, assess the engine's performance, inspect the electrical and plumbing systems, and ensure all necessary documents, such as boat safety certificates, are up to date. It's advisable to enlist the expertise of a marine surveyor to conduct a comprehensive inspection.",
  },
  {
    question: 'How do I choose the right narrowboat for me?',
    answer:
      'Selecting the right narrowboat depends on various factors such as your budget, intended use, size requirements, and preferred features. Consider your cruising plans, number of occupants, and desired amenities when making your decision. It’s also beneficial to visit boat shows or consult with experienced narrowboat owners for valuable insights.',
  },
  {
    question: 'What is a boat safety certificate, and do I need one?',
    answer:
      'A boat safety certificate, also known as a BSS certificate, is a document that verifies the safety standards of a narrowboat. It ensures compliance with essential safety regulations for gas, electrical systems, ventilation, fire safety, and more. If you plan to use your narrowboat on the inland waterways, a valid boat safety certificate is generally required.',
  },
]

type FaqProps = {
  hideHeader?: boolean
  singleColumn?: boolean
  hideCta?: boolean
  ctaText?: string
  mobileLeftAlign?: boolean
}

export default function Faq({
  hideHeader = false,
  singleColumn = false,
  hideCta = false,
  ctaText = 'View More FAQs',
  mobileLeftAlign = false,
}: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index))
  }

  const left = faqs.slice(0, 2)
  const right = faqs.slice(2)

  const renderItem = (faq: FaqItem, index: number) => {
    const isOpen = openIndex === index

    if (singleColumn) {
      return (
        <div key={faq.question} className="w-full overflow-hidden rounded-b-lg bg-white">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 self-stretch rounded-t-lg border-none bg-white p-6 text-left"
            onClick={() => toggle(index)}
            aria-expanded={isOpen}
          >
            <span
              className={`max-w-[41.875rem] font-display text-2xl leading-[130%] font-normal capitalize ${
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
              <p className="text-base leading-[1.5] text-text-body">{faq.answer}</p>
            </div>
          )}
        </div>
      )
    }

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

  const renderMobileItem = (faq: FaqItem, index: number) => {
    const isOpen = openIndex === index
    return (
      <div key={faq.question} className="w-full py-5 first:pt-0">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-4 border-none bg-transparent p-0 text-left"
          onClick={() => toggle(index)}
          aria-expanded={isOpen}
        >
          <span
            className={`font-display text-xl leading-[1.3] capitalize ${
              isOpen ? 'text-[#0b3a58]' : 'text-[#020f17]'
            }`}
          >
            {faq.question}
          </span>
          <img
            src={plus}
            alt=""
            aria-hidden="true"
            className={`size-5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
          />
        </button>
        {isOpen && (
          <div className="pt-4">
            <p className="text-sm leading-[1.6] text-text-body">{faq.answer}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <section className="flex flex-col items-center gap-12 py-16 lg:py-24">
      {!hideHeader && (
        <div
          className={`flex w-full max-w-[34.25rem] flex-col gap-6 ${
            mobileLeftAlign
              ? 'items-start text-left sm:items-center sm:text-center'
              : 'items-center text-center'
          }`}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e3f7fe] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-[#14b2ef] uppercase">
            <span className="size-2 rounded-full bg-blue" />
            FAQ
          </span>
          <h2
            className={`text-[#020f17] capitalize ${
              mobileLeftAlign
                ? 'max-w-[21.875rem] font-display text-[34px] leading-[1.2] tracking-[-2px] sm:max-w-none sm:font-accent sm:text-[3.5rem] sm:tracking-[-0.07rem]'
                : 'font-accent text-[2.5rem] leading-[1.2] tracking-[-0.07rem] sm:text-[3.5rem]'
            }`}
          >
            Frequently Asked Question{mobileLeftAlign ? 's' : ''}
          </h2>
        </div>
      )}

      {mobileLeftAlign && (
        <div className="flex w-full max-w-[80rem] flex-col sm:hidden">
          {faqs.map((faq, i) => renderMobileItem(faq, i))}
        </div>
      )}

      {singleColumn ? (
        <div
          className={`w-full max-w-[80rem] flex-col gap-4 ${mobileLeftAlign ? 'hidden sm:flex' : 'flex'}`}
        >
          {faqs.map((faq, i) => renderItem(faq, i))}
        </div>
      ) : (
        <div
          className={`w-full max-w-[75rem] flex-wrap items-start gap-6 ${
            mobileLeftAlign ? 'hidden sm:flex' : 'flex'
          }`}
        >
          <div className="flex min-w-72 flex-1 flex-col gap-6" style={{ flexBasis: '22rem' }}>
            {left.map((faq, i) => renderItem(faq, i))}
          </div>
          <div className="flex min-w-72 flex-1 flex-col gap-6" style={{ flexBasis: '22rem' }}>
            {right.map((faq, i) => renderItem(faq, i + left.length))}
          </div>
        </div>
      )}

      {!hideCta && (
        <button
          type="button"
          className={`inline-flex items-center gap-1.5 rounded-xl border-none bg-navy-dark px-5 py-3 text-base font-semibold text-white shadow-btn ${
            mobileLeftAlign ? '-mt-8 self-start sm:mt-0 sm:self-auto' : ''
          }`}
        >
          {ctaText}
          <img src={arrowRightWhite} alt="" aria-hidden="true" className="size-[18px]" />
        </button>
      )}
    </section>
  )
}
