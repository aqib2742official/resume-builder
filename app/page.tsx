'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import {
  PenSquare, FileText, Briefcase, BarChart3, Plus, ArrowRight,
  Sparkles, Mail, TrendingUp, Globe, Zap, CheckCircle, LayoutTemplate,
  Star, Shield, Download, LayoutPanelLeft,
} from 'lucide-react'
import { getSavedResumes, type SavedResume } from '@/lib/resumeStorage'
import { calculateCompleteness } from '@/lib/completenessScore'
import { loadResumeData } from '@/store/resumeSlice'
import { setTemplateId } from '@/store/themeSlice'
import { defaultResume } from '@/constants/defaultResume'
import type { AppDispatch, RootState } from '@/store'
import type { TemplateId } from '@/store/themeSlice'
import { format } from 'date-fns'

/* ─── small SVG thumbnails ─────────────────────────────────────────── */
function TwoColumnThumb({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 80 108" fill="none" className="w-full h-full">
      <rect width="80" height="108" fill="white" />
      <rect width="80" height="20" fill={accent} />
      <rect x="5" y="5" width="35" height="4" rx="1" fill="white" opacity="0.9" />
      <rect x="5" y="12" width="22" height="2" rx="1" fill="white" opacity="0.5" />
      <line x1="38" y1="22" x2="38" y2="100" stroke="#e5e7eb" strokeWidth="0.5" />
      {[26, 40, 54, 68, 82].map((y) => (
        <g key={y}>
          <rect x="5" y={y} width="28" height="2" rx="1" fill={accent} opacity="0.7" />
          <rect x="5" y={y + 5} width="24" height="1.5" rx="0.5" fill="#e5e7eb" />
          <rect x="5" y={y + 9} width="26" height="1.5" rx="0.5" fill="#e5e7eb" />
          <rect x="42" y={y} width="34" height="2" rx="1" fill={accent} opacity="0.7" />
          <rect x="42" y={y + 5} width="30" height="1.5" rx="0.5" fill="#e5e7eb" />
          <rect x="42" y={y + 9} width="28" height="1.5" rx="0.5" fill="#e5e7eb" />
        </g>
      ))}
    </svg>
  )
}
function MinimalThumb({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 80 108" fill="none" className="w-full h-full">
      <rect width="80" height="108" fill="white" />
      <rect width="80" height="22" fill={accent} />
      <rect x="5" y="5" width="40" height="5" rx="1" fill="white" opacity="0.9" />
      <rect x="5" y="14" width="25" height="2" rx="1" fill="white" opacity="0.5" />
      {[28, 48, 68, 88].map((y) => (
        <g key={y}>
          <rect x="5" y={y} width="50" height="2" rx="1" fill={accent} opacity="0.8" />
          <line x1="5" y1={y + 3} x2="75" y2={y + 3} stroke={accent} strokeWidth="0.4" opacity="0.4" />
          <rect x="5" y={y + 6} width="65" height="1.5" rx="0.5" fill="#e5e7eb" />
          <rect x="5" y={y + 10} width="60" height="1.5" rx="0.5" fill="#e5e7eb" />
          <rect x="5" y={y + 14} width="55" height="1.5" rx="0.5" fill="#e5e7eb" />
        </g>
      ))}
    </svg>
  )
}
function AcademicThumb({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 80 108" fill="none" className="w-full h-full">
      <rect width="80" height="108" fill="white" />
      <rect x="15" y="5" width="50" height="5" rx="1" fill="#111827" opacity="0.8" />
      <rect x="20" y="13" width="40" height="2" rx="1" fill="#6b7280" />
      <line x1="5" y1="18" x2="75" y2="18" stroke={accent} strokeWidth="0.8" opacity="0.6" />
      {[24, 44, 64, 84].map((y) => (
        <g key={y}>
          <rect x="5" y={y} width="35" height="2" rx="1" fill="#111827" opacity="0.65" />
          <line x1="5" y1={y + 4} x2="75" y2={y + 4} stroke={accent} strokeWidth="0.3" opacity="0.4" />
          <rect x="5" y={y + 7} width="65" height="1.5" rx="0.5" fill="#e5e7eb" />
          <rect x="5" y={y + 11} width="58" height="1.5" rx="0.5" fill="#e5e7eb" />
          <rect x="5" y={y + 15} width="62" height="1.5" rx="0.5" fill="#e5e7eb" />
        </g>
      ))}
    </svg>
  )
}
function ProfessionalThumb({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 80 108" fill="none" className="w-full h-full">
      <rect width="80" height="108" fill="white" />
      <rect x="5" y="5" width="45" height="5" rx="1" fill="#111827" opacity="0.85" />
      <rect x="5" y="13" width="30" height="2" rx="1" fill="#6b7280" />
      <rect x="5" y="18" width="70" height="1.5" rx="0.5" fill="#9ca3af" />
      <line x1="5" y1="23" x2="75" y2="23" stroke={accent} strokeWidth="1.2" />
      <rect x="5" y="28" width="40" height="2" rx="1" fill="#111827" opacity="0.65" />
      <line x1="5" y1="32" x2="75" y2="32" stroke={accent} strokeWidth="0.4" opacity="0.4" />
      {[[5, 32], [24, 32], [5, 44], [24, 50]].map(([x, w], i) => (
        <rect key={i} x={x} y={35 + i * 6} width={w} height="1.5" rx="0.5" fill={i % 2 === 0 ? '#374151' : '#e5e7eb'} opacity={i % 2 === 0 ? 0.6 : 1} />
      ))}
      <rect x="5" y="57" width="40" height="2" rx="1" fill="#111827" opacity="0.65" />
      <line x1="5" y1="61" x2="75" y2="61" stroke={accent} strokeWidth="0.4" opacity="0.4" />
      <rect x="5" y="64" width="38" height="1.5" rx="0.5" fill="#111827" opacity="0.5" />
      <rect x="5" y="69" width="28" height="1.5" rx="0.5" fill={accent} opacity="0.4" />
      {[74, 79, 84].map((y) => (
        <rect key={y} x="5" y={y} width={y === 79 ? 60 : 55} height="1.5" rx="0.5" fill="#e5e7eb" />
      ))}
    </svg>
  )
}
function ExecutiveThumb({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 80 108" fill="none" className="w-full h-full">
      <rect width="80" height="108" fill="white" />
      <rect width="26" height="108" fill={accent} />
      <circle cx="13" cy="16" r="8" fill="white" opacity="0.2" />
      <rect x="4" y="28" width="18" height="2.5" rx="1" fill="white" opacity="0.8" />
      <rect x="6" y="33" width="14" height="1.5" rx="0.5" fill="white" opacity="0.45" />
      <rect x="3" y="40" width="20" height="0.8" fill="white" opacity="0.2" />
      {[43, 48, 53, 58].map((y) => <rect key={y} x="3" y={y} width="20" height="1.2" rx="0.4" fill="white" opacity="0.35" />)}
      <rect x="3" y="66" width="20" height="0.8" fill="white" opacity="0.2" />
      {[4, 6, 8].map((i) => <rect key={i} x="3" y={68 + i * 4} width={14 + i} height="4" rx="2" fill="white" opacity="0.15" />)}
      <rect x="30" y="8" width="46" height="2" rx="1" fill={accent} opacity="0.75" />
      <line x1="30" y1="12" x2="76" y2="12" stroke={accent} strokeWidth="0.4" opacity="0.3" />
      {[15, 26, 37, 48, 59, 70].map((y) => (
        <rect key={y} x="30" y={y} width={y % 2 === 0 ? 40 : 35} height="1.5" rx="0.5" fill="#e5e7eb" />
      ))}
    </svg>
  )
}
function ModernThumb({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 80 108" fill="none" className="w-full h-full">
      <rect width="80" height="108" fill="white" />
      <rect width="80" height="24" fill={accent} />
      <rect x="10" y="5" width="60" height="6" rx="1" fill="white" opacity="0.9" />
      <rect x="15" y="14" width="50" height="2" rx="1" fill="white" opacity="0.55" />
      <rect x="5" y="20" width="70" height="1" fill="white" opacity="0.2" />
      {[30, 55, 80].map((y) => (
        <g key={y}>
          <rect x="5" y={y} width="2" height="11" rx="1" fill={accent} />
          <rect x="10" y={y + 2} width="28" height="2" rx="1" fill="#111827" opacity="0.65" />
          <circle cx="13" cy={y + 16} r="3" fill={accent} />
          <line x1="13" y1={y + 19} x2="13" y2={y + 26} stroke={accent} strokeWidth="1" opacity="0.2" />
          <rect x="20" y={y + 13} width="28" height="1.5" rx="0.5" fill="#111827" opacity="0.55" />
          <rect x="20" y={y + 18} width="22" height="1.5" rx="0.5" fill={accent} opacity="0.4" />
          <rect x="20" y={y + 22} width="48" height="1.5" rx="0.5" fill="#e5e7eb" />
        </g>
      ))}
    </svg>
  )
}

const TEMPLATES: { id: TemplateId; name: string; tag: string; thumb: (accent: string) => React.ReactNode }[] = [
  { id: 'two-column',   name: 'Classic',      tag: 'Two columns',   thumb: (a) => <TwoColumnThumb   accent={a} /> },
  { id: 'minimal',      name: 'Minimal',      tag: 'Single column', thumb: (a) => <MinimalThumb      accent={a} /> },
  { id: 'academic',     name: 'Academic',     tag: 'CV / dense',    thumb: (a) => <AcademicThumb     accent={a} /> },
  { id: 'professional', name: 'Professional', tag: 'Clean & formal',thumb: (a) => <ProfessionalThumb accent={a} /> },
  { id: 'executive',    name: 'Executive',    tag: 'Sidebar layout',thumb: (a) => <ExecutiveThumb    accent={a} /> },
  { id: 'modern',       name: 'Modern',       tag: 'Timeline style',thumb: (a) => <ModernThumb       accent={a} /> },
]

function getJobCount(): number {
  try {
    const raw = localStorage.getItem('resume-builder-jobs-v1')
    return raw ? (JSON.parse(raw) as unknown[]).length : 0
  } catch { return 0 }
}

export default function HomePage() {
  const router   = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const accentColor = useSelector((state: RootState) => state.theme.accentColor)
  const activeTemplateId = useSelector((state: RootState) => state.theme.templateId)
  const [resumes, setResumes] = useState<SavedResume[]>([])
  const [jobCount, setJobCount] = useState(0)

  useEffect(() => {
    setResumes(getSavedResumes())
    setJobCount(getJobCount())
  }, [])

  const recent = [...resumes].sort((a, b) => b.savedAt.localeCompare(a.savedAt)).slice(0, 3)
  const avgCompleteness = resumes.length
    ? Math.round(resumes.reduce((s, r) => s + calculateCompleteness(r.data).total, 0) / resumes.length)
    : 0
  const bestScore = resumes.length ? Math.max(...resumes.map((r) => calculateCompleteness(r.data).total)) : 0

  function createNew() {
    dispatch(loadResumeData(defaultResume))
    router.push('/editor')
  }

  function useTemplate(id: TemplateId) {
    dispatch(setTemplateId(id))
    router.push('/editor')
  }

  const features = [
    { icon: Zap,            title: 'AI-Powered Writing',   desc: 'Improve bullet points, generate summaries, and write cover letters with one click.' },
    { icon: Shield,         title: 'ATS-Friendly',         desc: 'Every template is structured to pass Applicant Tracking Systems and reach real recruiters.' },
    { icon: LayoutTemplate, title: '6 Professional Templates', desc: 'From classic two-column to modern timeline styles — switch instantly, no re-entering data.' },
    { icon: Download,       title: 'PDF Export',           desc: 'Export a crisp, print-ready PDF from any template in seconds.' },
    { icon: Star,           title: 'Completeness Score',   desc: 'Real-time scoring tells you exactly what\'s missing and what to improve.' },
    { icon: Briefcase,      title: 'Job Tracker',          desc: 'Track every application — company, status, notes — all in one place.' },
  ]

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-gray-950 custom-scroll">

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="bg-[#0f2044] text-white px-6 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-medium text-sky-300 mb-6">
            <Sparkles size={12} /> AI-powered resume builder
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight mb-4">
            Build a Resume That<br />
            <span className="text-sky-300">Gets You Hired</span>
          </h1>
          <p className="text-white/55 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Create a professional, ATS-optimised resume in minutes. Choose from 6 modern templates,
            get AI writing suggestions, and export a perfect PDF — all free, no sign-up required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={createNew}
              className="inline-flex items-center gap-2 rounded-xl bg-white text-[#0f2044] font-bold px-6 py-3 text-sm hover:bg-sky-50 transition-colors shadow-lg"
            >
              <Plus size={16} /> Create My Resume
            </button>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 text-white/80 hover:text-white hover:bg-white/10 font-semibold px-6 py-3 text-sm transition-colors"
            >
              <LayoutTemplate size={16} /> Browse Templates
            </Link>
          </div>
          {resumes.length > 0 && (
            <p className="mt-6 text-xs text-white/35">
              You have {resumes.length} saved resume{resumes.length > 1 ? 's' : ''} — <Link href="/resumes" className="text-sky-300 hover:underline">manage them here</Link>
            </p>
          )}
        </div>
      </section>

      {/* ── STATS (only if user has data) ──────────────────────────── */}
      {resumes.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-6">
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Saved Resumes',    value: resumes.length,        icon: FileText,   href: '/resumes',     color: 'text-[#0f2044] dark:text-white bg-[#0f2044]/10 dark:bg-white/10' },
              { label: 'Avg Completeness', value: `${avgCompleteness}%`, icon: TrendingUp, href: '/analytics',   color: 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-900/30' },
              { label: 'Best Score',       value: `${bestScore}%`,       icon: Sparkles,   href: '/analytics',   color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30' },
              { label: 'Jobs Applied',     value: jobCount,              icon: Briefcase,  href: '/job-tracker', color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30' },
            ].map(({ label, value, icon: Icon, href, color }) => (
              <Link key={label} href={href} className="flex items-center gap-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 hover:shadow-sm transition-all">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${color}`}>
                  <Icon size={17} />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white leading-none">{value}</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{label}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── TEMPLATES SHOWCASE ─────────────────────────────────────── */}
      <section className="px-6 py-14 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-2">Choose your style</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">6 Professional Templates</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              All templates are fully customisable — change colors, fonts, spacing and more. Switch anytime without losing your data.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {TEMPLATES.map((tpl) => {
              const isActive = tpl.id === activeTemplateId
              return (
                <div
                  key={tpl.id}
                  className={`group flex flex-col rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-150 ${
                    isActive
                      ? 'border-blue-500 shadow-lg shadow-blue-100 dark:shadow-blue-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                  }`}
                  onClick={() => useTemplate(tpl.id)}
                >
                  {/* Thumbnail */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-2 flex items-center justify-center" style={{ height: 130 }}>
                    <div className="w-20 h-28 rounded shadow-sm overflow-hidden bg-white border border-gray-100">
                      {tpl.thumb(accentColor)}
                    </div>
                  </div>
                  {/* Label */}
                  <div className="p-2.5 text-center">
                    <p className="text-xs font-semibold text-gray-800 dark:text-white">{tpl.name}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{tpl.tag}</p>
                  </div>
                  {/* Button */}
                  <div className="px-2.5 pb-2.5">
                    <div className={`w-full rounded-lg py-1.5 text-[10px] font-semibold text-center transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-blue-600 group-hover:text-white'
                    }`}>
                      {isActive ? 'Active' : 'Use Template'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-6">
            <Link href="/templates" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f2044] dark:text-sky-400 hover:underline">
              View full gallery <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────── */}
      <section className="px-6 py-14 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-2">Everything you need</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Built for job seekers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0f2044]/8 dark:bg-white/10 shrink-0">
                  <Icon size={18} className="text-[#0f2044] dark:text-sky-300" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────── */}
      <section className="px-6 py-14 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-2">Simple process</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-10">Ready in 3 steps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Pick a template', desc: 'Choose from 6 professionally designed layouts.', icon: LayoutPanelLeft },
              { step: '02', title: 'Fill your details', desc: 'Enter your experience, skills, and education. AI helps you write better bullets.', icon: PenSquare },
              { step: '03', title: 'Export as PDF', desc: 'Download a clean, ATS-ready PDF instantly — no account needed.', icon: Download },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f2044] text-white shadow-lg">
                    <Icon size={22} />
                  </div>
                  <span className="absolute -top-2 -right-2 text-[10px] font-black text-sky-500 bg-white dark:bg-gray-950 px-1 rounded">{step}</span>
                </div>
                <p className="font-bold text-gray-900 dark:text-white text-sm mb-1">{title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK ACTIONS ──────────────────────────────────────────── */}
      <section className="px-6 py-10 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-4 uppercase tracking-widest">Quick access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Editor',       desc: 'Edit resume',         icon: PenSquare,     href: '/editor',       primary: true },
              { label: 'My Resumes',   desc: 'Saved resumes',       icon: FileText,      href: '/resumes',      primary: false },
              { label: 'Templates',    desc: 'Browse all',          icon: LayoutTemplate, href: '/templates',   primary: false },
              { label: 'Cover Letter', desc: 'Write letter',        icon: Mail,          href: '/cover-letter', primary: false },
              { label: 'Job Tracker',  desc: 'Track applications',  icon: Briefcase,     href: '/job-tracker',  primary: false },
              { label: 'Find Jobs',    desc: 'Discover openings',   icon: Globe,         href: '/jobs',         primary: false },
            ].map(({ label, desc, icon: Icon, href, primary }) => (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all ${
                  primary
                    ? 'bg-[#0f2044] hover:bg-[#162d5c] text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm'
                }`}
              >
                <Icon size={20} />
                <div>
                  <p className="font-semibold text-xs">{label}</p>
                  <p className={`text-[10px] mt-0.5 ${primary ? 'text-white/50' : 'text-gray-400 dark:text-gray-500'}`}>{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECENT RESUMES ─────────────────────────────────────────── */}
      {recent.length > 0 && (
        <section className="px-6 py-10 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Recent Resumes</h2>
              <Link href="/resumes" className="text-xs text-[#0f2044] dark:text-sky-400 hover:underline flex items-center gap-1 font-medium">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recent.map((resume) => {
                const score = calculateCompleteness(resume.data)
                return (
                  <div
                    key={resume.id}
                    onClick={() => { dispatch(loadResumeData(resume.data)); router.push('/editor') }}
                    className="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3.5 cursor-pointer hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f2044] text-white text-sm font-bold shrink-0">
                      {resume.data.personal.fullName
                        ? resume.data.personal.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                        : '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{resume.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{format(new Date(resume.savedAt), 'MMM d')} · {score.total}%</p>
                    </div>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-sky-500 transition-colors shrink-0" />
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── FINAL CTA ──────────────────────────────────────────────── */}
      <section className="bg-[#0f2044] px-6 py-14 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to build your resume?</h2>
          <p className="text-white/50 text-sm mb-7">Free forever. No account needed. Just click and start.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={createNew}
              className="inline-flex items-center gap-2 rounded-xl bg-white text-[#0f2044] font-bold px-6 py-3 text-sm hover:bg-sky-50 transition-colors shadow-lg"
            >
              <Plus size={16} /> Start Building Free
            </button>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 text-white/80 hover:text-white hover:bg-white/10 font-semibold px-6 py-3 text-sm transition-colors"
            >
              <LayoutTemplate size={16} /> Browse Templates
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-white/35">
            {['No sign-up required', 'ATS-friendly output', 'PDF export free', 'AI writing tools'].map((f) => (
              <span key={f} className="flex items-center gap-1"><CheckCircle size={11} /> {f}</span>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
