'use client'

import { useState } from 'react'
import { Lightbulb, ChevronDown, ChevronRight } from 'lucide-react'
import { WRITING_TIPS } from '@/constants/writingTips'

interface WritingTipsProps {
  sectionKey: string
}

export function WritingTips({ sectionKey }: WritingTipsProps) {
  const [open, setOpen] = useState(false)
  const tipsData = WRITING_TIPS[sectionKey]
  if (!tipsData) return null

  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/20 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left"
      >
        <Lightbulb size={13} className="text-amber-500 shrink-0" />
        <span className="flex-1 text-xs font-medium text-amber-700 dark:text-amber-400">
          {tipsData.icon} Writing Tips
        </span>
        {open ? (
          <ChevronDown size={13} className="text-amber-500 shrink-0" />
        ) : (
          <ChevronRight size={13} className="text-amber-500 shrink-0" />
        )}
      </button>

      {open && (
        <ul className="px-3 pb-3 flex flex-col gap-1.5 border-t border-amber-200 dark:border-amber-900/30 pt-2">
          {tipsData.tips.map((tip, i) => (
            <li key={i} className="flex gap-2 text-xs text-amber-800 dark:text-amber-300">
              <span className="mt-0.5 shrink-0 text-amber-400">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
