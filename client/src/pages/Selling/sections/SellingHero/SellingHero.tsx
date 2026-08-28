import buyingHeroBg from '../../../../assets/buyinghero.jpg'
import Navbar from '../../../../components/Navbar/Navbar'

export default function SellingHero() {
  return (
    <section
      className="relative flex min-h-[min(34rem,70vh)] flex-col items-center justify-center overflow-hidden rounded-3xl bg-cover bg-center p-8 text-center max-[900px]:min-h-[min(28rem,65vh)] max-[900px]:p-5 sm:p-14"
      style={{ backgroundImage: `url(${buyingHeroBg})` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0)_35%,rgba(0,0,0,0.15)_100%)]" />
      <Navbar activeLabel="Selling" />

      <div className="relative z-[5] flex max-w-[43rem] flex-col items-center gap-6">
        <h1 className="font-display text-[44px] leading-[1.2] tracking-[-1.6px] text-white capitalize sm:text-[5rem]">
          The Selling Process
        </h1>
        <p className="max-w-[35rem] text-base leading-[26px] text-[#ededed] sm:text-xl sm:leading-[30px]">
          Ready to sell your boat? We make the process simple and straightforward, helping you
          present your boat to the right buyers and achieve the best possible outcome.
        </p>
      </div>
    </section>
  )
}
