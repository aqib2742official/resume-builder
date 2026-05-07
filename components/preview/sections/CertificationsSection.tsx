import type { Certification } from '@/types/resume'
import { formatSingleDate } from '@/lib/dateUtils'
import { SectionHeading } from './SectionHeading'

interface CertificationsSectionProps {
  certifications: Certification[]
  accentColor?: string
}

export function CertificationsSection({ certifications, accentColor = '#1e3a5f' }: Readonly<CertificationsSectionProps>) {
  const visible = certifications.filter((c) => c.title)
  if (visible.length === 0) return null

  return (
    <div>
      <SectionHeading accentColor={accentColor}>Certifications</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {visible.map((cert) => (
          <div key={cert.id}>
            <p style={{ fontSize: 10.5, fontWeight: 700, color: '#111827' }}>{cert.title}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
              <p style={{ fontSize: 9.5, color: accentColor, fontWeight: 600 }}>{cert.issuer}</p>
              {cert.date && (
                <p style={{ fontSize: 9, color: '#6b7280' }}>{formatSingleDate(cert.date)}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
