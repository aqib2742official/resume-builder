'use client'

import { useSelector } from 'react-redux'
import { ChevronDown, ChevronRight, Plus, Eye, EyeOff } from 'lucide-react'
import { clsx } from 'clsx'
import type { RootState } from '@/store'
import { useResumeActions } from '@/hooks/useResumeActions'

interface SectionBlockProps {
  sectionKey: string
  title: string
  onAdd?: () => void
  addLabel?: string
  children: React.ReactNode
  itemCount?: number
  hideable?: boolean
}

export function SectionBlock({
  sectionKey,
  title,
  onAdd,
  addLabel = 'Add',
  children,
  itemCount,
  hideable = true,
}: Readonly<SectionBlockProps>) {
  const collapsed = useSelector((state: RootState) =>
    state.ui.collapsedSections.includes(sectionKey)
  )
  const hidden = useSelector((state: RootState) =>
    state.resume.data.hiddenSections.includes(sectionKey)
  )
  const { toggleSection, toggleSectionVisibility } = useResumeActions()

  let dotColor: string | null = null
  if (itemCount !== undefined) {
    dotColor = itemCount === 0 ? 'bg-amber-400' : 'bg-emerald-500'
  }

  return (
    <div className={clsx(
      'border-b last:border-0 transition-colors',
      'border-gray-100 dark:border-slate-700/50'
    )}>
      {/* Header row */}
      <div className="flex items-center px-4 py-2.5 gap-1">
        {/* Collapse toggle */}
        <button
          type="button"
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center gap-2 flex-1 min-w-0 text-left"
        >
          <span className="text-gray-400 dark:text-slate-500 shrink-0">
            {collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
          </span>

          {/* Completeness dot */}
          {dotColor && (
            <span className={clsx('shrink-0 w-1.5 h-1.5 rounded-full', dotColor)} />
          )}

          <span className={clsx(
            'text-sm font-semibold truncate',
            hidden ? 'text-gray-400 dark:text-slate-500 line-through' : 'text-gray-800 dark:text-slate-100'
          )}>
            {title}
          </span>

          {itemCount !== undefined && itemCount > 0 && (
            <span className="shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/40 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
              {itemCount}
            </span>
          )}
        </button>

        {/* Visibility toggle */}
        {hideable && (
          <button
            type="button"
            onClick={() => toggleSectionVisibility(sectionKey)}
            className={clsx(
              'shrink-0 p-1 rounded transition-colors',
              hidden
                ? 'text-gray-300 dark:text-slate-600 hover:text-gray-500'
                : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'
            )}
            title={hidden ? 'Show section in resume' : 'Hide section from resume'}
          >
            {hidden ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        )}

        {/* Add button */}
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="shrink-0 flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <Plus size={13} />
            {addLabel}
          </button>
        )}
      </div>

      {/* Body */}
      {!collapsed && (
        <div className="px-4 pb-4 flex flex-col gap-2">
          {children}
        </div>
      )}
    </div>
  )
}
