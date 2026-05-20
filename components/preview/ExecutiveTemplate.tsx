'use client'

import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { FONT_OPTIONS } from '@/store/themeSlice'
import { useResumeData } from '@/hooks/useResumeData'
import { formatDateRange, formatSingleDate } from '@/lib/dateUtils'

const DENSITY_GAP: Record<string, number> = { compact: 10, standard: 16, spacious: 24 }

function SidebarSectionHead({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 3, marginBottom: 8 }}>
      <h2 style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
        {children}
      </h2>
    </div>
  )
}

function MainSectionHead({ children, accent }: Readonly<{ children: React.ReactNode; accent: string }>) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <h2 style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: accent }}>
        {children}
      </h2>
      <div style={{ flex: 1, height: 1, backgroundColor: accent, opacity: 0.25 }} />
    </div>
  )
}

export function ExecutiveTemplate({ noPdfId }: Readonly<{ noPdfId?: boolean }> = {}) {
  const data  = useResumeData()
  const theme = useSelector((state: RootState) => state.theme)

  const fontOption = FONT_OPTIONS.find((f) => f.value === theme.fontFamily)
  const fontCss    = fontOption?.css ?? 'system-ui, sans-serif'
  const { accentColor, headerBg, density, photoShape, nameSize } = theme
  const hidden = new Set(data.hiddenSections)
  const gap    = DENSITY_GAP[density] ?? 16

  const personal   = data.personal
  const photoRadius = photoShape === 'circle' ? '50%' : photoShape === 'square' ? '8px' : '0'

  const nameSizePx: Record<string, number> = { normal: 18, large: 22, xlarge: 26 }
  const namePx = nameSizePx[nameSize] ?? 18

  const contacts = [
    { label: personal.email },
    { label: personal.phone },
    { label: personal.location },
    { label: personal.linkedin },
    { label: personal.github },
    { label: personal.portfolio },
  ].filter((c) => c.label)

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

  const dot = { marginTop: 4, width: 3, height: 3, borderRadius: '50%', backgroundColor: accentColor, flexShrink: 0 }

  return (
    <div id={noPdfId ? undefined : 'resume-template'} className="a4-page bg-white" style={{ fontFamily: fontCss, display: 'flex', flexDirection: 'row' }}>

      {/* Left Sidebar */}
      <div style={{ width: 210, minHeight: '100%', backgroundColor: headerBg, padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: 20, flexShrink: 0 }}>

        {/* Photo + Name */}
        <div style={{ textAlign: 'center' }}>
          {personal.photo && photoShape !== 'none' && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <img src={personal.photo} alt={personal.fullName} style={{ width: 88, height: 88, borderRadius: photoRadius, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.25)' }} />
            </div>
          )}
          {personal.fullName && (
            <h1 style={{ fontSize: namePx, fontWeight: 700, color: '#ffffff', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              {personal.fullName}
            </h1>
          )}
          {personal.jobTitle && (
            <p style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.65)', marginTop: 4, fontWeight: 500, letterSpacing: '0.03em' }}>
              {personal.jobTitle}
            </p>
          )}
        </div>

        {/* Contact */}
        {contacts.length > 0 && (
          <div>
            <SidebarSectionHead>Contact</SidebarSectionHead>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {contacts.map(({ label }) => (
                <p key={label} style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, wordBreak: 'break-all' }}>
                  {label}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {!hidden.has('skills') && data.skills.filter((s) => s.skills.length > 0).length > 0 && (
          <div>
            <SidebarSectionHead>Skills</SidebarSectionHead>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.skills.filter((s) => s.skills.length > 0).map((cat) => (
                <div key={cat.id}>
                  {cat.category && (
                    <p style={{ fontSize: 8.5, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                      {cat.category}
                    </p>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 4px' }}>
                    {cat.skills.map((skill) => (
                      <span key={skill} style={{
                        fontSize: 8.5,
                        color: '#ffffff',
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        borderRadius: 99,
                        padding: '2px 7px',
                        display: 'inline-block',
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {!hidden.has('languages') && data.languages.filter((l) => l.name).length > 0 && (
          <div>
            <SidebarSectionHead>Languages</SidebarSectionHead>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {data.languages.filter((l) => l.name).map((lang) => (
                <div key={lang.id}>
                  <p style={{ fontSize: 9.5, fontWeight: 700, color: '#ffffff' }}>{lang.name}</p>
                  <p style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.6)' }}>{lang.proficiency}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications in sidebar */}
        {!hidden.has('certifications') && data.certifications.filter((c) => c.title).length > 0 && (
          <div>
            <SidebarSectionHead>Certifications</SidebarSectionHead>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {data.certifications.filter((c) => c.title).map((cert) => (
                <div key={cert.id}>
                  <p style={{ fontSize: 9.5, fontWeight: 600, color: '#ffffff' }}>{cert.title}</p>
                  {cert.issuer && <p style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.6)' }}>{cert.issuer}</p>}
                  {cert.date && <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)' }}>{formatSingleDate(cert.date)}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {!hidden.has('interests') && data.interests.filter(Boolean).length > 0 && (
          <div>
            <SidebarSectionHead>Interests</SidebarSectionHead>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 5px' }}>
              {data.interests.filter(Boolean).map((interest) => (
                <span key={interest} style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.8)', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 99, padding: '2px 7px' }}>
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right main content */}
      <div style={{ flex: 1, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap }}>

        {/* Summary */}
        {!hidden.has('summary') && personal.summary && (
          <div>
            <MainSectionHead accent={accentColor}>Profile</MainSectionHead>
            <p style={{ fontSize: 10.5, color: '#374151', lineHeight: 1.7 }}>{personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {!hidden.has('experience') && data.experience.filter((e) => e.company || e.position).length > 0 && (
          <div>
            <MainSectionHead accent={accentColor}>Experience</MainSectionHead>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.experience.filter((e) => e.company || e.position).map((exp) => (
                <div key={exp.id} className="page-break-avoid">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 1 }}>
                    <p style={{ fontSize: 11.5, fontWeight: 700, color: '#111827' }}>{exp.position}</p>
                    <p style={{ fontSize: 9.5, color: '#6b7280', flexShrink: 0, whiteSpace: 'nowrap' }}>
                      {formatDateRange(exp.startDate, exp.endDate, exp.currentlyWorking)}
                    </p>
                  </div>
                  <p style={{ fontSize: 10, color: accentColor, fontWeight: 600, marginBottom: 4 }}>
                    {exp.company}{exp.location && <span style={{ fontWeight: 400, color: '#6b7280' }}> · {exp.location}</span>}
                  </p>
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
        )}

        {/* Education */}
        {!hidden.has('education') && data.education.filter((e) => e.institution || e.degree).length > 0 && (
          <div>
            <MainSectionHead accent={accentColor}>Education</MainSectionHead>
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
                  <p style={{ fontSize: 10, color: accentColor, fontWeight: 600, marginTop: 1 }}>
                    {edu.institution}{edu.location && <span style={{ fontWeight: 400, color: '#6b7280' }}> · {edu.location}</span>}
                  </p>
                  {edu.description && (
                    <p style={{ fontSize: 10, color: '#374151', lineHeight: 1.6, marginTop: 3 }}>{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {!hidden.has('projects') && data.projects.filter((p) => p.title).length > 0 && (
          <div>
            <MainSectionHead accent={accentColor}>Projects</MainSectionHead>
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
        )}

        {/* Awards */}
        {!hidden.has('awards') && data.awards.filter((a) => a.title).length > 0 && (
          <div>
            <MainSectionHead accent={accentColor}>Awards</MainSectionHead>
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
        )}

        {/* Volunteer */}
        {!hidden.has('volunteer') && data.volunteer.filter((v) => v.organization || v.role).length > 0 && (
          <div>
            <MainSectionHead accent={accentColor}>Volunteer</MainSectionHead>
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
        )}

        {/* Custom sections */}
        {data.customSections.filter((s) => !hidden.has(s.id)).map((section) => (
          <div key={section.id}>
            <MainSectionHead accent={accentColor}>{section.title}</MainSectionHead>
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
