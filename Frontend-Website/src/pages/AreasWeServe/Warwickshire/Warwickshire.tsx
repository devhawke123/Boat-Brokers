import heroBg from '../../../assets/warwickshire-hero-bg.png'
import PageHero from '../../../components/PageHero/PageHero'
import WarwickshireWhyUs from './sections/WarwickshireWhyUs/WarwickshireWhyUs'
import WarwickshireListings from './sections/WarwickshireListings/WarwickshireListings'
import Testimonials from '../../../components/Testimonials/Testimonials'
import WarwickshireSellingProcess from './sections/WarwickshireSellingProcess/WarwickshireSellingProcess'
import WarwickshireWhyChoose from './sections/WarwickshireWhyChoose/WarwickshireWhyChoose'
import Faq from '../../../components/Faq/Faq'
import CtaBanner from '../../../components/CtaBanner/CtaBanner'
import Footer from '../../../components/Footer/Footer'

export default function Warwickshire() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <PageHero
        image={heroBg}
        activeLabel="Areas We Serve"
        size="lg"
        title="Warwickshire’s Specialist Narrowboat & Canal Boat Broker"
        maxWidthClassName="max-w-[79.375rem]"
        gapClassName="gap-8"
        contentClassName="mt-24 sm:mt-0"
        overlayClassName="bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.1)_35%,rgba(0,0,0,0.4)_100%)]"
        bodyClassName="max-w-[79.375rem] text-base leading-[1.5] tracking-[-0.32px] text-[#ededed]"
        body={
          <>
            At The Boat Brokers, we are the specialist{' '}
            <a
              href="https://theboatbrokers.co.uk/selling/"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              narrowboat broker Warwickshire
            </a>{' '}
            buyers and sellers across the county rely on. We bring local knowledge of the
            Warwickshire waterways, real transaction data from the current market and a
            professional, personal approach to every instruction we take. Whether you are buying
            your first narrowboat, upgrading to a different vessel or selling a canal boat you
            have owned for years, our team is here to make the process straightforward from start
            to finish.
          </>
        }
      />
      <WarwickshireWhyUs />
      <WarwickshireListings />
      <Testimonials />
      <WarwickshireSellingProcess />
      <WarwickshireWhyChoose />
      <Faq />
      <CtaBanner />
      <Footer />
    </main>
  )
}
