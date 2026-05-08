import { SectionHeading } from './SectionHeading'

interface SummarySectionProps {
  summary: string
  accentColor?: string
}

export function SummarySection({ summary, accentColor }: Readonly<SummarySectionProps>) {
  if (!summary) return null

  return (
    <div>
      <SectionHeading accentColor={accentColor}>Profile</SectionHeading>
      <p style={{ fontSize: 11.5, color: '#374151', lineHeight: 1.65, marginTop: 6 }}>
        {summary}
      </p>
    </div>
  )
}
