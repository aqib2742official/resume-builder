'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { Edit2, Trash2, Copy, ExternalLink, Check, X, FileText, Calendar, History, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import { loadResumeData } from '@/store/resumeSlice'
import type { AppDispatch } from '@/store'
import type { SavedResume } from '@/lib/resumeStorage'
import { deleteResume, renameResume, duplicateResume } from '@/lib/resumeStorage'
import { calculateCompleteness } from '@/lib/completenessScore'
import { VersionHistoryDrawer } from '@/components/features/VersionHistoryDrawer'
import { format, formatDistanceToNow } from 'date-fns'

interface ResumeCardProps {
  resume: SavedResume
  onUpdate: () => void
  onCompareSelect?: (id: string) => void
  compareSelected?: boolean
  compareMode?: boolean
  // Optional overrides for DB-backed operations
  onDelete?: (id: string) => Promise<void>
  onRename?: (id: string, name: string) => Promise<void>
  onDuplicate?: (id: string) => Promise<void>
}

function scoreColor(total: number): string {
  if (total >= 80) return 'text-green-600 bg-green-50'
  if (total >= 50) return 'text-yellow-600 bg-yellow-50'
  return 'text-red-500 bg-red-50'
}

function scoreBarColor(total: number): string {
  if (total >= 80) return 'bg-green-500'
  if (total >= 50) return 'bg-yellow-500'
  return 'bg-red-400'
}

function DeleteModal({ resume, onConfirm, onClose }: {
  resume: SavedResume
  onConfirm: () => void
  onClose: () => void
}) {
  const [deleting, setDeleting] = useState(false)

  function handleDelete() {
    setDeleting(true)
    setTimeout(() => { onConfirm() }, 400)
  }

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose() }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/30 mb-4">
          <Trash2 size={22} className="text-red-500" />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Delete Resume?</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <span className="font-medium text-gray-700 dark:text-gray-200">"{resume.name}"</span> will be permanently deleted and cannot be recovered.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-70"
          >
            {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function ResumeCard({ resume, onUpdate, onCompareSelect, compareSelected, compareMode, onDelete, onRename, onDuplicate }: Readonly<ResumeCardProps>) {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(resume.name)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showVersions, setShowVersions] = useState(false)

  const completeness = calculateCompleteness(resume.data)
  const initials = resume.data.personal.fullName
    ? resume.data.personal.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  const sectionCount = [
    resume.data.experience.length > 0,
    resume.data.education.length > 0,
    resume.data.projects.length > 0,
    resume.data.skills.length > 0,
    resume.data.certifications.length > 0,
    resume.data.languages.length > 0,
    resume.data.awards.length > 0,
    resume.data.volunteer.length > 0,
  ].filter(Boolean).length

  function openInEditor() {
    router.push(`/editor?id=${resume.id}`)
  }

  async function handleRename() {
    if (editName.trim() && editName.trim() !== resume.name) {
      if (onRename) {
        await onRename(resume.id, editName.trim())
      } else {
        renameResume(resume.id, editName.trim())
      }
      onUpdate()
    }
    setEditing(false)
  }

  function handleNameKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') { handleRename() }
    if (e.key === 'Escape') { setEditing(false) }
  }

  async function handleDuplicate() {
    if (onDuplicate) {
      await onDuplicate(resume.id)
    } else {
      duplicateResume(resume.id)
    }
    onUpdate()
  }

  function handleCardClick() {
    if (compareMode && onCompareSelect) { onCompareSelect(resume.id) }
  }

  function handleCardKeyDown(e: React.KeyboardEvent) {
    if (compareMode && onCompareSelect && (e.key === 'Enter' || e.key === ' ')) {
      onCompareSelect(resume.id)
    }
  }

  const decorativeLines = new Array(8).fill(null)

  return (
    <>
      <div
        role={compareMode ? 'button' : undefined}
        tabIndex={compareMode ? 0 : undefined}
        className={clsx(
          'group relative flex flex-col rounded-xl border bg-white dark:bg-gray-800 shadow-sm transition-all hover:shadow-md',
          compareSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 dark:border-gray-700',
          compareMode && 'cursor-pointer'
        )}
        onClick={handleCardClick}
        onKeyDown={handleCardKeyDown}
      >
        {/* Card header — visual preview area */}
        <div className="relative flex h-32 items-center justify-center rounded-t-xl bg-linear-to-br from-blue-50 to-indigo-100 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {decorativeLines.map((_, i) => (
              <div
                key={`line-${i}`}
                className="mx-4 mb-1.5 h-1.5 rounded-full bg-blue-400"
                style={{ marginTop: i === 0 ? '12px' : undefined, width: `${60 + Math.sin(i) * 25}%` }}
              />
            ))}
          </div>
          <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold shadow-lg">
            {initials}
          </div>
          {compareMode && (
            <div className={clsx(
              'absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors',
              compareSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
            )}>
              {compareSelected && <Check size={13} className="text-white" />}
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="flex flex-col gap-3 p-4 flex-1">
          {editing ? (
            <div className="flex gap-1">
              <input
                autoFocus
                className="flex-1 rounded-md border border-blue-400 px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={handleNameKeyDown}
              />
              <button onClick={handleRename} className="rounded p-1 text-green-600 hover:bg-green-50"><Check size={14} /></button>
              <button onClick={() => setEditing(false)} className="rounded p-1 text-gray-400 hover:bg-gray-50"><X size={14} /></button>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight line-clamp-1">{resume.name}</h3>
                {resume.data.personal.jobTitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{resume.data.personal.jobTitle}</p>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setEditing(true); setEditName(resume.name) }}
                className="shrink-0 rounded p-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-600 transition-opacity"
              >
                <Edit2 size={12} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span
              className="flex items-center gap-1"
              title={format(new Date(resume.savedAt), 'MMM d, yyyy HH:mm')}
            >
              <Calendar size={11} />
              {formatDistanceToNow(new Date(resume.savedAt), { addSuffix: true })}
            </span>
            <span className="flex items-center gap-1">
              <FileText size={11} />
              {sectionCount} sections
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Completeness</span>
              <span className={clsx('text-xs font-semibold rounded-full px-1.5 py-0.5', scoreColor(completeness.total))}>
                {completeness.total}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <div
                className={clsx('h-full rounded-full transition-all', scoreBarColor(completeness.total))}
                style={{ width: `${completeness.total}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action footer */}
        {!compareMode && (
          <div className="flex items-center gap-1 border-t border-gray-100 dark:border-gray-700 px-3 py-2">
            <button
              onClick={openInEditor}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <ExternalLink size={12} />
              Open in Editor
            </button>
            <button
              onClick={() => setShowVersions(true)}
              title="Version history"
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-purple-500 transition-colors"
            >
              <History size={14} />
            </button>
            <button
              onClick={handleDuplicate}
              title="Duplicate"
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              title="Delete"
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-500 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {showVersions && (
        <VersionHistoryDrawer
          resume={resume}
          onClose={() => setShowVersions(false)}
          onRestore={() => { setShowVersions(false); onUpdate() }}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          resume={resume}
          onConfirm={async () => {
          if (onDelete) { await onDelete(resume.id) } else { deleteResume(resume.id) }
          onUpdate()
        }}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </>
  )
}
