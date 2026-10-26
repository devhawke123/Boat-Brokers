import heroBg from '../../../assets/west-midlands-hero-bg.png'
import PageHero from '../../../components/PageHero/PageHero'
import WorcestershireWhyUs from './sections/WorcestershireWhyUs/WorcestershireWhyUs'
import WorcestershireListings from './sections/WorcestershireListings/WorcestershireListings'
import Testimonials from '../../../components/Testimonials/Testimonials'
import WorcestershireSellingProcess from './sections/WorcestershireSellingProcess/WorcestershireSellingProcess'
import WorcestershireWhyChoose from './sections/WorcestershireWhyChoose/WorcestershireWhyChoose'
import Faq from '../../../components/Faq/Faq'
import CtaBanner from '../../../components/CtaBanner/CtaBanner'
import Footer from '../../../components/Footer/Footer'

export default function Worcestershire() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <PageHero
        image={heroBg}
        activeLabel="Areas We Serve"
        size="lg"
        title="Worcestershire’s Specialist Canal Boat & Narrowboat Broker"
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
              narrowboat broker Worcestershire
            </a>{' '}
            buyers and sellers across the county trust. Whether you are searching for narrowboats
            for sale in Worcestershire, looking to sell a vessel you have moored on the
            Staffordshire and Worcestershire Canal or the Worcester and Birmingham, or simply
            wanting an honest, professional assessment of what your boat is worth in today’s
            market, our team is here to help.
          </>
        }
      />
      <WorcestershireWhyUs />
      <WorcestershireListings />
      <Testimonials />
      <WorcestershireSellingProcess />
      <WorcestershireWhyChoose />
      <Faq />
      <CtaBanner />
      <Footer />
    </main>
  )
}
