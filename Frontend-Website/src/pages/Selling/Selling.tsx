import buyingHeroBg from '../../assets/buyinghero.jpg'
import PageHero from '../../components/PageHero/PageHero'
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
      <PageHero
        image={buyingHeroBg}
        activeLabel="Selling"
        title="The Selling Process"
        body="Ready to sell your boat? We make the process simple and straightforward, helping you present your boat to the right buyers and achieve the best possible outcome."
        bodyClassName="max-w-[35rem] text-sm leading-[26px] text-[#ededed] sm:text-xl sm:leading-[30px]"
      />
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
