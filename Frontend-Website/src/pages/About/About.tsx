import aboutHeroBg from '../../assets/about-hero-bg.png'
import PageHero from '../../components/PageHero/PageHero'
import OurStory from './sections/OurStory/OurStory'
import BuySellConfidence from './sections/BuySellConfidence/BuySellConfidence'
import OurPurpose from './sections/OurPurpose/OurPurpose'
import TeamLead from './sections/TeamLead/TeamLead'
import Testimonials from '../../components/Testimonials/Testimonials'
import BrandsCarousel from '../../components/BrandsCarousel/BrandsCarousel'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function About() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <PageHero
        image={aboutHeroBg}
        activeLabel="About"
        title="About Us"
        titleFont="accent"
        body="We make buying and selling boats simple, personal, and stress-free, with expert guidance every step of the way."
        bodyClassName="max-w-[35rem] text-sm leading-[26px] text-[#ededed] sm:text-xl sm:leading-[30px]"
        contentClassName="mt-20 sm:mt-0"
      />
      <OurStory />
      <OurPurpose />
      <BuySellConfidence />
      <Testimonials />
      <BrandsCarousel />
      <TeamLead />
      <CtaBanner />
      <Footer />
    </main>
  )
}
