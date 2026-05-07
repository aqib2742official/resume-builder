import type { ResumeData } from '@/types/resume'

const STORAGE_KEY = 'resume-builder-saved-v1'
const MAX_VERSIONS = 10

export interface ResumeVersion {
  versionId: string
  label: string
  data: ResumeData
  savedAt: string
}

export interface SavedResume {
  id: string
  name: string
  data: ResumeData
  versions: ResumeVersion[]
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
  const now = new Date().toISOString()
  const resume: SavedResume = {
    id: crypto.randomUUID(),
    name: name.trim() || 'My Resume',
    data,
    versions: [{ versionId: crypto.randomUUID(), label: 'v1', data, savedAt: now }],
    savedAt: now,
  }
  resumes.push(resume)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes))
  return resume
}

export function addVersion(id: string, data: ResumeData, label?: string): void {
  const resumes = getSavedResumes().map((r) => {
    if (r.id !== id) return r
    const versions = r.versions ?? []
    const nextLabel = label ?? `v${versions.length + 1}`
    const newVersion: ResumeVersion = { versionId: crypto.randomUUID(), label: nextLabel, data, savedAt: new Date().toISOString() }
    const trimmed = [...versions, newVersion].slice(-MAX_VERSIONS)
    return { ...r, versions: trimmed, data, savedAt: new Date().toISOString() }
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes))
}

export function restoreVersion(resumeId: string, versionId: string): ResumeData | null {
  const resume = getSavedResumes().find((r) => r.id === resumeId)
  const version = resume?.versions?.find((v) => v.versionId === versionId)
  if (!version) return null
  updateResume(resumeId, version.data)
  return version.data
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
  const now = new Date().toISOString()
  const copy: SavedResume = {
    id: crypto.randomUUID(),
    name: `${source.name} (copy)`,
    data: source.data,
    versions: [{ versionId: crypto.randomUUID(), label: 'v1', data: source.data, savedAt: now }],
    savedAt: now,
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
