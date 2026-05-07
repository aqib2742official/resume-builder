import { clsx } from 'clsx'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: Readonly<EmptyStateProps>) {
  return (
    <div className={clsx(
      'animate-fade-in flex flex-col items-center gap-3 rounded-xl border-2 border-dashed py-8 px-4 text-center',
      'border-gray-200 dark:border-slate-700'
    )}>
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-700">
        <Icon size={20} className="text-gray-400 dark:text-slate-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-slate-300">{title}</p>
        <p className="mt-0.5 text-xs text-gray-400 dark:text-slate-500">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className={clsx(
            'rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors',
            'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
          )}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
