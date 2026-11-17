import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, FileText, ImagePlus, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import type { Notice } from '../../seller-portal/components/ToastNotice'
import { createBlogPost, deleteBlogPost, updateBlogPost } from '../lib/api'
import {
  BLOG_CONTENT_LIMIT,
  buildBlogFormData,
  formatBlogDate,
  openPublicBlogPost,
  searchBlogPosts,
  toAdminBlogPost,
  validateBlog,
  validateBlogImage,
} from '../lib/blogRecords'
import type { AdminBlogPost, BlogFormValues } from '../lib/blogRecords'
import { useBlogPosts, invalidateBlogPostsCache } from '../data/useBlogPosts'
import { InventoryNoticeContext } from '../context/InventoryNoticeContext'
import { AccountButton, AccountField } from './AdminAccountSettings'
import AdminSelectField from './AdminSelectField'
import { AdminActionButton, AdminResultsBody } from './AdminInteraction'
import AdminRecordOverlay from './AdminRecordOverlay'
import InventoryActionMenu from './InventoryActionMenu'
import { BoatPicture } from './BoatPicture'
import '../styles/admin-leads.css'
import '../styles/admin-inventory.css'
import '../styles/admin-blogs.css'

// Ported from boat-brokers/src/components/AdminBlogs.jsx. List + /blogs/new +
// /blogs/:id/edit screens and sticky action bar match the prototype; create /
// update / delete use multipart /admin/blogs APIs via useBlogPosts.

const blank = (): BlogFormValues => ({ title: '', author: '', date: '', readTime: '', image: '', content: '' })
const safeReturn = (value: unknown) => typeof value === 'string' && (value === '/blogs' || value.startsWith('/blogs?')) ? value : '/blogs'
const initialsOf = (name: string) => name.replace(/^The\s+/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('').toUpperCase()
const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Please try again.'

function PartyIdentity({ name = 'Not recorded' }: { name?: string }) {
  return <div className="inventory-person"><span className="lead-avatar" aria-hidden="true">{initialsOf(name)}</span><div><strong>{name}</strong></div></div>
}

function DeletePost({ post, onClose, onConfirm, busy }: {
  post: AdminBlogPost
  onClose: () => void
  onConfirm: () => void
  busy: boolean
}) {
  const keep = useRef<HTMLButtonElement>(null)
  return (
    <AdminRecordOverlay
      modal
      noClose
      title="Delete post?"
      subject={post.title}
      onClose={() => { if (!busy) onClose() }}
      initialFocusRef={keep}
      footer={
        <>
          <AccountButton ref={keep} onClick={onClose} disabled={busy}>Keep post</AccountButton>
          <AccountButton kind="primary" className="blogs-delete-confirm" disabled={busy} onClick={onConfirm}>
            {busy ? 'Deleting…' : 'Delete post'}
          </AccountButton>
        </>
      }
    >
      <p className="inventory-muted">This removes the post and its image from this prototype. This cannot be undone.</p>
    </AdminRecordOverlay>
  )
}

function BlogEditor({ post, onSave, onCancel, busy }: {
  post: AdminBlogPost | null
  onSave: (values: BlogFormValues, imageFile: File | null) => Promise<void> | void
  onCancel: () => void
  busy: boolean
}) {
  const [values, setValues] = useState<BlogFormValues>(() => post ? {
    title: post.title,
    author: post.author,
    date: post.date,
    readTime: post.readTime,
    image: post.image,
    content: post.content,
  } : blank())
  const [errors, setErrors] = useState<Partial<Record<keyof BlogFormValues, string>>>({})
  const [discard, setDiscard] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const form = useRef<HTMLFormElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const file = useRef<HTMLInputElement>(null)
  const upload = useRef({ version: 0 })
  const keep = useRef<HTMLButtonElement>(null)
  const objectUrl = useRef<string | null>(null)
  const [initial] = useState(() => JSON.stringify(post ? {
    title: post.title,
    author: post.author,
    date: post.date,
    readTime: post.readTime,
    image: post.image,
    content: post.content,
  } : blank()))
  const dirty = JSON.stringify(values) !== initial || Boolean(imageFile)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    heading.current?.focus({ preventScroll: true })
    const tracker = upload.current
    return () => {
      tracker.version++
      if (objectUrl.current) {
        URL.revokeObjectURL(objectUrl.current)
        objectUrl.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  function change(key: keyof BlogFormValues, value: string) {
    setValues(current => ({ ...current, [key]: value }))
    setErrors(current => ({ ...current, [key]: '' }))
    setSaveError('')
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    if (uploading || busy) return
    const next = validateBlog(values)
    setErrors(next)
    if (Object.keys(next).length) {
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid=true]')?.focus())
      return
    }
    try {
      await onSave(values, imageFile)
    } catch (problem) {
      setSaveError(errorMessage(problem))
    }
  }

  function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0]
    event.target.value = ''
    if (!selected) return
    const token = ++upload.current.version
    const error = validateBlogImage(selected)
    setErrors(current => ({ ...current, image: error }))
    if (error) {
      setUploading(false)
      return
    }
    setUploading(true)
    const reader = new FileReader()
    const fail = () => {
      if (token === upload.current.version) {
        setUploading(false)
        setErrors(current => ({ ...current, image: 'This image could not be read. Choose another file.' }))
      }
    }
    reader.onerror = fail
    reader.onload = () => {
      const image = new Image()
      image.onerror = fail
      image.onload = () => {
        if (token !== upload.current.version) return
        if (objectUrl.current) URL.revokeObjectURL(objectUrl.current)
        const preview = URL.createObjectURL(selected)
        objectUrl.current = preview
        setImageFile(selected)
        change('image', preview)
        setUploading(false)
      }
      image.src = String(reader.result)
    }
    reader.readAsDataURL(selected)
  }

  function clearImage() {
    upload.current.version++
    setUploading(false)
    setImageFile(null)
    if (objectUrl.current) {
      URL.revokeObjectURL(objectUrl.current)
      objectUrl.current = null
    }
    change('image', '')
  }

  return (
    <>
      <div className="leads-heading blogs-editor-heading">
        <h1 ref={heading} tabIndex={-1}>{post ? 'Edit post' : 'Add new post'}</h1>
      </div>
      <form ref={form} id="admin-blog-form" className="blogs-editor-layout" onSubmit={save} noValidate>
        <section className="blogs-editor-panel blogs-editor-meta v2-glass-surface" aria-labelledby="blog-details-heading">
          <h2 id="blog-details-heading">Post details</h2>
          <AccountField label="Title" name="title" required maxLength={200} placeholder="Post title" value={values.title} error={errors.title} onChange={event => change('title', event.target.value)} />
          <AccountField label="Author" name="author" required maxLength={100} placeholder="e.g. Jane Smith" value={values.author} error={errors.author} onChange={event => change('author', event.target.value)} />
          <div className="blogs-editor-pair">
            <AccountField label="Date" name="date" type="date" required value={values.date} error={errors.date} onChange={event => change('date', event.target.value)} />
            <AccountField label="Read time" name="readTime" required maxLength={40} placeholder="e.g. 5 min read" value={values.readTime} error={errors.readTime} onChange={event => change('readTime', event.target.value)} />
          </div>
          <div className="blogs-image-field">
            <h3>Image</h3>
            {values.image && (
              <div className="blogs-editor-image">
                <BoatPicture fallback={FileText} key={values.image} image={values.image} alt="Current post image" />
              </div>
            )}
            <input ref={file} type="file" className="sr-only" tabIndex={-1} aria-label="Choose post image" accept="image/jpeg,image/png,image/webp" onChange={selectImage} />
            <div className="blogs-image-actions">
              <AccountButton onClick={() => file.current?.click()} disabled={uploading || busy}>
                <ImagePlus size={16} />{values.image ? 'Replace image' : 'Choose image'}
              </AccountButton>
              {values.image && (
                <AccountButton aria-label="Remove post image" onClick={clearImage} disabled={busy}>
                  <X size={16} />
                </AccountButton>
              )}
            </div>
            <p className="blogs-field-hint">JPG, PNG or WebP · up to 5 MB</p>
            {errors.image && <p className="v2-settings-error" role="alert">{errors.image}</p>}
          </div>
        </section>
        <section className="blogs-editor-panel blogs-editor-content v2-glass-surface" aria-labelledby="blog-content-heading">
          <div className="blogs-content-heading"><h2 id="blog-content-heading">Article content</h2></div>
          <AccountField label="Content (HTML)" name="content" multiline rows={24} maxLength={BLOG_CONTENT_LIMIT} value={values.content} error={errors.content} placeholder="<p>Write or paste your article here…</p>" onChange={event => change('content', event.target.value)} />
          <p className="blogs-character-count">{values.content.length.toLocaleString('en-GB')} / 50,000</p>
          {saveError && <p className="v2-settings-error" role="alert">{saveError}</p>}
        </section>
      </form>
      <footer className="blogs-editor-footer" aria-label="Post actions">
        <div className="blogs-editor-actionbar v2-glass-surface">
          <AccountButton onClick={() => dirty ? setDiscard(true) : onCancel()} disabled={busy}>Cancel</AccountButton>
          <AccountButton kind="primary" type="submit" form="admin-blog-form" disabled={uploading || busy}>
            {uploading ? 'Reading image…' : busy ? 'Saving…' : 'Save post'}
          </AccountButton>
        </div>
      </footer>
      <AnimatePresence>
        {discard && (
          <AdminRecordOverlay
            modal
            noClose
            title="Discard changes?"
            subject={post?.title}
            onClose={() => setDiscard(false)}
            initialFocusRef={keep}
            footer={
              <>
                <AccountButton ref={keep} onClick={() => setDiscard(false)}>Keep editing</AccountButton>
                <AccountButton kind="primary" onClick={onCancel}>Discard changes</AccountButton>
              </>
            }
          >
            <p className="inventory-muted">Your unsaved changes will be lost.</p>
          </AdminRecordOverlay>
        )}
      </AnimatePresence>
    </>
  )
}

export default function AdminBlogs({ notice, onNotice, onDismissNotice }: {
  notice: Notice | null
  onNotice: (notice: Notice) => void
  onDismissNotice: () => void
}) {
  const { posts: apiPosts, loading, error, refetch } = useBlogPosts()
  const blogPosts = useMemo(() => apiPosts.map(toAdminBlogPost), [apiPosts])
  const navigate = useNavigate()
  const location = useLocation()
  const { '*': path = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const [deleting, setDeleting] = useState<AdminBlogPost | null>(null)
  const [busy, setBusy] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const restoreHeading = useRef(false)
  const query = params.get('q') || ''
  const perPage = [10, 20, 50].includes(Number(params.get('size'))) ? Number(params.get('size')) : 10
  const matches = searchBlogPosts(blogPosts, query)
  const pages = Math.max(1, Math.ceil(matches.length / perPage))
  const page = Math.max(1, Math.min(Math.trunc(Number(params.get('page'))) || 1, pages))
  const rows = matches.slice((page - 1) * perPage, page * perPage)
  const editorId = path.endsWith('/edit') ? path.slice(0, -5) : null
  const editing = editorId ? blogPosts.find(post => post.id === editorId) : undefined
  const editor = path === 'new' || Boolean(editorId)
  const listParams = new URLSearchParams(params)
  listParams.delete('post')
  const listUrl = '/blogs' + (listParams.size ? '?' + listParams : '')
  const returnTo = safeReturn((location.state as { returnTo?: string } | null)?.returnTo)

  useEffect(() => {
    document.title = (editor ? editing ? 'Edit post' : 'Add new post' : 'Blogs') + ' · Admin · The Boat Brokers'
    if (!editor) {
      heading.current?.focus({ preventScroll: true })
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [editor, editing])

  function change(values: Record<string, string | null | undefined>) {
    const next = new URLSearchParams(params)
    Object.entries(values).forEach(([key, value]) => value ? next.set(key, value) : next.delete(key))
    setParams(next, { replace: true })
  }

  function refresh() {
    invalidateBlogPostsCache()
    refetch()
  }

  function view(post: AdminBlogPost) {
    const result = openPublicBlogPost(post)
    if (!result.ok) onNotice(result.notice)
  }

  function edit(post: AdminBlogPost) {
    navigate('/blogs/' + encodeURIComponent(post.id) + '/edit', { state: { returnTo: listUrl } })
  }

  async function save(values: BlogFormValues, imageFile: File | null) {
    setBusy(true)
    try {
      const formData = buildBlogFormData(values, imageFile)
      if (editing) await updateBlogPost(Number(editing.id), formData)
      else await createBlogPost(formData)
      refresh()
      navigate(returnTo)
      onNotice({ type: 'success', title: editing ? 'Post updated' : 'Post added', description: values.title.trim() })
    } catch (err) {
      onNotice({ type: 'error', title: editing ? 'Post not updated' : 'Post not added', description: errorMessage(err) })
      throw err
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!deleting || busy) return
    setBusy(true)
    try {
      await deleteBlogPost(Number(deleting.id))
      onNotice({ type: 'success', title: 'Post deleted', description: deleting.title })
      restoreHeading.current = true
      setDeleting(null)
      refresh()
    } catch (err) {
      onNotice({ type: 'error', title: 'Post not deleted', description: errorMessage(err) })
    } finally {
      setBusy(false)
    }
  }

  if (editorId && !loading && !editing) {
    return (
      <div className="leads-empty">
        <FileText size={28} />
        <h1>Post not found</h1>
        <AccountButton onClick={() => navigate('/blogs')}>Back to Blogs</AccountButton>
      </div>
    )
  }
  if (path && !editor) {
    return (
      <div className="leads-empty">
        <FileText size={28} />
        <h1>Post not found</h1>
        <AccountButton onClick={() => navigate('/blogs')}>Back to Blogs</AccountButton>
      </div>
    )
  }
  if (editorId && loading && !editing) {
    return <div className="leads-empty"><FileText size={28} /><h1>Loading post…</h1></div>
  }

  return (
    <InventoryNoticeContext.Provider value={{ notice, onClose: onDismissNotice }}>
      {editor ? (
        <BlogEditor key={editorId || 'new'} post={editing || null} onSave={save} onCancel={() => navigate(returnTo)} busy={busy} />
      ) : (
        <>
          <div className="leads-heading">
            <h1 ref={heading} tabIndex={-1}>Blogs</h1>
            <AccountButton kind="primary" onClick={() => navigate('/blogs/new', { state: { returnTo: listUrl } })}>
              <Plus size={16} />Add new post
            </AccountButton>
          </div>
          <section className="leads-list blogs-list" aria-label="Blog posts">
            <div className="leads-toolbar">
              <div className="leads-search">
                <Search size={16} aria-hidden="true" />
                <input type="search" aria-label="Search blog posts" placeholder="Search posts or authors…" value={query} onChange={event => change({ q: event.target.value, page: null })} />
                {query && <AdminActionButton aria-label="Clear blog search" onClick={() => change({ q: null, page: null })}><X size={15} /></AdminActionButton>}
              </div>
            </div>
            <div className="inventory-table-scroll" role="region" aria-label="Blog posts table" tabIndex={0}>
              <table className="inventory-table is-blogs">
                <thead>
                  <tr>{['Post', 'Author', 'Date', 'Read time', 'Actions'].map(label => <th key={label} scope="col">{label}</th>)}</tr>
                </thead>
                <AdminResultsBody identity={JSON.stringify([query, page, perPage, loading])}>
                  {rows.map(post => (
                    <motion.tr key={post.id} onClick={() => view(post)}>
                      <td>
                        <div className="inventory-row-boat">
                          <BoatPicture fallback={FileText} image={post.image} />
                          <AdminActionButton className="blogs-post-title" title={post.title} onClick={event => { event.stopPropagation(); view(post) }}>{post.title}</AdminActionButton>
                        </div>
                      </td>
                      <td><PartyIdentity name={post.author} /></td>
                      <td><time dateTime={post.date}>{formatBlogDate(post.date || post.createdAt)}</time></td>
                      <td>{post.readTime}</td>
                      <td>
                        <div className="blogs-row-actions" onClick={event => event.stopPropagation()}>
                          <InventoryActionMenu
                            label={'Post actions: ' + post.title}
                            items={[
                              { label: 'Edit', icon: Pencil, onSelect: () => edit(post) },
                              { label: 'Delete', icon: Trash2, onSelect: () => setDeleting(post) },
                            ]}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AdminResultsBody>
              </table>
            </div>
            {!rows.length && (
              <div className="leads-empty">
                <FileText size={26} />
                <h2>{loading ? 'Loading posts…' : error ? 'Couldn’t load posts' : query ? 'No posts found' : 'No blog posts yet'}</h2>
                <p>{error && !loading ? error : query ? 'Try another title or author.' : loading ? 'Fetching blog posts.' : 'Add your first post to get started.'}</p>
                {error && !loading
                  ? <AccountButton onClick={refresh}>Try again</AccountButton>
                  : query ? <AccountButton onClick={() => change({ q: null, page: null })}>Clear search</AccountButton> : null}
              </div>
            )}
            <footer className="leads-pagination blogs-pagination">
              <p role="status">{matches.length ? (page - 1) * perPage + 1 + '–' + Math.min(page * perPage, matches.length) + ' of ' + matches.length + ' posts' : '0 posts'}</p>
              <div className="blogs-page-controls">
                <AdminActionButton aria-label="Previous page" disabled={page === 1} onClick={() => change({ page: String(page - 1) })}><ChevronLeft size={16} /></AdminActionButton>
                <span>{page} / {pages}</span>
                <AdminActionButton aria-label="Next page" disabled={page === pages} onClick={() => change({ page: String(page + 1) })}><ChevronRight size={16} /></AdminActionButton>
              </div>
              <div className="blogs-page-size">
                <AdminSelectField label="Posts per page" labelHidden collection variant="v2" value={String(perPage)} options={['10', '20', '50']} onChange={event => change({ size: event.target.value, page: null })} />
                <span>per page</span>
              </div>
            </footer>
          </section>
        </>
      )}
      <AnimatePresence onExitComplete={() => {
        if (restoreHeading.current) {
          heading.current?.focus({ preventScroll: true })
          restoreHeading.current = false
        }
      }}>
        {deleting && <DeletePost post={deleting} onClose={() => setDeleting(null)} onConfirm={remove} busy={busy} />}
      </AnimatePresence>
    </InventoryNoticeContext.Provider>
  )
}
