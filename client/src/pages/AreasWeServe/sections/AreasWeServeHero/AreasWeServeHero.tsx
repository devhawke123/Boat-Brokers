import heroBg from '../../../../assets/areas-we-serve-hero-bg.png'
import heroBgMobile from '../../../../assets/areas-we-serve-hero-bg-mobile.png'
import Navbar from '../../../../components/Navbar/Navbar'

export default function AreasWeServeHero() {
  return (
    <section className="relative flex min-h-[min(34rem,70vh)] flex-col items-center justify-center overflow-hidden rounded-3xl p-8 text-center max-[900px]:min-h-[min(28rem,65vh)] max-[900px]:p-5 sm:p-14">
      <div
        className="absolute inset-0 bg-cover bg-center sm:hidden"
        style={{ backgroundImage: `url(${heroBgMobile})` }}
      />
      <div
        className="absolute inset-0 hidden bg-cover bg-center sm:block"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(37.5deg,rgba(0,0,0,0.2)_19%,rgba(102,102,102,0)_31%)]" />
      <Navbar activeLabel="Areas We Serve" />

      <div className="relative z-[5] flex max-w-[43rem] flex-col items-center gap-6">
        <h1 className="font-display text-[44px] leading-[1.2] tracking-[-1.6px] text-white capitalize sm:text-[5rem]">
          Areas We Serve
        </h1>
        <p className="hidden max-w-[35rem] text-base leading-[26px] tracking-[-0.32px] text-[#ededed] sm:block">
          Specialist Narrowboat &amp; Canal Boat Brokerage Across the Midlands. The Boat Brokers
          provides professional narrowboat and canal boat brokerage across the West Midlands,
          Worcestershire and Warwickshire. Whether you are buying or selling, if you are based in
          or around the Midlands canal network, we can help. Free valuations. No upfront fees.
        </p>
        <p className="max-w-[17.75rem] text-sm leading-[26px] text-[#ededed] sm:hidden">
          Helping at every stage of the sales process, from appointment to completion. We are
          passionate about boating and dedicated to providing our clients with exceptional
          service.
        </p>
      </div>
    </section>
  )
}
