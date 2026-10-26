import heroBg from '../../assets/faq-hero-bg.png'
import PageHero from '../../components/PageHero/PageHero'
import FaqSection from '../../components/Faq/Faq'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function Faq() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <PageHero
        image={heroBg}
        activeLabel=""
        title="Frequently Asked Question"
        titleFont="accent"
        body="Have questions? Find clear, straightforward answers to the most common questions about buying and selling boats."
        bodyClassName="max-w-[35rem] text-base leading-[26px] tracking-[-0.32px] text-[#ededed] sm:text-base"
        overlayClassName="bg-[linear-gradient(54.6deg,rgba(102,102,102,0)_26%,rgba(0,0,0,0.2)_32%)]"
      />
      <FaqSection singleColumn hideCta />
      <CtaBanner />
      <Footer />
    </main>
  )
}
