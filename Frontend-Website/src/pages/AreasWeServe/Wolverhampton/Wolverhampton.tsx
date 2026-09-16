import heroBg from '../../../assets/birminghamabout.jpg'
import PageHero from '../../../components/PageHero/PageHero'
import WolverhamptonWhyUs from './sections/WolverhamptonWhyUs/WolverhamptonWhyUs'
import WolverhamptonListings from './sections/WolverhamptonListings/WolverhamptonListings'
import Testimonials from '../../../components/Testimonials/Testimonials'
import WolverhamptonSellingProcess from './sections/WolverhamptonSellingProcess/WolverhamptonSellingProcess'
import WolverhamptonWhyChoose from './sections/WolverhamptonWhyChoose/WolverhamptonWhyChoose'
import Faq from '../../../components/Faq/Faq'
import CtaBanner from '../../../components/CtaBanner/CtaBanner'
import Footer from '../../../components/Footer/Footer'

export default function Wolverhampton() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <PageHero
        image={heroBg}
        activeLabel="Areas We Serve"
        size="lg"
        title="Wolverhampton’s Specialist Narrowboat & Canal Boat Broker"
        maxWidthClassName="max-w-[79.375rem]"
        gapClassName="gap-8"
        contentClassName="mt-24 sm:mt-0"
        overlayClassName="bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.1)_35%,rgba(0,0,0,0.4)_100%)]"
        bodyClassName="max-w-[79.375rem] text-base leading-[1.5] tracking-[-0.32px] text-[#ededed]"
        body={
          <>
            Buying or selling a narrowboat in{' '}
            <a
              href="https://theboatbrokers.co.uk/selling/"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Wolverhampton
            </a>
            ? The Boat Brokers covers the Staffordshire &amp; Worcestershire Canal, the Birmingham
            Canal Navigations and the Shropshire Union Canal, all accessible from
            Wolverhampton’s well-connected waterway network. Free valuations. No upfront fees.
          </>
        }
      />
      <WolverhamptonWhyUs />
      <WolverhamptonListings />
      <Testimonials />
      <WolverhamptonSellingProcess />
      <WolverhamptonWhyChoose />
      <Faq />
      <CtaBanner />
      <Footer />
    </main>
  )
}
