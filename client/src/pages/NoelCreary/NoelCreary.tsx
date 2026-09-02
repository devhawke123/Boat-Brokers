import NoelCrearyHero from './sections/NoelCrearyHero/NoelCrearyHero'
import NoelCrearyAbout from './sections/NoelCrearyAbout/NoelCrearyAbout'
import NoelCrearyStory from './sections/NoelCrearyStory/NoelCrearyStory'
import NoelCrearyExpertise from './sections/NoelCrearyExpertise/NoelCrearyExpertise'
import NoelCrearyJourney from './sections/NoelCrearyJourney/NoelCrearyJourney'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function NoelCreary() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <NoelCrearyHero />
      <NoelCrearyAbout />
      <NoelCrearyStory />
      <NoelCrearyExpertise />
      <NoelCrearyJourney />
      <CtaBanner />
      <Footer />
    </main>
  )
}
