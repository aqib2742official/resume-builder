'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { Check, ArrowRight, Sparkles } from 'lucide-react'
import { clsx } from 'clsx'
import { loadResumeData } from '@/store/resumeSlice'
import { setTemplateId } from '@/store/themeSlice'
import { defaultResume } from '@/constants/defaultResume'
import type { AppDispatch } from '@/store'
import type { TemplateId } from '@/store/themeSlice'

// ── Template thumbnails ──────────────────────────────────────────────────────

function TwoColumnThumb({ a }: { a: string }) {
  return (
    <svg viewBox="0 0 80 108" fill="none" className="w-full h-full">
      <rect width="80" height="108" fill="white" />
      <rect width="80" height="20" fill={a} />
      <rect x="5" y="5" width="35" height="4" rx="1" fill="white" opacity="0.9" />
      <rect x="5" y="12" width="22" height="2" rx="1" fill="white" opacity="0.5" />
      <line x1="38" y1="22" x2="38" y2="100" stroke="#e5e7eb" strokeWidth="0.5" />
      {[26, 40, 54, 68, 82].map((y) => (
        <g key={y}>
          <rect x="5" y={y} width="28" height="2" rx="1" fill={a} opacity="0.7" />
          <rect x="5" y={y+5} width="24" height="1.5" rx="0.5" fill="#e5e7eb" />
          <rect x="42" y={y} width="34" height="2" rx="1" fill={a} opacity="0.7" />
          <rect x="42" y={y+5} width="30" height="1.5" rx="0.5" fill="#e5e7eb" />
        </g>
      ))}
    </svg>
  )
}
function MinimalThumb({ a }: { a: string }) {
  return (
    <svg viewBox="0 0 80 108" fill="none" className="w-full h-full">
      <rect width="80" height="108" fill="white" />
      <rect width="80" height="22" fill={a} />
      <rect x="5" y="5" width="40" height="5" rx="1" fill="white" opacity="0.9" />
      {[28,48,68,88].map((y) => (
        <g key={y}>
          <rect x="5" y={y} width="50" height="2" rx="1" fill={a} opacity="0.8" />
          <rect x="5" y={y+6} width="65" height="1.5" rx="0.5" fill="#e5e7eb" />
          <rect x="5" y={y+10} width="60" height="1.5" rx="0.5" fill="#e5e7eb" />
        </g>
      ))}
    </svg>
  )
}
function AcademicThumb({ a }: { a: string }) {
  return (
    <svg viewBox="0 0 80 108" fill="none" className="w-full h-full">
      <rect width="80" height="108" fill="white" />
      <rect x="15" y="5" width="50" height="5" rx="1" fill="#111827" opacity="0.8" />
      <line x1="5" y1="18" x2="75" y2="18" stroke={a} strokeWidth="0.8" opacity="0.6" />
      {[24,44,64,84].map((y) => (
        <g key={y}>
          <rect x="5" y={y} width="35" height="2" rx="1" fill="#111827" opacity="0.65" />
          <rect x="5" y={y+7} width="65" height="1.5" rx="0.5" fill="#e5e7eb" />
          <rect x="5" y={y+11} width="58" height="1.5" rx="0.5" fill="#e5e7eb" />
        </g>
      ))}
    </svg>
  )
}
function ProfessionalThumb({ a }: { a: string }) {
  return (
    <svg viewBox="0 0 80 108" fill="none" className="w-full h-full">
      <rect width="80" height="108" fill="white" />
      <rect x="5" y="5" width="45" height="5" rx="1" fill="#111827" opacity="0.85" />
      <line x1="5" y1="23" x2="75" y2="23" stroke={a} strokeWidth="1.2" />
      {[28,48,68,88].map((y) => (
        <g key={y}>
          <rect x="5" y={y} width="40" height="2" rx="1" fill="#111827" opacity="0.65" />
          <rect x="5" y={y+6} width="65" height="1.5" rx="0.5" fill="#e5e7eb" />
          <rect x="5" y={y+10} width="55" height="1.5" rx="0.5" fill="#e5e7eb" />
        </g>
      ))}
    </svg>
  )
}
function ExecutiveThumb({ a }: { a: string }) {
  return (
    <svg viewBox="0 0 80 108" fill="none" className="w-full h-full">
      <rect width="80" height="108" fill="white" />
      <rect width="26" height="108" fill={a} />
      <circle cx="13" cy="16" r="8" fill="white" opacity="0.2" />
      <rect x="4" y="28" width="18" height="2.5" rx="1" fill="white" opacity="0.8" />
      {[43,48,53,58].map((y) => <rect key={y} x="3" y={y} width="20" height="1.2" rx="0.4" fill="white" opacity="0.35" />)}
      <rect x="30" y="8" width="46" height="2" rx="1" fill={a} opacity="0.75" />
      {[15,26,37,48,59,70].map((y) => (
        <rect key={y} x="30" y={y} width={y % 2 === 0 ? 40 : 35} height="1.5" rx="0.5" fill="#e5e7eb" />
      ))}
    </svg>
  )
}
function ModernThumb({ a }: { a: string }) {
  return (
    <svg viewBox="0 0 80 108" fill="none" className="w-full h-full">
      <rect width="80" height="108" fill="white" />
      <rect width="80" height="24" fill={a} />
      <rect x="10" y="5" width="60" height="6" rx="1" fill="white" opacity="0.9" />
      {[30,55,80].map((y) => (
        <g key={y}>
          <rect x="5" y={y} width="2" height="11" rx="1" fill={a} />
          <rect x="10" y={y+2} width="28" height="2" rx="1" fill="#111827" opacity="0.65" />
          <rect x="20" y={y+22} width="48" height="1.5" rx="0.5" fill="#e5e7eb" />
        </g>
      ))}
    </svg>
  )
}

const TEMPLATES: { id: TemplateId; name: string; tag: string; thumb: React.ReactNode }[] = [
  { id: 'two-column',   name: 'Classic',      tag: 'Two columns',   thumb: <TwoColumnThumb   a="#1e3a5f" /> },
  { id: 'minimal',      name: 'Minimal',      tag: 'Single column', thumb: <MinimalThumb      a="#1e3a5f" /> },
  { id: 'academic',     name: 'Academic',     tag: 'CV / dense',    thumb: <AcademicThumb     a="#1e3a5f" /> },
  { id: 'professional', name: 'Professional', tag: 'Clean & formal',thumb: <ProfessionalThumb a="#1e3a5f" /> },
  { id: 'executive',    name: 'Executive',    tag: 'Sidebar layout',thumb: <ExecutiveThumb    a="#1e3a5f" /> },
  { id: 'modern',       name: 'Modern',       tag: 'Timeline style',thumb: <ModernThumb       a="#1e3a5f" /> },
]

// ── Wizard ───────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router   = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const [step,       setStep]       = useState(1)
  const [templateId, setTemplateIdState] = useState<TemplateId>('two-column')
  const [fullName,   setFullName]   = useState('')
  const [jobTitle,   setJobTitle]   = useState('')
  const [email,      setEmail]      = useState('')
  const [phone,      setPhone]      = useState('')

  function handlePickTemplate(id: TemplateId) {
    setTemplateIdState(id)
    setStep(2)
  }

  function handleOpenEditor() {
    const resume = {
      ...defaultResume,
      personal: { ...defaultResume.personal, fullName, jobTitle, email, phone },
    }
    dispatch(loadResumeData(resume))
    dispatch(setTemplateId(templateId))
    router.push('/editor')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2044] to-[#1a3a6e] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-medium tracking-[0.22em] text-sky-400 uppercase block">Maria</span>
          <span className="text-2xl font-extrabold text-white tracking-tight">
            Resume<span className="text-sky-400">Builder</span>
          </span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={clsx(
                'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors',
                step > s  ? 'bg-sky-400 text-white' :
                step === s ? 'bg-white text-[#0f2044]' :
                             'bg-white/20 text-white/50'
              )}>
                {step > s ? <Check size={13} /> : s}
              </div>
              {s < 3 && <div className={clsx('h-px w-10 transition-colors', step > s ? 'bg-sky-400' : 'bg-white/20')} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">

          {/* ── Step 1: Pick template ───────────────────────────── */}
          {step === 1 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Pick your template</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Choose a style — you can always change it later</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handlePickTemplate(t.id)}
                    className={clsx(
                      'group flex flex-col rounded-xl border-2 overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5',
                      templateId === t.id
                        ? 'border-[#0f2044] shadow-lg'
                        : 'border-gray-200 dark:border-gray-700 hover:border-[#0f2044]'
                    )}
                  >
                    <div className="aspect-[3/4] w-full bg-gray-50">{t.thumb}</div>
                    <div className="px-3 py-2 text-left">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">{t.name}</p>
                      <p className="text-[10px] text-gray-400">{t.tag}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Basic info ──────────────────────────────── */}
          {step === 2 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Tell us about yourself</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Just the basics — you can fill everything else in the editor</p>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Johnson"
                      className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Job Title</label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Software Engineer"
                      className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 234 567 890"
                      className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 rounded-lg bg-[#0f2044] hover:bg-[#1a3a6e] text-white px-5 py-2.5 text-sm font-semibold transition-colors"
                  >
                    Continue <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Ready ───────────────────────────────────── */}
          {step === 3 && (
            <div className="p-6 sm:p-8 flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 dark:bg-sky-950/30 mb-5">
                <Sparkles size={28} className="text-sky-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {fullName ? `You're all set, ${fullName.split(' ')[0]}!` : "You're all set!"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 max-w-sm">
                Your <span className="font-semibold text-gray-700 dark:text-gray-300">{TEMPLATES.find((t) => t.id === templateId)?.name}</span> template is ready. Open the full editor to complete your resume and download a PDF.
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-8">You can change the template, colors, and layout anytime from the editor.</p>

              <button
                onClick={handleOpenEditor}
                className="flex items-center gap-2 rounded-xl bg-[#0f2044] hover:bg-[#1a3a6e] text-white px-8 py-3 text-sm font-bold transition-colors shadow-lg"
              >
                Open Full Editor <ArrowRight size={16} />
              </button>

              <button
                onClick={() => setStep(2)}
                className="mt-4 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                ← Go back
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-white/40 mt-6">
          Already have an account?{' '}
          <a href="/sign-in" className="text-sky-400 hover:text-sky-300 transition-colors">Sign in</a>
        </p>
      </div>
    </div>
  )
}
