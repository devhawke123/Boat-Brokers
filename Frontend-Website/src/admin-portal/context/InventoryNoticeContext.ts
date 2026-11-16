import { createContext } from 'react'
import type { Notice } from '../../seller-portal/components/ToastNotice'

export type InventoryNotice = { notice: Notice | null; onClose: () => void }

export const InventoryNoticeContext = createContext<InventoryNotice | null>(null)
