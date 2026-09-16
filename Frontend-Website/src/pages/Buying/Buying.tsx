import buyingHeroBg from '../../assets/buyinghero.jpg'
import PageHero from '../../components/PageHero/PageHero'
import BuyingProcessSteps from './sections/BuyingProcessSteps/BuyingProcessSteps'
import SurveyGuide from './sections/SurveyGuide/SurveyGuide'
import BuyingFaqs from './sections/BuyingFaqs/BuyingFaqs'
import Faq from '../../components/Faq/Faq'
import GetInTouch from './sections/GetInTouch/GetInTouch'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function Buying() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <PageHero
        image={buyingHeroBg}
        activeLabel="Buying"
        title="The Buying Process"
        body="Buying a boat doesn’t have to be complicated. From finding the right boat to completing the purchase, we’re here to guide you through every step."
      />
      <BuyingProcessSteps />
      <SurveyGuide />
      <BuyingFaqs />
      <Faq />
      <CtaBanner />
      <GetInTouch />
      <Footer />
    </main>
   )
}
