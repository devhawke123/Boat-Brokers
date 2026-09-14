import type { BlogPostDetail } from '../../../../data/blogPostDetail'

type BlogDetailPostNavProps = {
  post: BlogPostDetail
}

export default function BlogDetailPostNav({ post }: BlogDetailPostNavProps) {
  return (
    <section className="flex justify-center border-t border-[#e5e7eb] px-6 py-12 sm:px-12">
      <div className="flex w-full max-w-[73.5rem] flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <a href={post.previousPost.href} className="flex flex-col items-start gap-2">
          <span className="text-xs font-semibold tracking-[1.2px] text-[#9ca3af] uppercase">Previous Post</span>
          <span className="font-display text-lg text-[#0a1f44] capitalize">{post.previousPost.title}</span>
        </a>
        <a href={post.nextPost.href} className="flex flex-col items-start gap-2 text-left sm:items-end sm:text-right">
          <span className="text-xs font-semibold tracking-[1.2px] text-[#9ca3af] uppercase">Next Post</span>
          <span className="font-display text-lg text-[#0a1f44] capitalize">{post.nextPost.title}</span>
        </a>
      </div>
    </section>
  )
}
