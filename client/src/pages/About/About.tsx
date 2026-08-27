import AboutHero from './sections/AboutHero/AboutHero'
import OurStory from './sections/OurStory/OurStory'
import BuySellConfidence from './sections/BuySellConfidence/BuySellConfidence'
import OurPurpose from './sections/OurPurpose/OurPurpose'
import TeamLead from './sections/TeamLead/TeamLead'
import Testimonials from '../../components/Testimonials/Testimonials'
import BrandsCarousel from '../../components/BrandsCarousel/BrandsCarousel'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function About() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <AboutHero />
      <OurStory />
      <BuySellConfidence />
      <OurPurpose />
      <Testimonials />
      <BrandsCarousel />
      <TeamLead />
      <CtaBanner />
      <Footer />
    </main>
  )
}
