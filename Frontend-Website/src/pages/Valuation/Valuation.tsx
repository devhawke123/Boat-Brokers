import valuationHeroBg from '../../assets/book-a-viewing-hero-bg.png'
import PageHero from '../../components/PageHero/PageHero'
import ValuationForm from './sections/ValuationForm/ValuationForm'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function Valuation() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
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
