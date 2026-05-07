'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  Trophy, TrendingUp, FileText, AlertCircle, Star,
  ChevronDown, ChevronUp, AlertTriangle, XCircle, Info, CheckCircle2,
  Zap, Target, Globe, Briefcase,
} from 'lucide-react'
import { clsx } from 'clsx'
import { getSavedResumes, type SavedResume } from '@/lib/resumeStorage'
import {
  calculateInternationalScore, VERDICTS,
  type InternationalScore, type CategoryScore, type RedFlag,
} from '@/lib/internationalScore'
import { getJobs } from '@/lib/jobTrackerStorage'
import { format } from 'date-fns'

// ── helpers ──────────────────────────────────────────────────────────────────

function scoreColor(s: number) {
  if (s >= 80) return 'text-emerald-600 dark:text-emerald-400'
  if (s >= 60) return 'text-sky-600 dark:text-sky-400'
  if (s >= 40) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-500 dark:text-red-400'
}

function barColor(s: number) {
  if (s >= 80) return 'bg-emerald-500'
  if (s >= 60) return 'bg-sky-500'
  if (s >= 40) return 'bg-amber-500'
  return 'bg-red-400'
}

function statusBadge(status: CategoryScore['status']) {
  const map = {
    excellent: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    good:      'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
    weak:      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    poor:      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  }
  return map[status]
}

function severityIcon(s: RedFlag['severity']) {
  if (s === 'critical') return <XCircle size={14} className="text-red-500 shrink-0" />
  if (s === 'major')    return <AlertTriangle size={14} className="text-orange-500 shrink-0" />
  return <Info size={14} className="text-gray-400 shrink-0" />
}

// ── sub-components ────────────────────────────────────────────────────────────

function CategoryRow({ cat }: { cat: CategoryScore }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{cat.label}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              {cat.weight}%
            </span>
            <span className={clsx('text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize', statusBadge(cat.status))}>
              {cat.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <div
                className={clsx('h-full rounded-full transition-all', barColor(cat.score))}
                style={{ width: `${Math.max(cat.score, 3)}%` }}
              />
            </div>
            <span className={clsx('text-sm font-bold tabular-nums w-10 text-right shrink-0', scoreColor(cat.score))}>
              {cat.score}%
            </span>
          </div>
        </div>
        {cat.tips.length > 0 && (
          open ? <ChevronUp size={14} className="text-gray-400 shrink-0" /> : <ChevronDown size={14} className="text-gray-400 shrink-0" />
        )}
      </button>
      {open && cat.tips.length > 0 && (
        <div className="px-4 pb-3 pt-1 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 space-y-1.5">
          {cat.tips.map((tip, i) => (
            <div key={i} className="flex gap-2">
              <Target size={12} className="text-[#0f2044] dark:text-sky-400 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600 dark:text-gray-400">{tip}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ScoreRing({ score, verdict }: { score: number; verdict: string }) {
  const v = VERDICTS[verdict as keyof typeof VERDICTS]
  const circumference = 2 * Math.PI * 52
  const offset = circumference - (score / 100) * circumference
  const strokeColor =
    score >= 80 ? '#10b981' :
    score >= 60 ? '#0ea5e9' :
    score >= 40 ? '#f59e0b' : '#ef4444'

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-100 dark:text-gray-700" />
          <circle
            cx="60" cy="60" r="52" fill="none"
            stroke={strokeColor} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={clsx('text-3xl font-extrabold tabular-nums', scoreColor(score))}>{score}</span>
          <span className="text-xs text-gray-400 font-medium">/ 100</span>
        </div>
      </div>
      <div className={clsx('px-3 py-1.5 rounded-lg border text-center', v.badgeBg, v.badgeBorder)}>
        <p className={clsx('text-xs font-bold', v.textColor)}>{v.label}</p>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{v.scoreRange} pts</p>
      </div>
    </div>
  )
}

function BulletMetric({ label, value, max, textCls, barCls }: { label: string; value: number; max: number; textCls: string; barCls: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
        <span className={clsx('text-sm font-bold', textCls)}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <div className={clsx('h-full rounded-full transition-all', barCls)} style={{ width: `${Math.max(pct, 2)}%` }} />
      </div>
      <p className="text-[10px] text-gray-400">{value} of {max} bullets</p>
    </div>
  )
}

type ScoredResume = SavedResume & { intl: InternationalScore }

// ── page ──────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [resumes, setResumes] = useState<SavedResume[]>([])
  const [jobCount, setJobCount] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    const saved = getSavedResumes()
    setResumes(saved)
    setJobCount(getJobs().length)
  }, [])

  const scored: ScoredResume[] = useMemo(() =>
    resumes.map((r) => ({ ...r, intl: calculateInternationalScore(r.data) }))
      .sort((a, b) => b.intl.finalScore - a.intl.finalScore),
    [resumes]
  )

  const selected = selectedId ? scored.find((r) => r.id === selectedId) ?? scored[0] : scored[0]

  const avgScore = scored.length
    ? Math.round(scored.reduce((s, r) => s + r.intl.finalScore, 0) / scored.length)
    : 0

  const skillFrequency = useMemo(() => {
    const map: Record<string, number> = {}
    resumes.flatMap((r) => r.data.skills.flatMap((c) => c.skills)).forEach((sk) => { map[sk] = (map[sk] ?? 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 12)
  }, [resumes])

  const sectionCoverage = useMemo(() => {
    if (!resumes.length) return []
    return [
      { label: 'Experience',    count: resumes.filter((r) => r.data.experience.length > 0).length },
      { label: 'Education',     count: resumes.filter((r) => r.data.education.length > 0).length },
      { label: 'Projects',      count: resumes.filter((r) => r.data.projects.length > 0).length },
      { label: 'Skills',        count: resumes.filter((r) => r.data.skills.length > 0).length },
      { label: 'Certifications',count: resumes.filter((r) => r.data.certifications.length > 0).length },
      { label: 'Languages',     count: resumes.filter((r) => r.data.languages.length > 0).length },
      { label: 'Summary',       count: resumes.filter((r) => !!r.data.personal.summary).length },
      { label: 'LinkedIn',      count: resumes.filter((r) => !!r.data.personal.linkedin).length },
    ]
  }, [resumes])

  const overviewCards = [
    { label: 'Saved Resumes',  value: resumes.length,      icon: FileText,   iconCls: 'bg-[#0f2044]/10 text-[#0f2044] dark:bg-white/10 dark:text-white' },
    { label: 'Avg Int\'l Score',value: `${avgScore}`,      icon: TrendingUp, iconCls: 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300' },
    { label: 'Best Score',     value: scored[0] ? `${scored[0].intl.finalScore}` : '—', icon: Trophy, iconCls: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
    { label: 'Jobs Tracked',   value: jobCount,            icon: Briefcase,  iconCls: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  ]

  return (
    <div className="flex flex-col h-full overflow-auto bg-gray-50 dark:bg-gray-950 pb-8">

      {/* Hero */}
      <div className="bg-[#0f2044] px-6 py-10 text-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-widest mb-2">Analytics</p>
          <h1 className="text-2xl font-bold mb-1">International Resume Analytics</h1>
          <p className="text-white/50 text-sm">Tougher standards. 8 weighted categories. Global employer benchmarks.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">

        {/* Overview cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {overviewCards.map(({ label, value, icon: Icon, iconCls }) => (
            <div key={label} className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
              <div className={clsx('flex h-9 w-9 items-center justify-center rounded-lg mb-2', iconCls)}>
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
            {/* ── International Score Deep Dive ── */}
            <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Card header + resume selector */}
              <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex-wrap">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-[#0f2044] dark:text-sky-400" />
                  <h2 className="font-semibold text-gray-900 dark:text-white text-sm">International Score Breakdown</h2>
                </div>
                {scored.length > 1 && (
                  <select
                    value={selectedId ?? scored[0]?.id}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-[#0f2044]/20"
                  >
                    {scored.map((r) => (
                      <option key={r.id} value={r.id}>{r.name} — {r.intl.finalScore}pts</option>
                    ))}
                  </select>
                )}
              </div>

              {selected && (
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row gap-6">

                    {/* Left — score ring + meta */}
                    <div className="flex flex-col items-center lg:items-start gap-4 lg:w-52 shrink-0">
                      <ScoreRing score={selected.intl.finalScore} verdict={selected.intl.verdict} />

                      {/* Score breakdown chips */}
                      <div className="w-full space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500 dark:text-gray-400">Raw score</span>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">{selected.intl.rawScore} pts</span>
                        </div>
                        {selected.intl.totalPenalty > 0 && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-400">Red flag penalty</span>
                            <span className="font-semibold text-red-500">−{selected.intl.totalPenalty} pts</span>
                          </div>
                        )}
                        <div className="flex justify-between text-xs border-t border-gray-100 dark:border-gray-700 pt-1.5">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Final score</span>
                          <span className={clsx('font-bold', scoreColor(selected.intl.finalScore))}>{selected.intl.finalScore} pts</span>
                        </div>
                      </div>

                      {/* Strengths */}
                      {selected.intl.strengths.length > 0 && (
                        <div className="w-full">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Strengths</p>
                          <div className="flex flex-wrap gap-1">
                            {selected.intl.strengths.map((s) => (
                              <span key={s} className="flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                                <CheckCircle2 size={9} /> {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right — 8 category bars */}
                    <div className="flex-1 space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-3">Category Breakdown — click to expand tips</p>
                      {selected.intl.categories.map((cat) => (
                        <CategoryRow key={cat.key} cat={cat} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Red Flags ── */}
            {selected && selected.intl.redFlags.length > 0 && (
              <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                  <AlertTriangle size={16} className="text-orange-500" />
                  <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Red Flags</h2>
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                    Total penalty: <span className="font-semibold text-red-500">−{selected.intl.totalPenalty} pts</span>
                  </span>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-gray-700">
                  {selected.intl.redFlags.map((flag, i) => (
                    <div key={i} className="flex items-start gap-3 px-5 py-3">
                      {severityIcon(flag.severity)}
                      <p className="flex-1 text-sm text-gray-700 dark:text-gray-300">{flag.issue}</p>
                      <span className="shrink-0 text-xs font-bold text-red-500 tabular-nums">−{flag.penalty}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Bullet Quality + Top Improvements ── */}
            {selected && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Bullet quality */}
                <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap size={15} className="text-[#0f2044] dark:text-sky-400" />
                    <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Bullet Point Quality</h2>
                  </div>
                  {selected.intl.bulletAnalysis.total === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No bullet points found — add achievement bullets to experience and projects.</p>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Total bullets analysed</span>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{selected.intl.bulletAnalysis.total}</span>
                      </div>
                      <BulletMetric
                        label="With quantified metrics (%, $, numbers)"
                        value={selected.intl.bulletAnalysis.withMetrics}
                        max={selected.intl.bulletAnalysis.total}
                        textCls="text-emerald-600 dark:text-emerald-400"
                        barCls="bg-emerald-500"
                      />
                      <BulletMetric
                        label="Starting with strong action verbs"
                        value={selected.intl.bulletAnalysis.withStrongVerbs}
                        max={selected.intl.bulletAnalysis.total}
                        textCls="text-sky-600 dark:text-sky-400"
                        barCls="bg-sky-500"
                      />
                      <BulletMetric
                        label="Weak phrasing (responsible for, helped…)"
                        value={selected.intl.bulletAnalysis.withWeakVerbs}
                        max={selected.intl.bulletAnalysis.total}
                        textCls="text-red-500 dark:text-red-400"
                        barCls="bg-red-400"
                      />
                      <div className="pt-2 border-t border-gray-100 dark:border-gray-700 text-[10px] text-gray-400 space-y-0.5">
                        <p>Target: <span className="font-semibold text-gray-600 dark:text-gray-300">50%+ metrics · 70%+ strong verbs · 0% weak phrasing</span></p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Top improvements */}
                <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Target size={15} className="text-[#0f2044] dark:text-sky-400" />
                    <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Priority Improvements</h2>
                  </div>
                  {selected.intl.topImprovements.length === 0 ? (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={16} />
                      <span className="text-sm font-medium">No major improvements needed!</span>
                    </div>
                  ) : (
                    <ol className="space-y-3">
                      {selected.intl.topImprovements.map((tip, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0f2044] text-white text-[10px] font-bold shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{tip}</p>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            )}

            {/* ── Resume Comparison Table ── */}
            <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white text-sm">All Resumes — International Comparison</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                      <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400">Resume</th>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400">Score</th>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell">Verdict</th>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hidden lg:table-cell">Flags</th>
                      <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400">Bar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scored.map((r, i) => {
                      const v = VERDICTS[r.intl.verdict]
                      return (
                        <tr
                          key={r.id}
                          onClick={() => setSelectedId(r.id)}
                          className={clsx(
                            'border-b border-gray-50 dark:border-gray-700 cursor-pointer transition-colors',
                            r.id === (selectedId ?? scored[0]?.id)
                              ? 'bg-[#0f2044]/5 dark:bg-white/5'
                              : 'hover:bg-gray-50/60 dark:hover:bg-gray-700/30',
                          )}
                        >
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              {i === 0 && <Star size={12} className="text-yellow-400 shrink-0" />}
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white text-sm">{r.name}</p>
                                {r.data.personal.fullName && (
                                  <p className="text-xs text-gray-400 dark:text-gray-500">{r.data.personal.fullName}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <span className={clsx('text-sm font-bold', scoreColor(r.intl.finalScore))}>
                              {r.intl.finalScore}
                            </span>
                          </td>
                          <td className="px-3 py-3 hidden md:table-cell">
                            <span className={clsx('text-[10px] font-semibold px-1.5 py-0.5 rounded border', v.badgeBg, v.badgeBorder, v.textColor)}>
                              {v.label}
                            </span>
                          </td>
                          <td className="px-3 py-3 hidden lg:table-cell">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {r.intl.redFlags.filter((f) => f.severity === 'critical').length}c /
                              {r.intl.redFlags.filter((f) => f.severity === 'major').length}m
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="w-28 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                              <div
                                className={clsx('h-full rounded-full', barColor(r.intl.finalScore))}
                                style={{ width: `${r.intl.finalScore}%` }}
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

            {/* ── Skills + Section Coverage ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {skillFrequency.length > 0 && (
                <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
                  <h2 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Top Skills Across Resumes</h2>
                  <div className="space-y-2.5">
                    {skillFrequency.map(([skill, count]) => {
                      const pct = resumes.length > 0 ? Math.round((count / resumes.length) * 100) : 0
                      return (
                        <div key={skill} className="flex items-center gap-3">
                          <span className="text-xs text-gray-600 dark:text-gray-400 w-28 shrink-0 truncate">{skill}</span>
                          <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                            <div className="h-full rounded-full bg-[#0f2044] dark:bg-sky-500" style={{ width: `${Math.max(pct, 3)}%` }} />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 w-6 text-right">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
                <h2 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Section Coverage</h2>
                <div className="space-y-2.5">
                  {sectionCoverage.map(({ label, count }) => {
                    const pct = resumes.length > 0 ? Math.round((count / resumes.length) * 100) : 0
                    return (
                      <div key={label} className="flex items-center gap-3">
                        <span className="text-xs text-gray-600 dark:text-gray-400 w-28 shrink-0 truncate">{label}</span>
                        <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                          <div
                            className={clsx('h-full rounded-full', pct === 100 ? 'bg-emerald-500' : pct >= 50 ? 'bg-sky-500' : 'bg-amber-400')}
                            style={{ width: `${Math.max(pct, 3)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">{count}/{resumes.length}</span>
                      </div>
                    )
                  })}
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3">
                  Across {resumes.length} resume{resumes.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
