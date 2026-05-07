'use client'

import { useMemo } from 'react'
import { clsx } from 'clsx'
import { calculateCompleteness } from '@/lib/completenessScore'
import { useResumeData } from '@/hooks/useResumeData'

function getScoreColor(score: number): string {
  if (score >= 85) return '#10b981'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}

function getScoreLabel(score: number): string {
  if (score >= 85) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 35) return 'Fair'
  return 'Incomplete'
}

export function CompletenessScore() {
  const data = useResumeData()
  const result = useMemo(() => calculateCompleteness(data), [data])
  const color = getScoreColor(result.total)
  const label = getScoreLabel(result.total)

  const lowestSection = result.sections
    .filter((s) => s.score < 100)
    .sort((a, b) => a.score * a.weight - b.score * b.weight)[0]

  return (
    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700/50 bg-white dark:bg-slate-800">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-600 dark:text-slate-300">Resume Strength</span>
        <span className="text-xs font-bold" style={{ color }}>
          {result.total}% · {label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${result.total}%`, backgroundColor: color }}
        />
      </div>

      {/* Section dots */}
      <div className="flex gap-1 mt-2">
        {result.sections.map((s) => (
          <div key={s.key} className="flex-1" title={`${s.label}: ${s.score}%`}>
            <div
              className="h-1 rounded-full transition-all duration-500"
              style={{
                backgroundColor: s.score >= 100 ? '#10b981' : s.score >= 50 ? '#f59e0b' : '#e5e7eb',
              }}
            />
          </div>
        ))}
      </div>

      {/* Next tip */}
      {lowestSection && result.total < 95 && (
        <p className="mt-1.5 text-xs text-gray-400 dark:text-slate-500 truncate">
          💡 {lowestSection.tip}
        </p>
      )}
    </div>
  )
}
