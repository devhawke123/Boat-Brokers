import { useState } from 'react'
import star from '../../assets/icons/star-gold.svg'
import arrowLeft from '../../assets/icons/arrow-left.svg'

type Testimonial = {
  quote: string
  body: string
  name: string
  date: string
}

const testimonials: Testimonial[] = [
  {
    quote: '"A Seamless Experience!"',
    body: '"Selling my boat was stress-free thanks to The Boat Brokers. They handled everything professionally and got me a great price. Highly recommend!"',
    name: 'James R., Southampton',
    date: '22 February, 2023',
  },
  {
    quote: '"Sold Faster Than Expected!"',
    body: '"I listed my boat with The Boat Brokers, and within weeks, it was sold at a price I was happy with. The team kept me informed at every step."',
    name: 'Mark W., Plymouth',
    date: '30 March, 2024',
  },
  {
    quote: '"Honest and Transparent Service"',
    body: '"I was hesitant about buying a used boat, but The Boat Brokers made the process smooth. Their honesty and attention to detail gave me complete peace of mind."',
    name: 'Emma L., Bristol',
    date: '10 January, 2024',
  },
  {
    quote: '"Professional from Start to Finish"',
    body: '"The Boat Brokers made selling my narrowboat so easy. They handled the viewings and negotiations, and I didn\'t have to worry about a thing."',
    name: 'Sarah D., Portsmouth',
    date: '02 April, 2024',
  },
  {
    quote: '"Fair Valuation and Quick Sale"',
    body: "\"The valuation was spot on, and they managed to find a buyer quickly. The service was fantastic, and I'd definitely use them again.\"",
    name: 'Lucy M., Bournemouth',
    date: '07 May, 2024',
  },
  {
    quote: '"Best Brokerage for Boat Sales"',
    body: '"I had tried selling my boat privately without success. The Boat Brokers found a serious buyer fast and handled all the paperwork effortlessly."',
    name: 'Richard K., Brighton',
    date: '10 June, 2024',
  },
  {
    quote: '"Highly Recommend!"',
    body: '"From the first call to the final sale, everything was smooth and professional. Couldn\'t be happier with the service!"',
    name: 'Chloe S., Cardiff',
    date: '12 July, 2024',
  },
  {
    quote: '"Excellent Customer Service"',
    body: '"The team went above and beyond to ensure I was happy with my purchase. They answered all my questions and even helped with after-sales support."',
    name: 'David P., Exeter',
    date: '26 August, 2024',
  },
  {
    quote: '"Stress-Free Process"',
    body: '"I expected selling my boat to be a hassle, but The Boat Brokers made it simple and quick. They are trustworthy and efficient!"',
    name: 'Alex B., Poole',
    date: '26 February, 2025',
  },
]

const pageSize = 2
const pageCount = Math.ceil(testimonials.length / pageSize)

export default function Testimonials() {
  const [page, setPage] = useState(0)

  const start = page * pageSize
  const showPair = testimonials.slice(start, start + pageSize)
  const canPrev = page > 0
  const canNext = page < pageCount - 1

  const goPrev = () => setPage((current) => Math.max(0, current - 1))
  const goNext = () => setPage((current) => Math.min(pageCount - 1, current + 1))

  return (
    <section className="section flex flex-col items-center gap-8 short:gap-4 rounded-2xl bg-navy-darkest px-section-x sm:gap-12">
      <div className="flex max-w-[36.375rem] flex-col items-center gap-4 short:gap-2 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[linear-gradient(45deg,rgba(108,214,255,0.30)_0%,rgba(108,214,255,0.18)_50%,rgba(108,214,255,0.10)_100%)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md px-4 py-1.5 text-label font-medium text-blue-light uppercase">
          <span className="size-2 rounded-full bg-blue-light" />
          Testimonial
        </span>
        <h2 className="font-display text-h2 text-frost capitalize">
          What Our Clients Say About Their Boats
        </h2>
        <p className="text-body-sm text-text-muted sm:text-body">
          Explore our handpicked selection of quality narrowboats, carefully chosen for their
          character, condition, and value.
        </p>
      </div>

      <div className="grid min-h-[22rem] w-full grid-cols-1 items-stretch gap-8 sm:min-h-[26rem] sm:grid-cols-2">
        {showPair.map((testimonial) => (
          <article
            key={testimonial.name}
            className="flex min-h-[22rem] w-full flex-col gap-6 rounded-xl border border-navy-dark bg-[rgba(17,73,96,0.59)] p-6 sm:min-h-[26rem] sm:gap-10 sm:p-8"
          >
            <div className="flex items-center gap-1" aria-hidden="true">
              <img src={star} alt="" className="size-[18px]" />
              <img src={star} alt="" className="size-[18px]" />
              <img src={star} alt="" className="size-[18px]" />
              <img src={star} alt="" className="size-[18px]" />
              <img src={star} alt="" className="size-[18px]" />
            </div>
            <p className="font-accent text-[17px] leading-[1.2] text-frost sm:text-[1.3125rem]">
              {testimonial.quote}
            </p>
            <p className="flex-1 text-body-sm font-light text-[#81a1b4] sm:text-base">{testimonial.body}</p>
            <div className="mt-auto flex flex-col gap-2">
              <p className="font-accent text-[17px] text-frost sm:text-[1.3125rem]">{testimonial.name}</p>
              <p className="text-xs font-light text-[#4eceff] sm:text-sm">{testimonial.date}</p>
            </div>
          </article>
        ))}
        {showPair.length === 1 && <div className="hidden min-h-[26rem] sm:block" aria-hidden="true" />}
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          className={`flex h-8 w-9 items-center justify-center rounded-md sm:h-10 sm:w-12 sm:rounded-lg ${
            canPrev ? 'bg-blue' : 'cursor-not-allowed bg-text-muted opacity-40'
          }`}
          onClick={goPrev}
          disabled={!canPrev}
          aria-label="Previous testimonials"
        >
          <img src={arrowLeft} alt="" aria-hidden="true" className="size-4 sm:size-6" />
        </button>
        <div className="flex w-20 flex-col items-center gap-2 sm:w-[6.1875rem]">
          <p className="font-accent text-xl text-blue sm:text-[1.875rem]">
            {String(page + 1).padStart(2, '0')}{' '}
            <span className="text-sm text-text-muted">/ {pageCount}</span>
          </p>
          <div className="flex w-full items-center gap-[3px]">
            {Array.from({ length: pageCount }, (_, i) => (
              <span
                key={i}
                className={`h-0.5 flex-1 rounded-full bg-blue ${i === page ? 'opacity-100' : 'opacity-[0.16]'}`}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          className={`flex h-8 w-9 items-center justify-center rounded-md sm:h-10 sm:w-12 sm:rounded-lg ${
            canNext ? 'bg-blue' : 'cursor-not-allowed bg-text-muted opacity-40'
          }`}
          onClick={goNext}
          disabled={!canNext}
          aria-label="Next testimonials"
        >
          <img src={arrowLeft} alt="" aria-hidden="true" className="size-4 rotate-180 sm:size-6" />
        </button>
      </div>
    </section>
  )
}
