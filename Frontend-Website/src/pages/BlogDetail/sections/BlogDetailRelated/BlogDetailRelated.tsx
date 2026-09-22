import { useBlogPosts } from '../../../../data/blogPosts'
import BlogCard from '../../../Blog/sections/BlogListing/BlogCard'

type BlogDetailRelatedProps = {
  currentSlug: string
}

export default function BlogDetailRelated({ currentSlug }: BlogDetailRelatedProps) {
  const { posts } = useBlogPosts()
  const relatedPosts = posts.filter((post) => post.slug !== currentSlug).slice(0, 3)

  if (relatedPosts.length === 0) return null

  return (
    <section className="flex flex-col items-center gap-8 bg-white px-6 pb-16 sm:gap-12 sm:px-12 sm:pb-24">
      <h3 className="font-display text-[34px] leading-[1.2] tracking-[-2px] text-black capitalize sm:text-[3.375rem]">
        Related Reading
      </h3>
      <div className="flex w-full max-w-[80rem] snap-x snap-mandatory gap-6 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <div key={post.slug} className="w-[85%] shrink-0 snap-start sm:w-full">
            <BlogCard post={post} />
          </div>
        ))}
      </div>
    </section>
  )
}
