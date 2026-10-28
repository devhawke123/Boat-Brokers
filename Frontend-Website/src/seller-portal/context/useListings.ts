import { createContext, useContext } from 'react'
import type { ApiSeller } from '../lib/api'
import type { ClientComment, ClientListing, ClientPhoto, WizardData } from '../lib/listingAdapter'

export type ListingInput = {
  data: WizardData
  photos: ClientPhoto[]
  brochure: File | null
  existing?: ClientListing
}

export type ListingsContextValue = {
  seller: ApiSeller
  listings: ClientListing[]
  loading: boolean
  error: string | null
  // Unread broker comments, newest first.
  updates: ClientComment[]
  markRead: (id: string) => void
  markAllRead: () => void
  saveDraft: (input: ListingInput) => Promise<void>
  submitListing: (input: ListingInput) => Promise<void>
  reply: (listing: ClientListing, text: string) => Promise<void>
  setSeller: (seller: ApiSeller) => void
  signOut: () => void
}

export const ListingsContext = createContext<ListingsContextValue | null>(null)

export function useListings() {
  const context = useContext(ListingsContext)
  if (!context) throw new Error('useListings must be used within ListingsProvider')
  return context
}
