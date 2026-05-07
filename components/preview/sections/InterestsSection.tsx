import { SectionHeading } from './SectionHeading'

interface InterestsSectionProps {
  interests: string[]
  accentColor?: string
}

export function InterestsSection({ interests, accentColor }: Readonly<InterestsSectionProps>) {
  const visible = interests.filter(Boolean)
  if (visible.length === 0) return null

  return (
    <div>
      <SectionHeading accentColor={accentColor}>Interests & Hobbies</SectionHeading>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 6px' }}>
        {visible.map((interest) => (
          <span
            key={interest}
            style={{
              fontSize: 9.5,
              color: '#374151',
              backgroundColor: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: 99,
              padding: '2px 8px',
              whiteSpace: 'nowrap',
            }}
          >
            {interest}
          </span>
        ))}
      </div>
    </div>
  )
}
