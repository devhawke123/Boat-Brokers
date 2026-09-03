import heroBg from '../../../../../assets/west-midlands-hero-bg.png'
import Navbar from '../../../../../components/Navbar/Navbar'

export default function WestMidlandsHero() {
  return (
    <section
      className="relative flex min-h-[min(34rem,70vh)] flex-col items-center justify-center overflow-hidden rounded-3xl bg-cover bg-center p-8 text-center max-[900px]:min-h-[min(28rem,65vh)] max-[900px]:p-5 sm:p-14"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(37.5deg,rgba(0,0,0,0.2)_19%,rgba(102,102,102,0)_31%)]" />
      <Navbar activeLabel="Areas We Serve" />

      <div className="relative z-[5] flex max-w-[45rem] flex-col items-center gap-6">
        <h1 className="font-display text-[44px] leading-[1.2] tracking-[-1.6px] text-white capitalize sm:text-[5rem]">
          Narrowboats For Sale West Midlands
        </h1>
        <p className="hidden max-w-[35rem] text-base leading-[26px] tracking-[-0.32px] text-[#ededed] sm:block">
          Buying or selling a narrowboat in the West Midlands? The Boat Brokers is the specialist
          canal boat brokerage the region trusts. We know the Birmingham Canal Navigations, the
          Grand Union and every waterway in between. Free valuations. No upfront fees.
        </p>
        <p className="max-w-[17.75rem] text-sm leading-[26px] text-[#ededed] sm:hidden">
          Helping at every stage of the sales process, from appointment to completion.
        </p>
      </div>
    </section>
  )
}
