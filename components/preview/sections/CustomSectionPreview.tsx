import type { CustomSection } from '@/types/resume'
import { SectionHeading } from './SectionHeading'

interface CustomSectionPreviewProps {
  section: CustomSection
  accentColor?: string
}

export function CustomSectionPreview({ section, accentColor }: Readonly<CustomSectionPreviewProps>) {
  const visible = section.items.filter((i) => i.subtitle || i.description)
  if (visible.length === 0) return null

  return (
    <div>
      <SectionHeading accentColor={accentColor}>{section.title || 'Custom Section'}</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {visible.map((item) => (
          <div key={item.id}>
            {item.subtitle && (
              <p style={{ fontSize: 10.5, fontWeight: 700, color: '#111827' }}>{item.subtitle}</p>
            )}
            {item.description && (
              <p style={{ fontSize: 10, color: '#374151', lineHeight: 1.55, marginTop: 2 }}>{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
