'use client'

import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { FONT_OPTIONS } from '@/store/themeSlice'
import { useResumeData } from '@/hooks/useResumeData'
import { formatDateRange, formatSingleDate } from '@/lib/dateUtils'

const DENSITY_GAP: Record<string, number> = { compact: 10, standard: 16, spacious: 24 }
const DENSITY_PAD: Record<string, string> = {
  compact:  '24px 48px',
  standard: '32px 52px',
  spacious: '42px 56px',
}

function SectionHead({ children, accent }: Readonly<{ children: React.ReactNode; accent: string }>) {
  return (
    <div style={{ borderBottom: `1.5px solid ${accent}`, paddingBottom: 3, marginBottom: 8 }}>
      <h2 style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#111827' }}>
        {children}
      </h2>
    </div>
  )
}

export function ProfessionalTemplate({ noPdfId }: Readonly<{ noPdfId?: boolean }> = {}) {
  const data  = useResumeData()
  const theme = useSelector((state: RootState) => state.theme)

  const fontOption = FONT_OPTIONS.find((f) => f.value === theme.fontFamily)
  const fontCss    = fontOption?.css ?? 'system-ui, sans-serif'
  const { accentColor, density, photoShape, sectionOrder, nameSize } = theme
  const hidden = new Set(data.hiddenSections)
  const gap    = DENSITY_GAP[density] ?? 16
  const pad    = DENSITY_PAD[density] ?? '32px 52px'

  const personal   = data.personal
  const photoRadius = photoShape === 'circle' ? '50%' : photoShape === 'square' ? '6px' : '0'

  const nameSizePx: Record<string, number> = { normal: 26, large: 30, xlarge: 36 }
  const namePx = nameSizePx[nameSize] ?? 26

  const contacts = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.github,
    personal.portfolio,
  ].filter(Boolean)

  const isEmpty = !personal.fullName && !personal.jobTitle && data.experience.length === 0 && data.skills.length === 0

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

  const dot = { marginTop: 4, width: 3, height: 3, borderRadius: '50%', backgroundColor: '#374151', flexShrink: 0 }

  const sectionMap: Record<string, React.ReactNode> = {
    summary: !hidden.has('summary') && personal.summary ? (
      <div key="summary">
        <SectionHead accent={accentColor}>Summary</SectionHead>
        <p style={{ fontSize: 10.5, color: '#374151', lineHeight: 1.7 }}>{personal.summary}</p>
      </div>
    ) : null,

    skills: !hidden.has('skills') && data.skills.filter((s) => s.skills.length > 0).length > 0 ? (
      <div key="skills">
        <SectionHead accent={accentColor}>Skills</SectionHead>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {data.skills.filter((s) => s.skills.length > 0).map((cat) => (
              <tr key={cat.id}>
                <td style={{ width: '28%', paddingBottom: 5, paddingRight: 12, verticalAlign: 'top' }}>
                  {cat.category && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#111827' }}>{cat.category}</span>
                  )}
                </td>
                <td style={{ paddingBottom: 5, verticalAlign: 'top' }}>
                  <span style={{ fontSize: 10, color: '#374151' }}>{cat.skills.join(', ')}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : null,

    experience: !hidden.has('experience') && data.experience.filter((e) => e.company || e.position).length > 0 ? (
      <div key="experience">
        <SectionHead accent={accentColor}>Experience</SectionHead>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.experience.filter((e) => e.company || e.position).map((exp) => (
            <div key={exp.id} className="page-break-avoid">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 1 }}>
                <p style={{ fontSize: 11.5, fontWeight: 700, color: '#111827' }}>{exp.company}</p>
                <p style={{ fontSize: 9.5, color: '#6b7280', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  {formatDateRange(exp.startDate, exp.endDate, exp.currentlyWorking)}
                </p>
              </div>
              {exp.position && (
                <p style={{ fontSize: 10.5, color: accentColor, fontWeight: 600, fontStyle: 'italic', marginBottom: 4 }}>{exp.position}</p>
              )}
              {exp.bullets.some(Boolean) && (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {exp.bullets.filter(Boolean).map((b) => (
                    <li key={b} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                      <span style={dot} />
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
              <p style={{ fontSize: 10.5, color: '#374151', marginTop: 1 }}>
                {edu.institution}{edu.location && <span style={{ color: '#6b7280' }}> · {edu.location}</span>}
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
                <p style={{ fontSize: 9.5, color: '#6b7280', fontWeight: 600, marginTop: 1 }}>{project.techStack}</p>
              )}
              {project.bullets.some(Boolean) && (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2, marginTop: 3 }}>
                  {project.bullets.filter(Boolean).map((b) => (
                    <li key={b} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                      <span style={dot} />
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

    certifications: !hidden.has('certifications') && data.certifications.filter((c) => c.title).length > 0 ? (
      <div key="certifications">
        <SectionHead accent={accentColor}>Certifications</SectionHead>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {data.certifications.filter((c) => c.title).map((cert) => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <p style={{ fontSize: 10.5, color: '#111827' }}>
                <span style={{ fontWeight: 700 }}>{cert.title}</span>
                {cert.issuer && <span style={{ color: '#6b7280' }}> — {cert.issuer}</span>}
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 24px' }}>
          {data.languages.filter((l) => l.name).map((lang) => (
            <span key={lang.id} style={{ fontSize: 10.5, color: '#374151' }}>
              <span style={{ fontWeight: 700 }}>{lang.name}</span>
              <span style={{ color: '#6b7280' }}> — {lang.proficiency}</span>
            </span>
          ))}
        </div>
      </div>
    ) : null,

    awards: !hidden.has('awards') && data.awards.filter((a) => a.title).length > 0 ? (
      <div key="awards">
        <SectionHead accent={accentColor}>Awards & Achievements</SectionHead>
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
        <SectionHead accent={accentColor}>Volunteer Work</SectionHead>
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
                <p style={{ fontSize: 10.5, color: accentColor, fontWeight: 600, fontStyle: 'italic', marginTop: 1 }}>{item.role}</p>
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
        <p style={{ fontSize: 10.5, color: '#374151' }}>{data.interests.filter(Boolean).join(' · ')}</p>
      </div>
    ) : null,
  }

  const orderedKeys = [
    ...sectionOrder.filter((k) => k in sectionMap),
    ...Object.keys(sectionMap).filter((k) => !sectionOrder.includes(k)),
  ]

  return (
    <div id={noPdfId ? undefined : 'resume-template'} className="a4-page bg-white" style={{ fontFamily: fontCss }}>
      {/* Header */}
      <div style={{ padding: pad, paddingBottom: 20, borderBottom: `2px solid ${accentColor}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
          {personal.photo && photoShape !== 'none' && (
            <img src={personal.photo} alt={personal.fullName} style={{ width: 72, height: 72, borderRadius: photoRadius, objectFit: 'cover', flexShrink: 0 }} />
          )}
          <div style={{ flex: 1 }}>
            {personal.fullName && (
              <h1 style={{ fontSize: namePx, fontWeight: 700, color: '#111827', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
                {personal.fullName}
              </h1>
            )}
            {personal.jobTitle && (
              <p style={{ fontSize: 13, color: '#6b7280', marginTop: 3, fontWeight: 500 }}>{personal.jobTitle}</p>
            )}
            {contacts.length > 0 && (
              <p style={{ fontSize: 9.5, color: '#6b7280', marginTop: 8 }}>
                {contacts.join('  ·  ')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: pad, paddingTop: 20, display: 'flex', flexDirection: 'column', gap }}>
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
