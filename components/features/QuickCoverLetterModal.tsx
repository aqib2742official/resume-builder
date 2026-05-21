'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useSession } from 'next-auth/react'
import { X, Mail, Loader2, Sparkles, Save, Check } from 'lucide-react'
import { callAI } from '@/lib/ai'
import type { RootState } from '@/store'

interface Props { onClose: () => void }

export function QuickCoverLetterModal({ onClose }: Readonly<Props>) {
  const { data: session } = useSession()
  const resumeData = useSelector((state: RootState) => state.resume.data)

  const [company,   setCompany]   = useState('')
  const [jobTitle,  setJobTitle]  = useState(resumeData.personal.jobTitle ?? '')
  const [body,      setBody]      = useState('')
  const [generating, setGenerating] = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [saved,      setSaved]      = useState(false)
  const [error,      setError]      = useState('')

  async function handleGenerate() {
    if (!company.trim() || !jobTitle.trim()) {
      setError('Please enter both company name and job title.')
      return
    }
    setError('')
    setGenerating(true)
    try {
      const skills = resumeData.skills
        .flatMap((g) => g.skills)
        .slice(0, 10)
        .join(', ')

      const experience = resumeData.experience
        .slice(0, 3)
        .map((e) => `${e.position} at ${e.company}`)
        .join('; ')

      const education = resumeData.education
        .slice(0, 2)
        .map((e) => `${e.degree} from ${e.institution}`)
        .join('; ')

      const projects = resumeData.projects
        .slice(0, 3)
        .map((p) => p.title)
        .join(', ')

      const text = await callAI('cover-letter', {
        senderName: resumeData.personal.fullName ?? '',
        role:       jobTitle.trim(),
        company:    company.trim(),
        skills,
        summary:    resumeData.personal.summary ?? '',
        experience,
        education,
        projects,
      })
      setBody(text)
    } catch {
      setError('AI generation failed. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  async function handleSave() {
    if (!body.trim()) return
    setSaving(true)
    try {
      await fetch('/api/cover-letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:          `${company} — ${jobTitle}`,
          companyName:   company.trim(),
          jobTitle:      jobTitle.trim(),
          recipientName: '',
          body:          body.trim(),
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setError('Failed to save cover letter.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose() }}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-sky-500" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Quick Cover Letter</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 p-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Company Name *</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google"
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Job Title *</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior React Developer"
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center justify-center gap-2 w-full rounded-lg bg-[#0f2044] hover:bg-[#1a3a6e] text-white py-2.5 text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {generating
              ? <><Loader2 size={14} className="animate-spin" /> Generating…</>
              : <><Sparkles size={14} /> Generate with AI</>}
          </button>

          {body && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Generated Letter — edit as needed</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white resize-y focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        {body && (
          <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 shrink-0 flex items-center justify-between gap-3">
            {!session && (
              <p className="text-xs text-gray-400">Sign in to save to your account</p>
            )}
            <div className="ml-auto flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
              {session && (
                <button
                  onClick={handleSave}
                  disabled={saving || saved}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold transition-colors disabled:opacity-60"
                >
                  {saved
                    ? <><Check size={13} /> Saved!</>
                    : saving
                    ? <><Loader2 size={13} className="animate-spin" /> Saving…</>
                    : <><Save size={13} /> Save to My Letters</>}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
