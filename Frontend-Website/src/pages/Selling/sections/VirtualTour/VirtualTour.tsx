import { useState } from 'react'
import tourVideoThumb from '../../../../assets/tour-video-thumb.png'
import tourLivingRoom from '../../../../assets/tour-living-room.png'
import tourBed from '../../../../assets/tour-bed.png'
import tourKitchen from '../../../../assets/tour-kitchen.png'
import tourDivider from '../../../../assets/icons/tour-divider.svg'
import playIcon from '../../../../assets/icons/play.svg'
import arrowDark from '../../../../assets/icons/arrow-right-blue.svg'
import arrowLight from '../../../../assets/icons/arrow-right-white2.svg'

const gallery = [
  { src: tourLivingRoom, label: 'Living Room' },
  { src: tourBed, label: 'Bed' },
  { src: tourKitchen, label: 'Kitchen' },
]

export default function VirtualTour() {
  const [active, setActive] = useState(0)

  const goPrev = () => setActive((i) => (i - 1 + gallery.length) % gallery.length)
  const goNext = () => setActive((i) => (i + 1) % gallery.length)

  const visible = Array.from({ length: 3 }, (_, i) => gallery[(active + i) % gallery.length])

  return (
    <section id="virtual-tour" className="scroll-mt-28 px-6 sm:px-16">
      <div className="mx-auto flex w-full max-w-[90rem] flex-col items-center gap-12 rounded-2xl bg-navy-darkest px-6 py-16 sm:px-[3.75rem] sm:py-[7.5rem]">
        <div className="flex w-full flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-[8.5rem]">
          <div className="flex flex-1 flex-col items-start gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[linear-gradient(45deg,rgba(108,214,255,0.30)_0%,rgba(108,214,255,0.18)_50%,rgba(108,214,255,0.10)_100%)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-blue-light uppercase">
              <span className="size-2 rounded-full bg-blue-light" />
              3D Tour
            </span>

            <h2 className="font-display text-[34px] leading-[1.3] tracking-[-2px] text-white capitalize sm:text-[3.375rem]">
              3D virtual tour
            </h2>

            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-[26px]">
                <span className="font-display text-[34px] leading-[1.3] tracking-[-2px] text-white sm:text-[3.375rem]">
                  01
                </span>
                <img src={tourDivider} alt="" aria-hidden="true" className="h-px w-28" />
              </div>
              <h4 className="font-display text-[1.5rem] leading-[1.3] tracking-[-2px] text-white capitalize sm:text-[2.125rem]">
                Preview the boat without leaving your house
              </h4>
              <p className="max-w-[41.5rem] text-base leading-[26px] text-[#c0c0c0]">
                How many times have you seen pictures, travelled to view a boat and it was not how
                you thought it would be?
              </p>
            </div>

            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-[26px]">
                <span className="font-display text-[34px] leading-[1.3] tracking-[-2px] text-white sm:text-[3.375rem]">
                  02
                </span>
                <img src={tourDivider} alt="" aria-hidden="true" className="h-px w-28" />
              </div>
              <h4 className="font-display text-[1.5rem] leading-[1.3] tracking-[-2px] text-white capitalize sm:text-[2.125rem]">
                Stop! Pre-view the boat without leaving your house with our virtual tours.
              </h4>
              <div className="flex max-w-[45rem] flex-col text-base leading-[26px] text-[#c0c0c0]">
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

          <a
            href="https://my.matterport.com/show/?m=Cxse2vYKxqS"
            target="_blank"
            rel="noreferrer"
            className="media-frame group flex aspect-[510/689] w-full max-w-[35.875rem] shrink-0 items-center justify-center rounded-xl lg:w-[35.875rem]"
          >
            <img src={tourVideoThumb} alt="Narrowboat interior virtual tour preview" />
            <img
              src={playIcon}
              alt=""
              aria-hidden="true"
              className="relative z-[1] size-24 transition-transform duration-150 group-hover:scale-105"
            />
          </a>
        </div>

        <div className="flex w-full flex-col items-center gap-8 sm:flex-row sm:gap-[3.375rem]">
          <div className="order-2 flex shrink-0 items-center justify-center gap-6 sm:order-1 sm:flex-col">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous rooms"
              className="flex items-center justify-center rounded-full bg-[#0d5673] p-3.5"
            >
              <img src={arrowLight} alt="" aria-hidden="true" className="size-[2.0625rem] rotate-180" />
            </button>
            <span className="font-display text-[1.75rem] tracking-[-1px] text-white">
              {String(active + 1).padStart(2, '0')}/{String(gallery.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next rooms"
              className="flex items-center justify-center rounded-full bg-white p-3.5"
            >
              <img src={arrowDark} alt="" aria-hidden="true" className="size-[2.0625rem]" />
            </button>
          </div>

          <div className="order-1 flex w-full flex-1 snap-x snap-mandatory gap-10 overflow-x-auto pb-2 sm:order-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
            {visible.map((item) => (
              <div
                key={item.label}
                className="media-frame h-[15.1875rem] w-[80%] shrink-0 snap-start rounded-[9px] sm:w-full"
              >
                <img src={item.src} alt={item.label} />
                <span className="absolute top-[19px] right-[20px] z-[1] rounded-full bg-white px-3.5 py-2 font-display text-base whitespace-nowrap text-black capitalize">
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
