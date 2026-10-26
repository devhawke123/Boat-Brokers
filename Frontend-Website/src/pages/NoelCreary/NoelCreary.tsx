import heroBg from '../../assets/noel-creary-hero-bg.png'
import Seo from '../../components/Seo/Seo'
import PageHero from '../../components/PageHero/PageHero'
import NoelCrearyAbout from './sections/NoelCrearyAbout/NoelCrearyAbout'
import NoelCrearyStory from './sections/NoelCrearyStory/NoelCrearyStory'
import NoelCrearyJourney from './sections/NoelCrearyJourney/NoelCrearyJourney'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function NoelCreary() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <Seo
        title="Noel Creary — Managing Director"
        description="Meet Noel Creary, Managing Director of The Boat Brokers. Passionate about boating and dedicated to guiding clients through every stage of buying and selling."
        path="/noel-creary"
        image={heroBg}
      />
      <PageHero
        image={heroBg}
        activeLabel=""
        title="Noel Creary"
        titleFont="accent"
        body="Helping at every stage of the sales process, from appointment to completion. We are passionate about boating and dedicated to providing our clients with exceptional service."
        bodyClassName="max-w-[35rem] text-base leading-[26px] tracking-[-0.32px] text-[#ededed] sm:text-base"
        overlayClassName="bg-black/30"        
      />
      <NoelCrearyAbout />
      <NoelCrearyStory />
      <NoelCrearyJourney />
      <CtaBanner />
      <Footer />
    </main>
  )
}
