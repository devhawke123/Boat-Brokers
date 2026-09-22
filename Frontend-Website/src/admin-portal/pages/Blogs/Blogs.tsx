import AdminShell from '../../components/AdminShell/AdminShell'
import { useAdminSession } from '../../data/useAdminSession'
import { useBlogPosts, invalidateBlogPostsCache } from '../../data/useBlogPosts'
import { deleteBlogPost, type ApiBlogPostAdmin } from '../../lib/api'
import BlogsTable from './sections/BlogsTable/BlogsTable'

export default function Blogs() {
  const { checkedSession } = useAdminSession()
  const { posts, loading, error, refetch } = useBlogPosts()

  async function handleDelete(post: ApiBlogPostAdmin) {
    if (!window.confirm(`Delete blog post "${post.title}"? This can't be undone.`)) return
    try {
      await deleteBlogPost(post.id)
      invalidateBlogPostsCache()
      refetch()
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to delete blog post.')
    }
  }

  if (!checkedSession) return null

  return (
    <AdminShell mainClassName="bg-frost">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Blogs</h1>

        {error ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#fca5a5] bg-[#fef2f2] py-16 text-center text-[#b91c1c]">
            <p>Couldn&rsquo;t load blog posts from the server: {error}</p>
            <p className="text-sm text-[#6b7280]">Make sure the API server is running at http://localhost:4000.</p>
          </div>
        ) : loading ? (
          <div className="h-80 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
        ) : (
          <BlogsTable posts={posts} onDelete={handleDelete} />
        )}
      </div>
    </AdminShell>
  )
}
