import { useEffect, useRef } from 'react'
import ToastNotice, { type Notice } from '../../seller-portal/components/ToastNotice'

// Remain in the active dialog's focus scope, but paint at the viewport edge.
// A manual popover escapes the dialog's transformed/clipped containing block.
export default function AdminToastLayer({ notice, onClose }: { notice: Notice | null; onClose: () => void }) {
  const layer = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = layer.current
    if (!element) return
    function sync() {
      if (!element) return
      const dialogs = [...document.querySelectorAll('dialog[open]')]
      const active = notice && element.closest('dialog') === dialogs.at(-1)
      if (active && !element.matches(':popover-open')) element.showPopover()
      else if (!active && element.matches(':popover-open')) element.hidePopover()
    }
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['open'] })
    return () => { observer.disconnect(); if (element.matches(':popover-open')) element.hidePopover() }
  }, [notice])
  return <div ref={layer} popover="manual" className="inventory-toast-layer"><ToastNotice notice={notice} onClose={onClose} /></div>
}
