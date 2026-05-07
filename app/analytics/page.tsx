'use client'

import { useEffect, useState, useMemo } from 'react'
import { BarChart3, Trophy, TrendingUp, FileText, AlertCircle, Star } from 'lucide-react'
import { clsx } from 'clsx'
import { getSavedResumes, type SavedResume } from '@/lib/resumeStorage'
import { calculateCompleteness } from '@/lib/completenessScore'
import { getJobs } from '@/lib/jobTrackerStorage'
import { format } from 'date-fns'

function scoreTextColor(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 50) return 'text-yellow-600'
  return 'text-red-500'
}

function scoreBarColor(score: number): string {
  if (score >= 80) return 'bg-green-500'
  if (score >= 50) return 'bg-yellow-500'
  return 'bg-red-400'
}

function BarRow({ label, value, max, color }: Readonly<{ label: string; value: number; max: number; color: string }>) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-600 dark:text-gray-400 w-28 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <div className={clsx('h-full rounded-full transition-all flex items-center justify-end pr-2', color)} style={{ width: `${Math.max(pct, 4)}%` }}>
          <span className="text-[10px] font-semibold text-white">{value}</span>
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [resumes, setResumes] = useState<SavedResume[]>([])
  const [jobCount, setJobCount] = useState(0)

  useEffect(() => {
    setResumes(getSavedResumes())
    setJobCount(getJobs().length)
  }, [])

  const scored = useMemo(() =>
    resumes.map((r) => ({ ...r, score: calculateCompleteness(r.data) }))
      .sort((a, b) => b.score.total - a.score.total),
    [resumes]
  )

  const avgCompleteness = scored.length
    ? Math.round(scored.reduce((s, r) => s + r.score.total, 0) / scored.length)
    : 0

  const best = scored[0]

  const skillFrequency = useMemo(() => {
    const map: Record<string, number> = {}
    const allSkills = resumes.flatMap((r) => r.data.skills.flatMap((cat) => cat.skills))
    allSkills.forEach((skill) => { map[skill] = (map[skill] ?? 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 12)
  }, [resumes])

  const sectionCoverage = useMemo(() => {
    if (resumes.length === 0) return []
    return [
      { label: 'Experience', count: resumes.filter((r) => r.data.experience.length > 0).length },
      { label: 'Education', count: resumes.filter((r) => r.data.education.length > 0).length },
      { label: 'Projects', count: resumes.filter((r) => r.data.projects.length > 0).length },
      { label: 'Skills', count: resumes.filter((r) => r.data.skills.length > 0).length },
      { label: 'Certifications', count: resumes.filter((r) => r.data.certifications.length > 0).length },
      { label: 'Languages', count: resumes.filter((r) => r.data.languages.length > 0).length },
      { label: 'Summary', count: resumes.filter((r) => !!r.data.personal.summary).length },
      { label: 'Photo', count: resumes.filter((r) => !!r.data.personal.photo).length },
    ]
  }, [resumes])

  const overviewCards = [
    { label: 'Total Resumes', value: resumes.length, icon: FileText, color: 'bg-blue-50 text-blue-600' },
    { label: 'Avg Completeness', value: `${avgCompleteness}%`, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { label: 'Best Resume Score', value: best ? `${best.score.total}%` : '—', icon: Trophy, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Jobs Applied', value: jobCount, icon: BarChart3, color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div className="flex flex-col h-full overflow-auto bg-gray-50 dark:bg-gray-950 pb-20 lg:pb-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Insights across all your saved resumes</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Overview cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {overviewCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
              <div className={clsx('flex h-9 w-9 items-center justify-center rounded-lg mb-2', color)}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        {resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle size={32} className="text-gray-300 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No saved resumes yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Save a resume from the editor to see analytics</p>
          </div>
        ) : (
          <>
            {/* Best resume callout */}
            {best && (
              <div className="rounded-xl bg-linear-to-r from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 border border-yellow-200 dark:border-yellow-800 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-white">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 uppercase tracking-wide">Strongest Resume</p>
                    <p className="font-bold text-gray-900 dark:text-white">{best.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{best.score.total}% complete · {best.data.personal.jobTitle || 'No title set'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Per-resume table */}
            <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Resume Breakdown</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                      <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400">Resume</th>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400">Score</th>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell">Sections</th>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hidden lg:table-cell">Last Saved</th>
                      <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scored.map((r, i) => {
                      const sectionCount = [r.data.experience.length > 0, r.data.education.length > 0, r.data.projects.length > 0, r.data.skills.length > 0, r.data.certifications.length > 0].filter(Boolean).length
                      return (
                        <tr key={r.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              {i === 0 && <Star size={12} className="text-yellow-400 shrink-0" />}
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white text-sm">{r.name}</p>
                                {r.data.personal.fullName && <p className="text-xs text-gray-400 dark:text-gray-500">{r.data.personal.fullName}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <span className={clsx('text-sm font-bold', scoreTextColor(r.score.total))}>
                              {r.score.total}%
                            </span>
                          </td>
                          <td className="px-3 py-3 hidden md:table-cell">
                            <span className="text-xs text-gray-600 dark:text-gray-400">{sectionCount} / 5</span>
                          </td>
                          <td className="px-3 py-3 hidden lg:table-cell">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{format(new Date(r.savedAt), 'MMM d, yyyy')}</span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="w-24 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                              <div
                                className={clsx('h-full rounded-full', scoreBarColor(r.score.total))}
                                style={{ width: `${r.score.total}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Two-column: Skills freq + Section coverage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Skill frequency */}
              {skillFrequency.length > 0 && (
                <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
                  <h2 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Top Skills Across Resumes</h2>
                  <div className="space-y-2.5">
                    {skillFrequency.map(([skill, count]) => (
                      <BarRow key={skill} label={skill} value={count} max={resumes.length} color="bg-blue-500" />
                    ))}
                  </div>
                </div>
              )}

              {/* Section coverage */}
              <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
                <h2 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Section Coverage</h2>
                <div className="space-y-2.5">
                  {sectionCoverage.map(({ label, count }) => (
                    <BarRow key={label} label={label} value={count} max={resumes.length} color="bg-indigo-500" />
                  ))}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">Out of {resumes.length} total resume{resumes.length === 1 ? '' : 's'}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
