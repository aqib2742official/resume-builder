'use client'

import { useSelector } from 'react-redux'
import { clsx } from 'clsx'
import type { RootState } from '@/store'
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

export function EditorPanel() {
  const darkEditor = useSelector((state: RootState) => state.ui.darkEditor)

  return (
    <aside
      className={clsx(
        'flex flex-col h-full border-r overflow-hidden transition-colors duration-200',
        darkEditor
          ? 'dark bg-slate-900 border-slate-700'
          : 'bg-gray-50 border-gray-200'
      )}
    >
      {/* Completeness score — always visible at top */}
      <CompletenessScore />

      {/* Scrollable section list */}
      <div className="flex-1 overflow-y-auto custom-scroll">
        <PersonalInfoEditor />
        <SummaryEditor />
        <ExperienceEditor />
        <EducationEditor />
        <ProjectsEditor />
        <SkillsEditor />
        <CertificationsEditor />
        <LanguagesEditor />
        <AwardsEditor />
        <VolunteerEditor />
        <InterestsEditor />
        <CustomSectionEditor />
      </div>
    </aside>
  )
}
