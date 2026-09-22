import { Fragment, useRef, useState } from 'react'
import noelVideo from '../../../../assets/noel-video.mp4'
import playIcon from '../../../../assets/icons/play.svg'
import Button from '../../../../components/Button/Button'

const stats = [
  { value: '25+', label: 'Years of exceptional experience and excellence' },
  { value: '450+', label: 'Happy Customers Worldwide' },
  { value: '500+', label: 'Boats Sold Succesfully' },
  { value: '98%', label: 'Client satisfaction rate aross all stays' },
]

export default function AboutUs() {
  const modalVideoRef = useRef<HTMLVideoElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const closeModal = () => {
    modalVideoRef.current?.pause()
    setIsModalOpen(false)
  }

  return (
    <section className="section content-center grid grid-cols-1 items-start justify-center gap-x-11 gap-y-10 short:gap-y-6 lg:grid-cols-[minmax(0,clamp(20rem,50%,40rem))_minmax(0,clamp(20rem,45%,37rem))]">
      <div className="order-2 lg:order-1">
        <div className="media-frame aspect-[640/560] rounded-2xl">
          <video src={noelVideo} playsInline muted preload="metadata" />
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="absolute top-1/2 left-1/2 z-[1] size-14 -translate-x-1/2 -translate-y-1/2 border-none bg-transparent p-0 lg:size-24"
            aria-label="Play video"
          >
            <img src={playIcon} alt="" aria-hidden="true" className="size-full" />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={closeModal}
        >
          <button
            type="button"
            onClick={closeModal}
            aria-label="Close video"
            className="absolute top-6 right-6 z-[1] size-10 border-none bg-transparent p-0 text-white text-h3 leading-none"
          >
            &times;
          </button>
          <video
            ref={modalVideoRef}
            src={noelVideo}
            playsInline
            controls
            autoPlay
            className="max-h-full max-w-full rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}

      <div className="order-1 flex flex-col gap-6 lg:order-2">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-badge-bg px-4 py-1.5 text-label font-medium text-badge-text uppercase">
              <span className="size-2 rounded-full bg-blue" />
              About Us
            </span>
            <h2 className="font-display text-h2 text-ink capitalize">
              The Boat Brokers
            </h2>
          </div>
          <p className="text-body text-text-body">
            At The Boat Brokers, we specialise in narrowboat sales, blending modern technology
            with personal service. While we&rsquo;ve invested heavily in streamlining the boat
            sales process, we haven&rsquo;t replaced everything with automation. We keep costs
            low by avoiding expensive marina branches and branded vehicles—allowing us to offer a
            premium service at a fraction of the price.
          </p>
        </div>

        <hr className="m-0 border-t border-t-border" />

        <p className="text-body text-text-body">
          With years of hands-on experience in the narrowboat and canal boat industry. We pride
          ourselves on connecting buyers and sellers quickly and smoothly, making narrowboat
          sales simple and stress-free. From the initial appointment to final completion,
          we&rsquo;re here to guide you every step of the way.
        </p>

        <Button variant="dark" label="Learn More" href="/about" />
      </div>

      <ul className="order-3 col-span-full flex items-start justify-center gap-5 pt-8 short:pt-4 md:gap-10 lg:hidden">
        {stats.slice(0, 3).map((stat) => (
          <li key={stat.value} className="flex w-[6.3125rem] flex-col gap-1.5 p-3 md:w-40">
            <span className="font-display text-h2 text-ink capitalize">
              {stat.value}
            </span>
            <span className="font-body text-caption text-text-body">
              {stat.label}
            </span>
          </li>
        ))}
      </ul>

      <ul className="order-3 col-span-full hidden flex-wrap items-start justify-between gap-6 pt-14 short:pt-6 lg:flex">
        {stats.map((stat, index) => (
          <Fragment key={stat.value}>
            <li className="flex items-center gap-1.5">
              <span className="font-display text-h2 text-ink capitalize">
                {stat.value}
              </span>
              <span className="max-w-[8.125rem] font-body text-body-sm font-light text-text-body">
                {stat.label}
              </span>
            </li>
            {index < stats.length - 1 && (
              <li className="self-center font-accent text-accent text-ink opacity-50" aria-hidden="true">
                /
              </li>
            )}
          </Fragment>
        ))}
      </ul>
    </section>
  )
}
