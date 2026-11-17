import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, LogOut, Settings } from 'lucide-react'
import { EASE, inventoryMotion, quick } from '../../seller-portal/lib/motion'
import type { Notice } from '../../seller-portal/components/ToastNotice'
import { clearStoredAdmin, getStoredAdmin, setStoredAdmin } from '../lib/session'
import AdminAccountSettings, { type AdminProfileDraft } from './AdminAccountSettings'

// Ported from boat-brokers BackOffice.jsx ProfileMenu (variant="v2" portal="admin").
// Identity comes from the stored admin session; Log out clears it.
export function AdminProfileMenu({ onNotice }: { onNotice: (notice: Notice) => void }) {
  const [admin, setAdmin] = useState(getStoredAdmin)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const name = admin?.name ?? 'Admin'
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!open) return undefined
    const outside = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [open])

  function select(label: 'Profile settings' | 'Log out') {
    setOpen(false)
    if (label === 'Profile settings') {
      setSettingsOpen(true)
      return
    }
    setSettingsOpen(false)
    clearStoredAdmin()
    // Hard navigate so App.tsx remounts under /admin-portal/* (nested
    // react-router navigate('/login') can leave the public site shell).
    window.location.replace('/admin-portal/login')
  }

  // No admin profile API exists: edits are kept in the stored admin session only.
  function saveProfile(next: AdminProfileDraft) {
    if (!admin) return
    const updated = { ...admin, name: next.name, email: next.email, phone: next.phone || null, location: next.location }
    setStoredAdmin(updated)
    setAdmin(updated)
    setSettingsOpen(false)
    onNotice({ type: 'success', title: 'Profile updated', description: 'Your profile details have been saved on this device.' })
  }

  const hover = { backgroundColor: '#eaf4fc', borderColor: '#d9eaf5' }
  return (
    <div ref={menuRef} className="v2-account">
      <AnimatePresence>
        {open && (
          <motion.div
            id="profile-menu"
            aria-label="Account options"
            initial={reducedMotion ? false : { opacity: 0, y: 7, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: reducedMotion ? 0 : 0.24, ease: EASE }}
            className="v2-account-popover absolute left-0 z-20 w-full overflow-hidden rounded-[12px] border border-[#c9dce8] bg-white p-1.5 shadow-[0_16px_40px_rgba(10,67,89,0.12)]"
          >
            <button
              type="button"
              onClick={() => select('Profile settings')}
              className="flex min-h-10 w-full items-center gap-2.5 rounded-[8px] px-3 text-left text-[12px] font-semibold text-sp-brand-deep hover:bg-[#eef7fb]"
            >
              <Settings size={16} /> Profile settings
            </button>
            <div className="mx-2 my-1 h-px bg-sp-hairline" />
            <button
              type="button"
              onClick={() => select('Log out')}
              className="flex min-h-10 w-full items-center gap-2.5 rounded-[8px] px-3 text-left text-[12px] font-semibold text-sp-brand-deep hover:bg-[#eef7fb]"
            >
              <LogOut size={16} /> Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        initial={false}
        animate={open ? hover : { backgroundColor: '#ffffff00', borderColor: '#ffffff00' }}
        whileHover={hover}
        whileFocus={hover}
        whileTap={reducedMotion ? undefined : { scale: inventoryMotion.pressScale }}
        transition={quick}
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={open ? 'profile-menu' : undefined}
        aria-label={`Open account menu for ${name}`}
        onClick={() => setOpen((value) => !value)}
        className="v2-profile-trigger"
      >
        {admin?.avatarUrl ? (
          <img
            src={admin.avatarUrl}
            alt=""
            aria-hidden="true"
            className="h-10 w-10 shrink-0 rounded-full border-2 border-white bg-white object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sp-brand text-[15px] font-bold text-white"
          >
            {(name.trim()[0] || 'U').toUpperCase()}
          </span>
        )}
        <span className="v2-profile-copy min-w-0 flex-1">
          <span className="block truncate text-[13px] font-bold text-sp-brand-deep">{name}</span>
          <span className="block text-[11px] text-[#59758a]">Administrator</span>
        </span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ ...inventoryMotion.interaction, duration: reducedMotion ? 0 : inventoryMotion.interaction.duration }}
          className="v2-profile-chevron shrink-0 text-sp-brand-deep"
        >
          <ChevronDown size={16} />
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {settingsOpen && admin && (
          <AdminAccountSettings
            key="admin-account-settings"
            profile={{
              name: admin.name,
              email: admin.email,
              phone: admin.phone ?? '',
              location: (admin as { location?: string }).location ?? '',
            }}
            photo={admin.avatarUrl}
            adminId={admin.adminId}
            onSave={saveProfile}
            onOpenChange={setSettingsOpen}
            returnFocusRef={triggerRef}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
