import boatsHeroBg from '../../../../assets/boats-for-sale-hero-bg.jpg'
import Navbar from '../../../../components/Navbar/Navbar'

export default function BoatsHero() {
  return (
    <section
      className="relative flex min-h-[min(34rem,70vh)] flex-col items-center justify-center overflow-hidden rounded-3xl bg-cover bg-center p-8 text-center max-[900px]:min-h-[min(28rem,65vh)] max-[900px]:p-5 sm:p-14"
      style={{ backgroundImage: `url(${boatsHeroBg})` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0)_35%,rgba(0,0,0,0.15)_100%)]" />
      <Navbar activeLabel="Boats for Sale" />

      <div className="relative z-[5] flex max-w-[43rem] flex-col items-center gap-6">
        <h1 className="font-accent text-[44px] leading-[1.2] tracking-[-1.6px] text-white capitalize sm:text-[5rem]">
          Boats for Sale
        </h1>
        <p className="max-w-[35rem] text-base leading-[26px] text-[#ededed] sm:text-xl sm:leading-[30px]">
          Find a boat that fits your lifestyle, plans, and budget. Explore our carefully selected
          boats and start your next adventure on the waterways.
        </p>
      </div>
    </section>
  )
}
