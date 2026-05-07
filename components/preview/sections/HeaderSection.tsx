import { Mail, Phone, MapPin, Link, Globe } from 'lucide-react'
import type { PersonalInfo } from '@/types/resume'
import type { PhotoShape, NameSize } from '@/store/themeSlice'

interface HeaderSectionProps {
  personal: PersonalInfo
  summary?: string
  accentColor?: string
  photoShape?: PhotoShape
  nameSize?: NameSize
}

const NAME_FONT_SIZE: Record<NameSize, number> = {
  normal: 26,
  large:  31,
  xlarge: 37,
}

export function HeaderSection({
  personal,
  summary,
  accentColor = '#1e3a5f',
  photoShape = 'circle',
  nameSize = 'normal',
}: Readonly<HeaderSectionProps>) {
  const contacts = [
    { key: 'email',     icon: Mail,   value: personal.email },
    { key: 'phone',     icon: Phone,  value: personal.phone },
    { key: 'location',  icon: MapPin, value: personal.location },
    { key: 'linkedin',  icon: Link,   value: personal.linkedin },
    { key: 'github',    icon: Link,   value: personal.github },
    { key: 'portfolio', icon: Globe,  value: personal.portfolio },
  ].filter((c) => c.value)

  if (!personal.fullName && !personal.jobTitle && contacts.length === 0) return null

  const showPhoto  = Boolean(personal.photo) && photoShape !== 'none'
  const isCircle   = photoShape === 'circle'
  const nameFontSz = NAME_FONT_SIZE[nameSize] ?? 26

  return (
    <div style={{ borderBottom: '1px solid #e5e7eb' }}>
      {/* Main info row */}
      <div style={{ display: 'flex', alignItems: 'stretch' }}>

        {/* Photo */}
        {showPhoto && (
          isCircle ? (
            /* Circle — fixed square so border-radius 50% produces a true circle */
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', padding: '18px 4px 18px 22px' }}>
              <img
                src={personal.photo}
                alt={personal.fullName}
                style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          ) : (
            /* Square / rounded-square — stretch to full row height */
            <div style={{ flexShrink: 0, width: 104, alignSelf: 'stretch', overflow: 'hidden' }}>
              <img
                src={personal.photo}
                alt={personal.fullName}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '10px 0 0 10px' }}
              />
            </div>
          )
        )}

        {/* Text block */}
        <div style={{ flex: 1, padding: '20px 28px 16px', minWidth: 0 }}>
          {personal.fullName && (
            <h1 style={{
              fontSize: nameFontSz,
              fontWeight: 700,
              color: '#111827',
              lineHeight: 1.15,
              letterSpacing: '-0.015em',
              marginBottom: 3,
            }}>
              {personal.fullName}
            </h1>
          )}

          {personal.jobTitle && (
            <p style={{
              fontSize: 12,
              fontWeight: 500,
              color: accentColor,
              marginBottom: summary ? 9 : 0,
              letterSpacing: '0.01em',
            }}>
              {personal.jobTitle}
            </p>
          )}

          {summary && (
            <p style={{ fontSize: 10, color: '#374151', lineHeight: 1.65, maxWidth: 560 }}>
              {summary}
            </p>
          )}
        </div>
      </div>

      {/* Contact bar */}
      {contacts.length > 0 && (
        <div style={{
          backgroundColor: '#f9fafb',
          borderTop: '1px solid #e5e7eb',
          padding: '7px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '4px 24px',
        }}>
          {contacts.map(({ key, icon: Icon, value }) => (
            <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9.5, color: '#4b5563' }}>
              <Icon size={10} style={{ flexShrink: 0, color: accentColor }} />
              <span style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {value}
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
