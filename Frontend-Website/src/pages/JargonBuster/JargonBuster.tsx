import heroBg from '../../assets/jargon-buster-hero-bg.png'
import Seo from '../../components/Seo/Seo'
import PageHero from '../../components/PageHero/PageHero'
import JargonGlossary from './sections/JargonGlossary/JargonGlossary'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function JargonBuster() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <Seo
        title="Boat Jargon Buster — Canal & Narrowboat Terms"
        description="New to boating terminology? Our jargon buster explains essential terms used when buying, selling, and talking about canal boats and narrowboats."
        path="/jargon-buster"
        image={heroBg}
      />
      <PageHero
        image={heroBg}
        activeLabel=""
        title="Jargon Buster"
        body="New to boating terminology? Our Jargon Buster makes it easy to understand the essential terms used when buying, selling, and talking about canal boats."
        bodyClassName="max-w-[35rem] text-base leading-[1.5] tracking-[-0.32px] text-[#ededed] sm:text-base"
        overlayClassName="bg-[linear-gradient(54.6deg,rgba(102,102,102,0)_26%,rgba(0,0,0,0.2)_32%)]"
      />
      <JargonGlossary />
      <CtaBanner />
      <Footer />
    </main>
  )
}
