import WorcestershireHero from './sections/WorcestershireHero/WorcestershireHero'
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
      <WorcestershireHero />
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
