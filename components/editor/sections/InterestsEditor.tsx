'use client'

import { useState, useRef } from 'react'
import { Plus } from 'lucide-react'
import { Smile } from 'lucide-react'
import { SectionBlock } from '@/components/editor/SectionBlock'
import { EmptyState } from '@/components/editor/EmptyState'
import { useInterests } from '@/hooks/useResumeData'
import { useResumeActions } from '@/hooks/useResumeActions'

export function InterestsEditor() {
  const interests = useInterests()
  const { addInterest, removeInterest } = useResumeActions()
  const [newInterest, setNewInterest] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleAdd() {
    if (!newInterest.trim()) return
    addInterest(newInterest.trim())
    setNewInterest('')
    inputRef.current?.focus()
  }

  return (
    <SectionBlock
      sectionKey="interests"
      title="Interests & Hobbies"
      itemCount={interests.length}
    >
      {interests.length === 0 && (
        <EmptyState
          icon={Smile}
          title="No interests yet"
          description="Add hobbies and passions to humanize your resume."
          actionLabel={undefined}
          onAction={undefined}
        />
      )}

      <div className="flex flex-wrap gap-1.5 mb-3">
        {interests.map((interest, i) => (
          <span
            key={interest}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-200 dark:border-blue-700"
          >
            {interest}
            <button
              type="button"
              onClick={() => removeInterest(i)}
              className="ml-0.5 text-blue-400 hover:text-blue-700 dark:hover:text-blue-200 leading-none"
              aria-label={`Remove ${interest}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-1.5">
        <input
          ref={inputRef}
          type="text"
          value={newInterest}
          onChange={(e) => setNewInterest(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
          placeholder="Add an interest, press Enter"
          className="flex-1 h-8 rounded-md border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-3 text-xs text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 focus:bg-white dark:focus:bg-slate-600"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          <Plus size={13} />
        </button>
      </div>
    </SectionBlock>
  )
}
