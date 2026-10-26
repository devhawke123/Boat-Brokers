import heroBg from '../../../assets/west-midlands-hero-bg.png'
import PageHero from '../../../components/PageHero/PageHero'
import WestMidlandsWhyUs from './sections/WestMidlandsWhyUs/WestMidlandsWhyUs'
import WestMidlandsListings from './sections/WestMidlandsListings/WestMidlandsListings'
import Testimonials from '../../../components/Testimonials/Testimonials'
import WestMidlandsSellingProcess from './sections/WestMidlandsSellingProcess/WestMidlandsSellingProcess'
import WestMidlandsWhyChoose from './sections/WestMidlandsWhyChoose/WestMidlandsWhyChoose'
import Faq from '../../../components/Faq/Faq'
import CtaBanner from '../../../components/CtaBanner/CtaBanner'
import Footer from '../../../components/Footer/Footer'

export default function WestMidlands() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <PageHero
        image={heroBg}
        activeLabel="Areas We Serve"
        size="lg"
        title="Narrowboats For Sale West Midlands"
        maxWidthClassName="max-w-[79.375rem]"
        gapClassName="gap-8"
        contentClassName="mt-24 sm:mt-0"
        overlayClassName="bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.1)_35%,rgba(0,0,0,0.4)_100%)]"
        bodyClassName="max-w-[79.375rem] text-base leading-[1.5] tracking-[-0.32px] text-[#ededed]"
        body="Buying or selling a narrowboat in the West Midlands? The Boat Brokers is the specialist canal boat brokerage the region trusts. We know the Birmingham Canal Navigations, the Grand Union and every waterway in between. Free valuations. No upfront fees."
      />
      <WestMidlandsWhyUs />
      <WestMidlandsListings />
      <Testimonials />
      <WestMidlandsSellingProcess />
      <WestMidlandsWhyChoose />
      <Faq />
      <CtaBanner />
      <Footer />
    </main>
  )
}
