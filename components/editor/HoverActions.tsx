'use client'

import { ChevronUp, ChevronDown, Copy, Trash2 } from 'lucide-react'
import { IconButton } from '@/components/ui/IconButton'

interface HoverActionsProps {
  onMoveUp?: () => void
  onMoveDown?: () => void
  onDuplicate?: () => void
  onDelete: () => void
  isFirst?: boolean
  isLast?: boolean
}

export function HoverActions({
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  isFirst,
  isLast,
}: HoverActionsProps) {
  return (
    <div className="absolute right-2 top-2 hidden group-hover:flex items-center gap-0.5 bg-white border border-gray-200 rounded-lg shadow-md px-1 py-0.5 z-10">
      {onMoveUp && (
        <IconButton
          tooltip="Move up"
          onClick={onMoveUp}
          disabled={isFirst}
          size="xs"
        >
          <ChevronUp size={13} />
        </IconButton>
      )}
      {onMoveDown && (
        <IconButton
          tooltip="Move down"
          onClick={onMoveDown}
          disabled={isLast}
          size="xs"
        >
          <ChevronDown size={13} />
        </IconButton>
      )}
      {onDuplicate && (
        <IconButton tooltip="Duplicate" onClick={onDuplicate} size="xs">
          <Copy size={13} />
        </IconButton>
      )}
      <IconButton
        tooltip="Delete"
        variant="danger"
        onClick={onDelete}
        size="xs"
      >
        <Trash2 size={13} />
      </IconButton>
    </div>
  )
}
