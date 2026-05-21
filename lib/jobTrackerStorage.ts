export type JobStatus = 'wishlist' | 'applied' | 'phone-screen' | 'interview' | 'offer' | 'rejected'
export type InterviewType = 'phone' | 'video' | 'onsite' | ''

export interface JobNote {
  id: string
  text: string
  createdAt: string
}

export interface JobApplication {
  id: string
  company: string
  role: string
  location: string
  appliedDate: string
  status: JobStatus
  resumeId?: string
  coverLetterId?: string
  notes: string
  notesHistory: JobNote[]
  url: string
  deadline: string
  interviewDate: string
  interviewType: InterviewType
}

const STORAGE_KEY = 'resume-builder-jobs-v1'

export function getJobs(): JobApplication[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch { return [] }
}

export function addJob(data: Omit<JobApplication, 'id' | 'notesHistory' | 'deadline' | 'interviewDate' | 'interviewType'> & Partial<Pick<JobApplication, 'notesHistory' | 'deadline' | 'interviewDate' | 'interviewType'>>): JobApplication {
  const jobs = getJobs()
  const job: JobApplication = {
    notesHistory: [],
    deadline: '',
    interviewDate: '',
    interviewType: '',
    ...data,
    id: crypto.randomUUID(),
  }
  jobs.push(job)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
  return job
}

export function updateJob(id: string, data: Partial<Omit<JobApplication, 'id'>>): void {
  const jobs = getJobs().map((j) => j.id === id ? { ...j, ...data } : j)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
}

export function deleteJob(id: string): void {
  const jobs = getJobs().filter((j) => j.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
}

export const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bg: string; border: string }> = {
  wishlist:     { label: 'Wishlist',      color: 'text-gray-600',   bg: 'bg-gray-50',   border: 'border-gray-200' },
  applied:      { label: 'Applied',       color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  'phone-screen': { label: 'Phone Screen', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },
  interview:    { label: 'Interview',     color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  offer:        { label: 'Offer',         color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200' },
  rejected:     { label: 'Rejected',      color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200' },
}

export const ALL_STATUSES: JobStatus[] = ['wishlist', 'applied', 'phone-screen', 'interview', 'offer', 'rejected']
