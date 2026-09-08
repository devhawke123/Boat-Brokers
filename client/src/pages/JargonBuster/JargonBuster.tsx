import JargonHero from './sections/JargonHero/JargonHero'
import JargonGlossary from './sections/JargonGlossary/JargonGlossary'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function JargonBuster() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <JargonHero />
      <JargonGlossary />
      <CtaBanner />
      <Footer />
    </main>
  )
}
