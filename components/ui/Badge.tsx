import { clsx } from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  onRemove?: () => void
}

export function Badge({ children, className, onRemove }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-100',
        className
      )}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 rounded-full hover:bg-blue-200 w-3.5 h-3.5 flex items-center justify-center text-blue-500 hover:text-blue-700 transition-colors"
          type="button"
        >
          ×
        </button>
      )}
    </span>
  )
}
