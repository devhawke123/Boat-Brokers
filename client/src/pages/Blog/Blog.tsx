import BlogHero from './sections/BlogHero/BlogHero'
import BlogListing from './sections/BlogListing/BlogListing'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function Blog() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <BlogHero />
      <BlogListing />
      <CtaBanner />
      <Footer />
    </main>
  )
}
