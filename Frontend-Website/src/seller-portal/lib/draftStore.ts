import type { WizardData } from './listingAdapter'

// Drafts never reach the server. They live in this browser's IndexedDB
// (localStorage can't hold photo Files), so they're per-device by design.
export type StoredDraft = {
  id: string
  data: WizardData
  photos: { id: string; name: string; file: File }[]
  brochure: File | null
  savedAt: string
}

const DB_NAME = 'seller-portal'
const STORE = 'drafts'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function run<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb()
  try {
    return await new Promise<T>((resolve, reject) => {
      const request = action(db.transaction(STORE, mode).objectStore(STORE))
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  } finally {
    db.close()
  }
}

export async function loadDrafts(sellerId: number): Promise<StoredDraft[]> {
  try {
    return ((await run('readonly', (store) => store.get(sellerId))) as StoredDraft[] | undefined) ?? []
  } catch {
    // Private windows can block IndexedDB; the portal still works without drafts.
    return []
  }
}

export function saveDrafts(sellerId: number, drafts: StoredDraft[]): Promise<IDBValidKey> {
  return run('readwrite', (store) => store.put(drafts, sellerId))
}
