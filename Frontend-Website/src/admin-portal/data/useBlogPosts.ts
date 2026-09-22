import { useEffect, useState } from 'react'
import { fetchBlogPostsAdmin, type ApiBlogPostAdmin } from '../lib/api'

type BlogPostsState = {
  posts: ApiBlogPostAdmin[]
  loading: boolean
  error: string | null
}

let cache: ApiBlogPostAdmin[] | null = null
let inflight: Promise<ApiBlogPostAdmin[]> | null = null

function loadBlogPosts(): Promise<ApiBlogPostAdmin[]> {
  if (cache) return Promise.resolve(cache)
  if (!inflight) {
    inflight = fetchBlogPostsAdmin()
      .then((posts) => {
        cache = posts
        return cache
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

export function invalidateBlogPostsCache() {
  cache = null
}

export function useBlogPosts(): BlogPostsState & { refetch: () => void } {
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
          setState({ posts: [], loading: false, error: err instanceof Error ? err.message : 'Failed to load blog posts' })
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return {
    ...state,
    refetch: () => {
      invalidateBlogPostsCache()
      setState((s) => ({ ...s, loading: true }))
      loadBlogPosts()
        .then((posts) => setState({ posts, loading: false, error: null }))
        .catch((err: unknown) =>
          setState({ posts: [], loading: false, error: err instanceof Error ? err.message : 'Failed to load blog posts' }),
        )
    },
  }
}

export function useBlogPostById(id: number) {
  const { posts, loading, error } = useBlogPosts()
  const post = posts.find((p) => p.id === id) ?? null
  return { post, loading, error }
}
