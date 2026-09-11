import AreasWeServeHero from './sections/AreasWeServeHero/AreasWeServeHero'
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
      <AreasWeServeHero />
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
