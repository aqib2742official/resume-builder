'use client'

import { useRef } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { clsx } from 'clsx'

interface BulletEditorProps {
  bullets: string[]
  onChange: (bullets: string[]) => void
  placeholder?: string
}

export function BulletEditor({ bullets, onChange, placeholder = 'Add a bullet point...' }: BulletEditorProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  function updateBullet(index: number, value: string) {
    const next = [...bullets]
    next[index] = value
    onChange(next)
  }

  function addBullet(afterIndex?: number) {
    const next = [...bullets]
    const insertAt = afterIndex !== undefined ? afterIndex + 1 : next.length
    next.splice(insertAt, 0, '')
    onChange(next)
    requestAnimationFrame(() => {
      inputRefs.current[insertAt]?.focus()
    })
  }

  function removeBullet(index: number) {
    if (bullets.length === 1) {
      onChange([''])
      return
    }
    const next = bullets.filter((_, i) => i !== index)
    onChange(next)
    requestAnimationFrame(() => {
      const focusIndex = Math.max(0, index - 1)
      inputRefs.current[focusIndex]?.focus()
    })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addBullet(index)
    } else if (e.key === 'Backspace' && bullets[index] === '' && bullets.length > 1) {
      e.preventDefault()
      removeBullet(index)
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">Bullet Points</span>
        <button
          type="button"
          onClick={() => addBullet()}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <Plus size={12} />
          Add
        </button>
      </div>

      <div className="flex flex-col gap-1">
        {bullets.map((bullet, index) => (
          <div key={index} className="flex items-start gap-1.5 group">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
            <input
              ref={(el) => { inputRefs.current[index] = el }}
              type="text"
              value={bullet}
              onChange={(e) => updateBullet(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              placeholder={placeholder}
              className={clsx(
                'flex-1 rounded border border-transparent bg-gray-50 px-2 py-1 text-xs text-gray-800 placeholder:text-gray-400',
                'focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 focus:bg-white',
                'hover:bg-gray-100 transition-colors'
              )}
            />
            <button
              type="button"
              onClick={() => removeBullet(index)}
              className="mt-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
