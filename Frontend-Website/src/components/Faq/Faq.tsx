import { useState } from 'react'
import plus from '../../assets/icons/plus.svg'
import arrowRightWhite from '../../assets/icons/arrow-right-white.svg'
import Button from '../Button/Button'
import { faqs, type FaqItem } from '../../data/faqs'

type FaqProps = {
  hideHeader?: boolean
  singleColumn?: boolean
  hideCta?: boolean
}

export default function Faq({ hideHeader = false, singleColumn = false, hideCta = false }: FaqProps) {
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
              className={`max-w-[41.875rem] font-display text-h6 font-normal capitalize ${
                isOpen ? 'text-navy-dark' : 'text-ink'
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
              <p className="text-body text-text-body">{faq.answer}</p>
            </div>
          )}
        </div>
      )
    }

    return (
      <div key={faq.question} className="w-full overflow-hidden rounded-lg bg-transparent sm:bg-white">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-4 border-none bg-transparent px-0 py-6 text-left sm:p-6"
          onClick={() => toggle(index)}
          aria-expanded={isOpen}
        >
          <span
            className={`font-display text-[20px] leading-[1.3] tracking-[-1px] capitalize sm:text-h6 sm:leading-normal sm:tracking-normal ${
              isOpen ? 'text-navy-dark' : 'text-ink'
            }`}
          >
            {faq.question}
          </span>
          <img
            src={plus}
            alt=""
            aria-hidden="true"
            className={`size-[22px] shrink-0 transition-transform duration-200 sm:size-7 ${isOpen ? 'rotate-45' : ''}`}
          />
        </button>
        {isOpen && (
          <div className="px-0 pb-6 sm:px-6">
            <p className="text-body-sm text-text-body">{faq.answer}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <section className="section flex flex-col items-start gap-8 sm:items-center sm:gap-12 short:gap-6">
      {!hideHeader && (
        <div className="flex max-w-full flex-col items-start gap-6 text-left short:gap-3 sm:max-w-[34.25rem] sm:items-center sm:text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-badge-bg px-4 py-1.5 text-label font-medium text-badge-text uppercase">
            <span className="size-2 rounded-full bg-blue" />
            FAQ
          </span>
          <h2 className="font-accent text-cta text-ink">
            Frequently Asked Questions
          </h2>
        </div>
      )}

      {singleColumn ? (
        <div className="flex w-full max-w-[80rem] flex-col gap-4">
          {faqs.map((faq, i) => renderItem(faq, i))}
        </div>
      ) : (
        <div className="flex w-full max-w-[75rem] flex-wrap items-start gap-0 sm:gap-6">
          <div className="flex min-w-72 flex-1 flex-col gap-0 sm:gap-6" style={{ flexBasis: '22rem' }}>
            {left.map((faq, i) => renderItem(faq, i))}
          </div>
          <div className="flex min-w-72 flex-1 flex-col gap-0 sm:gap-6" style={{ flexBasis: '22rem' }}>
            {right.map((faq, i) => renderItem(faq, i + left.length))}
          </div>
        </div>
      )}

      {!hideCta && (
        <div>
          <Button
          
          label=" View More FAQs"
          href= "/faq"
          className="inline-flex items-center gap-1.5 rounded-xl border-none bg-navy-dark px-5 py-3 text-base font-semibold text-white shadow-btn"
        >
         

          <img src={arrowRightWhite} alt="" aria-hidden="true" className="size-[18px]" />
        </Button></div>
        
      )}
    </section>
  )
}
