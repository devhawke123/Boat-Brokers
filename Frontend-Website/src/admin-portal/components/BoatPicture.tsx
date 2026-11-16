import { useState } from 'react'
import type { ComponentType } from 'react'
import { Sailboat } from 'lucide-react'

type PictureFallback = ComponentType<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean | 'true' | 'false' }>

// Ported from boat-brokers InventoryIdentity.jsx: thumbnail that falls back to an icon.
export function BoatPicture({ image, className = '', alt = '', fallback: Fallback = Sailboat }: { image?: string | null; className?: string; alt?: string; fallback?: PictureFallback }) {
  const [failed, setFailed] = useState(false)
  return <span className={`inventory-picture ${className}`}>{image && !failed ? <img src={image} alt={alt} onError={() => setFailed(true)} /> : <Fallback size={24} strokeWidth={1.3} aria-hidden="true" />}</span>
}
