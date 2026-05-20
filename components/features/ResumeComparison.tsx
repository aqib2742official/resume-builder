'use client'

import { X, Check, Minus, Trophy } from 'lucide-react'
import { clsx } from 'clsx'
import type { SavedResume } from '@/lib/resumeStorage'
import { calculateCompleteness } from '@/lib/completenessScore'
import { format } from 'date-fns'

interface Props {
  resumeA: SavedResume
  resumeB: SavedResume
  onClose: () => void
}

function wordCount(resume: SavedResume): number {
  const d = resume.data
  const texts = [
    d.personal.summary,
    ...d.experience.flatMap((e) => [e.company, e.position, ...e.bullets]),
    ...d.education.map((e) => e.description),
    ...d.projects.flatMap((p) => [...p.bullets, p.techStack]),
    ...d.skills.flatMap((s) => s.skills),
    d.personal.fullName, d.personal.jobTitle,
  ]
  return texts.join(' ').split(/\s+/).filter(Boolean).length
}

interface StatRowProps {
  label: string
  a: number | string
  b: number | string
  higherIsBetter?: boolean
  format?: (v: number | string) => string
}

function StatRow({ label, a, b, higherIsBetter = true }: StatRowProps) {
  const aNum = typeof a === 'number' ? a : parseFloat(a) || 0
  const bNum = typeof b === 'number' ? b : parseFloat(b) || 0
  const aWins = higherIsBetter ? aNum > bNum : aNum < bNum
  const bWins = higherIsBetter ? bNum > aNum : bNum < aNum
  const tied = aNum === bNum

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-2.5 border-b border-gray-100 last:border-0">
      <div className={clsx('flex items-center justify-end gap-1.5', aWins ? 'text-green-700 font-semibold' : 'text-gray-600')}>
        <span>{a}{typeof a === 'number' && label.includes('%') ? '%' : ''}</span>
        {aWins && <Trophy size={13} className="text-yellow-500" />}
      </div>
      <div className="text-center text-xs text-gray-500 whitespace-nowrap px-3">{label}</div>
      <div className={clsx('flex items-center justify-start gap-1.5', bWins ? 'text-green-700 font-semibold' : 'text-gray-600')}>
        {bWins && <Trophy size={13} className="text-yellow-500" />}
        <span>{b}{typeof b === 'number' && label.includes('%') ? '%' : ''}</span>
      </div>
    </div>
  )
}

function SectionCheckRow({ label, hasA, hasB }: { label: string; hasA: boolean; hasB: boolean }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
      <div className="flex justify-end">
        {hasA ? <Check size={14} className="text-green-500" /> : <Minus size={14} className="text-gray-300" />}
      </div>
      <div className="text-center text-xs text-gray-500 px-3">{label}</div>
      <div className="flex justify-start">
        {hasB ? <Check size={14} className="text-green-500" /> : <Minus size={14} className="text-gray-300" />}
      </div>
    </div>
  )
}

export function ResumeComparison({ resumeA, resumeB, onClose }: Props) {
  const scoreA = calculateCompleteness(resumeA.data)
  const scoreB = calculateCompleteness(resumeB.data)
  const wordsA = wordCount(resumeA)
  const wordsB = wordCount(resumeB)

  const sectionsA = resumeA.data
  const sectionsB = resumeB.data

  const skillCountA = sectionsA.skills.reduce((s, c) => s + c.skills.length, 0)
  const skillCountB = sectionsB.skills.reduce((s, c) => s + c.skills.length, 0)

  const winner = scoreA.total > scoreB.total ? 'A' : scoreB.total > scoreA.total ? 'B' : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Resume Comparison</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"><X size={18} /></button>
        </div>

        <div className="overflow-auto flex-1">
          {/* Resume names header */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 px-6 py-4 bg-gray-50">
            <div className={clsx('rounded-xl p-3 text-center', winner === 'A' ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-200')}>
              <p className="font-semibold text-gray-900 text-sm line-clamp-1">{resumeA.name}</p>
              {resumeA.data.personal.jobTitle && (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{resumeA.data.personal.jobTitle}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">{format(new Date(resumeA.savedAt), 'MMM d, yyyy')}</p>
              {winner === 'A' && <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-green-700"><Trophy size={11} className="text-yellow-500" /> Stronger Resume</span>}
            </div>
            <div className="flex items-center justify-center text-xs font-bold text-gray-400">VS</div>
            <div className={clsx('rounded-xl p-3 text-center', winner === 'B' ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-200')}>
              <p className="font-semibold text-gray-900 text-sm line-clamp-1">{resumeB.name}</p>
              {resumeB.data.personal.jobTitle && (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{resumeB.data.personal.jobTitle}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">{format(new Date(resumeB.savedAt), 'MMM d, yyyy')}</p>
              {winner === 'B' && <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-green-700"><Trophy size={11} className="text-yellow-500" /> Stronger Resume</span>}
            </div>
          </div>

          {/* Stats section */}
          <div className="px-6 py-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Overall Scores</h3>

            <StatRow label="Completeness %" a={scoreA.total} b={scoreB.total} />
            <StatRow label="Word Count" a={wordsA} b={wordsB} />
            <StatRow label="Skills Listed" a={skillCountA} b={skillCountB} />
            <StatRow label="Experience Items" a={sectionsA.experience.length} b={sectionsB.experience.length} />
            <StatRow label="Projects" a={sectionsA.projects.length} b={sectionsB.projects.length} />
            <StatRow label="Certifications" a={sectionsA.certifications.length} b={sectionsB.certifications.length} />
          </div>

          {/* Section-by-section breakdown */}
          <div className="px-6 pb-4 border-t border-gray-100 pt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Section Breakdown</h3>
            {scoreA.sections.map((sA) => {
              const sB = scoreB.sections.find((s) => s.key === sA.key)!
              return (
                <div key={sA.key} className="mb-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span className="font-medium">{sA.label}</span>
                    <span className="text-gray-400">weight: {sA.weight}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs text-gray-500">{resumeA.name.slice(0, 12)}</span>
                        <span className={clsx('text-xs font-semibold', sA.score >= 80 ? 'text-green-600' : sA.score >= 50 ? 'text-yellow-600' : 'text-red-500')}>{sA.score}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className={clsx('h-full rounded-full', sA.score >= 80 ? 'bg-green-500' : sA.score >= 50 ? 'bg-yellow-500' : 'bg-red-400')} style={{ width: `${sA.score}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs text-gray-500">{resumeB.name.slice(0, 12)}</span>
                        <span className={clsx('text-xs font-semibold', sB.score >= 80 ? 'text-green-600' : sB.score >= 50 ? 'text-yellow-600' : 'text-red-500')}>{sB.score}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className={clsx('h-full rounded-full', sB.score >= 80 ? 'bg-green-500' : sB.score >= 50 ? 'bg-yellow-500' : 'bg-red-400')} style={{ width: `${sB.score}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Sections present */}
          <div className="px-6 pb-6 border-t border-gray-100 pt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Sections Present</h3>
            <SectionCheckRow label="Summary" hasA={!!sectionsA.personal.summary} hasB={!!sectionsB.personal.summary} />
            <SectionCheckRow label="Experience" hasA={sectionsA.experience.length > 0} hasB={sectionsB.experience.length > 0} />
            <SectionCheckRow label="Education" hasA={sectionsA.education.length > 0} hasB={sectionsB.education.length > 0} />
            <SectionCheckRow label="Projects" hasA={sectionsA.projects.length > 0} hasB={sectionsB.projects.length > 0} />
            <SectionCheckRow label="Skills" hasA={sectionsA.skills.length > 0} hasB={sectionsB.skills.length > 0} />
            <SectionCheckRow label="Certifications" hasA={sectionsA.certifications.length > 0} hasB={sectionsB.certifications.length > 0} />
            <SectionCheckRow label="Languages" hasA={sectionsA.languages.length > 0} hasB={sectionsB.languages.length > 0} />
            <SectionCheckRow label="Awards" hasA={sectionsA.awards.length > 0} hasB={sectionsB.awards.length > 0} />
            <SectionCheckRow label="Volunteer Work" hasA={sectionsA.volunteer.length > 0} hasB={sectionsB.volunteer.length > 0} />
            <SectionCheckRow label="Interests" hasA={sectionsA.interests.length > 0} hasB={sectionsB.interests.length > 0} />
            <SectionCheckRow label="Photo" hasA={!!sectionsA.personal.photo} hasB={!!sectionsB.personal.photo} />
            <SectionCheckRow label="LinkedIn" hasA={!!sectionsA.personal.linkedin} hasB={!!sectionsB.personal.linkedin} />
            <SectionCheckRow label="GitHub" hasA={!!sectionsA.personal.github} hasB={!!sectionsB.personal.github} />
          </div>
        </div>
      </div>
    </div>
  )
}
