import { useEffect, useState } from 'react'
import { fetchBlogPosts, type ApiBlogPostSummary } from '../lib/api'
import defaultAuthorAvatar from '../assets/blog/blog-author.jpg'

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  author: string
  authorAvatar: string
  readTime: string
  image: string
}

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="%23e2e8f0"/></svg>',
  )

// The catalogue doesn't record a category or per-author avatar yet — every
// post defaults to these until an admin panel manages them individually.
function mapApiBlogPostToSummary(post: ApiBlogPostSummary): BlogPost {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    category: 'Blog',
    author: post.author,
    authorAvatar: defaultAuthorAvatar,
    readTime: post.readTime,
    image: post.imageUrl ?? FALLBACK_IMAGE,
  }
}

type BlogPostsState = {
  posts: BlogPost[]
  loading: boolean
  error: string | null
}

let cache: BlogPost[] | null = null
let inflight: Promise<BlogPost[]> | null = null

function loadBlogPosts(): Promise<BlogPost[]> {
  if (cache) return Promise.resolve(cache)
  if (!inflight) {
    inflight = fetchBlogPosts()
      .then((posts) => {
        cache = posts.map(mapApiBlogPostToSummary)
        return cache
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

export function useBlogPosts(): BlogPostsState {
  const [state, setState] = useState<BlogPostsState>({ posts: cache ?? [], loading: !cache, error: null })

  useEffect(() => {
    if (cache) {
      setState({ posts: cache, loading: false, error: null })
      return
    }
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    loadBlogPosts()
      .then((posts) => {
        if (!cancelled) setState({ posts, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({ posts: [], loading: false, error: err instanceof Error ? err.message : 'Failed to load posts' })
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
