import type { ApiBlogPostAdmin } from './api'

// Ported from boat-brokers/src/lib/blogRecords.js. Validation/sanitization and
// search match the prototype; toAdminBlogPost / buildBlogFormData adapt live
// /admin/blogs multipart payloads (display dates, optional image file).

export const BLOG_CONTENT_LIMIT = 50000
export const BLOG_IMAGE_LIMIT = 5 * 1024 * 1024
export const blogImageTypes = ['image/jpeg', 'image/png', 'image/webp']

export type BlogFormValues = {
  title: string
  author: string
  date: string
  readTime: string
  image: string
  content: string
}

export type AdminBlogPost = BlogFormValues & {
  id: string
  createdAt: string
  updatedAt: string
  slug?: string
}

export function validBlogDate(value: string | undefined) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false
  const date = new Date(value + 'T12:00:00Z')
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export function blogViewingNotice() {
  return {
    type: 'info' as const,
    title: 'Public blog preview',
    description: 'This would open the public post in a new tab. Public pages are not connected in this prototype.',
  }
}

export function normaliseReadTime(value: string | undefined) {
  const match = String(value || '').trim().match(/^([1-9]\d{0,2})\s*(?:min(?:ute)?s?(?:\s+read)?)?$/i)
  return match ? Number(match[1]) + ' min read' : ''
}

export function validateBlog(values: Partial<BlogFormValues>) {
  const errors: Partial<Record<keyof BlogFormValues, string>> = {}
  if (!values.title?.trim()) errors.title = 'Enter a post title.'
  else if (values.title.trim().length > 200) errors.title = 'Use 200 characters or fewer.'
  if (!values.author?.trim()) errors.author = 'Enter an author name.'
  else if (values.author.trim().length > 100) errors.author = 'Use 100 characters or fewer.'
  if (!validBlogDate(values.date)) errors.date = 'Choose a valid date.'
  if (!normaliseReadTime(values.readTime)) errors.readTime = 'Enter a read time, e.g. 5 min read.'
  if (String(values.content || '').length > BLOG_CONTENT_LIMIT) errors.content = 'Use 50,000 characters or fewer.'
  return errors
}

export function validateBlogImage(file: Pick<File, 'type' | 'size'>) {
  if (!blogImageTypes.includes(file.type)) return 'Choose a JPG, PNG or WebP image.'
  if (file.size > BLOG_IMAGE_LIMIT) return 'Choose an image smaller than 5 MB.'
  return ''
}

export function saveBlogRecord(posts: AdminBlogPost[], values: BlogFormValues, id?: string | null, now = new Date().toISOString()) {
  const errors = validateBlog(values)
  if (Object.keys(errors).length) throw new Error(Object.values(errors)[0])
  const original = id ? posts.find(post => post.id === id) : null
  if (id && !original) throw new Error('This post no longer exists.')
  const post: AdminBlogPost = {
    ...values,
    id: id || 'POST-' + crypto.randomUUID(),
    title: values.title.trim(),
    author: values.author.trim(),
    readTime: normaliseReadTime(values.readTime),
    content: values.content || '',
    image: values.image || '',
    createdAt: original?.createdAt || now,
    updatedAt: now,
  }
  return { post, posts: original ? posts.map(item => item.id === id ? post : item) : [post, ...posts] }
}

export function searchBlogPosts(posts: AdminBlogPost[], query = '') {
  const text = query.trim().toLowerCase()
  return posts
    .filter(post => [post.title, post.author].some(value => value.toLowerCase().includes(text)))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.date.localeCompare(a.date))
}

// Preview links never accept executable or embedded-document URL schemes.
export function safeBlogUrl(value: string | null | undefined, image = false) {
  try {
    const url = new URL(String(value || ''))
    return (image ? ['https:', 'http:'] : ['https:', 'http:', 'mailto:', 'tel:']).includes(url.protocol) ? url.href : undefined
  } catch {
    return undefined
  }
}

export function toDateInputValue(displayDate: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(displayDate)) return displayDate
  const parsed = new Date(displayDate)
  if (Number.isNaN(parsed.getTime())) return ''
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}`
}

export function toApiDate(inputValue: string) {
  const [y, m, d] = inputValue.split('-').map(Number)
  if (!y || !m || !d) return inputValue
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatBlogDate(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(value + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  const parsed = new Date(value)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  return value
}

export function toAdminBlogPost(post: ApiBlogPostAdmin): AdminBlogPost {
  return {
    id: String(post.id),
    title: post.title,
    author: post.author,
    date: toDateInputValue(post.date),
    readTime: post.readTime,
    image: post.imageUrl || '',
    content: post.content || '',
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    slug: post.slug,
  }
}

export function buildBlogFormData(values: BlogFormValues, imageFile: File | null) {
  const errors = validateBlog(values)
  if (Object.keys(errors).length) throw new Error(Object.values(errors)[0] || 'Invalid post')
  const formData = new FormData()
  formData.set('title', values.title.trim())
  formData.set('author', values.author.trim())
  formData.set('date', toApiDate(values.date))
  formData.set('readTime', normaliseReadTime(values.readTime))
  formData.set('content', values.content || '')
  if (imageFile) formData.set('image', imageFile, imageFile.name)
  return formData
}
