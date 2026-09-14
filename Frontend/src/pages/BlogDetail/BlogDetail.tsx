import heroBg from '../../assets/blog/blog-hero-bg.png'
import PageHero from '../../components/PageHero/PageHero'
import BlogDetailContent from './sections/BlogDetailContent/BlogDetailContent'
import BlogDetailPostNav from './sections/BlogDetailPostNav/BlogDetailPostNav'
import BlogDetailRelated from './sections/BlogDetailRelated/BlogDetailRelated'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'
import { blogPostDetail } from '../../data/blogPostDetail'
import { IconComment } from './icons'

type BlogDetailProps = {
  slug: string
}

export default function BlogDetail({ slug }: BlogDetailProps) {
  const post = { ...blogPostDetail, slug }

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
            <span className="text-blue">{post.category}</span>
            <span className="size-1 rounded-full bg-[#d1d5db]" />
            <span>By {post.author}</span>
          </div>
        }
      >
        <div className="flex items-center gap-2 pt-2 text-sm text-[#9ca3af]">
          <IconComment className="size-4" />
          <span>
            {post.commentsCount} {post.commentsCount === 1 ? 'Comment' : 'Comments'}
          </span>
        </div>
      </PageHero>
      <BlogDetailContent post={post} />
      <BlogDetailPostNav post={post} />
      <BlogDetailRelated currentSlug={slug} />
      <CtaBanner />
      <Footer />
    </main>
  )
}
