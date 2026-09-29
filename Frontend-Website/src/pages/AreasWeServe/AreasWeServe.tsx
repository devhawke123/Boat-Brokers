import heroBg from '../../assets/areasweserve2.png'
import PageHero from '../../components/PageHero/PageHero'
import AreasWeServeAbout from './sections/AreasWeServeAbout/AreasWeServeAbout'
import AreasWeServeCoverage from './sections/AreasWeServeCoverage/AreasWeServeCoverage'
import OurPurpose from '../About/sections/OurPurpose/OurPurpose'
import BuySellConfidence from '../About/sections/BuySellConfidence/BuySellConfidence'
import Testimonials from '../../components/Testimonials/Testimonials'
import BrandsCarousel from '../../components/BrandsCarousel/BrandsCarousel'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function AreasWeServe() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-10">
      <PageHero
        image={heroBg}
        activeLabel="Areas We Serve"
        title="Areas We Serve"
        align="left"
        overlayClassName="bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0)_35%,rgba(0,0,0,0.15)_100%)]"
        contentClassName="mb-[100px]"
        animateEntrance
      >
        <p className="hidden max-w-[35rem] text-[#ededed] sm:block">
          Specialist Narrowboat &amp; Canal Boat Brokerage Across the Midlands. The Boat Brokers
          provides professional narrowboat and canal boat brokerage across the West Midlands,
          Worcestershire and Warwickshire. Whether you are buying or selling, if you are based in
          or around the Midlands canal network, we can help. Free valuations. No upfront fees.
        </p>
        <p className="max-w-[17.75rem] text-sm leading-[26px] text-[#ededed] sm:hidden">
          Helping at every stage of the sales process, from appointment to completion. We are
          passionate about boating and dedicated to providing our clients with exceptional
          service.
        </p>
      </PageHero>
      <AreasWeServeAbout />
      <OurPurpose />
      <AreasWeServeCoverage />
      <Testimonials />
      <BrandsCarousel />
      <BuySellConfidence />
      <CtaBanner />
      <Footer />
    </main>
  )
}
