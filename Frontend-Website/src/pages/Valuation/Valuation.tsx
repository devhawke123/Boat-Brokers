import valuationHeroBg from '../../assets/book-a-viewing-hero-bg.png'
import Seo from '../../components/Seo/Seo'
import PageHero from '../../components/PageHero/PageHero'
import ValuationForm from './sections/ValuationForm/ValuationForm'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function Valuation() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <Seo
        title="Free Boat Valuation"
        description="Ready to sell your boat? Tell us about it and The Boat Brokers will get back to you with a free valuation — no upfront fees."
        path="/valuation"
        image={valuationHeroBg}
      />
      <PageHero
        image={valuationHeroBg}
        activeLabel="Selling"
        title="Book A Free Valuation"
        body="Ready to sell your boat? Tell us a bit about it and we'll get back to you with a free valuation."
      />
      <ValuationForm />
      <CtaBanner />
      <Footer />
    </main>
  )
}
