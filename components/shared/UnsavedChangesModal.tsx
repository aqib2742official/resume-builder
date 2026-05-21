'use client'

import { useState } from 'react'
import { AlertTriangle, Save, Trash2, X, Loader2 } from 'lucide-react'

interface Props {
  onSave: () => Promise<void>
  onDiscard: () => void
  onCancel: () => void
}

export function UnsavedChangesModal({ onSave, onDiscard, onCancel }: Readonly<Props>) {
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await onSave()
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative w-full max-w-sm bg-white dark:bg-[#0d1424] rounded-2xl shadow-2xl z-10 p-6">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/20 mb-4">
          <AlertTriangle size={22} className="text-amber-500" />
        </div>

        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">Unsaved changes</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          You have unsaved changes. Save them to the cloud before leaving, or discard them.
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#0f2044] hover:bg-[#1a3a6e] text-white text-sm font-bold py-2.5 transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saving…' : 'Save & Continue'}
          </button>

          <button
            onClick={onDiscard}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium py-2.5 transition-colors disabled:opacity-60"
          >
            <Trash2 size={14} />
            Discard Changes
          </button>

          <button
            onClick={onCancel}
            disabled={saving}
            className="w-full text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 py-1.5 transition-colors"
          >
            Cancel — keep editing
          </button>
        </div>
      </div>
    </div>
  )
}
