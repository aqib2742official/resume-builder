'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import { PenSquare, FileText, Briefcase, BarChart3, Plus, ArrowRight, Sparkles, Mail, TrendingUp, Globe } from 'lucide-react'
import { getSavedResumes, type SavedResume } from '@/lib/resumeStorage'
import { calculateCompleteness } from '@/lib/completenessScore'
import { loadResumeData } from '@/store/resumeSlice'
import { defaultResume } from '@/constants/defaultResume'
import type { AppDispatch } from '@/store'
import { format } from 'date-fns'

function getJobCount(): number {
  try {
    const raw = localStorage.getItem('resume-builder-jobs-v1')
    return raw ? (JSON.parse(raw) as unknown[]).length : 0
  } catch { return 0 }
}

export default function DashboardPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
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
  const bestScore = resumes.length
    ? Math.max(...resumes.map((r) => calculateCompleteness(r.data).total))
    : 0

  function createNew() {
    dispatch(loadResumeData(defaultResume))
    router.push('/editor')
  }

  const stats = [
    { label: 'Saved Resumes',    value: resumes.length,        icon: FileText,   iconCls: 'bg-[#0f2044]/10 text-[#0f2044] dark:bg-white/10 dark:text-white',    link: '/resumes' },
    { label: 'Avg Completeness', value: `${avgCompleteness}%`, icon: TrendingUp, iconCls: 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',         link: '/analytics' },
    { label: 'Best Score',       value: `${bestScore}%`,       icon: Sparkles,   iconCls: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', link: '/analytics' },
    { label: 'Jobs Applied',     value: jobCount,              icon: Briefcase,  iconCls: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',   link: '/job-tracker' },
  ]

  const quickActions = [
    { label: 'Resume Editor',  desc: 'Edit your active resume',        icon: PenSquare, href: '/editor',       primary: true  },
    { label: 'My Resumes',     desc: 'Browse & manage saved resumes',  icon: FileText,  href: '/resumes',      primary: false },
    { label: 'Cover Letter',   desc: 'Write matching cover letters',   icon: Mail,      href: '/cover-letter', primary: false },
    { label: 'Find Jobs',      desc: 'Discover jobs matching resume',  icon: Globe,     href: '/jobs',         primary: false },
  ]

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950 overflow-auto pb-6">

      {/* Hero — brand navy */}
      <div className="bg-[#0f2044] px-6 py-10 text-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-widest mb-2">Dashboard</p>
          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-white/50 text-sm mb-7">Your career platform — build, track, and land your dream job.</p>

          <button
            onClick={createNew}
            className="inline-flex items-center gap-2 rounded-xl bg-white text-[#0f2044] font-bold px-5 py-2.5 text-sm hover:bg-sky-50 transition-colors shadow-md"
          >
            <Plus size={16} /> Create New Resume
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-6 py-6">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {stats.map(({ label, value, icon: Icon, iconCls, link }) => (
            <Link
              key={label}
              href={link}
              className="flex flex-col gap-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconCls}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-widest">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map(({ label, desc, icon: Icon, href, primary }) => (
              <Link
                key={href}
                href={href}
                className={
                  primary
                    ? 'flex flex-col gap-2 rounded-xl px-4 py-3.5 transition-colors bg-[#0f2044] hover:bg-[#162d5c] text-white'
                    : 'flex flex-col gap-2 rounded-xl px-4 py-3.5 transition-colors bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                }
              >
                <Icon size={20} />
                <div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className={`text-xs mt-0.5 ${primary ? 'text-white/50' : 'text-gray-400 dark:text-gray-500'}`}>{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent resumes */}
        {recent.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
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
                    className="flex items-center gap-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3.5 cursor-pointer hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all group"
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
        )}

        {/* Analytics nudge — navy-tinted, no purple/pink */}
        <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0f2044]/10 dark:bg-white/10 shrink-0">
              <BarChart3 size={18} className="text-[#0f2044] dark:text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Check Your Analytics</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                See how all your resumes compare, track completeness trends, and find gaps in your profile.
              </p>
              <Link
                href="/analytics"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0f2044] dark:text-sky-400 hover:underline"
              >
                View Analytics <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
