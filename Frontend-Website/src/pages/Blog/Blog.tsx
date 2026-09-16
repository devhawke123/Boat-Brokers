import heroBg from '../../assets/blog/blog-hero-bg.png'
import PageHero from '../../components/PageHero/PageHero'
import BlogListing from './sections/BlogListing/BlogListing'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function Blog() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <PageHero
        image={heroBg}
        activeLabel=""
        size="md"
        title="Blog"
        maxWidthClassName="max-w-[43.75rem]"
        gapClassName="gap-4"
        body="Explore expert knowledge, thoughtful guidance and essential insights for navigating the world of narrowboats with confidence."
        bodyClassName="max-w-[43.75rem] text-sm leading-[1.5] tracking-[-0.32px] text-[#ededed] sm:text-base"
        overlayClassName="bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.1)_35%,rgba(0,0,0,0.4)_100%)]"
      />
      <BlogListing />
      <CtaBanner />
      <Footer />
    </main>
  )
}
