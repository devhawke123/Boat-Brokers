import BuyingHero from './sections/BuyingHero/BuyingHero'
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
      <BuyingHero />
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
