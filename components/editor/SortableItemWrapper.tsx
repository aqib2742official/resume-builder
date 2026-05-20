'use client'

import { useMemo } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { clsx } from 'clsx'
import { DragHandleContext } from './DragHandleContext'

interface SortableItemWrapperProps {
  id: string
  children: React.ReactNode
}

export function SortableItemWrapper({ id, children }: Readonly<SortableItemWrapperProps>) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id })

  const dragHandle = useMemo(() => (
    <button
      ref={setActivatorNodeRef}
      type="button"
      className="flex w-5 self-stretch shrink-0 cursor-grab active:cursor-grabbing items-center justify-center rounded-l-lg border-r border-gray-100 dark:border-slate-700/50 text-gray-300 hover:text-gray-500 hover:bg-gray-50 dark:text-slate-600 dark:hover:text-slate-400 dark:hover:bg-slate-700/50 transition-colors touch-none"
      {...attributes}
      {...listeners}
      aria-label="Drag to reorder"
    >
      <GripVertical size={13} />
    </button>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [setActivatorNodeRef, isDragging])

  return (
    <DragHandleContext.Provider value={dragHandle}>
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        className={clsx(isDragging && 'z-50 opacity-50 shadow-lg rounded-lg')}
      >
        {children}
      </div>
    </DragHandleContext.Provider>
  )
}
