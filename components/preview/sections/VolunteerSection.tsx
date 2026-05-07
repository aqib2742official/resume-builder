import type { VolunteerWork } from '@/types/resume'
import { formatDateRange } from '@/lib/dateUtils'
import { SectionHeading } from './SectionHeading'

interface VolunteerSectionProps {
  volunteer: VolunteerWork[]
  accentColor?: string
}

export function VolunteerSection({ volunteer, accentColor }: Readonly<VolunteerSectionProps>) {
  const visible = volunteer.filter((v) => v.organization || v.role)
  if (visible.length === 0) return null

  return (
    <div>
      <SectionHeading accentColor={accentColor}>Volunteer Work</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {visible.map((item) => (
          <div key={item.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 1 }}>
              <div>
                <p style={{ fontSize: 10.5, fontWeight: 700, color: '#111827' }}>{item.organization}</p>
                {item.role && (
                  <p style={{ fontSize: 10, color: accentColor ?? '#1e3a5f', fontWeight: 500 }}>{item.role}</p>
                )}
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: 9, color: '#6b7280' }}>
                  {formatDateRange(item.startDate, item.endDate, item.currentlyVolunteering)}
                </p>
                {item.location && (
                  <p style={{ fontSize: 9, color: '#9ca3af' }}>{item.location}</p>
                )}
              </div>
            </div>
            {item.description && (
              <p style={{ fontSize: 10, color: '#374151', lineHeight: 1.55, marginTop: 3 }}>{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
