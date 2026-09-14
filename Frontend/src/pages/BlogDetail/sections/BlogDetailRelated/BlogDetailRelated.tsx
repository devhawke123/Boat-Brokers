import { blogPosts } from '../../../../data/blogPosts'
import BlogCard from '../../../Blog/sections/BlogListing/BlogCard'

type BlogDetailRelatedProps = {
  currentSlug: string
}

export default function BlogDetailRelated({ currentSlug }: BlogDetailRelatedProps) {
  const relatedPosts = blogPosts.filter((post) => post.slug !== currentSlug).slice(0, 3)

  if (relatedPosts.length === 0) return null

  return (
    <section className="flex flex-col items-center gap-8 bg-white px-6 pb-16 sm:gap-12 sm:px-12 sm:pb-24">
      <h3 className="font-display text-[34px] leading-[1.2] tracking-[-2px] text-black capitalize sm:text-[3.375rem]">
        Related Reading
      </h3>
      <div className="grid w-full max-w-[80rem] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
