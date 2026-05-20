'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { X, RotateCcw, Clock, Check } from 'lucide-react'
import { clsx } from 'clsx'
import { loadResumeData } from '@/store/resumeSlice'
import type { AppDispatch } from '@/store'
import type { SavedResume } from '@/lib/resumeStorage'
import { restoreVersion } from '@/lib/resumeStorage'
import { format } from 'date-fns'

interface Props {
  resume: SavedResume
  onClose: () => void
  onRestore: () => void
}

export function VersionHistoryDrawer({ resume, onClose, onRestore }: Props) {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const [restoringId, setRestoringId] = useState<string | null>(null)

  const versions = [...(resume.versions ?? [])].reverse()

  function handleRestore(versionId: string) {
    setRestoringId(versionId)
    const data = restoreVersion(resume.id, versionId)
    if (data) {
      dispatch(loadResumeData(data))
      setTimeout(() => {
        onRestore()
        router.push('/editor')
      }, 400)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h2 className="font-bold text-gray-900">Version History</h2>
            <p className="text-xs text-gray-500 mt-0.5">{resume.name}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
            <X size={16} />
          </button>
        </div>

        {/* Version list */}
        <div className="overflow-auto max-h-96">
          {versions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <Clock size={28} className="text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium text-sm">No versions saved yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Versions are created automatically each time you save this resume.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {versions.map((version, idx) => {
                const isCurrent = idx === 0
                const isRestoring = restoringId === version.versionId

                return (
                  <div
                    key={version.versionId}
                    className={clsx(
                      'flex items-center justify-between gap-3 px-5 py-3.5',
                      isCurrent && 'bg-blue-50'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={clsx(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                        isCurrent ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                      )}>
                        {isCurrent ? <Check size={14} /> : version.label}
                      </div>
                      <div className="min-w-0">
                        <p className={clsx('text-sm font-medium', isCurrent ? 'text-blue-700' : 'text-gray-800')}>
                          {version.label}
                          {isCurrent && <span className="ml-1.5 text-xs font-normal text-blue-500">· Current</span>}
                        </p>
                        <p className="text-xs text-gray-400">
                          {format(new Date(version.savedAt), 'MMM d, yyyy · h:mm a')}
                        </p>
                      </div>
                    </div>

                    {!isCurrent && (
                      <button
                        onClick={() => handleRestore(version.versionId)}
                        disabled={!!restoringId}
                        className={clsx(
                          'shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                          isRestoring
                            ? 'bg-green-50 text-green-600'
                            : 'border border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600'
                        )}
                      >
                        {isRestoring ? <Check size={12} /> : <RotateCcw size={12} />}
                        {isRestoring ? 'Restoring…' : 'Restore'}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 px-5 py-3 bg-gray-50">
          <p className="text-xs text-gray-400 text-center">
            Restoring a version loads it into the editor. Up to 10 versions are kept.
          </p>
        </div>
      </div>
    </div>
  )
}
