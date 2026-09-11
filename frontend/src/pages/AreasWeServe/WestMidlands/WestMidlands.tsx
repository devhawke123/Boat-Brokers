import WestMidlandsHero from './sections/WestMidlandsHero/WestMidlandsHero'
import WestMidlandsWhyUs from './sections/WestMidlandsWhyUs/WestMidlandsWhyUs'
import WestMidlandsListings from './sections/WestMidlandsListings/WestMidlandsListings'
import Testimonials from '../../../components/Testimonials/Testimonials'
import WestMidlandsSellingProcess from './sections/WestMidlandsSellingProcess/WestMidlandsSellingProcess'
import WestMidlandsWhyChoose from './sections/WestMidlandsWhyChoose/WestMidlandsWhyChoose'
import Faq from '../../../components/Faq/Faq'
import CtaBanner from '../../../components/CtaBanner/CtaBanner'
import Footer from '../../../components/Footer/Footer'

export default function WestMidlands() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <WestMidlandsHero />
      <WestMidlandsWhyUs />
      <WestMidlandsListings />
      <Testimonials />
      <WestMidlandsSellingProcess />
      <WestMidlandsWhyChoose />
      <Faq />
      <CtaBanner />
      <Footer />
    </main>
  )
}
