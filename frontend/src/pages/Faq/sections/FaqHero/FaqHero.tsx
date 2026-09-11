import heroBg from '../../../../assets/faq-hero-bg.png'
import Navbar from '../../../../components/Navbar/Navbar'

export default function FaqHero() {
  return (
    <section
      className="relative flex min-h-[min(34rem,70vh)] flex-col items-center justify-center overflow-hidden rounded-3xl bg-cover bg-center p-8 text-center max-[900px]:min-h-[min(28rem,65vh)] max-[900px]:p-5 sm:p-14"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(54.6deg,rgba(102,102,102,0)_26%,rgba(0,0,0,0.2)_32%)]" />
      <Navbar activeLabel="" />

      <div className="relative z-[5] flex max-w-[43rem] flex-col items-center gap-6">
        <h1 className="font-accent text-[44px] leading-[1.2] tracking-[-1.6px] text-white sm:text-[5rem]">
          Frequently Asked Question
        </h1>
        <p className="max-w-[35rem] text-base leading-[26px] tracking-[-0.32px] text-[#ededed] sm:text-base">
          Have questions? Find clear, straightforward answers to the most common questions about
          buying and selling boats.
        </p>
      </div>
    </section>
  )
}
