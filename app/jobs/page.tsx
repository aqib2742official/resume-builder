'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import {
  Globe, Search, RefreshCw, ExternalLink, MapPin, Briefcase,
  Loader2, AlertCircle, BookmarkPlus, Check, ArrowUpRight, FileText,
} from 'lucide-react'
import { clsx } from 'clsx'
import { addJob } from '@/lib/jobTrackerStorage'
import { getSavedResumes, type SavedResume } from '@/lib/resumeStorage'
import { format } from 'date-fns'
import type { RootState } from '@/store'

// ── Types ────────────────────────────────────────────────────────────────────

interface RemotiveJob {
  id: number
  url: string
  title: string
  company_name: string
  company_logo: string | null
  category: string
  tags: string[]
  job_type: string
  publication_date: string
  candidate_required_location: string
  salary: string
  description: string
}

type Region = 'pakistan' | 'americas' | 'europe' | 'other'

// ── Helpers ──────────────────────────────────────────────────────────────────

const JOB_TYPES: { value: string; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
]

function getRegion(loc: string): Region {
  const l = loc.toLowerCase()
  if (['worldwide', 'anywhere', 'global', 'remote', 'asia', 'south asia', 'pakistan', 'apac', 'international'].some((k) => l.includes(k))) return 'pakistan'
  if (['usa', 'us only', 'canada', 'north america', 'americas', 'latin america', 'united states'].some((k) => l.includes(k))) return 'americas'
  if (['europe', ' eu', 'uk', 'germany', 'france', 'netherlands', 'spain', 'italy', 'sweden', 'poland', 'portugal'].some((k) => l.includes(k))) return 'europe'
  return 'other'
}

function matchScore(tags: string[], skills: string[]): number {
  if (!tags.length || !skills.length) return 0
  const sl = skills.map((s) => s.toLowerCase())
  const matched = tags.filter((t) => sl.some((s) => s.includes(t.toLowerCase()) || t.toLowerCase().includes(s)))
  return Math.min(100, Math.round((matched.length / Math.max(tags.length, 1)) * 150))
}

const REGION_META: Record<Region, { emoji: string; label: string; sub: string }> = {
  pakistan: { emoji: '🇵🇰', label: 'Pakistan & Asia', sub: 'Remote jobs open to Pakistan + worldwide' },
  americas: { emoji: '🌎', label: 'Americas', sub: 'Remote jobs — US, Canada, Latin America' },
  europe:   { emoji: '🇪🇺', label: 'Europe', sub: 'Remote jobs — EU, UK & more' },
  other:    { emoji: '🌍', label: 'Other Regions', sub: 'Remaining remote positions' },
}

const REGION_ORDER: Region[] = ['pakistan', 'americas', 'europe', 'other']

// ── Job Card ─────────────────────────────────────────────────────────────────

function JobCard({
  job, score, allSkills, saved, onTrack,
}: {
  job: RemotiveJob
  score: number
  allSkills: string[]
  saved: boolean
  onTrack: () => void
}) {
  const initials = job.company_name.slice(0, 2).toUpperCase()
  const typeLabel = JOB_TYPES.find((t) => t.value === job.job_type)?.label ?? job.job_type

  return (
    <div className="flex flex-col rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md dark:hover:border-gray-600 transition-all">
      {/* Header */}
      <div className="flex gap-3 mb-3">
        <div className="shrink-0">
          {job.company_logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={job.company_logo}
              alt={job.company_name}
              className="h-10 w-10 rounded-lg object-contain bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 p-0.5"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0f2044] text-white text-xs font-bold">
              {initials}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2">{job.title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{job.company_name}</p>
        </div>

        {score > 0 && (
          <div className={clsx(
            'shrink-0 flex flex-col items-center justify-center h-10 w-10 rounded-full text-xs font-bold border-2',
            score >= 70 ? 'border-green-500 text-green-600 dark:text-green-400' :
            score >= 40 ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400' :
                          'border-gray-300 dark:border-gray-600 text-gray-400'
          )}>
            {score}%
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <MapPin size={11} /> {job.candidate_required_location}
        </span>
        {job.job_type && (
          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Briefcase size={11} /> {typeLabel}
          </span>
        )}
        {job.salary && (
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">{job.salary}</span>
        )}
      </div>

      {/* Tags */}
      {job.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {job.tags.slice(0, 5).map((tag) => {
            const isMatch = allSkills.some((s) => s.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(s.toLowerCase()))
            return (
              <span
                key={tag}
                className={clsx(
                  'px-2 py-0.5 rounded text-xs',
                  isMatch
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                )}
              >
                {tag}
              </span>
            )
          })}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-1">
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#0f2044] hover:bg-[#162d5c] text-white text-xs font-semibold transition-colors"
        >
          <ExternalLink size={12} /> Apply Now
        </a>
        <button
          onClick={onTrack}
          disabled={saved}
          title={saved ? 'Added to Job Tracker' : 'Save to Job Tracker'}
          className={clsx(
            'flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors',
            saved
              ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
          )}
        >
          {saved ? <Check size={13} /> : <BookmarkPlus size={13} />}
          {saved ? 'Saved' : 'Track'}
        </button>
      </div>
    </div>
  )
}

// ── External Site Card (Rozee / LinkedIn) ────────────────────────────────────

function ExternalSiteCard({ name, logo, url, keywords, description }: {
  name: string
  logo: string
  url: string
  keywords: string
  description: string
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 rounded-xl border-2 border-dashed border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 px-4 py-3.5 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shrink-0 text-lg">
        {logo}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{description}</p>
        {keywords && (
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 truncate">
            Search: "{keywords}"
          </p>
        )}
      </div>
      <ArrowUpRight size={18} className="text-gray-400 group-hover:text-sky-500 transition-colors shrink-0" />
    </a>
  )
}

// ── Loading Skeleton ─────────────────────────────────────────────────────────

function Skeletons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
          <div className="flex gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="flex gap-1">
              {[1,2,3].map((j) => <div key={j} className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-14" />)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function JobsPage() {
  const activeResumeData = useSelector((state: RootState) => state.resume.data)

  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<string>('')  // '' = active resume

  useEffect(() => {
    setSavedResumes(getSavedResumes())
  }, [])

  // Resolved resume data — selected saved resume or the active (Redux) one
  const resumeData = useMemo(() => {
    if (selectedResumeId) {
      const found = savedResumes.find((r) => r.id === selectedResumeId)
      if (found) return found.data
    }
    return activeResumeData
  }, [selectedResumeId, savedResumes, activeResumeData])

  const allSkills = resumeData.skills.flatMap((cat) => cat.skills)
  const jobTitle = resumeData.personal.jobTitle

  const initialQuery = [jobTitle, ...allSkills.slice(0, 3)].filter(Boolean).join(' ')

  const [query, setQuery] = useState(initialQuery)
  const [jobs, setJobs] = useState<RemotiveJob[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState('all')
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set())

  const fetchJobs = useCallback(async (q: string) => {
    if (!q.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`https://remotive.com/api/remote-jobs?search=${encodeURIComponent(q)}&limit=40`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setJobs(data.jobs ?? [])
    } catch {
      setError('Could not load jobs. Check your connection and try again.')
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch on mount
  useEffect(() => {
    if (initialQuery) fetchJobs(initialQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-fetch when a different saved resume is selected
  useEffect(() => {
    if (!savedResumes.length) return
    const data = selectedResumeId
      ? savedResumes.find((r) => r.id === selectedResumeId)?.data ?? activeResumeData
      : activeResumeData
    const q = [data.personal.jobTitle, ...data.skills.flatMap((c) => c.skills).slice(0, 3)].filter(Boolean).join(' ')
    if (q) { setQuery(q); fetchJobs(q) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedResumeId])

  function handleSearch(e: React.SyntheticEvent) {
    e.preventDefault()
    fetchJobs(query)
  }

  function handleSkillClick(skill: string) {
    setQuery(skill)
    fetchJobs(skill)
  }

  function saveToTracker(job: RemotiveJob) {
    addJob({
      company: job.company_name,
      role: job.title,
      location: job.candidate_required_location,
      appliedDate: format(new Date(), 'yyyy-MM-dd'),
      status: 'wishlist',
      url: job.url,
      notes: '',
      resumeId: selectedResumeId || undefined,
    })
    setSavedIds((prev) => new Set(prev).add(job.id))
  }

  // Filter by job type, then group by region, sort by match score within each group
  const filteredJobs = jobs.filter((j) => typeFilter === 'all' || j.job_type === typeFilter)

  const grouped = REGION_ORDER.reduce<Record<Region, (RemotiveJob & { score: number })[]>>((acc, region) => {
    acc[region] = filteredJobs
      .filter((j) => getRegion(j.candidate_required_location) === region)
      .map((j) => ({ ...j, score: matchScore(j.tags, allSkills) }))
      .sort((a, b) => b.score - a.score)
    return acc
  }, { pakistan: [], americas: [], europe: [], other: [] })

  const keywords = [resumeData.personal.jobTitle, ...allSkills.slice(0, 3)].filter(Boolean).join(' ')
  const rozeeUrl = `https://www.rozee.pk/job/jsearch/q/${encodeURIComponent(keywords || 'developer')}`
  const linkedinUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keywords || 'developer')}&location=Pakistan`
  const indeedUrl = `https://pk.indeed.com/jobs?q=${encodeURIComponent(keywords || 'developer')}&l=Pakistan`

  return (
    <div className="flex flex-col h-full overflow-auto bg-gray-50 dark:bg-gray-950 pb-6">

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <Globe size={20} className="text-[#0f2044] dark:text-blue-400" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Find Jobs</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Jobs matched to your resume — Pakistan on top, worldwide remote below.
          </p>

          {/* Resume selector */}
          {savedResumes.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <FileText size={14} className="text-gray-400 shrink-0" />
              <label htmlFor="resume-select" className="text-xs text-gray-500 dark:text-gray-400 shrink-0">Match jobs for:</label>
              <select
                id="resume-select"
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="flex-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0f2044]/20"
              >
                <option value="">Active Resume ({activeResumeData.personal.fullName || activeResumeData.personal.jobTitle || 'Untitled'})</option>
                {savedResumes.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. React Developer TypeScript"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0f2044] hover:bg-[#162d5c] text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
              Search
            </button>
            <button
              type="button"
              onClick={() => fetchJobs(query)}
              title="Refresh"
              disabled={loading}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-6 py-5">

        {/* Filters + skill chips */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {JOB_TYPES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTypeFilter(value)}
              className={clsx(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                typeFilter === value
                  ? 'bg-[#0f2044] text-white border-[#0f2044]'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300'
              )}
            >
              {label}
            </button>
          ))}

          {!loading && filteredJobs.length > 0 && (
            <span className="ml-auto text-xs text-gray-400">
              {filteredJobs.length} remote jobs found
            </span>
          )}
        </div>

        {allSkills.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-gray-400">Resume skills:</span>
            {allSkills.slice(0, 10).map((s) => (
              <button
                key={s}
                onClick={() => handleSkillClick(s)}
                className="px-2.5 py-1 rounded-full text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 mb-5 text-sm text-red-700 dark:text-red-300">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && <Skeletons />}

        {/* Empty state */}
        {!loading && !error && filteredJobs.length === 0 && (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <Globe size={40} className="mx-auto mb-3 opacity-25" />
            <p className="font-medium">No jobs found</p>
            {!jobTitle && (
              <p className="text-sm mt-1">
                <Link href="/editor" className="text-blue-600 hover:underline">Add a job title to your resume</Link>
                {' '}to auto-search
              </p>
            )}
          </div>
        )}

        {/* Grouped results */}
        {!loading && !error && filteredJobs.length > 0 && REGION_ORDER.map((region) => {
          const regionJobs = grouped[region]
          const meta = REGION_META[region]
          const isPakistan = region === 'pakistan'

          if (!isPakistan && regionJobs.length === 0) return null

          return (
            <section key={region} className="mb-10">
              {/* Section heading */}
              <div className={clsx(
                'flex items-center gap-3 mb-4 pb-3 border-b',
                isPakistan
                  ? 'border-blue-200 dark:border-blue-800'
                  : 'border-gray-200 dark:border-gray-700'
              )}>
                <span className="text-2xl leading-none">{meta.emoji}</span>
                <div>
                  <h2 className={clsx(
                    'font-bold text-base',
                    isPakistan ? 'text-[#0f2044] dark:text-blue-300' : 'text-gray-800 dark:text-gray-200'
                  )}>
                    {meta.label}
                    {regionJobs.length > 0 && (
                      <span className={clsx(
                        'ml-2 text-xs font-medium px-2 py-0.5 rounded-full',
                        isPakistan
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                      )}>
                        {regionJobs.length} jobs
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{meta.sub}</p>
                </div>
              </div>

              {/* Pakistan: external site cards first */}
              {isPakistan && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  <ExternalSiteCard
                    name="Browse on Rozee.pk"
                    logo="🇵🇰"
                    url={rozeeUrl}
                    keywords={keywords}
                    description="Pakistan's #1 job board — all types"
                  />
                  <ExternalSiteCard
                    name="Search on Indeed"
                    logo="🔍"
                    url={indeedUrl}
                    keywords={keywords}
                    description="Indeed Pakistan — on-site, remote & hybrid"
                  />
                  <ExternalSiteCard
                    name="Search LinkedIn Pakistan"
                    logo="💼"
                    url={linkedinUrl}
                    keywords={keywords}
                    description="LinkedIn Jobs — full-time, part-time & more"
                  />
                </div>
              )}

              {/* Job cards grid */}
              {regionJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {regionJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      score={job.score}
                      allSkills={allSkills}
                      saved={savedIds.has(job.id)}
                      onTrack={() => saveToTracker(job)}
                    />
                  ))}
                </div>
              ) : isPakistan ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No remote jobs matched your search — try the Rozee.pk or LinkedIn links above.
                </p>
              ) : null}
            </section>
          )
        })}

        {/* API credit */}
        {!loading && filteredJobs.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-4">
            Remote jobs powered by{' '}
            <a href="https://remotive.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Remotive
            </a>
            {' '}— free job board · Updated daily
          </p>
        )}
      </div>
    </div>
  )
}
