import heroBg from '../../assets/areas-we-serve-hero-bg.png'
import heroBgMobile from '../../assets/areas-we-serve-hero-bg-mobile.png'
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
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <PageHero
        image={heroBg}
        imageMobile={heroBgMobile}
        activeLabel="Areas We Serve"
        title="Areas We Serve"
        overlayClassName="bg-[linear-gradient(37.5deg,rgba(0,0,0,0.2)_19%,rgba(102,102,102,0)_31%)]"
      >
        <p className="hidden max-w-[35rem] text-base leading-[26px] tracking-[-0.32px] text-[#ededed] sm:block">
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
