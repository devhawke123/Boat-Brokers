import type { BlogPost } from '../../../../data/blogPosts'
import { IconArrowRight, IconClock } from './icons'

type BlogCardProps = {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="flex flex-col items-start rounded-xl border border-[#bedfeb] bg-[#fafeff] p-4 pb-8 transition-colors duration-150 hover:bg-[#e8f9ff] sm:p-5 sm:pb-8">
      <a href={`/blog/${post.slug}`} className="mb-6 aspect-[378/284] w-full overflow-hidden rounded-lg">
        <img src={post.image} alt={post.title} className="size-full object-cover" />
      </a>

      <p className="mb-3 text-[10px] font-bold tracking-[1px] text-navy-dark uppercase">
        {post.date} · {post.category}
      </p>

      <h3 className="mb-4 font-display text-xl leading-[1.3] tracking-[-1px] text-[#0a1a2f] capitalize">
        <a href={`/blog/${post.slug}`}>{post.title}</a>
      </h3>

      <p className="mb-6 line-clamp-2 text-base leading-[26px] text-[#4a5568]">{post.excerpt}</p>

      <a
        href={`/blog/${post.slug}`}
        className="mb-6 inline-flex items-center gap-1 text-[10px] font-bold tracking-[1px] text-[#0a1a2f] uppercase"
      >
        Continue Reading
        <IconArrowRight className="size-3" />
      </a>

      <div className="flex w-full items-center justify-between border-t border-[#e5e7eb] pt-4">
        <div className="flex items-center gap-2">
          <img src={post.authorAvatar} alt={post.author} className="size-6 rounded-full object-cover" />
          <span className="text-[11px] font-medium text-[#0a1a2f]">{post.author}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#9ca3af]">
          <IconClock className="size-3" />
          <span>{post.readTime}</span>
        </div>
      </div>
    </article>
  )
}
