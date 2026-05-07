export interface PersonalInfo {
  fullName: string
  jobTitle: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  portfolio: string
  photo: string
  summary: string
}

export interface WorkExperience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  currentlyWorking: boolean
  bullets: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  fieldOfStudy: string
  location: string
  startDate: string
  endDate: string
  description: string
}

export interface Project {
  id: string
  title: string
  techStack: string
  liveLink: string
  githubLink: string
  bullets: string[]
}

export interface SkillCategory {
  id: string
  category: string
  skills: string[]
}

export interface Certification {
  id: string
  title: string
  issuer: string
  date: string
  credentialLink: string
}

export type LanguageProficiency = 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic'

export interface Language {
  id: string
  name: string
  proficiency: LanguageProficiency
}

export interface Award {
  id: string
  title: string
  date: string
  description: string
}

export interface VolunteerWork {
  id: string
  organization: string
  role: string
  location: string
  startDate: string
  endDate: string
  currentlyVolunteering: boolean
  description: string
}

export interface CustomSectionItem {
  id: string
  subtitle: string
  description: string
}

export interface CustomSection {
  id: string
  title: string
  items: CustomSectionItem[]
}

export interface ResumeData {
  personal: PersonalInfo
  experience: WorkExperience[]
  education: Education[]
  projects: Project[]
  skills: SkillCategory[]
  certifications: Certification[]
  languages: Language[]
  awards: Award[]
  volunteer: VolunteerWork[]
  interests: string[]
  customSections: CustomSection[]
  hiddenSections: string[]
}
