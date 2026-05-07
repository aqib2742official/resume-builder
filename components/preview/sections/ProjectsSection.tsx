import type { Project } from '@/types/resume'
import { SectionHeading } from './SectionHeading'

interface ProjectsSectionProps {
  projects: Project[]
  accentColor?: string
}

export function ProjectsSection({ projects, accentColor = '#1e3a5f' }: Readonly<ProjectsSectionProps>) {
  const visible = projects.filter((p) => p.title)
  if (visible.length === 0) return null

  return (
    <div>
      <SectionHeading accentColor={accentColor}>Projects</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {visible.map((project) => (
          <div key={project.id}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#111827' }}>{project.title}</p>
              {(project.liveLink || project.githubLink) && (
                <span style={{ fontSize: 9, color: accentColor }}>
                  {project.liveLink || project.githubLink}
                </span>
              )}
            </div>
            {project.techStack && (
              <p style={{ fontSize: 9.5, color: '#7c3aed', fontWeight: 600, marginTop: 1 }}>
                {project.techStack}
              </p>
            )}
            {project.bullets.some(Boolean) && (
              <ul style={{ marginTop: 3, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {project.bullets.filter(Boolean).map((bullet) => (
                  <li key={bullet} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                    <span style={{ marginTop: 4, width: 3, height: 3, borderRadius: '50%', backgroundColor: accentColor, flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: '#374151', lineHeight: 1.55 }}>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
