'use client'

import { useRef, useState } from 'react'
import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import { callAI } from '@/lib/ai'

interface BulletEditorProps {
  bullets: string[]
  onChange: (bullets: string[]) => void
  placeholder?: string
  role?: string
}

export function BulletEditor({ bullets, onChange, placeholder = 'Add a bullet point...', role }: BulletEditorProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [improvingIndex, setImprovingIndex] = useState<number | null>(null)
  const [errorIndex, setErrorIndex] = useState<number | null>(null)

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

  async function improveBullet(index: number) {
    const bullet = bullets[index].trim()
    if (!bullet || improvingIndex !== null) return
    setImprovingIndex(index)
    setErrorIndex(null)
    try {
      const result = await callAI('improve-bullet', { role: role ?? '', bullet })
      updateBullet(index, result)
    } catch {
      setErrorIndex(index)
      setTimeout(() => setErrorIndex(null), 2500)
    } finally {
      setImprovingIndex(null)
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
        {bullets.map((bullet, index) => {
          const isImproving = improvingIndex === index
          const hasError = errorIndex === index
          return (
            <div key={index} className="flex items-start gap-1.5 group">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
              <input
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                value={bullet}
                onChange={(e) => updateBullet(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                placeholder={placeholder}
                disabled={isImproving}
                className={clsx(
                  'flex-1 rounded border border-transparent bg-gray-50 px-2 py-1 text-xs text-gray-800 placeholder:text-gray-400',
                  'focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 focus:bg-white',
                  'hover:bg-gray-100 transition-colors disabled:opacity-60'
                )}
              />

              {/* AI improve button */}
              <button
                type="button"
                onClick={() => improveBullet(index)}
                disabled={isImproving || !bullet.trim()}
                title="Improve with AI"
                className={clsx(
                  'mt-1 transition-all',
                  isImproving
                    ? 'opacity-100 text-[#0f2044]'
                    : 'opacity-0 group-hover:opacity-100 text-[#0f2044] hover:text-sky-600 disabled:opacity-20 disabled:cursor-not-allowed'
                )}
              >
                {isImproving
                  ? <Loader2 size={12} className="animate-spin" />
                  : <Sparkles size={12} />}
              </button>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => removeBullet(index)}
                className="mt-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
              >
                <Trash2 size={12} />
              </button>

              {hasError && (
                <span className="mt-1.5 text-[10px] text-red-500 shrink-0">Failed</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
