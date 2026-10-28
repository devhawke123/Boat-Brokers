import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  addListingComment,
  createBoat,
  updateBoat,
  updateListingPreferences,
  updateListingStatus,
  updateSeller,
  type ApiSeller,
} from '../lib/api'
import { useBoatListings } from '../data/useBoatListings'
import { loadDrafts, saveDrafts, type StoredDraft } from '../lib/draftStore'
import { boatFormData, parsePrice, readIdsKey, sellerListings, type ClientListing } from '../lib/listingAdapter'
import { ListingsContext, type ListingInput } from './useListings'
import { useSession } from './useSession'

function readStoredIds(key: string): string[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(saved) ? saved.filter((id) => typeof id === 'string') : []
  } catch {
    return []
  }
}

// ponytail: object URLs for draft photos are never revoked — revoking in an
// effect cleanup breaks them under StrictMode, and drafts are few and small.
function draftToListing(draft: StoredDraft): ClientListing {
  const savedAt = draft.savedAt.slice(0, 10)
  return {
    id: draft.id,
    name: draft.data.boatName.trim() || 'Untitled boat',
    type: draft.data.boatType,
    price: parsePrice(draft.data.askingPrice),
    submittedAt: savedAt,
    updatedAt: savedAt,
    status: 'Draft',
    details: draft.data,
    photos: draft.photos.map((photo) => ({ ...photo, src: URL.createObjectURL(photo.file) })),
    brochureFile: draft.brochure ?? undefined,
    comments: [],
  }
}

export function ListingsProvider({ seller, children }: { seller: ApiSeller; children: ReactNode }) {
  const { setSeller } = useSession()
  const { listings: apiListings, loading, error, refetch } = useBoatListings()
  const [drafts, setDrafts] = useState<StoredDraft[]>([])
  const [draftsLoaded, setDraftsLoaded] = useState(false)
  const [readIds, setReadIds] = useState(() => readStoredIds(readIdsKey(seller)))

  useEffect(() => {
    let cancelled = false
    loadDrafts(seller.id).then((stored) => {
      if (cancelled) return
      setDrafts(stored)
      setDraftsLoaded(true)
    })
    return () => {
      cancelled = true
    }
  }, [seller.id])

  const draftListings = useMemo(() => drafts.map(draftToListing), [drafts])
  const listings = useMemo(() => [...draftListings, ...sellerListings(apiListings, seller)], [draftListings, apiListings, seller])
  const updates = useMemo(
    () =>
      listings
        .flatMap((listing) => listing.comments)
        .filter((comment) => !comment.fromSeller && !readIds.includes(comment.id))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [listings, readIds],
  )

  function persistReadIds(next: string[]) {
    setReadIds(next)
    try {
      localStorage.setItem(readIdsKey(seller), JSON.stringify(next))
    } catch {
      // Read state just won't survive a reload.
    }
  }

  async function writeDrafts(next: StoredDraft[]) {
    await saveDrafts(seller.id, next)
    setDrafts(next)
  }

  async function saveDraft({ data, photos, brochure, existing }: ListingInput) {
    const id = existing?.status === 'Draft' ? existing.id : `draft-${Date.now()}`
    const draft: StoredDraft = {
      id,
      data,
      // Drafts are only offered for new listings, so every photo is a local File.
      photos: photos.flatMap((photo) => (photo.file ? [{ id: photo.id, name: photo.name, file: photo.file }] : [])),
      brochure,
      savedAt: new Date().toISOString(),
    }
    await writeDrafts([draft, ...drafts.filter((item) => item.id !== id)])
  }

  async function submitListing({ data, photos, brochure, existing }: ListingInput) {
    if (existing?.listingId && existing.boatId) {
      await updateBoat(existing.boatId, boatFormData({ data, photos, brochure, sellerId: seller.id, editing: true }))
      await updateListingPreferences(existing.listingId, {
        sellTimeline: data.sellTimeline,
        contactTime: data.contactTime,
        listerType: data.sellerType,
        additionalNotes: data.notes.trim(),
        agreedToContact: true,
      })
      // An edited rejected listing goes back into the broker's review queue.
      if (existing.status === 'Rejected') await updateListingStatus(existing.listingId, 'PENDING')
    } else {
      await createBoat(boatFormData({ data, photos, brochure, sellerId: seller.id, editing: false }))
      if (existing?.status === 'Draft') await writeDrafts(drafts.filter((item) => item.id !== existing.id))
    }
    refetch()
    // Phone and city live on the seller record. The listing is already saved,
    // so a failure here must not surface as a failed submit (that invites a
    // second, duplicate submission).
    const phone = data.phone.trim()
    const location = data.city.trim()
    if (phone !== (seller.phone ?? '') || location !== (seller.location ?? '')) {
      updateSeller(seller.id, { phone, location })
        .then(setSeller)
        .catch(() => undefined)
    }
  }

  async function reply(listing: ClientListing, text: string) {
    if (!listing.listingId) return
    await addListingComment(listing.listingId, text, seller.name, { fromSeller: true })
    refetch()
  }

  return (
    <ListingsContext.Provider
      value={{
        seller,
        listings,
        loading: loading || !draftsLoaded,
        error,
        updates,
        markRead: (id) => persistReadIds([...readIds, id]),
        markAllRead: () => persistReadIds([...readIds, ...updates.map((comment) => comment.id)]),
        saveDraft,
        submitListing,
        reply,
        setSeller: (next) => setSeller(next),
        signOut: () => setSeller(null),
      }}
    >
      {children}
    </ListingsContext.Provider>
  )
}
