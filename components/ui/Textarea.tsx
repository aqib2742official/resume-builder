'use client'

import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replaceAll(/\s+/g, '-').replaceAll(/[^a-z0-9-]/g, '')

    return (
      <div className="flex flex-col gap-0.5">
        <div
          className={clsx(
            'relative rounded-lg border transition-all duration-150',
            'border-gray-200 dark:border-slate-600',
            'hover:border-gray-300 dark:hover:border-slate-500',
            'focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:focus-within:ring-blue-400/20',
            error && 'border-red-400 focus-within:ring-red-400/20',
          )}
        >
          {label && (
            <label
              htmlFor={textareaId}
              className={clsx(
                'absolute -top-2 left-2.5 px-1 text-[10px] font-semibold uppercase tracking-wide',
                'bg-white dark:bg-slate-800 rounded',
                error ? 'text-red-500' : 'text-gray-500 dark:text-slate-400',
              )}
            >
              {label}
            </label>
          )}
          <textarea
            ref={ref}
            id={textareaId}
            rows={3}
            className={clsx(
              'w-full px-3 py-3 text-sm text-gray-900 dark:text-slate-100',
              'bg-transparent placeholder:text-gray-400 dark:placeholder:text-slate-500',
              'focus:outline-none resize-none rounded-lg',
              className
            )}
            {...props}
          />
        </div>
        {hint && !error && (
          <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5 ml-1">{hint}</p>
        )}
        {error && <p className="text-[10px] text-red-500 mt-0.5 ml-1">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
