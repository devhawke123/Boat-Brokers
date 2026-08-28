import BoatsHero from './sections/BoatsHero/BoatsHero'
import BoatsListing from './sections/BoatsListing/BoatsListing'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function BoatForSale() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <BoatsHero />
      <BoatsListing />
      <CtaBanner />
      <Footer />
    </main>
  )
}
