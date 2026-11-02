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
        scrollHint
        maxWidthClassName="max-w-[66.875rem]"
        gapClassName="gap-4"
        titleClassName="[text-shadow:0px_0px_10px_black]"
        overlayClassName="bg-[linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.45))]"
        eyebrow={
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold tracking-[2.4px] text-[#d1d5db] uppercase [text-shadow:0px_0px_10px_black]">
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
