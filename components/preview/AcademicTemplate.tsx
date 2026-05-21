'use client'

import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { FONT_OPTIONS } from '@/store/themeSlice'
import { useResumeData } from '@/hooks/useResumeData'
import { formatDateRange, formatSingleDate } from '@/lib/dateUtils'

function SectionHead({ children, accent }: Readonly<{ children: React.ReactNode; accent: string }>) {
  return (
    <div style={{ borderBottom: `1px solid ${accent}`, paddingBottom: 3, marginBottom: 7, marginTop: 14 }}>
      <h2 style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent }}>
        {children}
      </h2>
    </div>
  )
}

function Bullet({ accent }: { accent: string }) {
  return <span style={{ display: 'inline-block', width: 3, height: 3, borderRadius: '50%', backgroundColor: accent, flexShrink: 0, marginTop: 4.5 }} />
}

export function AcademicTemplate({ noPdfId }: Readonly<{ noPdfId?: boolean }> = {}) {
  const data = useResumeData()
  const theme = useSelector((state: RootState) => state.theme)

  const fontOption = FONT_OPTIONS.find((f) => f.value === theme.fontFamily)
  const fontCss = fontOption?.css ?? 'Georgia, Times New Roman, serif'
  const { accentColor, sectionOrder, pdfBg } = theme
  const hidden = new Set(data.hiddenSections)
  const p = data.personal

  const contacts = [p.email, p.phone, p.location, p.linkedin, p.github, p.portfolio].filter(Boolean)

  const isEmpty = !p.fullName && data.experience.length === 0 && data.education.length === 0

  if (isEmpty) {
    return (
      <div id={noPdfId ? undefined : 'resume-template'} className="a4-page bg-white" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Your CV preview</p>
          <p style={{ fontSize: 13 }}>Fill in your details on the left to see the preview</p>
        </div>
      </div>
    )
  }

  return (
    <div
      id={noPdfId ? undefined : 'resume-template'}
      className={`a4-page ${pdfBg === 'dark' ? 'a4-page-dark' : 'bg-white'}`}
      style={{ fontFamily: fontCss, padding: '32px 44px', fontSize: 10, color: '#1a1a1a', lineHeight: 1.5 }}
    >
      {/* Header — name, contact, horizontal rule */}
      <div style={{ textAlign: 'center', borderBottom: `2px solid ${accentColor}`, paddingBottom: 10, marginBottom: 2 }}>
        {p.fullName && (
          <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.02em', color: '#111', marginBottom: 3 }}>
            {p.fullName}
          </h1>
        )}
        {p.jobTitle && (
          <p style={{ fontSize: 10.5, fontWeight: 500, color: accentColor, marginBottom: 5 }}>{p.jobTitle}</p>
        )}
        {contacts.length > 0 && (
          <p style={{ fontSize: 9, color: '#555', letterSpacing: '0.03em' }}>
            {contacts.join('  ·  ')}
          </p>
        )}
      </div>

      {/* Sections in user-defined order */}
      {(() => {
        const sectionMap: Record<string, React.ReactNode> = {
          summary: !hidden.has('summary') && p.summary ? (
            <div key="summary">
              <SectionHead accent={accentColor}>Research Interests & Profile</SectionHead>
              <p style={{ fontSize: 9.5, color: '#333', lineHeight: 1.65 }}>{p.summary}</p>
            </div>
          ) : null,

          education: !hidden.has('education') && data.education.filter((e) => e.institution || e.degree).length > 0 ? (
            <div key="education">
              <SectionHead accent={accentColor}>Education</SectionHead>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {data.education.filter((e) => e.institution || e.degree).map((edu) => (
                  <div key={edu.id} className="page-break-avoid">
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 10 }}>{[edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ')}</span>
                      <span style={{ fontSize: 9, color: '#555', flexShrink: 0 }}>{formatDateRange(edu.startDate, edu.endDate, false)}</span>
                    </div>
                    <p style={{ fontSize: 9.5, color: accentColor, fontWeight: 600, marginTop: 1 }}>
                      {edu.institution}{edu.location && <span style={{ fontWeight: 400, color: '#555' }}>, {edu.location}</span>}
                    </p>
                    {edu.description && <p style={{ fontSize: 9, color: '#444', lineHeight: 1.55, marginTop: 2 }}>{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          ) : null,

          experience: !hidden.has('experience') && data.experience.filter((e) => e.company || e.position).length > 0 ? (
            <div key="experience">
              <SectionHead accent={accentColor}>Work Experience</SectionHead>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {data.experience.filter((e) => e.company || e.position).map((exp) => (
                  <div key={exp.id} className="page-break-avoid">
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 10 }}>{exp.position}</span>
                      <span style={{ fontSize: 9, color: '#555', flexShrink: 0, whiteSpace: 'nowrap' }}>{formatDateRange(exp.startDate, exp.endDate, exp.currentlyWorking)}</span>
                    </div>
                    <p style={{ fontSize: 9.5, color: accentColor, fontWeight: 600, fontStyle: 'italic', marginTop: 1 }}>
                      {exp.company}{exp.location && <span style={{ fontWeight: 400, fontStyle: 'normal', color: '#555' }}>, {exp.location}</span>}
                    </p>
                    {exp.bullets.some(Boolean) && (
                      <ul style={{ marginTop: 3, listStyle: 'none', padding: 0, paddingLeft: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {exp.bullets.filter(Boolean).map((b) => (
                          <li key={b} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                            <Bullet accent={accentColor} /><span style={{ fontSize: 9.5, color: '#333', lineHeight: 1.55 }}>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null,

          projects: !hidden.has('projects') && data.projects.filter((proj) => proj.title).length > 0 ? (
            <div key="projects">
              <SectionHead accent={accentColor}>Publications & Projects</SectionHead>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {data.projects.filter((proj) => proj.title).map((project) => (
                  <div key={project.id} className="page-break-avoid">
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: 10 }}>{project.title}</span>
                      {project.techStack && <span style={{ fontSize: 9, color: accentColor, fontWeight: 600 }}>[{project.techStack}]</span>}
                      {(project.liveLink || project.githubLink) && <span style={{ fontSize: 8.5, color: '#666' }}>{project.liveLink || project.githubLink}</span>}
                    </div>
                    {project.bullets.some(Boolean) && (
                      <ul style={{ marginTop: 2, listStyle: 'none', padding: 0, paddingLeft: 10, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {project.bullets.filter(Boolean).map((b) => (
                          <li key={b} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                            <Bullet accent={accentColor} /><span style={{ fontSize: 9.5, color: '#333', lineHeight: 1.5 }}>{b}</span>
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
              <SectionHead accent={accentColor}>Skills & Competencies</SectionHead>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {data.skills.filter((s) => s.skills.length > 0).map((cat) => (
                  <div key={cat.id} style={{ display: 'flex', gap: 8 }}>
                    {cat.category && <span style={{ fontSize: 9, fontWeight: 700, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0, minWidth: 90 }}>{cat.category}:</span>}
                    <span style={{ fontSize: 9.5, color: '#333' }}>{cat.skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null,

          certifications: !hidden.has('certifications') && data.certifications.filter((c) => c.title).length > 0 ? (
            <div key="certifications">
              <SectionHead accent={accentColor}>Certifications & Training</SectionHead>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {data.certifications.filter((c) => c.title).map((cert) => (
                  <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: 9.5, fontWeight: 600, color: '#111' }}>
                      {cert.title}{cert.issuer && <span style={{ fontWeight: 400, color: '#555' }}>, {cert.issuer}</span>}
                    </span>
                    {cert.date && <span style={{ fontSize: 9, color: '#666', flexShrink: 0 }}>{formatSingleDate(cert.date)}</span>}
                  </div>
                ))}
              </div>
            </div>
          ) : null,

          awards: !hidden.has('awards') && data.awards.filter((a) => a.title).length > 0 ? (
            <div key="awards">
              <SectionHead accent={accentColor}>Honours & Awards</SectionHead>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {data.awards.filter((a) => a.title).map((award) => (
                  <div key={award.id} className="page-break-avoid">
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 9.5 }}>{award.title}</span>
                      {award.date && <span style={{ fontSize: 9, color: '#666', flexShrink: 0 }}>{formatSingleDate(award.date)}</span>}
                    </div>
                    {award.description && <p style={{ fontSize: 9, color: '#444', lineHeight: 1.55, marginTop: 1 }}>{award.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          ) : null,

          languages: !hidden.has('languages') && data.languages.filter((l) => l.name).length > 0 ? (
            <div key="languages">
              <SectionHead accent={accentColor}>Languages</SectionHead>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 24px' }}>
                {data.languages.filter((l) => l.name).map((lang) => (
                  <span key={lang.id} style={{ fontSize: 9.5 }}>
                    <span style={{ fontWeight: 600 }}>{lang.name}</span><span style={{ color: '#666' }}> ({lang.proficiency})</span>
                  </span>
                ))}
              </div>
            </div>
          ) : null,

          volunteer: !hidden.has('volunteer') && data.volunteer.filter((v) => v.organization || v.role).length > 0 ? (
            <div key="volunteer">
              <SectionHead accent={accentColor}>Service & Volunteer</SectionHead>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {data.volunteer.filter((v) => v.organization || v.role).map((item) => (
                  <div key={item.id} className="page-break-avoid">
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 10 }}>{item.organization}</span>
                      <span style={{ fontSize: 9, color: '#555', flexShrink: 0 }}>{formatDateRange(item.startDate, item.endDate, item.currentlyVolunteering)}</span>
                    </div>
                    {item.role && <p style={{ fontSize: 9.5, color: accentColor, fontStyle: 'italic', marginTop: 1 }}>{item.role}</p>}
                    {item.description && <p style={{ fontSize: 9, color: '#444', lineHeight: 1.55, marginTop: 2 }}>{item.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          ) : null,

          interests: !hidden.has('interests') && data.interests.filter(Boolean).length > 0 ? (
            <div key="interests">
              <SectionHead accent={accentColor}>Interests</SectionHead>
              <p style={{ fontSize: 9.5, color: '#333' }}>{data.interests.filter(Boolean).join(' · ')}</p>
            </div>
          ) : null,
        }

        const orderedKeys = [
          ...sectionOrder.filter((k) => k in sectionMap),
          ...Object.keys(sectionMap).filter((k) => !sectionOrder.includes(k)),
        ]

        return (
          <>
            {orderedKeys.map((k) => sectionMap[k])}
            {data.customSections.filter((s) => !hidden.has(s.id)).map((section) => (
              <div key={section.id}>
                <SectionHead accent={accentColor}>{section.title}</SectionHead>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {section.items.map((item) => (
                    <div key={item.id} className="page-break-avoid">
                      {item.subtitle && <p style={{ fontSize: 10, fontWeight: 700, color: '#111' }}>{item.subtitle}</p>}
                      {item.description && <p style={{ fontSize: 9, color: '#444', lineHeight: 1.55, marginTop: 1 }}>{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )
      })()}
    </div>
  )
}
