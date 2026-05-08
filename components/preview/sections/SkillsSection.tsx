import type { SkillCategory } from '@/types/resume'
import { SectionHeading } from './SectionHeading'

interface SkillsSectionProps {
  skills: SkillCategory[]
  accentColor?: string
}

export function SkillsSection({ skills, accentColor = '#1e3a5f' }: Readonly<SkillsSectionProps>) {
  const visible = skills.filter((s) => s.skills.length > 0)
  if (visible.length === 0) return null

  return (
    <div>
      <SectionHeading accentColor={accentColor}>Skills</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {visible.map((cat) => (
          <div key={cat.id} className="page-break-avoid">
            {cat.category && (
              <p style={{ fontSize: 10.5, fontWeight: 700, color: accentColor, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {cat.category}
              </p>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 5px' }}>
              {cat.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    display: 'inline-block',
                    fontSize: 10.5,
                    color: '#1e40af',
                    backgroundColor: '#eff6ff',
                    border: '0.5px solid #bfdbfe',
                    borderRadius: 20,
                    padding: '2px 7px',
                    fontWeight: 500,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
