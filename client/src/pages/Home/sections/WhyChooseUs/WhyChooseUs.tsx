import euroMoney from '../../../../assets/icons/euro-money.png'
import handshake from '../../../../assets/icons/handshake.png'
import smallBusiness from '../../../../assets/icons/small-business.png'
import tools from '../../../../assets/icons/tools.png'
import whyChooseImg from '../../../../assets/whychoose.jpg'

const reasons = [
  {
    icon: euroMoney,
    title: 'Save Money',
    description:
      'By operating without physical offices, branded vehicles and excessive overheads, we can offer competitive rates benefitting you with massively reduced costs. No Sale, No Fee!',
  },
  {
    icon: handshake,
    title: 'Get Support',
    description:
      'Our team possesses in-depth knowledge of the boating market, enabling us to provide expert guidance, as well as transparency. You can trust us to provide clear communication, and reliable feedback throughout the buying or selling process.',
  },
  {
    icon: smallBusiness,
    title: 'Sell Faster',
    description:
      'We leverage the power of online marketing to maximize exposure for your boat listing, reaching a broader audience and increasing the chances of a fast sale compared to traditional brokerage methods.',
  },
  {
    icon: tools,
    title: 'Great Service',
    description:
      'We prioritize customer satisfaction and aim to exceed your expectations. Our track record of positive testimonials and repeat clients is a testament to our commitment to delivering a top-notch service.',
  },
]

export default function WhyChooseUs() {
  const [left, right] = [reasons.slice(0, 2), reasons.slice(2)]

  return (
    <section className="flex flex-col items-center gap-6 py-12 sm:py-16">
      <div className="flex max-w-[26.25rem] flex-col items-center gap-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(33,192,253,0.12)] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-[#14b2ef] uppercase">
          <span className="size-2 rounded-full bg-blue" />
          Why Choose Us
        </span>
        <h2 className="font-display text-[34px] leading-[1.2] tracking-[-2px] text-[#1a1a1a] capitalize sm:text-[3.375rem] sm:leading-[1.3]">
          Why Choose The Boat Brokers?
        </h2>
      </div>

      <div className="flex w-full flex-col items-center gap-6 xl:flex-row xl:items-start xl:justify-center">
        <div className="w-[90%] sm:w-[80%] xl:w-[clamp(16rem,22%,19rem)] xl:shrink-0">
          <div className="flex flex-col gap-6">
            {left.map((reason) => (
              <article
                key={reason.title}
                className="flex flex-1 flex-col items-start justify-center gap-3 rounded-lg bg-white p-5 text-left xl:items-center xl:text-center"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-navy-darkest xl:size-14">
                  <img src={reason.icon} alt="" aria-hidden="true" className="size-[22px] object-contain xl:size-7" />
                </span>
                <h3 className="font-display text-[24px] leading-[1.3] tracking-[-2px] text-[#020f17] capitalize xl:text-[1.75rem] xl:leading-[1.2] xl:tracking-[-1px]">
                  {reason.title}
                </h3>
                <p className="text-sm leading-[26px] text-text-body xl:leading-[1.5]">{reason.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="w-[85%] shrink-0 overflow-hidden rounded-xl sm:w-[75%] xl:w-[clamp(26rem,24%,30rem)]">
          <img
            src={whyChooseImg}
            alt="A narrowboat moored on a calm canal at sunrise"
            className="h-auto w-full rounded-xl object-cover"
          />
        </div>

        <div className="w-[90%] sm:w-[80%] xl:w-[clamp(16rem,22%,19rem)] xl:shrink-0">
          <div className="flex flex-col gap-6">
            {right.map((reason) => (
              <article
                key={reason.title}
                className="flex flex-1 flex-col items-start justify-center gap-3 rounded-lg bg-white p-5 text-left xl:items-center xl:text-center"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-navy-darkest xl:size-14">
                  <img src={reason.icon} alt="" aria-hidden="true" className="size-[22px] object-contain xl:size-7" />
                </span>
                <h3 className="font-display text-[24px] leading-[1.3] tracking-[-2px] text-[#020f17] capitalize xl:text-[1.75rem] xl:leading-[1.2] xl:tracking-[-1px]">
                  {reason.title}
                </h3>
                <p className="text-sm leading-[26px] text-text-body xl:leading-[1.5]">{reason.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
