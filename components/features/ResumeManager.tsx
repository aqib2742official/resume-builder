'use client'

import { useState, useEffect } from 'react'
import { X, Save, FolderOpen, Trash2, Check, FileText, Copy } from 'lucide-react'
import { getSavedResumes, saveResume, deleteResume, renameResume, duplicateResume, type SavedResume } from '@/lib/resumeStorage'
import { useResumeData } from '@/hooks/useResumeData'
import { useResumeActions } from '@/hooks/useResumeActions'
import { Button } from '@/components/ui/Button'

interface ResumeManagerProps {
  onClose: () => void
}

export function ResumeManager({ onClose }: ResumeManagerProps) {
  const data = useResumeData()
  const { loadResumeData } = useResumeActions()
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([])
  const [saveName, setSaveName] = useState(() =>
    data.personal.fullName ? `${data.personal.fullName} — Resume` : ''
  )
  const [saved, setSaved] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  useEffect(() => {
    setSavedResumes(getSavedResumes())
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
    loadResumeData(resume.data)
    onClose()
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
      <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-blue-600" />
            <h2 className="text-base font-semibold text-gray-800">My Resumes</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Save current */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Save Current Resume</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                placeholder={data.personal.fullName ? `${data.personal.fullName} — v1` : 'My Resume'}
                className="flex-1 h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button size="sm" onClick={handleSave}>
                {saved ? <Check size={14} /> : <Save size={14} />}
                {saved ? 'Saved!' : 'Save'}
              </Button>
            </div>
          </div>

          {/* Saved resumes list */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Saved Resumes{' '}
              <span className="text-gray-400 font-normal">({savedResumes.length})</span>
            </p>

            {savedResumes.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-gray-200 py-8 text-center">
                <FileText size={28} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">No saved resumes yet</p>
                <p className="text-xs text-gray-300 mt-1">Save your current resume above</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {savedResumes.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                  >
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
                          className="w-full text-sm font-medium bg-white border border-blue-300 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                      ) : (
                        <p
                          className="text-sm font-medium text-gray-800 truncate cursor-pointer hover:text-blue-600"
                          onClick={() => { setEditingId(r.id); setEditingName(r.name) }}
                          title="Click to rename"
                        >
                          {r.name}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">{formattedDate(r.savedAt)}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleLoad(r)}
                        className="flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                      >
                        <FolderOpen size={12} /> Load
                      </button>
                      <button
                        onClick={() => handleDuplicate(r.id)}
                        title="Duplicate"
                        className="rounded-md border border-gray-200 bg-white p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id, r.name)}
                        title="Delete"
                        className="rounded-md border border-gray-200 bg-white p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
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
