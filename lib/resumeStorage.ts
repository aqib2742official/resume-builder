import type { ResumeData } from '@/types/resume'

const STORAGE_KEY = 'resume-builder-saved-v1'

export interface SavedResume {
  id: string
  name: string
  data: ResumeData
  savedAt: string
}

export function getSavedResumes(): SavedResume[] {
  if (globalThis.window === undefined) return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function saveResume(name: string, data: ResumeData): SavedResume {
  const resumes = getSavedResumes()
  const resume: SavedResume = {
    id: crypto.randomUUID(),
    name: name.trim() || 'My Resume',
    data,
    savedAt: new Date().toISOString(),
  }
  resumes.push(resume)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes))
  return resume
}

export function deleteResume(id: string): void {
  const resumes = getSavedResumes().filter((r) => r.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes))
}

export function renameResume(id: string, name: string): void {
  const resumes = getSavedResumes().map((r) =>
    r.id === id ? { ...r, name: name.trim() || r.name } : r
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes))
}

export function duplicateResume(id: string): SavedResume | null {
  const resumes = getSavedResumes()
  const source = resumes.find((r) => r.id === id)
  if (!source) return null
  const copy: SavedResume = {
    id: crypto.randomUUID(),
    name: `${source.name} (copy)`,
    data: source.data,
    savedAt: new Date().toISOString(),
  }
  resumes.push(copy)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes))
  return copy
}

export function updateResume(id: string, data: ResumeData): void {
  const resumes = getSavedResumes().map((r) =>
    r.id === id ? { ...r, data, savedAt: new Date().toISOString() } : r
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes))
}
