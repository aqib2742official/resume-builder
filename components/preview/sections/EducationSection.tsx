import type { Education } from '@/types/resume'
import { formatDateRange } from '@/lib/dateUtils'
import { SectionHeading } from './SectionHeading'

interface EducationSectionProps {
  education: Education[]
  accentColor?: string
}

export function EducationSection({ education, accentColor = '#1e3a5f' }: Readonly<EducationSectionProps>) {
  const visible = education.filter((e) => e.institution || e.degree)
  if (visible.length === 0) return null

  return (
    <div>
      <SectionHeading accentColor={accentColor}>Education</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {visible.map((edu) => (
          <div key={edu.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
                {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ')}
              </p>
              <p style={{ fontSize: 9.5, color: '#6b7280', flexShrink: 0, whiteSpace: 'nowrap' }}>
                {formatDateRange(edu.startDate, edu.endDate, false)}
              </p>
            </div>
            <p style={{ fontSize: 10, color: accentColor, fontWeight: 600, marginTop: 1 }}>
              {edu.institution}
              {edu.location && (
                <span style={{ fontWeight: 400, color: '#6b7280' }}> · {edu.location}</span>
              )}
            </p>
            {edu.description && (
              <p style={{ fontSize: 10, color: '#374151', lineHeight: 1.55, marginTop: 3 }}>
                {edu.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
