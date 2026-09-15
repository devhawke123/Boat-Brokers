import heroBg from '../../assets/blog/blog-hero-bg.png'
import PageHero from '../PageHero/PageHero'
import BlogDetailContent from '../../pages/BlogDetail/sections/BlogDetailContent/BlogDetailContent'
import BlogDetailPostNav from '../../pages/BlogDetail/sections/BlogDetailPostNav/BlogDetailPostNav'
import BlogDetailRelated from '../../pages/BlogDetail/sections/BlogDetailRelated/BlogDetailRelated'
import CtaBanner from '../CtaBanner/CtaBanner'
import Footer from '../Footer/Footer'
import type { BlogPostDetail } from '../../data/blogPostDetail'

type BlogDetailViewProps = {
  post: BlogPostDetail
}

export default function BlogDetailView({ post }: BlogDetailViewProps) {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <PageHero
        image={heroBg}
        activeLabel=""
        size="md"
        title={post.title}
        maxWidthClassName="max-w-[66.875rem]"
        gapClassName="gap-4"
        overlayClassName="bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.1)_35%,rgba(0,0,0,0.4)_100%)]"
        eyebrow={
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold tracking-[2.4px] text-[#d1d5db] uppercase">
            <span>{post.date}</span>
            <span className="size-1 rounded-full bg-[#d1d5db]" />
            <span className="text-blue">{post.readTime}</span>
            <span className="size-1 rounded-full bg-[#d1d5db]" />
            <span>By {post.author}</span>
          </div>
        }
      />
      <BlogDetailContent post={post} />
      <BlogDetailPostNav />
      <BlogDetailRelated currentSlug={post.slug} />
      <CtaBanner />
      <Footer />
    </main>
  )
}
