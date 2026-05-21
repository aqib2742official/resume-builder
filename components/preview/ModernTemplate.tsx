'use client'

import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { FONT_OPTIONS } from '@/store/themeSlice'
import { useResumeData } from '@/hooks/useResumeData'
import { formatDateRange, formatSingleDate } from '@/lib/dateUtils'

const DENSITY_GAP: Record<string, number> = { compact: 12, standard: 18, spacious: 26 }
const DENSITY_PAD: Record<string, string> = {
  compact:  '0 36px 24px',
  standard: '0 40px 30px',
  spacious: '0 44px 36px',
}

function SectionHead({ children, accent }: Readonly<{ children: React.ReactNode; accent: string }>) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <div style={{ width: 3, height: 16, backgroundColor: accent, borderRadius: 2, flexShrink: 0 }} />
      <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#111827' }}>
        {children}
      </h2>
    </div>
  )
}

export function ModernTemplate({ noPdfId }: Readonly<{ noPdfId?: boolean }> = {}) {
  const data  = useResumeData()
  const theme = useSelector((state: RootState) => state.theme)

  const fontOption = FONT_OPTIONS.find((f) => f.value === theme.fontFamily)
  const fontCss    = fontOption?.css ?? 'system-ui, sans-serif'
  const { accentColor, headerBg, density, photoShape, sectionOrder, nameSize, pdfBg } = theme
  const hidden = new Set(data.hiddenSections)
  const gap    = DENSITY_GAP[density] ?? 18
  const pad    = DENSITY_PAD[density] ?? '0 40px 30px'

  const personal   = data.personal
  const photoRadius = photoShape === 'circle' ? '50%' : photoShape === 'square' ? '6px' : '0'

  const nameSizePx: Record<string, number> = { normal: 28, large: 34, xlarge: 40 }
  const namePx = nameSizePx[nameSize] ?? 28

  const contacts = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.github,
    personal.portfolio,
  ].filter(Boolean)

  const isEmpty = !personal.fullName && !personal.jobTitle && data.experience.length === 0

  if (isEmpty) {
    return (
      <div id={noPdfId ? undefined : 'resume-template'} className="a4-page bg-white" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Your resume preview</p>
          <p style={{ fontSize: 13 }}>Fill in your details on the left to see the magic here</p>
        </div>
      </div>
    )
  }

  const sectionMap: Record<string, React.ReactNode> = {
    summary: !hidden.has('summary') && personal.summary ? (
      <div key="summary">
        <SectionHead accent={accentColor}>About</SectionHead>
        <p style={{ fontSize: 10.5, color: '#374151', lineHeight: 1.7 }}>{personal.summary}</p>
      </div>
    ) : null,

    experience: !hidden.has('experience') && data.experience.filter((e) => e.company || e.position).length > 0 ? (
      <div key="experience">
        <SectionHead accent={accentColor}>Experience</SectionHead>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {data.experience.filter((e) => e.company || e.position).map((exp) => (
            <div key={exp.id} className="page-break-avoid" style={{ display: 'flex', gap: 14 }}>
              {/* Timeline decoration */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: 3 }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: accentColor, flexShrink: 0 }} />
                <div style={{ flex: 1, width: 1.5, backgroundColor: `${accentColor}30`, marginTop: 4 }} />
              </div>
              {/* Content */}
              <div style={{ flex: 1, paddingBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{exp.position}</p>
                  <p style={{ fontSize: 9.5, color: '#6b7280', flexShrink: 0, whiteSpace: 'nowrap' }}>
                    {formatDateRange(exp.startDate, exp.endDate, exp.currentlyWorking)}
                  </p>
                </div>
                <p style={{ fontSize: 10.5, color: accentColor, fontWeight: 600, marginBottom: 5 }}>
                  {exp.company}{exp.location && <span style={{ fontWeight: 400, color: '#6b7280' }}> · {exp.location}</span>}
                </p>
                {exp.bullets.some(Boolean) && (
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {exp.bullets.filter(Boolean).map((b) => (
                      <li key={b} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                        <span style={{ marginTop: 5, width: 3, height: 3, borderRadius: '50%', backgroundColor: '#9ca3af', flexShrink: 0 }} />
                        <span style={{ fontSize: 10.5, color: '#374151', lineHeight: 1.6 }}>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null,

    education: !hidden.has('education') && data.education.filter((e) => e.institution || e.degree).length > 0 ? (
      <div key="education">
        <SectionHead accent={accentColor}>Education</SectionHead>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.education.filter((e) => e.institution || e.degree).map((edu) => (
            <div key={edu.id} className="page-break-avoid">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#111827' }}>
                  {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ')}
                </p>
                <p style={{ fontSize: 9.5, color: '#6b7280', flexShrink: 0 }}>
                  {formatDateRange(edu.startDate, edu.endDate, false)}
                </p>
              </div>
              <p style={{ fontSize: 10.5, color: accentColor, fontWeight: 600, marginTop: 1 }}>
                {edu.institution}{edu.location && <span style={{ fontWeight: 400, color: '#6b7280' }}> · {edu.location}</span>}
              </p>
              {edu.description && (
                <p style={{ fontSize: 10, color: '#374151', lineHeight: 1.6, marginTop: 3 }}>{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    projects: !hidden.has('projects') && data.projects.filter((p) => p.title).length > 0 ? (
      <div key="projects">
        <SectionHead accent={accentColor}>Projects</SectionHead>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {data.projects.filter((p) => p.title).map((project) => (
            <div key={project.id} className="page-break-avoid">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#111827' }}>{project.title}</p>
                {(project.liveLink || project.githubLink) && (
                  <p style={{ fontSize: 9.5, color: accentColor, flexShrink: 0 }}>{project.liveLink || project.githubLink}</p>
                )}
              </div>
              {project.techStack && (
                <p style={{ fontSize: 9.5, color: '#7c3aed', fontWeight: 600, marginTop: 1 }}>{project.techStack}</p>
              )}
              {project.bullets.some(Boolean) && (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
                  {project.bullets.filter(Boolean).map((b) => (
                    <li key={b} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                      <span style={{ marginTop: 5, width: 3, height: 3, borderRadius: '50%', backgroundColor: '#9ca3af', flexShrink: 0 }} />
                      <span style={{ fontSize: 10.5, color: '#374151', lineHeight: 1.6 }}>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    skills: !hidden.has('skills') && data.skills.filter((s) => s.skills.length > 0).length > 0 ? (
      <div key="skills">
        <SectionHead accent={accentColor}>Skills</SectionHead>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {data.skills.filter((s) => s.skills.length > 0).map((cat) => (
            <div key={cat.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              {cat.category && (
                <span style={{ fontSize: 9.5, fontWeight: 700, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: 80, flexShrink: 0, paddingTop: 2 }}>
                  {cat.category}
                </span>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 5px' }}>
                {cat.skills.map((skill) => (
                  <span key={skill} style={{
                    fontSize: 9.5,
                    color: '#374151',
                    backgroundColor: `${accentColor}12`,
                    border: `1px solid ${accentColor}30`,
                    borderRadius: 4,
                    padding: '2px 7px',
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null,

    certifications: !hidden.has('certifications') && data.certifications.filter((c) => c.title).length > 0 ? (
      <div key="certifications">
        <SectionHead accent={accentColor}>Certifications</SectionHead>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {data.certifications.filter((c) => c.title).map((cert) => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <p style={{ fontSize: 10.5, color: '#111827' }}>
                <span style={{ fontWeight: 700 }}>{cert.title}</span>
                {cert.issuer && <span style={{ color: accentColor }}> · {cert.issuer}</span>}
              </p>
              {cert.date && <p style={{ fontSize: 9.5, color: '#6b7280', flexShrink: 0 }}>{formatSingleDate(cert.date)}</p>}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    languages: !hidden.has('languages') && data.languages.filter((l) => l.name).length > 0 ? (
      <div key="languages">
        <SectionHead accent={accentColor}>Languages</SectionHead>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px' }}>
          {data.languages.filter((l) => l.name).map((lang) => (
            <span key={lang.id} style={{ fontSize: 10.5, color: '#374151' }}>
              <span style={{ fontWeight: 700 }}>{lang.name}</span>
              <span style={{ color: '#9ca3af' }}> / {lang.proficiency}</span>
            </span>
          ))}
        </div>
      </div>
    ) : null,

    awards: !hidden.has('awards') && data.awards.filter((a) => a.title).length > 0 ? (
      <div key="awards">
        <SectionHead accent={accentColor}>Awards</SectionHead>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {data.awards.filter((a) => a.title).map((award) => (
            <div key={award.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <p style={{ fontSize: 10.5, fontWeight: 700, color: '#111827' }}>{award.title}</p>
                {award.date && <p style={{ fontSize: 9.5, color: '#6b7280' }}>{formatSingleDate(award.date)}</p>}
              </div>
              {award.description && (
                <p style={{ fontSize: 10, color: '#374151', lineHeight: 1.6, marginTop: 2 }}>{award.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    volunteer: !hidden.has('volunteer') && data.volunteer.filter((v) => v.organization || v.role).length > 0 ? (
      <div key="volunteer">
        <SectionHead accent={accentColor}>Volunteer</SectionHead>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.volunteer.filter((v) => v.organization || v.role).map((item) => (
            <div key={item.id} className="page-break-avoid">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#111827' }}>{item.organization}</p>
                <p style={{ fontSize: 9.5, color: '#6b7280', flexShrink: 0 }}>
                  {formatDateRange(item.startDate, item.endDate, item.currentlyVolunteering)}
                </p>
              </div>
              {item.role && (
                <p style={{ fontSize: 10, color: accentColor, fontWeight: 600, marginTop: 1 }}>{item.role}</p>
              )}
              {item.description && (
                <p style={{ fontSize: 10, color: '#374151', lineHeight: 1.6, marginTop: 3 }}>{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    interests: !hidden.has('interests') && data.interests.filter(Boolean).length > 0 ? (
      <div key="interests">
        <SectionHead accent={accentColor}>Interests</SectionHead>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 6px' }}>
          {data.interests.filter(Boolean).map((interest) => (
            <span key={interest} style={{
              fontSize: 9.5,
              color: '#374151',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: 99,
              padding: '2px 8px',
            }}>
              {interest}
            </span>
          ))}
        </div>
      </div>
    ) : null,
  }

  const orderedKeys = [
    ...sectionOrder.filter((k) => k in sectionMap),
    ...Object.keys(sectionMap).filter((k) => !sectionOrder.includes(k)),
  ]

  return (
    <div id={noPdfId ? undefined : 'resume-template'} className={`a4-page ${pdfBg === 'dark' ? 'a4-page-dark' : 'bg-white'}`} style={{ fontFamily: fontCss }}>
      {/* Colored Header Band */}
      <div style={{ backgroundColor: headerBg, padding: '28px 40px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {personal.photo && photoShape !== 'none' && (
            <img src={personal.photo} alt={personal.fullName} style={{ width: 72, height: 72, borderRadius: photoRadius, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)', flexShrink: 0 }} />
          )}
          <div style={{ flex: 1 }}>
            {personal.fullName && (
              <h1 style={{ fontSize: namePx, fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                {personal.fullName}
              </h1>
            )}
            {personal.jobTitle && (
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4, fontWeight: 500, letterSpacing: '0.02em' }}>
                {personal.jobTitle}
              </p>
            )}
          </div>
        </div>

        {/* Contact row */}
        {contacts.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px', marginTop: 14, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 12 }}>
            {contacts.map((c) => (
              <span key={c} style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.75)' }}>{c}</span>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: pad, display: 'flex', flexDirection: 'column', gap, paddingTop: 24 }}>
        {orderedKeys.map((key) => sectionMap[key])}

        {/* Custom sections */}
        {data.customSections.filter((s) => !hidden.has(s.id)).map((section) => (
          <div key={section.id}>
            <SectionHead accent={accentColor}>{section.title}</SectionHead>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {section.items.map((item) => (
                <div key={item.id}>
                  {item.subtitle && <p style={{ fontSize: 10.5, fontWeight: 700, color: '#111827' }}>{item.subtitle}</p>}
                  {item.description && <p style={{ fontSize: 10, color: '#374151', lineHeight: 1.6, marginTop: 2 }}>{item.description}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
