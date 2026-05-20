import type { Award } from '@/types/resume'
import { formatSingleDate } from '@/lib/dateUtils'
import { SectionHeading } from './SectionHeading'

interface AwardsSectionProps {
  awards: Award[]
  accentColor?: string
}

export function AwardsSection({ awards, accentColor }: Readonly<AwardsSectionProps>) {
  const visible = awards.filter((a) => a.title)
  if (visible.length === 0) return null

  return (
    <div>
      <SectionHeading accentColor={accentColor}>Awards & Achievements</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {visible.map((award) => (
          <div key={award.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: '#111827' }}>{award.title}</p>
              {award.date && (
                <p style={{ fontSize: 10, color: '#6b7280', flexShrink: 0 }}>{formatSingleDate(award.date)}</p>
              )}
            </div>
            {award.description && (
              <p style={{ fontSize: 11, color: '#374151', lineHeight: 1.55, marginTop: 2 }}>{award.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
