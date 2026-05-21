'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'next/navigation'
import { MessageSquare, Sparkles, Loader2, RefreshCw, Lightbulb, Code2, Users, Star, ChevronDown, ChevronUp } from 'lucide-react'
import { callAI } from '@/lib/ai'
import type { RootState } from '@/store'
import type { ResumeData } from '@/types/resume'

interface QA {
  question: string
  answer:   string
  type:     'behavioral' | 'technical' | 'situational'
}

const TYPE_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  behavioral:  { label: 'Behavioral',  color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',  icon: <Users     size={11} /> },
  technical:   { label: 'Technical',   color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',           icon: <Code2     size={11} /> },
  situational: { label: 'Situational', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',       icon: <Lightbulb size={11} /> },
}

function QACard({ qa, index, onRegenerate, loading }: Readonly<{ qa: QA; index: number; onRegenerate: () => void; loading: boolean }>) {
  const [open, setOpen] = useState(true)
  const meta = TYPE_META[qa.type] ?? TYPE_META.behavioral

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      {/* Question row */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
      >
        <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">
          {index + 1}
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 mt-0.5 ${meta.color}`}>
          {meta.icon} {meta.label}
        </span>
        <span className="flex-1 text-sm font-semibold text-gray-900 dark:text-white leading-snug">{qa.question}</span>
        {open
          ? <ChevronUp  size={15} className="shrink-0 text-gray-400 mt-0.5" />
          : <ChevronDown size={15} className="shrink-0 text-gray-400 mt-0.5" />}
      </button>

      {/* Answer — open by default */}
      {open && (
        <div className="px-5 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3">
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{qa.answer}</p>
          <button
            onClick={(e) => { e.stopPropagation(); onRegenerate() }}
            disabled={loading}
            className="mt-3 flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
            Regenerate answer
          </button>
        </div>
      )}
    </div>
  )
}

export default function InterviewPrepPage() {
  const reduxResumeData = useSelector((state: RootState) => state.resume.data)
  const searchParams = useSearchParams()

  const paramJobTitle   = searchParams.get('jobTitle') ?? ''
  const paramCompany    = searchParams.get('company') ?? ''
  const paramResumeId   = searchParams.get('resumeId') ?? ''
  const paramResumeName = searchParams.get('resumeName') ?? ''

  const [fetchedResume, setFetchedResume] = useState<ResumeData | null>(null)
  const [loadingResume, setLoadingResume] = useState(false)

  useEffect(() => {
    if (!paramResumeId) return
    setLoadingResume(true)
    fetch(`/api/resumes/${paramResumeId}`)
      .then((r) => r.json())
      .then(({ resume }) => { if (resume?.data) setFetchedResume(resume.data as ResumeData) })
      .catch(() => {/* fallback to redux */})
      .finally(() => setLoadingResume(false))
  }, [paramResumeId])

  const resumeData = fetchedResume ?? reduxResumeData

  const [jobTitle,   setJobTitle]   = useState(paramJobTitle || resumeData.personal.jobTitle || '')
  const [jobDesc,    setJobDesc]    = useState(paramCompany ? `Company: ${paramCompany}` : '')
  const [useResume,  setUseResume]  = useState(true)
  const [questions,  setQuestions]  = useState<QA[]>([])
  const [generating, setGenerating] = useState(false)
  const [regenIdx,   setRegenIdx]   = useState<number | null>(null)
  const [error,      setError]      = useState('')

  function buildPayload() {
    const payload: Record<string, string> = { jobTitle, jobDescription: jobDesc }
    if (useResume) {
      payload.experience = resumeData.experience.slice(0, 3).map((e) => `${e.position} at ${e.company}`).join('; ')
      payload.skills     = resumeData.skills.flatMap((g) => g.skills).slice(0, 12).join(', ')
      payload.projects   = resumeData.projects.slice(0, 3).map((p) => p.title).join(', ')
    }
    return payload
  }

  async function handleGenerate() {
    if (!jobTitle.trim()) { setError('Please enter a job title.'); return }
    setError('')
    setGenerating(true)
    try {
      const raw = await callAI('interview-questions', buildPayload())
      setQuestions(JSON.parse(raw))
    } catch {
      setError('Failed to generate questions. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  async function handleRegenAnswer(idx: number) {
    setRegenIdx(idx)
    try {
      const payload = { ...buildPayload(), singleQuestion: questions[idx].question }
      const raw = await callAI('interview-questions', { ...payload, jobTitle: `Single question regeneration for: ${questions[idx].question}` })
      const parsed: QA[] = JSON.parse(raw)
      const updated = [...questions]
      updated[idx] = { ...updated[idx], answer: parsed[0]?.answer ?? updated[idx].answer }
      setQuestions(updated)
    } catch {
      // silently keep old answer
    } finally {
      setRegenIdx(null)
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">

        {/* Page header */}
        <div>
          {(paramResumeId || paramCompany) && (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30 px-4 py-3 text-sm text-purple-700 dark:text-purple-300">
              {loadingResume
                ? <Loader2 size={14} className="animate-spin shrink-0" />
                : <Star size={14} className="shrink-0 fill-purple-400 text-purple-400" />}
              <span>
                {paramCompany && <><strong>{paramCompany}</strong> — </>}
                {paramResumeName
                  ? <>Using resume: <strong>{paramResumeName}</strong></>
                  : paramResumeId ? 'Loading resume data…' : 'Preparing questions…'}
              </span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f2044] text-white shrink-0">
              <MessageSquare size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Interview Prep</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">AI-generated questions + STAR-method answers tailored to you</p>
            </div>
          </div>
        </div>

        {/* ── Input form ── */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Job Title *</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g. Senior React Developer"
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                Job Description <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste job description for targeted questions…"
                rows={3}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="flex items-center gap-2.5 cursor-pointer flex-1">
              <input
                type="checkbox"
                checked={useResume}
                onChange={(e) => setUseResume(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-400"
              />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Use my active resume</p>
                <p className="text-xs text-gray-400">Tailors questions to your experience & skills</p>
              </div>
            </label>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#0f2044] hover:bg-[#1a3a6e] text-white px-6 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 shrink-0"
            >
              {generating
                ? <><Loader2 size={14} className="animate-spin" /> Generating…</>
                : <><Sparkles size={14} /> Generate 20 Questions</>}
            </button>
          </div>
        </div>

        {/* ── Q&A results ── */}
        {generating && (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-14 flex flex-col items-center justify-center gap-3">
            <Loader2 size={30} className="animate-spin text-sky-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Generating your 20 interview questions…</p>
          </div>
        )}

        {!generating && questions.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-14 flex flex-col items-center justify-center text-center gap-3">
            <MessageSquare size={32} className="text-gray-300 dark:text-gray-600" />
            <p className="text-sm font-medium text-gray-400 dark:text-gray-500">Questions & answers will appear here</p>
            <p className="text-xs text-gray-400 dark:text-gray-600">Enter a job title above and click Generate</p>
          </div>
        )}

        {!generating && questions.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{questions.length} Questions</p>
              <div className="flex gap-2 text-[10px] font-semibold">
                {(['behavioral', 'technical', 'situational'] as const).map((t) => {
                  const count = questions.filter(q => q.type === t).length
                  if (!count) return null
                  return (
                    <span key={t} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${TYPE_META[t].color}`}>
                      {TYPE_META[t].icon} {count} {TYPE_META[t].label}
                    </span>
                  )
                })}
              </div>
            </div>

            {questions.map((qa, i) => (
              <QACard
                key={i}
                qa={qa}
                index={i}
                onRegenerate={() => handleRegenAnswer(i)}
                loading={regenIdx === i}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
