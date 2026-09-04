import WarwickshireHero from './sections/WarwickshireHero/WarwickshireHero'
import WarwickshireWhyUs from './sections/WarwickshireWhyUs/WarwickshireWhyUs'
import WarwickshireListings from './sections/WarwickshireListings/WarwickshireListings'
import Testimonials from '../../../components/Testimonials/Testimonials'
import WarwickshireBuyingProcess from './sections/WarwickshireBuyingProcess/WarwickshireBuyingProcess'
import WarwickshireWhyChoose from './sections/WarwickshireWhyChoose/WarwickshireWhyChoose'
import Faq from '../../../components/Faq/Faq'
import CtaBanner from '../../../components/CtaBanner/CtaBanner'
import Footer from '../../../components/Footer/Footer'

export default function Warwickshire() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <WarwickshireHero />
      <WarwickshireWhyUs />
      <WarwickshireListings />
      <Testimonials />
      <WarwickshireBuyingProcess />
      <WarwickshireWhyChoose />
      <Faq ctaText="Learn More" mobileLeftAlign />
      <CtaBanner />
      <Footer />
    </main>
  )
}
