'use client'

import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { FONT_OPTIONS } from '@/store/themeSlice'
import { useResumeData } from '@/hooks/useResumeData'
import { HeaderSection } from './sections/HeaderSection'
import { ExperienceSection } from './sections/ExperienceSection'
import { EducationSection } from './sections/EducationSection'
import { ProjectsSection } from './sections/ProjectsSection'
import { SkillsSection } from './sections/SkillsSection'
import { CertificationsSection } from './sections/CertificationsSection'
import { LanguagesSection } from './sections/LanguagesSection'
import { AwardsSection } from './sections/AwardsSection'
import { VolunteerSection } from './sections/VolunteerSection'
import { InterestsSection } from './sections/InterestsSection'
import { CustomSectionPreview } from './sections/CustomSectionPreview'

function getSectionGap(density: string): number {
  if (density === 'compact') return 10
  if (density === 'spacious') return 24
  return 16
}

function getColPadding(density: string): { left: string; right: string } {
  if (density === 'compact') return { left: '14px 20px 18px 22px', right: '14px 20px 18px 16px' }
  if (density === 'spacious') return { left: '26px 24px 30px 34px', right: '26px 28px 30px 22px' }
  return { left: '20px 22px 24px 28px', right: '20px 24px 24px 20px' }
}

export function ResumeTemplate() {
  const data = useResumeData()
  const theme = useSelector((state: RootState) => state.theme)

  const fontOption = FONT_OPTIONS.find((f) => f.value === theme.fontFamily)
  const fontCss = fontOption?.css ?? 'system-ui, sans-serif'
  const { accentColor, density, photoShape, nameSize } = theme
  const hidden = new Set(data.hiddenSections)
  const gap = getSectionGap(density)
  const pad = getColPadding(density)

  const isEmpty =
    !data.personal.fullName &&
    !data.personal.jobTitle &&
    data.experience.length === 0 &&
    data.education.length === 0 &&
    data.projects.length === 0 &&
    data.skills.length === 0

  if (isEmpty) {
    return (
      <div
        id="resume-template"
        className="a4-page bg-white"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Your resume preview</p>
          <p style={{ fontSize: 13 }}>Fill in your details on the left to see the magic here</p>
        </div>
      </div>
    )
  }

  return (
    <div id="resume-template" className="a4-page bg-white" style={{ fontFamily: fontCss }}>
      <HeaderSection
        personal={data.personal}
        summary={hidden.has('summary') ? undefined : data.personal.summary}
        accentColor={accentColor}
        photoShape={photoShape}
        nameSize={nameSize}
      />

      <div style={{ display: 'flex', minHeight: 'calc(1123px - 120px)' }}>
        {/* Left column — 60% */}
        <div style={{
          flex: '0 0 60%',
          padding: pad.left,
          display: 'flex',
          flexDirection: 'column',
          gap,
          borderRight: '1px solid #e5e7eb',
        }}>
          {!hidden.has('experience') && <ExperienceSection experience={data.experience} accentColor={accentColor} />}
          {!hidden.has('projects') && <ProjectsSection projects={data.projects} accentColor={accentColor} />}
          {!hidden.has('volunteer') && <VolunteerSection volunteer={data.volunteer} accentColor={accentColor} />}
          {data.customSections
            .filter((_, i) => i % 2 === 0)
            .filter((s) => !hidden.has(s.id))
            .map((section) => (
              <CustomSectionPreview key={section.id} section={section} accentColor={accentColor} />
            ))}
        </div>

        {/* Right column — 40% */}
        <div style={{
          flex: '0 0 40%',
          padding: pad.right,
          display: 'flex',
          flexDirection: 'column',
          gap,
          backgroundColor: '#fafafa',
        }}>
          {!hidden.has('skills') && <SkillsSection skills={data.skills} accentColor={accentColor} />}
          {!hidden.has('education') && <EducationSection education={data.education} accentColor={accentColor} />}
          {!hidden.has('languages') && <LanguagesSection languages={data.languages} accentColor={accentColor} />}
          {!hidden.has('certifications') && <CertificationsSection certifications={data.certifications} accentColor={accentColor} />}
          {!hidden.has('awards') && <AwardsSection awards={data.awards} accentColor={accentColor} />}
          {!hidden.has('interests') && <InterestsSection interests={data.interests} accentColor={accentColor} />}
          {data.customSections
            .filter((_, i) => i % 2 !== 0)
            .filter((s) => !hidden.has(s.id))
            .map((section) => (
              <CustomSectionPreview key={section.id} section={section} accentColor={accentColor} />
            ))}
        </div>
      </div>
    </div>
  )
}
