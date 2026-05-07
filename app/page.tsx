'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import { PenSquare, FileText, Briefcase, BarChart3, Plus, ArrowRight, Sparkles, Mail, TrendingUp } from 'lucide-react'
import { getSavedResumes, type SavedResume } from '@/lib/resumeStorage'
import { calculateCompleteness } from '@/lib/completenessScore'
import { loadResumeData } from '@/store/resumeSlice'
import { defaultResume } from '@/constants/defaultResume'
import type { AppDispatch } from '@/store'
import { format } from 'date-fns'
import { clsx } from 'clsx'

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
    { label: 'Saved Resumes', value: resumes.length, icon: FileText, color: 'bg-blue-50 text-blue-600', link: '/resumes' },
    { label: 'Avg Completeness', value: `${avgCompleteness}%`, icon: TrendingUp, color: 'bg-green-50 text-green-600', link: '/analytics' },
    { label: 'Best Score', value: `${bestScore}%`, icon: Sparkles, color: 'bg-purple-50 text-purple-600', link: '/analytics' },
    { label: 'Jobs Applied', value: jobCount, icon: Briefcase, color: 'bg-orange-50 text-orange-600', link: '/job-tracker' },
  ]

  const quickActions = [
    { label: 'Resume Editor', desc: 'Edit your active resume', icon: PenSquare, href: '/editor', color: 'bg-blue-600 text-white hover:bg-blue-700' },
    { label: 'My Resumes', desc: 'Browse & manage saved resumes', icon: FileText, href: '/resumes', color: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700' },
    { label: 'Cover Letter', desc: 'Write matching cover letters', icon: Mail, href: '/cover-letter', color: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700' },
    { label: 'Job Tracker', desc: 'Track your applications', icon: Briefcase, href: '/job-tracker', color: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700' },
  ]

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950 overflow-auto pb-20 lg:pb-6">
      {/* Hero header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 px-6 py-10 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Welcome back 👋</h1>
          <p className="text-blue-200 text-sm mb-6">Your resume platform — build, track, and land your dream job.</p>

          <button
            onClick={createNew}
            className="inline-flex items-center gap-2 rounded-xl bg-white text-blue-600 font-semibold px-5 py-2.5 text-sm hover:bg-blue-50 transition-colors shadow-md"
          >
            <Plus size={16} /> Create New Resume
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-6 py-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {stats.map(({ label, value, icon: Icon, color, link }) => (
            <Link key={label} href={link} className="flex flex-col gap-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
              <div className={clsx('flex h-9 w-9 items-center justify-center rounded-lg', color)}>
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
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map(({ label, desc, icon: Icon, href, color }) => (
              <Link
                key={href}
                href={href}
                className={clsx('flex flex-col gap-2 rounded-xl px-4 py-3.5 transition-colors', color)}
              >
                <Icon size={20} />
                <div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className={clsx('text-xs mt-0.5', color.includes('white') ? 'text-gray-500' : 'text-blue-200')}>{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent resumes */}
        {recent.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Recent Resumes</h2>
              <Link href="/resumes" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
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
                    className="flex items-center gap-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3.5 cursor-pointer hover:shadow-md transition-shadow group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold shrink-0">
                      {resume.data.personal.fullName ? resume.data.personal.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{resume.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{format(new Date(resume.savedAt), 'MMM d')} · {score.total}%</p>
                    </div>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Job-readiness tip */}
        <div className="rounded-xl bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border border-purple-100 dark:border-purple-800 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 shrink-0">
              <BarChart3 size={18} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Check Your Analytics</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                See how all your resumes compare, track completeness trends, and find gaps in your profile.
              </p>
              <Link
                href="/analytics"
                className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 hover:underline"
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
