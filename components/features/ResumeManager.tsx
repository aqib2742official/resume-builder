'use client'

import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { X, Save, FolderOpen, Trash2, Check, FileText, Copy, LayoutTemplate, ChevronDown, Loader2, LogIn } from 'lucide-react'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { AuthToSaveModal } from '@/components/shared/AuthToSaveModal'
import { useResumeData } from '@/hooks/useResumeData'
import { useResumeActions } from '@/hooks/useResumeActions'
import { setTemplateId, type TemplateId } from '@/store/themeSlice'
import { loadResumeData } from '@/store/resumeSlice'
import { Button } from '@/components/ui/Button'
import { useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/store'

const TEMPLATE_LIST: { id: TemplateId; label: string }[] = [
  { id: 'two-column',   label: 'Classic (Two-Column)' },
  { id: 'minimal',      label: 'Minimal' },
  { id: 'academic',     label: 'Academic' },
  { id: 'professional', label: 'Professional' },
  { id: 'executive',    label: 'Executive' },
  { id: 'modern',       label: 'Modern' },
]

interface DBResume {
  _id: string
  name: string
  template: string
  data: Record<string, unknown>
  theme: Record<string, unknown>
  updatedAt: string
}

interface ResumeManagerProps {
  onClose: () => void
}

const DB_RESUME_ID_KEY = 'resume-builder-db-id'

export function ResumeManager({ onClose }: ResumeManagerProps) {
  const data    = useResumeData()
  const theme   = useSelector((state: RootState) => state.theme)
  const { loadResumeData: loadCurrent } = useResumeActions()
  const dispatch = useDispatch<AppDispatch>()
  const router   = useRouter()
  const { data: session } = useSession()

  const [resumes, setResumes]       = useState<DBResume[]>([])
  const [fetchLoading, setFetchLoading] = useState(false)
  const [saveName, setSaveName]     = useState(() =>
    data.personal.fullName ? `${data.personal.fullName} — Resume` : ''
  )
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)
  const [editingId, setEditingId]   = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [renameLoading, setRenameLoading] = useState<string | null>(null)
  const [duplicateLoading, setDuplicateLoading] = useState<string | null>(null)
  const [templateMenuId, setTemplateMenuId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [loadTarget, setLoadTarget] = useState<DBResume | null>(null)
  const [showAuth, setShowAuth]     = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!session) return
    setFetchLoading(true)
    fetch('/api/resumes')
      .then((r) => r.json())
      .then((d) => setResumes(d.resumes ?? []))
      .finally(() => setFetchLoading(false))
  }, [session])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setTemplateMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleSave() {
    const name = saveName.trim() || (data.personal.fullName ? `${data.personal.fullName} — Resume` : 'My Resume')
    setSaving(true)
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, template: theme.templateId, data, theme, completenessScore: 0 }),
      })
      if (res.ok) {
        const { resume } = await res.json()
        sessionStorage.setItem(DB_RESUME_ID_KEY, resume._id)
        setResumes((prev) => [resume, ...prev])
        setSaveName('')
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveAfterAuth() {
    setShowAuth(false)
    await handleSave()
  }

  function handleLoad(resume: DBResume) {
    setLoadTarget(resume)
  }

  function confirmLoad() {
    if (!loadTarget) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadCurrent(loadTarget.data as any)
    sessionStorage.setItem(DB_RESUME_ID_KEY, loadTarget._id)
    setLoadTarget(null)
    onClose()
  }

  function handleOpenWithTemplate(resume: DBResume, templateId: TemplateId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(loadResumeData(resume.data as any))
    dispatch(setTemplateId(templateId))
    sessionStorage.setItem(DB_RESUME_ID_KEY, resume._id)
    setTemplateMenuId(null)
    onClose()
    router.push('/editor')
  }

  async function handleDuplicate(id: string) {
    setDuplicateLoading(id)
    try {
      const src = resumes.find((r) => r._id === id)
      if (!src) return
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `${src.name} (copy)`, template: src.template, data: src.data, theme: src.theme, completenessScore: 0 }),
      })
      if (res.ok) {
        const { resume } = await res.json()
        setResumes((prev) => [resume, ...prev])
      }
    } finally {
      setDuplicateLoading(null)
    }
  }

  function handleDelete(id: string, name: string) {
    setDeleteTarget({ id, name })
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/resumes/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        setResumes((prev) => prev.filter((r) => r._id !== deleteTarget.id))
        if (sessionStorage.getItem(DB_RESUME_ID_KEY) === deleteTarget.id) {
          sessionStorage.removeItem(DB_RESUME_ID_KEY)
        }
      }
    } finally {
      setDeleteLoading(false)
      setDeleteTarget(null)
    }
  }

  async function handleRename(id: string) {
    if (!editingName.trim()) { setEditingId(null); return }
    setRenameLoading(id)
    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingName.trim() }),
      })
      if (res.ok) {
        setResumes((prev) => prev.map((r) => r._id === id ? { ...r, name: editingName.trim() } : r))
      }
    } finally {
      setRenameLoading(null)
      setEditingId(null)
    }
  }

  const formattedDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-blue-600" />
              <h2 className="text-base font-semibold text-gray-800 dark:text-white">My Resumes</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <X size={18} />
            </button>
          </div>

          <div className="p-6 flex flex-col gap-6">
            {!session ? (
              /* Guest — prompt to sign in */
              <div className="rounded-xl border-2 border-dashed border-sky-200 dark:border-sky-700 py-10 text-center">
                <FileText size={32} className="mx-auto text-sky-300 dark:text-sky-600 mb-3" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Sign in to save your resumes</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">Create a free account and access your work from anywhere.</p>
                <Button size="sm" onClick={() => setShowAuth(true)}>
                  <LogIn size={14} /> Sign In / Create Account
                </Button>
              </div>
            ) : (
              <>
                {/* Save current */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Save Current Resume</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={saveName}
                      onChange={(e) => setSaveName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                      placeholder={data.personal.fullName ? `${data.personal.fullName} — v1` : 'My Resume'}
                      className="flex-1 h-9 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button size="sm" onClick={handleSave} disabled={saving}>
                      {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
                      {saving ? 'Saving…' : saved ? 'Saved!' : 'Save'}
                    </Button>
                  </div>
                </div>

                {/* Saved resumes list */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                    Saved Resumes{' '}
                    <span className="text-gray-400 font-normal">({resumes.length})</span>
                  </p>

                  {fetchLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }, (_, i) => (
                        <div key={`sk-${i}`} className="h-14 rounded-lg bg-gray-100 dark:bg-gray-700 animate-pulse" />
                      ))}
                    </div>
                  ) : resumes.length === 0 ? (
                    <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600 py-8 text-center">
                      <FileText size={28} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-400">No saved resumes yet</p>
                      <p className="text-xs text-gray-300 mt-1">Save your current resume above</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2" ref={menuRef}>
                      {resumes.map((r) => (
                        <div key={r._id} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 overflow-visible">
                          <div className="flex items-center gap-3 px-4 py-3">
                            <FileText size={16} className="text-blue-400 shrink-0" />
                            <div className="flex-1 min-w-0">
                              {editingId === r._id ? (
                                <input
                                  type="text"
                                  value={editingName}
                                  onChange={(e) => setEditingName(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleRename(r._id)}
                                  onBlur={() => handleRename(r._id)}
                                  autoFocus
                                  className="w-full text-sm font-medium bg-white dark:bg-gray-600 border border-blue-300 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-800 dark:text-white"
                                />
                              ) : (
                                <p
                                  className="text-sm font-medium text-gray-800 dark:text-white truncate cursor-pointer hover:text-blue-600"
                                  onClick={() => { setEditingId(r._id); setEditingName(r.name) }}
                                  title="Click to rename"
                                >
                                  {renameLoading === r._id ? <Loader2 size={12} className="inline animate-spin mr-1" /> : null}
                                  {r.name}
                                </p>
                              )}
                              <p className="text-xs text-gray-400">{formattedDate(r.updatedAt)}</p>
                            </div>

                            <div className="flex gap-1 shrink-0 items-center">
                              {/* Load button */}
                              <button
                                onClick={() => handleLoad(r)}
                                className="flex items-center gap-1 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 hover:border-blue-200 transition-colors"
                              >
                                <FolderOpen size={12} /> Load
                              </button>

                              {/* Change Template button */}
                              <div className="relative">
                                <button
                                  onClick={() => setTemplateMenuId(templateMenuId === r._id ? null : r._id)}
                                  title="Open with different template"
                                  className="flex items-center gap-1 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 hover:border-purple-200 transition-colors"
                                >
                                  <LayoutTemplate size={12} />
                                  <ChevronDown size={10} />
                                </button>

                                {templateMenuId === r._id && (
                                  <div className="absolute right-0 bottom-full mb-1 z-50 w-48 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
                                    <p className="px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">
                                      Open in Editor as…
                                    </p>
                                    {TEMPLATE_LIST.map((tpl) => (
                                      <button
                                        key={tpl.id}
                                        onClick={() => handleOpenWithTemplate(r, tpl.id)}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 transition-colors text-left"
                                      >
                                        <LayoutTemplate size={11} className="text-gray-400 shrink-0" />
                                        {tpl.label}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <button
                                onClick={() => handleDuplicate(r._id)}
                                disabled={duplicateLoading === r._id}
                                title="Duplicate"
                                className="rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors disabled:opacity-40"
                              >
                                {duplicateLoading === r._id ? <Loader2 size={12} className="animate-spin" /> : <Copy size={12} />}
                              </button>
                              <button
                                onClick={() => handleDelete(r._id, r.name)}
                                title="Delete"
                                className="rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {deleteTarget && (
          <ConfirmModal
            title="Delete Resume?"
            description={<><span className="font-medium text-gray-700 dark:text-gray-200">&quot;{deleteTarget.name}&quot;</span> will be permanently deleted and cannot be recovered.</>}
            confirmLabel="Delete"
            loading={deleteLoading}
            onConfirm={confirmDelete}
            onClose={() => setDeleteTarget(null)}
          />
        )}

        {loadTarget && (
          <ConfirmModal
            title="Load Resume?"
            description={<>Loading <span className="font-medium text-gray-700 dark:text-gray-200">&quot;{loadTarget.name}&quot;</span> will replace your current unsaved changes.</>}
            confirmLabel="Load"
            variant="warning"
            onConfirm={confirmLoad}
            onClose={() => setLoadTarget(null)}
          />
        )}
      </div>

      {showAuth && (
        <AuthToSaveModal
          onClose={() => setShowAuth(false)}
          onSuccess={handleSaveAfterAuth}
          title="Save your resume"
          subtitle="Sign in or create a free account to save your resumes to the cloud."
        />
      )}
    </>
  )
}
