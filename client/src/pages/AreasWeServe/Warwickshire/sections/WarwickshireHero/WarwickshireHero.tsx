import heroBg from '../../../../../assets/warwickshire-hero-bg.png'
import Navbar from '../../../../../components/Navbar/Navbar'

export default function WarwickshireHero() {
  return (
    <section
      className="relative flex min-h-[min(40rem,75vh)] flex-col items-center justify-center overflow-hidden rounded-3xl bg-cover bg-center p-8 text-center max-[900px]:min-h-[min(32rem,70vh)] max-[900px]:p-5 sm:p-16"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.1)_35%,rgba(0,0,0,0.4)_100%)]" />
      <Navbar activeLabel="Areas We Serve" />

      <div className="relative z-[5] flex max-w-[79.375rem] flex-col items-center gap-6 sm:gap-8">
        <h1 className="max-w-[17.75rem] font-display text-[44px] leading-[1.2] tracking-[-2px] text-white capitalize sm:hidden">
          Narrowboats For Sale West Midlands
        </h1>
        <h1 className="hidden font-display text-[5rem] leading-[1.2] tracking-[-2px] text-white capitalize sm:block">
          Warwickshire&rsquo;s Specialist Narrowboat &amp; Canal Boat Broker
        </h1>
        <p className="max-w-[17.75rem] text-sm leading-[26px] text-[#ededed] sm:hidden">
          Helping at every stage of the sales process.
        </p>
        <p className="hidden max-w-[79.375rem] text-base leading-[1.5] tracking-[-0.32px] text-[#ededed] sm:block">
          At The Boat Brokers, we are the specialist{' '}
          <a
            href="https://theboatbrokers.co.uk/selling/"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            narrowboat broker Warwickshire
          </a>{' '}
          buyers and sellers across the county rely on. We bring local knowledge of the
          Warwickshire waterways, real transaction data from the current market and a
          professional, personal approach to every instruction we take. Whether you are buying
          your first narrowboat, upgrading to a different vessel or selling a canal boat you have
          owned for years, our team is here to make the process straightforward from start to
          finish.
        </p>
      </div>
    </section>
  )
}
