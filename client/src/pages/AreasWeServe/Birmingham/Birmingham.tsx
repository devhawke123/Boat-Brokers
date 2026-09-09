import BirminghamHero from './sections/BirminghamHero/BirminghamHero'
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
      <BirminghamHero />
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
