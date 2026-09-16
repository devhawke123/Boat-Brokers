import boatsHeroBg from '../../assets/boats-for-sale-hero-bg.jpg'
import PageHero from '../../components/PageHero/PageHero'
import BoatsListing from './sections/BoatsListing/BoatsListing'
import GetInTouch from './sections/GetInTouch/GetInTouch'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function BoatForSale() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <PageHero
        image={boatsHeroBg}
        activeLabel="Boats for Sale"
        title="Boats for Sale"
        titleFont="accent"
        body="Find a boat that fits your lifestyle, plans, and budget. Explore our carefully selected boats and start your next adventure on the waterways."
      />
      <BoatsListing />
      <GetInTouch />
      <CtaBanner />
      <Footer />
    </main>
  )
}
