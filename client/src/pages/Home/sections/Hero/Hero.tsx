import heroBg from '../../../../assets/hero-bg.png'
import customer1 from '../../../../assets/people/customer-1.png'
import customer2 from '../../../../assets/people/customer-2.png'
import customer3 from '../../../../assets/people/customer-3.png'
import star from '../../../../assets/icons/star.svg'
import starHalf from '../../../../assets/icons/star-half.svg'
import xLogo from '../../../../assets/icons/x-logo.svg'
import instagramLogo from '../../../../assets/icons/instagram-logo.svg'
import facebookLogo from '../../../../assets/icons/facebook-logo.svg'
import Navbar from '../../../../components/Navbar/Navbar'
import Button from '../../../../components/Button/Button'

const socialLinks = [
  {
    name: 'X',
    href: 'https://www.linkedin.com/company/the-boat-brokers/',
    icon: xLogo,
    bg: 'bg-blue',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/theboatbrokersuk/',
    icon: instagramLogo,
    bg: 'bg-white',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/theboatbrokersuk/',
    icon: facebookLogo,
    bg: 'bg-white',
  },
]

export default function Hero() {
  return (
    <section
      className="relative flex min-h-[min(56.25rem,88vh)] flex-col justify-end overflow-hidden rounded-3xl bg-cover bg-center p-8 max-[900px]:min-h-[min(45rem,85vh)] max-[900px]:p-5 sm:p-14"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0)_35%,rgba(0,0,0,0.15)_100%)]" />
      <Navbar />

      <ul className="absolute top-[140px] right-4 z-[5] flex flex-col gap-4 sm:top-[297px] sm:right-14">
        {socialLinks.map((social) => (
          <li key={social.name}>
            <a
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className={`flex size-12 items-center justify-center rounded-full ${social.bg}`}
              aria-label={social.name}
            >
              <img src={social.icon} alt="" aria-hidden="true" className="size-[23px]" />
            </a>
          </li>
        ))}
      </ul>

      <div className="relative z-[5] flex max-w-[45rem] flex-col gap-[30px]">
        <div className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[rgba(96,166,192,0.28)] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-white uppercase">
            <span className="size-2 rounded-full bg-white" />
            The Boat Breakers - Luxury Feel
          </span>

          <h1 className="font-display text-[3rem] leading-[1.2] tracking-[-2px] text-white capitalize sm:text-[5rem]">
            The Simple Way
            <br />
            To Buy &amp; Sell.
          </h1>

          <p className="max-w-[35rem] text-base leading-[26px] text-[#ededed]">
            Helping at every stage of the sales process, from appointment to completion. We are
            passionate about boating and dedicated to providing our clients with exceptional
            service.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="light" label="Buy Boats Now" href="/boats-for-sale" />
            <Button variant="outline-white" label="Sell Your Boats" href="/sell" />
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex items-center">
              <img
                src={customer1}
                alt=""
                className="-mr-3.5 size-12 rounded-full border-2 border-white/50 object-cover"
              />
              <img
                src={customer2}
                alt=""
                className="-mr-3.5 size-12 rounded-full border-2 border-white/50 object-cover"
              />
              <img
                src={customer3}
                alt=""
                className="-mr-3.5 size-12 rounded-full border-2 border-white/50 object-cover"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1">
                <img src={star} alt="" className="size-[18px]" />
                <img src={star} alt="" className="size-[18px]" />
                <img src={star} alt="" className="size-[18px]" />
                <img src={star} alt="" className="size-[18px]" />
                <img src={starHalf} alt="" className="size-[18px]" />
              </div>
              <p className="text-base tracking-[-0.32px] text-[#ededed]">Happy Customer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
