'use client'

import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { X, Save, FolderOpen, Trash2, Check, FileText, Copy, LayoutTemplate, ChevronDown } from 'lucide-react'
import { getSavedResumes, saveResume, deleteResume, renameResume, duplicateResume, type SavedResume } from '@/lib/resumeStorage'
import { useResumeData } from '@/hooks/useResumeData'
import { useResumeActions } from '@/hooks/useResumeActions'
import { setTemplateId, type TemplateId } from '@/store/themeSlice'
import { loadResumeData } from '@/store/resumeSlice'
import { Button } from '@/components/ui/Button'
import type { AppDispatch } from '@/store'

const TEMPLATE_LIST: { id: TemplateId; label: string }[] = [
  { id: 'two-column',   label: 'Classic (Two-Column)' },
  { id: 'minimal',      label: 'Minimal' },
  { id: 'academic',     label: 'Academic' },
  { id: 'professional', label: 'Professional' },
  { id: 'executive',    label: 'Executive' },
  { id: 'modern',       label: 'Modern' },
]

interface ResumeManagerProps {
  onClose: () => void
}

export function ResumeManager({ onClose }: ResumeManagerProps) {
  const data = useResumeData()
  const { loadResumeData: loadCurrent } = useResumeActions()
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([])
  const [saveName, setSaveName] = useState(() =>
    data.personal.fullName ? `${data.personal.fullName} — Resume` : ''
  )
  const [saved, setSaved] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [templateMenuId, setTemplateMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSavedResumes(getSavedResumes())
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setTemplateMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSave() {
    const name = saveName.trim() || (data.personal.fullName ? `${data.personal.fullName} — Resume` : 'My Resume')
    saveResume(name, data)
    setSavedResumes(getSavedResumes())
    setSaveName('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleLoad(resume: SavedResume) {
    if (!confirm(`Load "${resume.name}"? Your current unsaved changes will be replaced.`)) return
    loadCurrent(resume.data)
    onClose()
  }

  function handleOpenWithTemplate(resume: SavedResume, templateId: TemplateId) {
    dispatch(loadResumeData(resume.data))
    dispatch(setTemplateId(templateId))
    setTemplateMenuId(null)
    onClose()
    router.push('/editor')
  }

  function handleDuplicate(id: string) {
    duplicateResume(id)
    setSavedResumes(getSavedResumes())
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return
    deleteResume(id)
    setSavedResumes(getSavedResumes())
  }

  function handleRename(id: string) {
    if (!editingName.trim()) { setEditingId(null); return }
    renameResume(id, editingName)
    setSavedResumes(getSavedResumes())
    setEditingId(null)
  }

  const formattedDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
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
              <Button size="sm" onClick={handleSave}>
                {saved ? <Check size={14} /> : <Save size={14} />}
                {saved ? 'Saved!' : 'Save'}
              </Button>
            </div>
          </div>

          {/* Saved resumes list */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
              Saved Resumes{' '}
              <span className="text-gray-400 font-normal">({savedResumes.length})</span>
            </p>

            {savedResumes.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600 py-8 text-center">
                <FileText size={28} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">No saved resumes yet</p>
                <p className="text-xs text-gray-300 mt-1">Save your current resume above</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2" ref={menuRef}>
                {savedResumes.map((r) => (
                  <div key={r.id} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 overflow-visible">
                    <div className="flex items-center gap-3 px-4 py-3">
                      <FileText size={16} className="text-blue-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        {editingId === r.id ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRename(r.id)}
                            onBlur={() => handleRename(r.id)}
                            autoFocus
                            className="w-full text-sm font-medium bg-white dark:bg-gray-600 border border-blue-300 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-800 dark:text-white"
                          />
                        ) : (
                          <p
                            className="text-sm font-medium text-gray-800 dark:text-white truncate cursor-pointer hover:text-blue-600"
                            onClick={() => { setEditingId(r.id); setEditingName(r.name) }}
                            title="Click to rename"
                          >
                            {r.name}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">{formattedDate(r.savedAt)}</p>
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
                            onClick={() => setTemplateMenuId(templateMenuId === r.id ? null : r.id)}
                            title="Open with different template"
                            className="flex items-center gap-1 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 hover:border-purple-200 transition-colors"
                          >
                            <LayoutTemplate size={12} />
                            <ChevronDown size={10} />
                          </button>

                          {templateMenuId === r.id && (
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
                          onClick={() => handleDuplicate(r.id)}
                          title="Duplicate"
                          className="rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                        >
                          <Copy size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id, r.name)}
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
        </div>
      </div>
    </div>
  )
}
