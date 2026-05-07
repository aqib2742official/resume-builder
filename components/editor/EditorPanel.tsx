'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'
import type { RootState } from '@/store'
import { useTheme } from '@/hooks/useTheme'
import { DEFAULT_SECTION_ORDER } from '@/store/themeSlice'
import { CompletenessScore } from '@/components/shared/CompletenessScore'
import { PersonalInfoEditor } from './sections/PersonalInfoEditor'
import { SummaryEditor } from './sections/SummaryEditor'
import { ExperienceEditor } from './sections/ExperienceEditor'
import { EducationEditor } from './sections/EducationEditor'
import { ProjectsEditor } from './sections/ProjectsEditor'
import { SkillsEditor } from './sections/SkillsEditor'
import { CertificationsEditor } from './sections/CertificationsEditor'
import { LanguagesEditor } from './sections/LanguagesEditor'
import { AwardsEditor } from './sections/AwardsEditor'
import { VolunteerEditor } from './sections/VolunteerEditor'
import { InterestsEditor } from './sections/InterestsEditor'
import { CustomSectionEditor } from './sections/CustomSectionEditor'

const SECTION_COMPONENTS: Record<string, React.ReactNode> = {
  summary:        <SummaryEditor />,
  experience:     <ExperienceEditor />,
  education:      <EducationEditor />,
  projects:       <ProjectsEditor />,
  skills:         <SkillsEditor />,
  certifications: <CertificationsEditor />,
  languages:      <LanguagesEditor />,
  awards:         <AwardsEditor />,
  volunteer:      <VolunteerEditor />,
  interests:      <InterestsEditor />,
}

const SECTION_LABELS: Record<string, string> = {
  summary: 'Summary', experience: 'Experience', education: 'Education',
  projects: 'Projects', skills: 'Skills', certifications: 'Certifications',
  languages: 'Languages', awards: 'Awards', volunteer: 'Volunteer', interests: 'Interests',
}

export function EditorPanel() {
  const darkEditor = useSelector((state: RootState) => state.ui.darkEditor)
  const { theme, setSectionOrder } = useTheme()
  const [reorderMode, setReorderMode] = useState(false)

  // Fallback handles persisted state that predates sectionOrder being added
  const stored = theme.sectionOrder ?? DEFAULT_SECTION_ORDER
  const order = [
    ...stored.filter((k) => DEFAULT_SECTION_ORDER.includes(k)),
    ...DEFAULT_SECTION_ORDER.filter((k) => !stored.includes(k)),
  ]

  function move(key: string, dir: 'up' | 'down') {
    const idx = order.indexOf(key)
    if (idx === -1) return
    const next = [...order]
    const swap = dir === 'up' ? idx - 1 : idx + 1
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    setSectionOrder(next)
  }

  return (
    <aside
      className={clsx(
        'flex flex-col h-full border-r overflow-hidden transition-colors duration-200',
        darkEditor ? 'dark bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'
      )}
    >
      <CompletenessScore />

      {/* Reorder toggle bar */}
      <div className={clsx(
        'flex items-center justify-between px-4 py-1.5 border-b text-xs',
        darkEditor ? 'border-slate-700 bg-slate-800' : 'border-gray-100 bg-gray-50'
      )}>
        <span className={clsx('text-xs', darkEditor ? 'text-slate-400' : 'text-gray-400')}>
          {reorderMode ? 'Drag to reorder sections' : 'Editor'}
        </span>
        <button
          onClick={() => setReorderMode((v) => !v)}
          className={clsx(
            'flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors',
            reorderMode
              ? 'bg-blue-600 text-white'
              : darkEditor
                ? 'text-slate-400 hover:bg-slate-700'
                : 'text-gray-500 hover:bg-gray-100'
          )}
          title="Reorder sections"
        >
          <ArrowUpDown size={11} />
          Reorder
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll">
        {/* Personal info — always first, not reorderable */}
        <PersonalInfoEditor />

        {reorderMode ? (
          /* Reorder mode — show compact draggable list */
          <div className={clsx('divide-y', darkEditor ? 'divide-slate-700' : 'divide-gray-100')}>
            {order.map((key, idx) => (
              <div
                key={key}
                className={clsx(
                  'flex items-center justify-between px-4 py-2.5 gap-2',
                  darkEditor ? 'bg-slate-900' : 'bg-white'
                )}
              >
                <span className={clsx('text-sm font-medium', darkEditor ? 'text-slate-200' : 'text-gray-700')}>
                  {SECTION_LABELS[key] ?? key}
                </span>
                <div className="flex gap-0.5">
                  <button
                    onClick={() => move(key, 'up')}
                    disabled={idx === 0}
                    className={clsx(
                      'rounded p-1 transition-colors disabled:opacity-25',
                      darkEditor ? 'text-slate-400 hover:bg-slate-700' : 'text-gray-400 hover:bg-gray-100'
                    )}
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => move(key, 'down')}
                    disabled={idx === order.length - 1}
                    className={clsx(
                      'rounded p-1 transition-colors disabled:opacity-25',
                      darkEditor ? 'text-slate-400 hover:bg-slate-700' : 'text-gray-400 hover:bg-gray-100'
                    )}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Normal mode — render section editors in order */
          <>
            {order.map((key) => (
              <div key={key}>
                {SECTION_COMPONENTS[key]}
              </div>
            ))}
            <CustomSectionEditor />
          </>
        )}
      </div>
    </aside>
  )
}
