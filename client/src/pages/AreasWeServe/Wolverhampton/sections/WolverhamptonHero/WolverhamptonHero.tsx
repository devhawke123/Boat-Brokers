import heroBg from '../../../../../assets/birminghamabout.jpg'
import Navbar from '../../../../../components/Navbar/Navbar'

export default function WolverhamptonHero() {
  return (
    <section
      className="relative flex min-h-[min(40rem,75vh)] flex-col items-center justify-center overflow-hidden rounded-3xl bg-cover bg-center p-8 text-center max-[900px]:min-h-[min(32rem,70vh)] max-[900px]:p-5 sm:p-16"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.1)_35%,rgba(0,0,0,0.4)_100%)]" />
      <Navbar activeLabel="Areas We Serve" />

      <div className="relative z-[5] mt-24 flex max-w-[79.375rem] flex-col items-center gap-8 sm:mt-0">
        <h1 className="font-display text-[40px] leading-[1.2] tracking-[-1.6px] text-white capitalize sm:text-[5rem] sm:tracking-[-2px]">
          Wolverhampton&rsquo;s Specialist Narrowboat &amp; Canal Boat Broker
        </h1>
        <p className="max-w-[79.375rem] text-base leading-[1.5] tracking-[-0.32px] text-[#ededed]">
          Buying or selling a narrowboat in{' '}
          <a
            href="https://theboatbrokers.co.uk/selling/"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Wolverhampton
          </a>
          ? The Boat Brokers covers the Staffordshire &amp; Worcestershire Canal, the Birmingham
          Canal Navigations and the Shropshire Union Canal, all accessible from
          Wolverhampton&rsquo;s well-connected waterway network. Free valuations. No upfront fees.
        </p>
      </div>
    </section>
  )
}
