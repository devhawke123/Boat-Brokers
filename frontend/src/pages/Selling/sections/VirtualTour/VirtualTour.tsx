import { useState } from 'react'
import tourVideoThumb from '../../../../assets/tour-video-thumb.png'
import tourLivingRoom from '../../../../assets/tour-living-room.png'
import tourBed from '../../../../assets/tour-bed.png'
import tourKitchen from '../../../../assets/tour-kitchen.png'
import tourDivider from '../../../../assets/icons/tour-divider.svg'
import playIcon from '../../../../assets/icons/play.svg'
import arrowDark from '../../../../assets/icons/arrow-right-white.svg'
import arrowLight from '../../../../assets/icons/arrow-right-dark2.svg'

const gallery = [
  { src: tourLivingRoom, label: 'Living Room' },
  { src: tourBed, label: 'Bed' },
  { src: tourKitchen, label: 'Kitchen' },
]

export default function VirtualTour() {
  const [active, setActive] = useState(0)

  const goPrev = () => setActive((i) => (i - 1 + gallery.length) % gallery.length)
  const goNext = () => setActive((i) => (i + 1) % gallery.length)

  return (
    <section className="px-6 sm:px-16">
      <div className="mx-auto flex w-full max-w-[80rem] flex-col items-center gap-12 rounded-2xl bg-navy-darkest px-6 py-16 sm:px-[3.75rem] sm:py-[7.5rem]">
        <div className="flex w-full flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-[7.5rem]">
          <div className="flex flex-1 flex-col items-start gap-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(108,214,255,0.22)] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-blue-light uppercase">
              <span className="size-2 rounded-full bg-blue-light" />
              3D Tour
            </span>

            <h2 className="font-display text-[34px] leading-[1.3] tracking-[-2px] text-white capitalize sm:text-[3.375rem]">
              3D virtual tour
            </h2>

            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-6">
                <span className="font-display text-[34px] leading-[1.3] tracking-[-2px] text-white sm:text-[3.375rem]">
                  01
                </span>
                <img src={tourDivider} alt="" aria-hidden="true" className="h-px w-28" />
              </div>
              <h4 className="font-display text-[1.5rem] leading-[1.3] tracking-[-2px] text-white capitalize sm:text-[2.125rem]">
                Preview the boat without leaving your house
              </h4>
              <p className="max-w-[36.5rem] text-base leading-[26px] text-[#c0c0c0]">
                How many times have you seen pictures, travelled to view a boat and it was not how
                you thought it would be?
              </p>
            </div>

            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-6">
                <span className="font-display text-[34px] leading-[1.3] tracking-[-2px] text-white sm:text-[3.375rem]">
                  02
                </span>
                <img src={tourDivider} alt="" aria-hidden="true" className="h-px w-28" />
              </div>
              <h4 className="font-display text-[1.5rem] leading-[1.3] tracking-[-2px] text-white capitalize sm:text-[2.125rem]">
                Stop! Pre-view the boat without leaving your house with our virtual tours.
              </h4>
              <div className="flex max-w-[40rem] flex-col gap-4 text-base leading-[26px] text-[#c0c0c0]">
                <p>It&rsquo;s not always simple to find the time to view boats due to busy schedules.</p>
                <p>
                  In order to make your life easier, we&rsquo;ve created virtual tours of the
                  boat, so you may virtually explore each one room by room from the comfort of
                  your home at a time that suits you.
                </p>
                <p>
                  Even while we still encourage you to come and see us, feel free to relax and
                  view the boat by clicking on the virtual tour in the gallery below by clicking
                  the play icon.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="group relative flex h-[26rem] w-full max-w-[31.875rem] shrink-0 items-center justify-center overflow-hidden rounded-xl lg:w-[31.875rem]"
          >
            <img
              src={tourVideoThumb}
              alt="Narrowboat interior virtual tour preview"
              className="absolute inset-0 size-full object-cover"
            />
            <img
              src={playIcon}
              alt=""
              aria-hidden="true"
              className="relative size-24 transition-transform duration-150 group-hover:scale-105"
            />
          </button>
        </div>

        <div className="flex w-full items-center gap-6 overflow-x-auto sm:gap-8">
          <div className="flex shrink-0 flex-col items-center justify-center gap-6">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous room"
              className="flex items-center justify-center rounded-full bg-[#0d5673] p-3.5"
            >
              <img src={arrowLight} alt="" aria-hidden="true" className="size-[1.375rem] rotate-180" />
            </button>
            <span className="font-display text-[1.75rem] tracking-[-1px] text-white">
              {String(active + 1).padStart(2, '0')}/{String(gallery.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next room"
              className="flex items-center justify-center rounded-full bg-white p-3.5"
            >
              <img src={arrowDark} alt="" aria-hidden="true" className="size-[1.375rem]" />
            </button>
          </div>

          <div className="grid flex-1 grid-cols-3 gap-4">
            {gallery.map((item, index) => (
              <div
                key={item.label}
                className={`relative h-[15.25rem] w-full overflow-hidden rounded-[9px] transition-[outline] ${
                  index === active ? 'outline outline-2 outline-offset-2 outline-blue' : ''
                }`}
              >
                <img src={item.src} alt={item.label} className="absolute inset-0 size-full object-cover" />
                <span className="absolute top-[19px] left-1/2 -translate-x-1/2 rounded-full bg-white px-3.5 py-2 font-display text-base whitespace-nowrap text-black capitalize">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
