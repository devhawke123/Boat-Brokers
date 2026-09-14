import heroBg from '../../assets/noel-creary-hero-bg.png'
import PageHero from '../../components/PageHero/PageHero'
import NoelCrearyAbout from './sections/NoelCrearyAbout/NoelCrearyAbout'
import NoelCrearyStory from './sections/NoelCrearyStory/NoelCrearyStory'
import NoelCrearyExpertise from './sections/NoelCrearyExpertise/NoelCrearyExpertise'
import NoelCrearyJourney from './sections/NoelCrearyJourney/NoelCrearyJourney'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function NoelCreary() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <PageHero
        image={heroBg}
        activeLabel=""
        title="Noel Creary"
        titleFont="accent"
        body="Helping at every stage of the sales process, from appointment to completion. We are passionate about boating and dedicated to providing our clients with exceptional service."
        bodyClassName="max-w-[35rem] text-base leading-[26px] tracking-[-0.32px] text-[#ededed] sm:text-base"
        overlayClassName="bg-[linear-gradient(54.6deg,rgba(102,102,102,0)_26%,rgba(0,0,0,0.2)_32%)]"
      />
      <NoelCrearyAbout />
      <NoelCrearyStory />
      <NoelCrearyExpertise />
      <NoelCrearyJourney />
      <CtaBanner />
      <Footer />
    </main>
  )
}
