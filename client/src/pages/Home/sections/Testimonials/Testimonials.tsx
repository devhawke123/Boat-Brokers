import { useState } from 'react'
import star from '../../../../assets/icons/star.svg'
import arrowLeft from '../../../../assets/icons/arrow-left.svg'

type Testimonial = {
  quote: string
  body: string
  name: string
  date: string
}

const testimonials: Testimonial[] = [
  {
    quote: '"Fair Valuation and Quick Sale"',
    body: "\"The valuation was spot on, and they managed to find a buyer quickly. The service was fantastic, and I'd definitely use them again.\"",
    name: 'Lucy M., Bournemouth',
    date: '07 May, 2024',
  },
  {
    quote: '"Highly Recommend!"',
    body: '"From the first call to the final sale, everything was smooth and professional. Couldn\'t be happier with the service!"',
    name: 'Chloe S., Cardiff',
    date: '12 July, 2024',
  },
  {
    quote: '"Smooth From Start To Finish"',
    body: '"The team kept us updated every step of the way. Selling our narrowboat has never been this easy."',
    name: 'James T., Bristol',
    date: '03 September, 2024',
  },
]

const total = testimonials.length

export default function Testimonials() {
  const [index, setIndex] = useState(0)

  const showPair = [testimonials[index], testimonials[(index + 1) % total]]

  const goPrev = () => setIndex((current) => (current - 1 + total) % total)
  const goNext = () => setIndex((current) => (current + 1) % total)

  return (
    <section className="flex flex-col items-center gap-12 rounded-2xl bg-navy-darkest px-6 py-20 sm:px-16">
      <div className="flex max-w-[36.375rem] flex-col items-center gap-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(108,214,255,0.22)] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-blue-light uppercase">
          <span className="size-2 rounded-full bg-blue-light" />
          Testimonial
        </span>
        <h2 className="font-accent text-[2.25rem] leading-[1.2] text-[#f8fcff] sm:text-[3rem]">
          What Our Clients Say About Their Boats
        </h2>
      </div>

      <div className="flex w-full flex-wrap justify-center gap-8">
        {showPair.map((testimonial) => (
          <article
            key={testimonial.name}
            className="flex min-w-72 max-w-[38.125rem] flex-1 flex-col gap-10 rounded-xl border border-[#0d5673] bg-[rgba(17,73,96,0.59)] p-8"
          >
            <div className="flex items-center gap-1" aria-hidden="true">
              <img src={star} alt="" className="size-[18px]" />
              <img src={star} alt="" className="size-[18px]" />
              <img src={star} alt="" className="size-[18px]" />
              <img src={star} alt="" className="size-[18px]" />
              <img src={star} alt="" className="size-[18px]" />
            </div>
            <p className="font-accent text-[1.3125rem] leading-[1.2] text-[#f8fcff]">{testimonial.quote}</p>
            <p className="text-base leading-[1.5] font-light text-[#81a1b4]">{testimonial.body}</p>
            <div className="flex flex-col gap-2">
              <p className="font-accent text-[1.3125rem] text-[#f8fcff]">{testimonial.name}</p>
              <p className="text-sm font-light text-[#4eceff]">{testimonial.date}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="flex h-10 w-12 items-center justify-center rounded-lg bg-[#a7a7a7]"
          onClick={goPrev}
          aria-label="Previous testimonial"
        >
          <img src={arrowLeft} alt="" aria-hidden="true" className="size-6" />
        </button>
        <div className="flex w-[6.1875rem] flex-col items-center gap-2">
          <p className="font-accent text-[1.875rem] text-blue">
            {String(index + 1).padStart(2, '0')} <span className="text-sm text-[#a7a7a7]">/ {total}</span>
          </p>
          <div className="flex w-full items-center gap-[3px]">
            {testimonials.map((testimonial, i) => (
              <span
                key={testimonial.name}
                className={`h-0.5 flex-1 rounded-full bg-blue ${i === index ? 'opacity-100' : 'opacity-[0.16]'}`}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          className="flex h-10 w-12 items-center justify-center rounded-lg bg-blue"
          onClick={goNext}
          aria-label="Next testimonial"
        >
          <img src={arrowLeft} alt="" aria-hidden="true" className="size-6 rotate-180" />
        </button>
      </div>
    </section>
  )
}
