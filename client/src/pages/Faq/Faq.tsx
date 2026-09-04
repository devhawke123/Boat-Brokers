import FaqHero from './sections/FaqHero/FaqHero'
import FaqSection from '../../components/Faq/Faq'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function Faq() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <FaqHero />
      <FaqSection singleColumn hideCta mobileLeftAlign />
      <CtaBanner />
      <Footer />
    </main>
  )
}
