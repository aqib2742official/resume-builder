'use client'

import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, type, placeholder, disabled, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replaceAll(/\s+/g, '-').replaceAll(/[^a-z0-9-]/g, '')
    const isDateType = type === 'month' || type === 'date' || type === 'time' || type === 'datetime-local'
    const hasFloatingLabel = Boolean(label) && !isDateType

    return (
      <div className="flex flex-col gap-0.5">
        {/* Date/time inputs: static label above (floating trick doesn't work on these) */}
        {label && isDateType && (
          <label
            htmlFor={inputId}
            className="text-[10px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            placeholder={hasFloatingLabel ? ' ' : placeholder}
            className={clsx(
              'peer w-full rounded-lg border text-sm text-gray-900 dark:text-slate-100 transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              'dark:focus:ring-blue-400',
              'border-gray-200 dark:border-slate-600',
              'bg-white dark:bg-slate-700/60',
              'hover:border-gray-300 dark:hover:border-slate-500',
              hasFloatingLabel ? 'h-12 pt-5 pb-1 px-3 placeholder:text-transparent' : 'h-8 px-3',
              isDateType && 'h-8 px-3',
              error && 'border-red-400 focus:ring-red-400 focus:border-red-400',
              disabled && 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-slate-800',
              className
            )}
            {...props}
          />

          {hasFloatingLabel && (
            <label
              htmlFor={inputId}
              className={clsx(
                'absolute left-3 pointer-events-none select-none transition-all duration-150',
                // Default (empty + unfocused): placeholder position
                'text-sm top-3.5 text-gray-400 dark:text-slate-400 font-normal',
                // Has value: floated
                'peer-[:not(:placeholder-shown)]:top-1.25',
                'peer-[:not(:placeholder-shown)]:text-[10px]',
                'peer-[:not(:placeholder-shown)]:font-semibold',
                'peer-[:not(:placeholder-shown)]:text-gray-500',
                'peer-[:not(:placeholder-shown)]:dark:text-slate-400',
                'peer-[:not(:placeholder-shown)]:uppercase',
                'peer-[:not(:placeholder-shown)]:tracking-wide',
                // Focused: floated + accent color
                'peer-focus:top-1.25',
                'peer-focus:text-[10px]',
                'peer-focus:font-semibold',
                'peer-focus:text-blue-600',
                'peer-focus:dark:text-blue-400',
                'peer-focus:uppercase',
                'peer-focus:tracking-wide',
              )}
            >
              {label}
            </label>
          )}
        </div>

        {hint && !error && (
          <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5 ml-1">{hint}</p>
        )}
        {error && <p className="text-[10px] text-red-500 mt-0.5 ml-1">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
