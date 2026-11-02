import heroBg from '../../assets/blogpageherobanenrnew.png'
import PageHero from '../../components/PageHero/PageHero'
import BlogListing from './sections/BlogListing/BlogListing'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function Blog() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <PageHero
        image={heroBg}
        activeLabel="Blog"
        size="md"
        title="Blog"
        scrollHint
        maxWidthClassName="max-w-[43.75rem]"
        gapClassName="gap-4"
        body="Explore expert knowledge, thoughtful guidance and essential insights for navigating the world of narrowboats with confidence."
        titleClassName="[text-shadow:0px_0px_10px_black]"
        bodyClassName="max-w-[43.75rem] text-sm leading-[1.5] tracking-[-0.32px] text-[#ededed] [text-shadow:0px_0px_10px_black] sm:text-base"
        overlayClassName="bg-[linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.45))]"
      />
      <BlogListing />
      <CtaBanner />
      <Footer />
    </main>
  )
}
