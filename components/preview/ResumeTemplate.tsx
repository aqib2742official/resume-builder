'use client'

import { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '@/store'
import { FONT_OPTIONS, setColumnRatio } from '@/store/themeSlice'
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
  if (density === 'compact') return { left: '14px 20px 8px 22px', right: '14px 20px 8px 16px' }
  if (density === 'spacious') return { left: '26px 24px 8px 34px', right: '26px 28px 8px 22px' }
  return { left: '20px 22px 8px 28px', right: '20px 24px 8px 20px' }
}

export function ResumeTemplate({ noPdfId }: Readonly<{ noPdfId?: boolean }> = {}) {
  const data = useResumeData()
  const theme = useSelector((state: RootState) => state.theme)
  const dispatch = useDispatch<AppDispatch>()
  const templateRef = useRef<HTMLDivElement>(null)

  const fontOption = FONT_OPTIONS.find((f) => f.value === theme.fontFamily)
  const fontCss = fontOption?.css ?? 'system-ui, sans-serif'
  const { accentColor, density, photoShape, nameSize, columnRatio } = theme
  const hidden = new Set(data.hiddenSections)
  const gap = getSectionGap(density)
  const pad = getColPadding(density)
  const leftPct  = `${columnRatio}%`
  const rightPct = `${100 - columnRatio}%`

  function handleDividerMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault()
    const el = templateRef.current
    if (!el) return

    // getBoundingClientRect returns post-transform size, so width = 794 * scale
    const scale = el.getBoundingClientRect().width / 794
    const startX     = e.clientX
    const startRatio = columnRatio

    function onMove(me: MouseEvent) {
      const deltaPercent = ((me.clientX - startX) / scale / 794) * 100
      dispatch(setColumnRatio(Math.round(startRatio + deltaPercent)))
    }

    function onUp() {
      globalThis.removeEventListener('mousemove', onMove)
      globalThis.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
    }

    document.body.style.cursor = 'col-resize'
    globalThis.addEventListener('mousemove', onMove)
    globalThis.addEventListener('mouseup', onUp)
  }

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
        id={noPdfId ? undefined : 'resume-template'}
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
    <div ref={templateRef} id={noPdfId ? undefined : 'resume-template'} className="a4-page bg-white" style={{ fontFamily: fontCss }}>
      <HeaderSection
        personal={data.personal}
        summary={hidden.has('summary') ? undefined : data.personal.summary}
        accentColor={accentColor}
        photoShape={photoShape}
        nameSize={nameSize}
      />

      <div style={{ display: 'flex' }}>
        {/* Left column */}
        <div style={{
          flex: `0 0 ${leftPct}`,
          padding: pad.left,
          display: 'flex',
          flexDirection: 'column',
          gap,
          minWidth: 0,
        }}>
          {!hidden.has('experience') && (
            <div className="page-break-avoid">
              <ExperienceSection experience={data.experience} accentColor={accentColor} />
            </div>
          )}
          {!hidden.has('projects') && (
            <div className="page-break-avoid">
              <ProjectsSection projects={data.projects} accentColor={accentColor} />
            </div>
          )}
          {data.customSections
            .filter((_, i) => i % 2 === 0)
            .filter((s) => !hidden.has(s.id))
            .map((section) => (
              <div key={section.id} className="page-break-avoid">
                <CustomSectionPreview section={section} accentColor={accentColor} />
              </div>
            ))}
        </div>

        {/* Draggable column divider — hidden in print/PDF */}
        <div
          role="slider"
          aria-label={`Column divider: ${columnRatio}% left, ${100 - columnRatio}% right. Drag or use arrow keys to resize.`}
          aria-orientation="vertical"
          aria-valuenow={columnRatio}
          aria-valuemin={30}
          aria-valuemax={70}
          tabIndex={0}
          className="no-print"
          onMouseDown={handleDividerMouseDown}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft')  dispatch(setColumnRatio(columnRatio - 1))
            if (e.key === 'ArrowRight') dispatch(setColumnRatio(columnRatio + 1))
          }}
          title={`${columnRatio}% · ${100 - columnRatio}%  —  drag to resize`}
          style={{
            flexShrink: 0,
            width: 9,
            cursor: 'col-resize',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 5,
            marginLeft: -1,
            outline: 'none',
          }}
        >
          {/* Visible line */}
          <div style={{ width: 1, height: '100%', backgroundColor: '#e5e7eb', position: 'absolute' }} />
          {/* Grab pill */}
          <div style={{
            position: 'relative',
            width: 5,
            height: 36,
            borderRadius: 99,
            backgroundColor: '#d1d5db',
            border: '1px solid #e5e7eb',
            transition: 'background-color 0.15s',
          }} />
        </div>

        {/* Right column */}
        <div style={{
          flex: `0 0 ${rightPct}`,
          padding: pad.right,
          display: 'flex',
          flexDirection: 'column',
          gap,
          backgroundColor: '#fafafa',
          minWidth: 0,
          alignSelf: 'flex-start',
        }}>
          {!hidden.has('skills') && (
            <div className="page-break-avoid">
              <SkillsSection skills={data.skills} accentColor={accentColor} />
            </div>
          )}
          {!hidden.has('education') && (
            <div className="page-break-avoid">
              <EducationSection education={data.education} accentColor={accentColor} />
            </div>
          )}
          {!hidden.has('languages') && (
            <div className="page-break-avoid">
              <LanguagesSection languages={data.languages} accentColor={accentColor} />
            </div>
          )}
          {!hidden.has('certifications') && (
            <div className="page-break-avoid">
              <CertificationsSection certifications={data.certifications} accentColor={accentColor} />
            </div>
          )}
          {!hidden.has('awards') && (
            <div className="page-break-avoid">
              <AwardsSection awards={data.awards} accentColor={accentColor} />
            </div>
          )}
          {!hidden.has('volunteer') && (
            <div className="page-break-avoid">
              <VolunteerSection volunteer={data.volunteer} accentColor={accentColor} />
            </div>
          )}
          {!hidden.has('interests') && (
            <div className="page-break-avoid">
              <InterestsSection interests={data.interests} accentColor={accentColor} />
            </div>
          )}
          {data.customSections
            .filter((_, i) => i % 2 !== 0)
            .filter((s) => !hidden.has(s.id))
            .map((section) => (
              <div key={section.id} className="page-break-avoid">
                <CustomSectionPreview section={section} accentColor={accentColor} />
              </div>
            ))}
        </div>
      </div>

      {/* Professional footer — page number on multi-page resumes */}
      <ResumeFooter name={data.personal.fullName} accentColor={accentColor} />
    </div>
  )
}

function ResumeFooter({ name, accentColor }: Readonly<{ name: string; accentColor: string }>) {
  if (!name) return null
  return (
    <div
      className="no-print"
      style={{
        borderTop: '1px solid #f3f4f6',
        padding: '6px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span style={{ fontSize: 8.5, color: '#9ca3af', letterSpacing: '0.04em' }}>
        {name}
      </span>
      <span style={{ fontSize: 8.5, color: accentColor, letterSpacing: '0.06em' }}>
        References available upon request
      </span>
    </div>
  )
}
