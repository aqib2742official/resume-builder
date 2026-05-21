'use client'

import { useEffect, useRef } from 'react'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'

interface ConfirmModalProps {
  title: string
  description: React.ReactNode
  confirmLabel?: string
  variant?: 'danger' | 'warning'
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmModal({
  title,
  description,
  confirmLabel = 'Delete',
  variant = 'danger',
  loading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    cancelRef.current?.focus()
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const isDanger = variant === 'danger'
  const Icon = isDanger ? Trash2 : AlertTriangle
  const iconBg  = isDanger ? 'bg-red-50'     : 'bg-amber-50'
  const iconClr = isDanger ? 'text-red-500'  : 'text-amber-500'
  const btnClr  = isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-500 hover:bg-amber-600'

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex h-12 w-12 items-center justify-center rounded-full mb-4 ${iconBg} dark:bg-opacity-20`}>
          <Icon size={22} className={iconClr} />
        </div>

        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{title}</h3>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">{description}</div>

        <div className="flex gap-3 justify-end">
          <button
            ref={cancelRef}
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-70 ${btnClr}`}
          >
            {loading
              ? <><Loader2 size={14} className="animate-spin" /> Deleting…</>
              : <><Icon size={14} /> {confirmLabel}</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}
