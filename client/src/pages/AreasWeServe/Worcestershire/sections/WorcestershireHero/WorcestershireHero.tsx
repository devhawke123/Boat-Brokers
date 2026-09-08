import heroBg from '../../../../../assets/west-midlands-hero-bg.png'
import Navbar from '../../../../../components/Navbar/Navbar'

export default function WorcestershireHero() {
  return (
    <section
      className="relative flex min-h-[min(40rem,75vh)] flex-col items-center justify-center overflow-hidden rounded-3xl bg-cover bg-center p-8 text-center max-[900px]:min-h-[min(32rem,70vh)] max-[900px]:p-5 sm:p-16"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.1)_35%,rgba(0,0,0,0.4)_100%)]" />
      <Navbar activeLabel="Areas We Serve" />

      <div className="relative z-[5] flex max-w-[79.375rem] flex-col items-center gap-8">
        <h1 className="font-display text-[40px] leading-[1.2] tracking-[-1.6px] text-white capitalize sm:text-[5rem] sm:tracking-[-2px]">
          Worcestershire&rsquo;s Specialist Canal Boat &amp; Narrowboat Broker
        </h1>
        <p className="max-w-[79.375rem] text-base leading-[1.5] tracking-[-0.32px] text-[#ededed]">
          At The Boat Brokers, we are the specialist{' '}
          <a
            href="https://theboatbrokers.co.uk/selling/"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            narrowboat broker Worcestershire
          </a>{' '}
          buyers and sellers across the county trust. Whether you are searching for narrowboats
          for sale in Worcestershire, looking to sell a vessel you have moored on the
          Staffordshire and Worcestershire Canal or the Worcester and Birmingham, or simply
          wanting an honest, professional assessment of what your boat is worth in today&rsquo;s
          market, our team is here to help.
        </p>
      </div>
    </section>
  )
}
