'use client'

import { useEffect, useState } from 'react'
import { X, Megaphone } from 'lucide-react'

export function AnnouncementBanner() {
  const [text, setText] = useState('')
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    fetch('/api/announcement')
      .then((r) => r.json())
      .then((d) => setText(d.announcement ?? ''))
      .catch(() => {})
  }, [])

  if (!text || dismissed) return null

  return (
    <div className="relative bg-blue-600 text-white text-sm px-4 py-2.5 flex items-center justify-center gap-3">
      <Megaphone className="w-4 h-4 shrink-0" />
      <p className="flex-1 text-center">{text}</p>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 rounded p-0.5 hover:bg-white/20 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
