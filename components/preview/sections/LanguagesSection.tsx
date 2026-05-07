import type { Language, LanguageProficiency } from '@/types/resume'
import { SectionHeading } from './SectionHeading'

interface LanguagesSectionProps {
  languages: Language[]
  accentColor?: string
}

const PROFICIENCY_DOTS: Record<LanguageProficiency, number> = {
  Native: 5,
  Fluent: 4,
  Advanced: 4,
  Intermediate: 3,
  Basic: 2,
}

export function LanguagesSection({ languages, accentColor = '#1e3a5f' }: Readonly<LanguagesSectionProps>) {
  const visible = languages.filter((l) => l.name)
  if (visible.length === 0) return null

  return (
    <div>
      <SectionHeading accentColor={accentColor}>Languages</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {visible.map((lang) => {
          const filled = PROFICIENCY_DOTS[lang.proficiency] ?? 3
          return (
            <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: 10.5, color: '#111827', fontWeight: 600 }}>{lang.name}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{ fontSize: 9, color: '#6b7280', marginRight: 4 }}>{lang.proficiency}</span>
                {[1, 2, 3, 4, 5].map((dot) => (
                  <span
                    key={dot}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      backgroundColor: dot <= filled ? accentColor : '#e5e7eb',
                      display: 'inline-block',
                    }}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
