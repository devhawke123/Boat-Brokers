import { useEffect, useState } from 'react'

// A single dialog host mounted once (in AdminShell) replaces every
// window.confirm/window.alert call across the admin portal with a styled
// in-page modal. confirmDialog/alertDialog are plain functions (not hooks)
// so they can be called from event handlers anywhere without threading a
// context through every page — the host below is the only subscriber.
type ConfirmOptions = {
  title?: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}

type AlertOptions = {
  title?: string
}

type DialogState =
  | ({ kind: 'confirm'; message: string; resolve: (value: boolean) => void } & ConfirmOptions)
  | ({ kind: 'alert'; message: string; resolve: () => void } & AlertOptions)
  | null

let setDialogState: ((state: DialogState) => void) | null = null

export function confirmDialog(message: string, options?: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    setDialogState?.({ kind: 'confirm', message, resolve, ...options })
  })
}

export function alertDialog(message: string, options?: AlertOptions): Promise<void> {
  return new Promise((resolve) => {
    setDialogState?.({ kind: 'alert', message, resolve, title: options?.title ?? 'Error' })
  })
}

export default function AdminDialogHost() {
  const [state, setState] = useState<DialogState>(null)

  useEffect(() => {
    setDialogState = setState
    return () => {
      setDialogState = null
    }
  }, [])

  useEffect(() => {
    if (!state) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') settle(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  if (!state) return null

  function settle(confirmed: boolean) {
    if (state?.kind === 'confirm') state.resolve(confirmed)
    else if (state?.kind === 'alert') state.resolve()
    setState(null)
  }

  const isConfirm = state.kind === 'confirm'

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
      onClick={() => settle(false)}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-[#0f172a]">
          {state.title ?? (isConfirm ? 'Confirm' : undefined)}
        </h2>
        <p className="mt-2 text-sm whitespace-pre-wrap text-[#475569]">{state.message}</p>
        <div className="mt-6 flex justify-end gap-3">
          {isConfirm ? (
            <button
              type="button"
              onClick={() => settle(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-[#475569] hover:bg-[#f1f5f9]"
            >
              {state.cancelLabel ?? 'Cancel'}
            </button>
          ) : null}
          <button
            type="button"
            autoFocus
            onClick={() => settle(true)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
              isConfirm && state.danger !== false ? 'bg-[#dc2626] hover:bg-[#b91c1c]' : 'bg-[#0f172a] hover:bg-[#1e293b]'
            }`}
          >
            {isConfirm ? (state.confirmLabel ?? 'Delete') : 'OK'}
          </button>
        </div>
      </div>
    </div>
  )
}
