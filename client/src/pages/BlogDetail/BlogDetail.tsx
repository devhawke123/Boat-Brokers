import BlogDetailHero from './sections/BlogDetailHero/BlogDetailHero'
import BlogDetailContent from './sections/BlogDetailContent/BlogDetailContent'
import BlogDetailPostNav from './sections/BlogDetailPostNav/BlogDetailPostNav'
import BlogDetailRelated from './sections/BlogDetailRelated/BlogDetailRelated'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'
import { blogPostDetail } from '../../data/blogPostDetail'

type BlogDetailProps = {
  slug: string
}

export default function BlogDetail({ slug }: BlogDetailProps) {
  const post = { ...blogPostDetail, slug }

  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <BlogDetailHero post={post} />
      <BlogDetailContent post={post} />
      <BlogDetailPostNav post={post} />
      <BlogDetailRelated currentSlug={slug} />
      <CtaBanner />
      <Footer />
    </main>
  )
}
