'use client'

import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { FONT_OPTIONS } from '@/store/themeSlice'
import { Mail, Phone, MapPin, Link, Globe } from 'lucide-react'
import { useResumeData } from '@/hooks/useResumeData'
import { formatDateRange, formatSingleDate } from '@/lib/dateUtils'

const DENSITY_GAP: Record<string, number> = { compact: 12, standard: 18, spacious: 26 }
const DENSITY_PAD: Record<string, string> = {
  compact:  '18px 32px',
  standard: '26px 36px',
  spacious: '34px 42px',
}

function SectionHead({ children, accent }: Readonly<{ children: React.ReactNode; accent: string }>) {
  return (
    <div style={{ borderBottom: `1.5px solid ${accent}`, paddingBottom: 4, marginBottom: 8 }}>
      <h2 style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent }}>
        {children}
      </h2>
    </div>
  )
}

export function MinimalTemplate({ noPdfId }: Readonly<{ noPdfId?: boolean }> = {}) {
  const data = useResumeData()
  const theme = useSelector((state: RootState) => state.theme)

  const fontOption = FONT_OPTIONS.find((f) => f.value === theme.fontFamily)
  const fontCss = fontOption?.css ?? 'system-ui, sans-serif'
  const { accentColor, headerBg, density, photoShape, sectionOrder, pdfBg } = theme
  const hidden = new Set(data.hiddenSections)
  const gap = DENSITY_GAP[density] ?? 18
  const pad = DENSITY_PAD[density] ?? '26px 36px'

  const personal = data.personal
  const contacts = [
    { key: 'email',     icon: Mail,  value: personal.email },
    { key: 'phone',     icon: Phone, value: personal.phone },
    { key: 'location',  icon: MapPin, value: personal.location },
    { key: 'linkedin',  icon: Link,  value: personal.linkedin },
    { key: 'github',    icon: Link,  value: personal.github },
    { key: 'portfolio', icon: Globe, value: personal.portfolio },
  ].filter((c) => c.value)

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

  const photoRadius = photoShape === 'circle' ? '50%' : photoShape === 'square' ? '8px' : '0'

  const dot = { marginTop: 4, width: 3, height: 3, borderRadius: '50%', backgroundColor: accentColor, flexShrink: 0 }

  const sectionMap: Record<string, React.ReactNode> = {
    summary: !hidden.has('summary') && personal.summary ? (
      <div key="summary">
        <SectionHead accent={accentColor}>Profile</SectionHead>
        <p style={{ fontSize: 10.5, color: '#374151', lineHeight: 1.65 }}>{personal.summary}</p>
      </div>
    ) : null,

    experience: !hidden.has('experience') && data.experience.filter((e) => e.company || e.position).length > 0 ? (
      <div key="experience">
        <SectionHead accent={accentColor}>Work Experience</SectionHead>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {data.experience.filter((e) => e.company || e.position).map((exp) => (
            <div key={exp.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#111827' }}>{exp.position}</p>
                <p style={{ fontSize: 9.5, color: '#6b7280', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  {formatDateRange(exp.startDate, exp.endDate, exp.currentlyWorking)}
                </p>
              </div>
              <p style={{ fontSize: 10, color: accentColor, fontWeight: 600, marginTop: 1 }}>
                {exp.company}{exp.location && <span style={{ fontWeight: 400, color: '#6b7280' }}> · {exp.location}</span>}
              </p>
              {exp.bullets.some(Boolean) && (
                <ul style={{ marginTop: 4, listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {exp.bullets.filter(Boolean).map((b) => (
                    <li key={b} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                      <span style={dot} />
                      <span style={{ fontSize: 10, color: '#374151', lineHeight: 1.55 }}>{b}</span>
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
            <div key={edu.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
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
            </div>
          ))}
        </div>
      </div>
    ) : null,

    projects: !hidden.has('projects') && data.projects.filter((p) => p.title).length > 0 ? (
      <div key="projects">
        <SectionHead accent={accentColor}>Projects</SectionHead>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.projects.filter((p) => p.title).map((project) => (
            <div key={project.id}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#111827' }}>{project.title}</p>
              {project.techStack && (
                <p style={{ fontSize: 9.5, color: '#7c3aed', fontWeight: 600, marginTop: 1 }}>{project.techStack}</p>
              )}
              {project.bullets.some(Boolean) && (
                <ul style={{ marginTop: 3, listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {project.bullets.filter(Boolean).map((b) => (
                    <li key={b} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                      <span style={dot} />
                      <span style={{ fontSize: 10, color: '#374151', lineHeight: 1.55 }}>{b}</span>
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px' }}>
          {data.skills.filter((s) => s.skills.length > 0).map((cat) => (
            <div key={cat.id} style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
              {cat.category && (
                <span style={{ fontSize: 9.5, fontWeight: 700, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {cat.category}:
                </span>
              )}
              <span style={{ fontSize: 9.5, color: '#374151' }}>{cat.skills.join(' · ')}</span>
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
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ fontSize: 10.5, fontWeight: 600, color: '#111827' }}>
                {cert.title}
                {cert.issuer && <span style={{ fontWeight: 400, color: accentColor }}> · {cert.issuer}</span>}
              </p>
              {cert.date && <p style={{ fontSize: 9.5, color: '#6b7280' }}>{formatSingleDate(cert.date)}</p>}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    languages: !hidden.has('languages') && data.languages.filter((l) => l.name).length > 0 ? (
      <div key="languages">
        <SectionHead accent={accentColor}>Languages</SectionHead>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px' }}>
          {data.languages.filter((l) => l.name).map((lang) => (
            <span key={lang.id} style={{ fontSize: 10.5, color: '#374151' }}>
              <span style={{ fontWeight: 600 }}>{lang.name}</span>
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
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 10.5, fontWeight: 700, color: '#111827' }}>{award.title}</p>
                {award.date && <p style={{ fontSize: 9.5, color: '#6b7280' }}>{formatSingleDate(award.date)}</p>}
              </div>
              {award.description && (
                <p style={{ fontSize: 10, color: '#374151', lineHeight: 1.55, marginTop: 2 }}>{award.description}</p>
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
            <div key={item.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#111827' }}>{item.organization}</p>
                <p style={{ fontSize: 9.5, color: '#6b7280', flexShrink: 0 }}>
                  {formatDateRange(item.startDate, item.endDate, item.currentlyVolunteering)}
                </p>
              </div>
              {item.role && (
                <p style={{ fontSize: 10, color: accentColor, fontWeight: 600, marginTop: 1 }}>{item.role}</p>
              )}
              {item.description && (
                <p style={{ fontSize: 10, color: '#374151', lineHeight: 1.55, marginTop: 3 }}>{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    interests: !hidden.has('interests') && data.interests.filter(Boolean).length > 0 ? (
      <div key="interests">
        <SectionHead accent={accentColor}>Interests & Hobbies</SectionHead>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 6px' }}>
          {data.interests.filter(Boolean).map((interest) => (
            <span key={interest} style={{ fontSize: 9.5, color: '#374151', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 99, padding: '2px 8px' }}>
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
      {/* Header */}
      <div style={{ backgroundColor: headerBg, padding: '28px 36px 22px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
          {personal.photo && photoShape !== 'none' && (
            <img src={personal.photo} alt={personal.fullName} style={{ width: 72, height: 72, borderRadius: photoRadius, objectFit: 'cover', border: '2px solid rgba(255,255,255,0.3)', flexShrink: 0 }} />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
              <div>
                {personal.fullName && <h1 style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.01em' }}>{personal.fullName}</h1>}
                {personal.jobTitle && <p style={{ fontSize: 12, color: '#93c5fd', marginTop: 3, fontWeight: 500 }}>{personal.jobTitle}</p>}
              </div>
              {contacts.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end' }}>
                  {contacts.map(({ key, icon: Icon, value }) => (
                    <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9.5, color: '#bfdbfe' }}>
                      <Icon size={9} style={{ flexShrink: 0 }} />
                      <span>{value}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body — sections in order */}
      <div style={{ padding: pad, display: 'flex', flexDirection: 'column', gap }}>
        {orderedKeys.map((key) => sectionMap[key])}

        {/* Custom sections always at end */}
        {data.customSections.filter((s) => !hidden.has(s.id)).map((section) => (
          <div key={section.id}>
            <SectionHead accent={accentColor}>{section.title}</SectionHead>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {section.items.map((item) => (
                <div key={item.id}>
                  {item.subtitle && <p style={{ fontSize: 10.5, fontWeight: 700, color: '#111827' }}>{item.subtitle}</p>}
                  {item.description && <p style={{ fontSize: 10, color: '#374151', lineHeight: 1.55, marginTop: 2 }}>{item.description}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
