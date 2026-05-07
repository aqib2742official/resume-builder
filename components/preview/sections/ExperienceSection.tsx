import type { WorkExperience } from '@/types/resume'
import { formatDateRange } from '@/lib/dateUtils'
import { SectionHeading } from './SectionHeading'

interface ExperienceSectionProps {
  experience: WorkExperience[]
  accentColor?: string
}

export function ExperienceSection({ experience, accentColor = '#1e3a5f' }: Readonly<ExperienceSectionProps>) {
  const visible = experience.filter((e) => e.company || e.position)
  if (visible.length === 0) return null

  return (
    <div>
      <SectionHeading accentColor={accentColor}>Work Experience</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {visible.map((exp) => (
          <div key={exp.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
                {exp.position}
              </p>
              <p style={{ fontSize: 9.5, color: '#6b7280', flexShrink: 0, lineHeight: 1.4, whiteSpace: 'nowrap' }}>
                {formatDateRange(exp.startDate, exp.endDate, exp.currentlyWorking)}
              </p>
            </div>
            <p style={{ fontSize: 10, color: accentColor, fontWeight: 600, marginTop: 1 }}>
              {exp.company}
              {exp.location && (
                <span style={{ fontWeight: 400, color: '#6b7280' }}> · {exp.location}</span>
              )}
            </p>
            {exp.bullets.some(Boolean) && (
              <ul style={{ marginTop: 4, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {exp.bullets.filter(Boolean).map((bullet) => (
                  <li key={bullet} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                    <span style={{ marginTop: 4, width: 3, height: 3, borderRadius: '50%', backgroundColor: accentColor, flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: '#374151', lineHeight: 1.55 }}>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
