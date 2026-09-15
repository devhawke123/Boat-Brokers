import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { BlogPostDetail } from '../../../../data/blogPostDetail'
import { IconChevronDown, IconClose, IconPhone } from '../../icons'

type BlogDetailContentProps = {
  post: BlogPostDetail
}

const midCta = {
  heading: 'Need a Second Opinion?',
  description: 'Want an experienced second opinion on a narrowboat survey report?',
  phone: '07960 768724',
  linkLabel: 'theboatbrokers.co.uk/buying',
}

const closingCta = {
  heading: 'Considering a Purchase?',
  description:
    'Get the clarity you need before signing. Our experts are here to help you navigate the complexities of narrowboat surveys.',
  phone: '07960 768724',
  linkLabel: 'or visit theboatbrokers.co.uk/buying',
}

const faqs = [
  {
    question: 'Can I finance the purchase of a narrowboat?',
    answer:
      "Yes, there are financing options available for purchasing a narrowboat. Banks, specialized marine lenders, and narrowboat brokers can provide information on loans and financing plans tailored for boat purchases.",
  },
  {
    question: 'What should I inspect before buying a used narrowboat?',
    answer:
      "It's essential to thoroughly inspect its condition. Check for signs of wear and tear, examine the hull for any damage or leaks, assess the engine's performance, and ensure all necessary documents, such as boat safety certificates, are up to date.",
  },
  {
    question: 'How do I choose the right narrowboat for me?',
    answer:
      'Selecting the right narrowboat depends on your budget, intended use, size requirements, and preferred features. Consider your cruising plans, number of occupants, and desired amenities when making your decision.',
  },
]

const tags = ['Narrowboat Hull Survey', 'Boat Buying Tips', 'Maintenance Guide', 'UK Canals']

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="w-full border-b border-[#e2e8f0] py-4 sm:rounded-lg sm:border sm:border-[#e5e7eb] sm:bg-white sm:p-6 sm:py-6 last:border-b-0 sm:last:border-b">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="font-display text-lg leading-[1.3] text-[#0a1f44] capitalize sm:text-xl">{question}</span>
        <IconChevronDown className={`size-4 shrink-0 text-[#6b7280] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pt-4 text-sm leading-[24px] text-[#6e6e6e] sm:text-base sm:leading-[26px]">{answer}</p>}
    </div>
  )
}

export default function BlogDetailContent({ post }: BlogDetailContentProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  useEffect(() => {
    if (!isLightboxOpen) return

    document.body.style.overflow = 'hidden'
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsLightboxOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isLightboxOpen])

  return (
    <section className="flex justify-center bg-white px-6 py-12 sm:px-12 sm:py-20 lg:px-12">
      <div className="flex w-full max-w-[87.5rem] flex-col items-center gap-10 sm:gap-16">
        {/*
          The banner crops the photo to a consistent band. Header images run
          from 0.84 (portrait) to 1.57, so a good part of most of them falls
          outside the crop — clicking opens the uncropped photo full-size.
        */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          aria-label="View full-size photo"
          className="aspect-square w-full max-w-[87.5rem] cursor-zoom-in overflow-hidden rounded-lg border-none p-0 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] sm:aspect-[1440/600]"
        >
          <img src={post.image} alt={post.title} className="size-full object-cover" />
        </button>

        <div className="flex w-full max-w-[87.5rem] flex-col gap-10 sm:gap-16 lg:flex-row lg:items-start">
          <article className="flex w-full flex-col gap-10 sm:gap-16">
            <div
              className="article-prose flex flex-col gap-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="hidden flex-col items-start justify-between gap-6 rounded-lg border-2 border-navy-dark bg-white p-10 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] sm:flex sm:flex-row sm:items-center">
              <div className="flex flex-col gap-2">
                <h4 className="font-display text-2xl text-[#0a1f44] capitalize">{midCta.heading}</h4>
                <p className="text-lg leading-[32.4px] text-[#374151]">{midCta.description}</p>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-1.5 sm:items-end">
                <a href={`tel:${midCta.phone.replace(/\s/g, '')}`} className="text-right text-xl font-bold tracking-[-0.33px] text-[#0a1f44]">
                  {midCta.phone}
                </a>
                <a href="/buying" className="text-right text-sm font-semibold tracking-[1.4px] text-navy-dark uppercase">
                  {midCta.linkLabel}
                </a>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 rounded-xl bg-[#f1f5f9] px-6 py-8 text-center sm:gap-4 sm:bg-[#f5f8fa] sm:px-12 sm:py-16">
              <h3 className="font-display text-2xl leading-[1.3] tracking-[-2px] text-black capitalize sm:text-[2.375rem]">
                {closingCta.heading}
              </h3>
              <p className="max-w-[36rem] text-sm leading-[22px] text-text-body sm:text-lg sm:leading-[28px]">{closingCta.description}</p>
              <div className="flex w-full flex-col items-center gap-3 pt-2 sm:w-auto sm:gap-4 sm:pt-4">
                <a
                  href={`tel:${closingCta.phone.replace(/\s/g, '')}`}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-navy-darkest px-10 py-4 text-base font-bold text-white sm:w-auto sm:text-lg"
                >
                  <IconPhone className="size-[18px]" />
                  {closingCta.phone}
                </a>
                <a href="/buying" className="text-xs font-semibold tracking-[1.4px] text-[#6b7280] uppercase sm:text-sm">
                  {closingCta.linkLabel}
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-6 sm:gap-10">
              <h3 className="font-display text-2xl leading-[1.3] tracking-[-2px] text-black capitalize sm:text-[3.375rem]">
                Frequently Asked Questions
              </h3>
              <div className="flex flex-col sm:gap-4">
                {faqs.map((faq) => (
                  <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#e5e7eb] bg-white px-5 py-2 text-xs font-semibold tracking-[1.2px] text-[#6b7280] uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        </div>
      </div>

      {isLightboxOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close"
              className="absolute top-section-y right-section-x flex size-10 items-center justify-center rounded-full border-none bg-transparent text-white transition-colors hover:bg-white/10"
            >
              <IconClose className="size-6" />
            </button>

            <img
              src={post.image}
              alt={post.title}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[90vw] cursor-default rounded-lg object-contain shadow-2xl"
            />
          </div>,
          document.body,
        )}
    </section>
  )
}
