'use client'

import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

interface SectionHeadingProps {
  children: React.ReactNode
  accentColor?: string
}

export function SectionHeading({ children, accentColor = '#1e3a5f' }: Readonly<SectionHeadingProps>) {
  const headingStyle = useSelector((state: RootState) => state.theme.headingStyle)

  if (headingStyle === 'leftbar') {
    return (
      <div style={{ marginBottom: 7, paddingLeft: 8, borderLeft: `3px solid ${accentColor}` }}>
        <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: accentColor }}>
          {children}
        </h2>
      </div>
    )
  }

  if (headingStyle === 'plain') {
    return (
      <div style={{ marginBottom: 7 }}>
        <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: accentColor }}>
          {children}
        </h2>
      </div>
    )
  }

  if (headingStyle === 'filled') {
    return (
      <div style={{ marginBottom: 7 }}>
        <h2 style={{
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#ffffff',
          backgroundColor: accentColor,
          display: 'inline-block',
          padding: '2px 8px 3px',
          borderRadius: 3,
        }}>
          {children}
        </h2>
      </div>
    )
  }

  // default: 'underline'
  return (
    <div style={{ marginBottom: 6, paddingBottom: 4, borderBottom: `1.5px solid ${accentColor}` }}>
      <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: accentColor }}>
        {children}
      </h2>
    </div>
  )
}
