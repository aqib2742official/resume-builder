import type { ResumeData } from '@/types/resume'

export const defaultResume: ResumeData = {
  personal: {
    fullName: '', jobTitle: '', email: '', phone: '',
    location: '', linkedin: '', github: '', portfolio: '', photo: '', summary: '',
  },
  experience: [],
  education: [],
  projects: [],
  skills: [],
  certifications: [],
  languages: [],
  awards: [],
  volunteer: [],
  interests: [],
  customSections: [],
  hiddenSections: [],
}
