import { useState, type FormEvent } from 'react'
import AdminShell from '../../components/AdminShell/AdminShell'
import { useAdminSession } from '../../data/useAdminSession'
import { useBlogPostById, invalidateBlogPostsCache } from '../../data/useBlogPosts'
import { createBlogPost, updateBlogPost } from '../../lib/api'
import { TextField, TextareaField, FieldRow } from '../../../seller-portal/components/FormField/FormField'
import Button from '../../../components/Button/Button'

type BlogPostFormProps = {
  postId?: number
}

export default function BlogPostForm({ postId }: BlogPostFormProps) {
  const { checkedSession } = useAdminSession()
  const isEdit = postId !== undefined
  const { post, loading } = useBlogPostById(postId ?? -1)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [date, setDate] = useState('')
  const [readTime, setReadTime] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [initialized, setInitialized] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Populate the form once the existing post loads (edit mode only).
  if (isEdit && post && !initialized) {
    setTitle(post.title)
    setAuthor(post.author)
    setDate(post.date)
    setReadTime(post.readTime)
    setContent(post.content)
    setInitialized(true)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)

    const formData = new FormData()
    formData.set('title', title)
    formData.set('author', author)
    formData.set('date', date)
    formData.set('readTime', readTime)
    formData.set('content', content)
    if (image) formData.set('image', image, image.name)

    try {
      if (isEdit && postId !== undefined) {
        await updateBlogPost(postId, formData)
        invalidateBlogPostsCache()
        window.location.href = '/admin-portal/blogs'
      } else {
        await createBlogPost(formData)
        invalidateBlogPostsCache()
        window.location.href = '/admin-portal/blogs'
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save blog post.')
      setSaving(false)
    }
  }

  if (!checkedSession) return null
  if (isEdit && loading) {
    return (
      <AdminShell mainClassName="bg-frost">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="h-96 w-full max-w-3xl animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
        </div>
      </AdminShell>
    )
  }
  if (isEdit && !post) {
    return (
      <AdminShell mainClassName="bg-frost">
        <div className="flex flex-col items-center gap-2 p-8 text-center text-[#64748b]">
          <p>This blog post couldn&rsquo;t be found.</p>
          <a href="/admin-portal/blogs" className="text-sm font-semibold text-[#2563eb]">
            Back to Blogs
          </a>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell mainClassName="bg-frost">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">{isEdit ? 'Edit Blog Post' : 'Add New Blog Post'}</h1>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-3xl flex-col gap-4 rounded-lg border border-[#e2e8f0] bg-white p-6"
        >
          <TextField label="Title" required value={title} onChange={setTitle} placeholder="Post title" />

          <FieldRow>
            <TextField label="Author" required value={author} onChange={setAuthor} placeholder="Jane Smith" />
            <TextField label="Date" required value={date} onChange={setDate} placeholder="12 Mar 2026" />
            <TextField label="Read Time" required value={readTime} onChange={setReadTime} placeholder="5 min read" />
          </FieldRow>

          {post?.imageUrl && !image && (
            <div className="flex items-center gap-3">
              <img src={post.imageUrl} alt="" className="size-16 rounded-lg object-cover" />
              <span className="text-xs text-[#64748b]">Current image — choose a file below to replace it</span>
            </div>
          )}
          <label className="flex flex-col gap-2">
            <span className="text-[12px] font-bold tracking-[0.6px] text-[#64748b] uppercase">Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="text-sm text-[#0f172a] file:mr-3 file:rounded-md file:border-0 file:bg-[#f1f5f9] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-[#0f172a]"
            />
          </label>

          <TextareaField
            label="Content (HTML)"
            value={content}
            onChange={setContent}
            placeholder="<p>Paste post content here...</p>"
            maxLength={50000}
          />

          {error && <p className="text-sm font-medium text-[#dc2626]">{error}</p>}

          <div className="flex items-center gap-3">
            <Button type="submit" variant="dark" label={saving ? 'Saving…' : 'Save Post'} icon="none" disabled={saving} />
            <a href="/admin-portal/blogs" className="text-sm font-semibold text-[#64748b] hover:text-[#0f172a]">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </AdminShell>
  )
}
