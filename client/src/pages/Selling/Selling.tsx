import SellingHero from './sections/SellingHero/SellingHero'
import SellingProcessSteps from './sections/SellingProcessSteps/SellingProcessSteps'
import WhyUseABroker from './sections/WhyUseABroker/WhyUseABroker'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function Selling() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <SellingHero />
      <SellingProcessSteps />
      <WhyUseABroker />
      <CtaBanner />
      <Footer />
    </main>
  )
}
