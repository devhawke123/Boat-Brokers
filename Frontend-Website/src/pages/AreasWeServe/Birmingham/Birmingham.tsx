import heroBg from '../../../assets/birminghamabout.jpg'
import PageHero from '../../../components/PageHero/PageHero'
import BirminghamWhyUs from './sections/BirminghamWhyUs/BirminghamWhyUs'
import BirminghamListings from './sections/BirminghamListings/BirminghamListings'
import Testimonials from '../../../components/Testimonials/Testimonials'
import BirminghamSellingProcess from './sections/BirminghamSellingProcess/BirminghamSellingProcess'
import BirminghamWhyChoose from './sections/BirminghamWhyChoose/BirminghamWhyChoose'
import Faq from '../../../components/Faq/Faq'
import CtaBanner from '../../../components/CtaBanner/CtaBanner'
import Footer from '../../../components/Footer/Footer'

export default function Birmingham() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <PageHero
        image={heroBg}
        activeLabel="Areas We Serve"
        size="lg"
        title="Birmingham’s Specialist Narrowboat & Canal Boat Broker"
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
              narrowboat broker Birmingham
            </a>{' '}
            buyers and sellers across the county rely on. Buying or selling a narrowboat in
            Birmingham? The Boat Brokers is the specialist canal boat brokerage serving the
            Birmingham Canal Navigations, the largest urban canal network in the UK outside
            London. Free valuations. No upfront fees.
          </>
        }
      />
      <BirminghamWhyUs />
      <BirminghamListings />
      <Testimonials />
      <BirminghamSellingProcess />
      <BirminghamWhyChoose />
      <Faq />
      <CtaBanner />
      <Footer />
    </main>
  )
}
