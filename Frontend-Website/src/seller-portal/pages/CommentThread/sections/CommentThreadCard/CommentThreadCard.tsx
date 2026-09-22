import { useState } from 'react'
import Button from '../../../../../components/Button/Button'
import { addListingComment, type ApiListingComment } from '../../../../lib/api'
import { formatDateTime } from '../../../../lib/formatDate'

type CommentThreadCardProps = {
  listingId: number
  comments: ApiListingComment[]
  sellerName: string
  onCommentPosted: () => void
  // True (default) when the person replying is the seller — used by the
  // seller portal. The admin portal reuses this same card for its own
  // comment thread and passes false so its replies are attributed correctly.
  fromSeller?: boolean
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function CommentThreadCard({
  listingId,
  comments,
  sellerName,
  onCommentPosted,
  fromSeller = true,
}: CommentThreadCardProps) {
  const [draft, setDraft] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Comments and their replies shown as one flat, most-recent-first timeline.
  const allComments = comments
    .flatMap((comment) => [comment, ...comment.replies])
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  async function submitReply() {
    const content = draft.trim()
    if (!content || submitting) return

    setSubmitting(true)
    setError(null)
    try {
      await addListingComment(listingId, content, sellerName, { fromSeller })
      setDraft('')
      onCommentPosted()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post reply. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="border-b border-[#f3f4f6] px-8 py-5">
        <h2 className="text-lg font-semibold text-[#102a43]">Comments ({allComments.length})</h2>
      </div>

      <div className="flex flex-col">
        {allComments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-4 border-t border-[#f3f4f6] px-8 py-6 first:border-t-0">
            <span
              className={
                comment.fromSeller
                  ? 'flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0b3a58] text-xs font-bold text-white'
                  : 'flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eff6ff] text-xs font-bold text-[#0b3a58]'
              }
            >
              {initials(comment.author ?? (comment.fromSeller ? 'Seller' : 'Anonymous'))}
            </span>
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-[#102a43]">
                  {comment.author ?? (comment.fromSeller ? 'Seller' : 'Anonymous')}
                </span>
                <span className="text-xs text-[#829ab1]">{formatDateTime(comment.createdAt)}</span>
              </div>
              <p className="text-base text-[#334e68]">{comment.content}</p>
            </div>
          </div>
        ))}

        {allComments.length === 0 && (
          <div className="px-8 py-10 text-center text-sm text-[#64748b]">No comments on this listing yet.</div>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-[#f3f4f6] p-8">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submitReply()
            }}
            placeholder="Type your reply here..."
            className="h-[3.25rem] flex-1 rounded-xl border border-[#e5e7eb] px-6 text-base text-[#0f172a] placeholder:text-[#9ca3af] focus:border-navy-dark focus:outline-none"
          />
          <Button variant="dark" label={submitting ? 'Sending...' : 'Send'} onClick={submitReply} disabled={submitting} />
        </div>
        {error && <p className="text-xs font-medium text-[#dc2626]">{error}</p>}
      </div>
    </div>
  )
}
