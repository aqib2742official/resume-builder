'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'
import { HoverActions } from './HoverActions'
import { useDragHandle } from './DragHandleContext'

interface ItemCardProps {
  title: string
  subtitle?: string
  isFirst?: boolean
  isLast?: boolean
  onMoveUp?: () => void
  onMoveDown?: () => void
  onDuplicate?: () => void
  onDelete: () => void
  defaultExpanded?: boolean
  children: React.ReactNode
}

export function ItemCard({
  title, subtitle, isFirst, isLast,
  onMoveUp, onMoveDown, onDuplicate, onDelete,
  defaultExpanded = true, children,
}: Readonly<ItemCardProps>) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const dragHandle = useDragHandle()

  return (
    <div className="animate-item-enter relative group flex rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-shadow hover:shadow-sm overflow-hidden">
      {/* Left drag handle stripe */}
      {dragHandle}

      {/* Card content */}
      <div className="flex-1 min-w-0">
        <HoverActions
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          isFirst={isFirst}
          isLast={isLast}
        />

        {/* Header */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
        >
          <span className="text-gray-400 dark:text-slate-500 shrink-0">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
          <div className="flex-1 min-w-0 pr-16">
            <p className={clsx(
              'truncate text-sm font-medium',
              title ? 'text-gray-800 dark:text-slate-100' : 'text-gray-400 dark:text-slate-500'
            )}>
              {title || 'Untitled'}
            </p>
            {subtitle && (
              <p className="truncate text-xs text-gray-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
        </button>

        {/* Body */}
        {expanded && (
          <div className="border-t border-gray-100 dark:border-slate-700/50 px-3 py-3">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
