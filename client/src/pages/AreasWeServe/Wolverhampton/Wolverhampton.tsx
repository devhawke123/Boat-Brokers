import WolverhamptonHero from './sections/WolverhamptonHero/WolverhamptonHero'
import WolverhamptonWhyUs from './sections/WolverhamptonWhyUs/WolverhamptonWhyUs'
import WolverhamptonListings from './sections/WolverhamptonListings/WolverhamptonListings'
import Testimonials from '../../../components/Testimonials/Testimonials'
import WolverhamptonSellingProcess from './sections/WolverhamptonSellingProcess/WolverhamptonSellingProcess'
import WolverhamptonWhyChoose from './sections/WolverhamptonWhyChoose/WolverhamptonWhyChoose'
import Faq from '../../../components/Faq/Faq'
import CtaBanner from '../../../components/CtaBanner/CtaBanner'
import Footer from '../../../components/Footer/Footer'

export default function Wolverhampton() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <WolverhamptonHero />
      <WolverhamptonWhyUs />
      <WolverhamptonListings />
      <Testimonials />
      <WolverhamptonSellingProcess />
      <WolverhamptonWhyChoose />
      <Faq />
      <CtaBanner />
      <Footer />
    </main>
  )
}
