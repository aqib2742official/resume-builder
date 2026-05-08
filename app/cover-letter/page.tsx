'use client'

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Mail, Plus, Save, Trash2, Download, FileText, ChevronDown, X, Check, Loader2, Sparkles } from 'lucide-react'
import { clsx } from 'clsx'
import { getSavedResumes, type SavedResume } from '@/lib/resumeStorage'
import { callAI } from '@/lib/ai'
import {
  getCoverLetters, saveCoverLetter, updateCoverLetter, deleteCoverLetter,
  type CoverLetter,
} from '@/lib/coverLetterStorage'
import { usePersonal } from '@/hooks/useResumeData'
import { format } from 'date-fns'

function emptyLetter(): Omit<CoverLetter, 'id' | 'savedAt'> {
  return { name: 'My Cover Letter', linkedResumeId: '', recipientName: '', companyName: '', jobTitle: '', body: '' }
}

function CoverLetterPreview({ letter, senderName, senderEmail, senderPhone }: {
  letter: Omit<CoverLetter, 'id' | 'savedAt'>
  senderName: string
  senderEmail: string
  senderPhone: string
}) {
  const today = format(new Date(), 'MMMM d, yyyy')

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-sm leading-relaxed font-serif text-gray-800 min-h-[600px]">
      {/* Letterhead */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <p className="text-xl font-bold text-gray-900">{senderName || 'Your Name'}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {[senderEmail, senderPhone].filter(Boolean).join(' · ') || 'your@email.com · +1 (555) 000-0000'}
        </p>
      </div>

      <p className="text-xs text-gray-400 mb-4">{today}</p>

      {(letter.recipientName || letter.companyName) && (
        <div className="mb-4">
          {letter.recipientName && <p>{letter.recipientName}</p>}
          {letter.companyName && <p className="font-semibold">{letter.companyName}</p>}
        </div>
      )}

      {(letter.recipientName || letter.jobTitle) && (
        <p className="mb-4">
          Dear {letter.recipientName || 'Hiring Manager'},
        </p>
      )}

      {letter.body ? (
        <div className="whitespace-pre-wrap text-gray-700 leading-7">{letter.body}</div>
      ) : (
        <div className="text-gray-400 italic">
          <p className="mb-3">Start writing your cover letter in the editor on the left. Your letter will preview here in real-time.</p>
          <p className="mb-3">A strong cover letter should:</p>
          <ul className="list-disc ml-4 space-y-1 text-sm">
            <li>Mention the specific role and company</li>
            <li>Highlight 2–3 relevant achievements</li>
            <li>Show genuine enthusiasm for the role</li>
            <li>Be concise — 3 to 4 paragraphs maximum</li>
          </ul>
        </div>
      )}

      {letter.body && (
        <div className="mt-6">
          <p>Sincerely,</p>
          <p className="mt-4 font-semibold">{senderName || 'Your Name'}</p>
        </div>
      )}
    </div>
  )
}

export default function CoverLetterPage() {
  const personal = usePersonal()
  const [letters, setLetters] = useState<CoverLetter[]>([])
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [draft, setDraft] = useState(emptyLetter())
  const [saving, setSaving] = useState(false)
  const [savedFeedback, setSavedFeedback] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showList, setShowList] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiError, setAiError] = useState(false)

  function loadAll() {
    const cls = getCoverLetters()
    setLetters(cls)
    setSavedResumes(getSavedResumes())
  }

  useEffect(() => { loadAll() }, [])

  const activeLetter = letters.find((l) => l.id === activeId)

  function selectLetter(id: string) {
    const l = letters.find((x) => x.id === id)
    if (!l) return
    setActiveId(id)
    setDraft({ name: l.name, linkedResumeId: l.linkedResumeId ?? '', recipientName: l.recipientName, companyName: l.companyName, jobTitle: l.jobTitle, body: l.body })
    setShowList(false)
  }

  function handleNew() {
    setActiveId(null)
    setDraft(emptyLetter())
    setShowList(false)
  }

  function handleSave() {
    setSaving(true)
    setTimeout(() => {
      if (activeId) {
        updateCoverLetter(activeId, draft)
      } else {
        const saved = saveCoverLetter(draft)
        setActiveId(saved.id)
      }
      loadAll()
      setSaving(false)
      setSavedFeedback(true)
      setTimeout(() => setSavedFeedback(false), 2000)
    }, 300)
  }

  function handleDelete() {
    if (!activeId) return
    if (confirmDelete) {
      deleteCoverLetter(activeId)
      setActiveId(null)
      setDraft(emptyLetter())
      loadAll()
      setConfirmDelete(false)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  function handlePrint() {
    const content = document.getElementById('cover-letter-preview')
    if (!content) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<html><head><title>Cover Letter</title><style>body{font-family:serif;padding:40px;max-width:700px;margin:auto;color:#1a1a1a;line-height:1.7;font-size:14px}</style></head><body>${content.innerHTML}</body></html>`)
    win.document.close()
    win.print()
  }

  const linkedResume = savedResumes.find((r) => r.id === draft.linkedResumeId)
  const senderName = linkedResume?.data.personal.fullName || personal.fullName || ''
  const senderEmail = linkedResume?.data.personal.email || personal.email || ''
  const senderPhone = linkedResume?.data.personal.phone || personal.phone || ''

  async function handleAIGenerate() {
    setAiGenerating(true)
    setAiError(false)
    try {
      const resumeData = linkedResume?.data
      const skills = (resumeData?.skills ?? []).flatMap((c) => c.skills).slice(0, 15).join(', ')
      const summary = resumeData?.personal.summary || personal.summary || ''
      const result = await callAI('cover-letter', {
        company: draft.companyName,
        role: draft.jobTitle,
        senderName,
        skills,
        summary,
      })
      setDraft((d) => ({ ...d, body: result }))
    } catch {
      setAiError(true)
      setTimeout(() => setAiError(false), 3000)
    } finally {
      setAiGenerating(false)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Page header */}
      <div className="shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Mail size={18} className="text-blue-600 shrink-0" />
          <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">{draft.name || 'Cover Letter'}</h1>
          {activeLetter && <span className="text-xs text-gray-400">{format(new Date(activeLetter.savedAt), 'MMM d, yyyy')}</span>}
        </div>

        <div className="flex items-center gap-2">
          {/* Letters picker */}
          <div className="relative">
            <button
              onClick={() => setShowList((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FileText size={13} />
              My Letters ({letters.length})
              <ChevronDown size={13} />
            </button>
            {showList && (
              <div className="absolute right-0 top-full mt-1 z-20 w-56 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                <div className="p-1">
                  <button onClick={handleNew} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors">
                    <Plus size={13} /> New Letter
                  </button>
                  {letters.map((l) => (
                    <button key={l.id} onClick={() => selectLetter(l.id)} className={clsx('flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-left transition-colors', l.id === activeId ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700')}>
                      <Mail size={12} className="shrink-0" />
                      <span className="truncate">{l.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {activeId && (
            <button
              onClick={handleDelete}
              className={clsx('rounded-lg border px-3 py-1.5 text-sm transition-colors', confirmDelete ? 'border-red-300 bg-red-50 text-red-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50')}
            >
              <Trash2 size={13} />
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download size={13} /> Export PDF
          </button>

          <button
            onClick={handleSave}
            disabled={saving || !draft.name.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : savedFeedback ? <Check size={13} /> : <Save size={13} />}
            {savedFeedback ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>

      {/* Main split */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: editor */}
        <div className="w-full lg:w-96 lg:shrink-0 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-auto">
          <div className="p-4 space-y-4">
            {/* Letter name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Letter Name</label>
              <input
                className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="e.g. Google SWE Application"
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              />
            </div>

            {/* Link to resume */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Link to Resume (optional)</label>
              <select
                className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={draft.linkedResumeId ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, linkedResumeId: e.target.value }))}
              >
                <option value="">— Use active resume —</option>
                {savedResumes.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">Pulls your name and contact info automatically</p>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Recipient Details</p>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Hiring Manager Name</label>
                <input
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="e.g. Sarah Johnson"
                  value={draft.recipientName}
                  onChange={(e) => setDraft((d) => ({ ...d, recipientName: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                <input
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="e.g. Google"
                  value={draft.companyName}
                  onChange={(e) => setDraft((d) => ({ ...d, companyName: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
                <input
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="e.g. Software Engineer"
                  value={draft.jobTitle}
                  onChange={(e) => setDraft((d) => ({ ...d, jobTitle: e.target.value }))}
                />
              </div>
            </div>

            {/* AI Generate button */}
            <div className="flex items-center justify-between gap-2 border-t border-gray-100 dark:border-gray-700 pt-4">
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1">
                  <Sparkles size={12} className="text-[#0f2044] dark:text-sky-400" /> AI Cover Letter
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Generates from company, role + resume</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {aiError && <span className="text-[10px] text-red-500">Failed — check API key</span>}
                <button
                  onClick={handleAIGenerate}
                  disabled={aiGenerating || (!draft.companyName.trim() && !draft.jobTitle.trim())}
                  className="flex items-center gap-1.5 rounded-lg bg-[#0f2044] hover:bg-[#162d5c] text-white px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {aiGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  {aiGenerating ? 'Writing…' : 'Generate with AI'}
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Letter Body</label>
              <textarea
                className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none leading-relaxed"
                rows={16}
                placeholder={`I am writing to express my interest in the ${draft.jobTitle || '[Role]'} position at ${draft.companyName || '[Company]'}...\n\nIn my previous role at [Company], I [achievement with numbers]...\n\nI am particularly excited about [specific thing about the company]...\n\nThank you for your consideration. I look forward to discussing this opportunity.`}
                value={draft.body}
                onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
              />
              <p className="text-xs text-gray-400 mt-1">{draft.body.split(/\s+/).filter(Boolean).length} words</p>
            </div>
          </div>
        </div>

        {/* Right: preview */}
        <div className="hidden lg:flex flex-1 flex-col overflow-auto bg-gray-100 dark:bg-gray-950 p-6">
          <div id="cover-letter-preview" className="max-w-2xl mx-auto w-full">
            <CoverLetterPreview letter={draft} senderName={senderName} senderEmail={senderEmail} senderPhone={senderPhone} />
          </div>
        </div>
      </div>
    </div>
  )
}
