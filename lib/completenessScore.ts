import type { ResumeData } from '@/types/resume'

export interface SectionScore {
  key: string
  label: string
  score: number
  weight: number
  tip: string
}

export interface CompletenessResult {
  total: number
  sections: SectionScore[]
}

function scorePersonal(data: ResumeData): number {
  const p = data.personal
  const fields = [p.fullName, p.jobTitle, p.email, p.phone, p.location, p.summary]
  const filled = fields.filter(Boolean).length
  return Math.round((filled / fields.length) * 100)
}

function scoreExperience(data: ResumeData): number {
  if (data.experience.length === 0) return 0
  const complete = data.experience.filter(
    (e) => e.company && e.position && e.startDate && e.bullets.filter(Boolean).length > 0
  )
  return Math.min(100, Math.round((complete.length / Math.max(data.experience.length, 1)) * 100))
}

function scoreProjects(data: ResumeData): number {
  if (data.projects.length === 0) return 0
  const complete = data.projects.filter((p) => p.title && p.techStack && p.bullets.filter(Boolean).length > 0)
  return Math.min(100, Math.round((complete.length / Math.max(data.projects.length, 1)) * 100))
}

function scoreSkills(data: ResumeData): number {
  const totalSkills = data.skills.reduce((sum, cat) => sum + cat.skills.length, 0)
  if (totalSkills === 0) return 0
  if (totalSkills >= 10) return 100
  return Math.round((totalSkills / 10) * 100)
}

export function calculateCompleteness(data: ResumeData): CompletenessResult {
  const sections: SectionScore[] = [
    {
      key: 'personal',
      label: 'Personal Info',
      score: scorePersonal(data),
      weight: 25,
      tip: 'Fill in name, title, email, phone, location, and summary',
    },
    {
      key: 'experience',
      label: 'Experience',
      score: scoreExperience(data),
      weight: 25,
      tip: 'Add work experience with company, role, dates, and bullet points',
    },
    {
      key: 'skills',
      label: 'Skills',
      score: scoreSkills(data),
      weight: 20,
      tip: 'Add at least 10 skills across categories',
    },
    {
      key: 'education',
      label: 'Education',
      score: data.education.length > 0 ? 100 : 0,
      weight: 15,
      tip: 'Add your education history',
    },
    {
      key: 'projects',
      label: 'Projects',
      score: scoreProjects(data),
      weight: 15,
      tip: 'Add projects with title, tech stack, and description',
    },
  ]

  const total = sections.reduce((sum, s) => sum + (s.score * s.weight) / 100, 0)

  return { total: Math.round(total), sections }
}
