import { useEffect, useState } from 'react'
import { fetchBlogPost, type ApiBlogPost } from '../lib/api'

export type BlogPostDetail = {
  slug: string
  title: string
  author: string
  date: string
  readTime: string
  image: string
  // Raw HTML pasted by an admin (e.g. from a rich text editor) — rendered as-is.
  content: string
}

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="%23e2e8f0"/></svg>',
  )

function mapApiBlogPostToDetail(post: ApiBlogPost): BlogPostDetail {
  return {
    slug: post.slug,
    title: post.title,
    author: post.author,
    date: post.date,
    readTime: post.readTime,
    image: post.imageUrl ?? FALLBACK_IMAGE,
    content: post.content,
  }
}

type BlogPostState = {
  post: BlogPostDetail | null
  loading: boolean
  error: string | null
}

export function useBlogPostBySlug(slug: string): BlogPostState {
  const [state, setState] = useState<BlogPostState>({ post: null, loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    setState({ post: null, loading: true, error: null })

    fetchBlogPost(slug)
      .then((post) => {
        if (!cancelled) setState({ post: mapApiBlogPostToDetail(post), loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({ post: null, loading: false, error: err instanceof Error ? err.message : 'Failed to load post' })
        }
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  return state
}
