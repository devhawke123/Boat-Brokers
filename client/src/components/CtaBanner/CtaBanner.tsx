import ctaBg from '../../assets/letsgetyou.jpg'
import Button from '../Button/Button'

export default function CtaBanner() {
  return (
    <section
      className="relative flex min-h-[min(25.375rem,65vh)] items-center overflow-hidden rounded-2xl bg-cover bg-center px-6 py-14 sm:px-16 sm:py-20"
      style={{ backgroundImage: `url(${ctaBg})` }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.45)_20%,rgba(0,0,0,0)_60%)]" />
      <div className="relative z-[1] flex max-w-[41.375rem] flex-col gap-8">
        <h2 className="font-display text-[34px] leading-[1.2] tracking-[-2px] text-white capitalize sm:text-[4rem] sm:leading-[1.3]">
          Lets Get You Started!
        </h2>
        <p className="max-w-[20.625rem] text-sm leading-[26px] text-[#e3e0e0] sm:max-w-[28rem] sm:text-base sm:leading-[1.625rem]">
          Helping at every stage of the sales process, from appointment to completion. We are
          passionate about boating and dedicated to providing our clients with exceptional
          service.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="light" label="Buy Boats Now" href="/boats-for-sale" />
          <Button variant="outline-white" label="Sell Your Boats" href="/sell" />
        </div>
      </div>
    </section>
  )
}
