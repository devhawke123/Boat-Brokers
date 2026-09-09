import boatInsuranceIcon from '../../../../assets/icons/icon-boat-insurance.png'
import licenseIcon from '../../../../assets/icons/icon-license-certificate.png'
import boatFinanceIcon from '../../../../assets/icons/icon-boat-finance.png'

type FaqCard = {
  id: string
  icon: string
  question: string
  answer: string
  description: string
}

const faqCards: FaqCard[] = [
  {
    id: 'insurance',
    icon: boatInsuranceIcon,
    question: 'Do I need to insure my boat?',
    answer: 'The simple answer is yes!',
    description:
      "It's important to get insurance from the day of completion, as it's required for your waterways license. Insurance protects your boat from damage or theft and covers accidents. There are two types: fully comprehensive and third-party, with varying premiums and coverage, so it's wise to compare options.",
  },
  {
    id: 'licence',
    icon: licenseIcon,
    question: 'Do I need a License?',
    answer: 'The simple answer is yes!',
    description:
      'A waterway license is required to navigate most waterways, managed by authorities like Canal & Rivers Trust and the Environment Agency. Smaller authorities, such as Avon Navigation Trust, may require a separate license. Apply online at info@theboatbrokers.co.uk with your insurance and boat safety certificate.',
  },
  {
    id: 'finance',
    icon: boatFinanceIcon,
    question: 'Can I get boat finance?',
    answer: 'The simple answer is yes!',
    description:
      'Purchasing a narrowboat is a significant investment, and financing options, like marine mortgages, are available with a typical 20% deposit. Some lenders may only offer finance to leisure boaters. The Boat Brokers recommend seeking professional financial advice as they are not members of the Financial Services Authority.',
  },
]

export default function BuyingFaqs() {
  return (
    <section
      id="buying-faqs"
      className="flex flex-col items-center gap-12 px-6 py-16 sm:px-16 sm:py-24 scroll-mt-28"
    >
      <div className="flex max-w-[49rem] flex-col items-center gap-4 text-center">
        <h2 className="font-display text-[34px] leading-[1.3] tracking-[-2px] text-ink capitalize sm:text-[3.375rem]">
          Everything You Need to Know Before Buying a Boat
        </h2>
        <p className="max-w-[33rem] text-base leading-[26px] text-[#434242]">
          At The Boat Brokers, we specialise in narrowboat sales, blending modern technology with
          personal service.
        </p>
      </div>

      <div className="grid w-full max-w-[80rem] grid-cols-1 gap-6 md:grid-cols-3">
        {faqCards.map((card) => (
          <div
            key={card.question}
            id={card.id}
            className="flex flex-col items-start gap-3 rounded-xl border border-[rgba(7,48,64,0.28)] bg-[#f5fcff] p-6 scroll-mt-28 sm:p-8"
          >
            <img src={card.icon} alt="" aria-hidden="true" className="size-12 sm:size-16" />
            <div className="flex flex-col gap-1">
              <p className="font-body text-xl text-ink sm:text-2xl">{card.question}</p>
              <p className="font-body text-base text-navy-dark sm:text-lg">{card.answer}</p>
            </div>
            <p className="text-sm leading-[24px] text-[rgba(115,115,115,0.78)] sm:text-base sm:leading-[26px]">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
