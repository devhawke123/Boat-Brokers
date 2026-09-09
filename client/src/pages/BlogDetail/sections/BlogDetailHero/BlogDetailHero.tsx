import heroBg from '../../../../assets/blog/blog-hero-bg.png'
import Navbar from '../../../../components/Navbar/Navbar'
import type { BlogPostDetail } from '../../../../data/blogPostDetail'
import { IconComment } from '../../icons'

type BlogDetailHeroProps = {
  post: BlogPostDetail
}

export default function BlogDetailHero({ post }: BlogDetailHeroProps) {
  return (
    <section
      className="relative flex min-h-[min(35rem,70vh)] flex-col items-center justify-center overflow-hidden rounded-3xl bg-cover bg-center p-8 text-center max-[900px]:min-h-[min(28rem,65vh)] max-[900px]:p-5 sm:p-14"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.1)_35%,rgba(0,0,0,0.4)_100%)]" />
      <Navbar activeLabel="" />

      <div className="relative z-[5] flex max-w-[66.875rem] flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold tracking-[2.4px] text-[#d1d5db] uppercase">
          <span>{post.date}</span>
          <span className="size-1 rounded-full bg-[#d1d5db]" />
          <span className="text-blue">{post.category}</span>
          <span className="size-1 rounded-full bg-[#d1d5db]" />
          <span>By {post.author}</span>
        </div>

        <h1 className="font-display text-[44px] leading-[1.2] tracking-[-1.6px] text-white capitalize sm:text-[5rem]">
          {post.title}
        </h1>

        <div className="flex items-center gap-2 pt-2 text-sm text-[#9ca3af]">
          <IconComment className="size-4" />
          <span>
            {post.commentsCount} {post.commentsCount === 1 ? 'Comment' : 'Comments'}
          </span>
        </div>
      </div>
    </section>
  )
}
