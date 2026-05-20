'use client'

import { forwardRef } from 'react'
import { clsx } from 'clsx'

type Variant = 'ghost' | 'danger' | 'primary'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'xs' | 'sm' | 'md'
  tooltip?: string
}

const variants: Record<Variant, string> = {
  ghost: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
  danger: 'text-gray-400 hover:text-red-500 hover:bg-red-50',
  primary: 'text-blue-500 hover:text-blue-700 hover:bg-blue-50',
}

const sizes = {
  xs: 'w-5 h-5 rounded',
  sm: 'w-6 h-6 rounded-md',
  md: 'w-8 h-8 rounded-lg',
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'ghost', size = 'sm', tooltip, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        title={tooltip}
        className={clsx(
          'inline-flex items-center justify-center transition-colors duration-100 cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          'disabled:pointer-events-none disabled:opacity-40',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'
