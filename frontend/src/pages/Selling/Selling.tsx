import SellingHero from './sections/SellingHero/SellingHero'
import SellingProcessSteps from './sections/SellingProcessSteps/SellingProcessSteps'
import WhyUseABroker from './sections/WhyUseABroker/WhyUseABroker'
import FeeComparison from './sections/FeeComparison/FeeComparison'
import VirtualTour from './sections/VirtualTour/VirtualTour'
import WhereWeAdvertise from './sections/WhereWeAdvertise/WhereWeAdvertise'
import SellingGuide from './sections/SellingGuide/SellingGuide'
import GetInTouch from './sections/GetInTouch/GetInTouch'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function Selling() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <SellingHero />
      <SellingProcessSteps />
      <WhyUseABroker />
      <FeeComparison />
      <VirtualTour />
      <WhereWeAdvertise />
      <SellingGuide />
      <GetInTouch />
      <CtaBanner />
      <Footer />
    </main>
  )
}
