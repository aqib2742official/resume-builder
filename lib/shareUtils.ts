import type { ResumeData } from '@/types/resume'

export function encodeResume(data: ResumeData): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(data))))
}

export function decodeResume(encoded: string): ResumeData | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(encoded)))) as ResumeData
  } catch {
    return null
  }
}

export function buildShareUrl(data: ResumeData): string {
  const base = typeof window !== 'undefined' ? `${window.location.origin}/editor` : '/editor'
  return `${base}?resume=${encodeResume(data)}`
}

export async function copyShareUrl(data: ResumeData): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(buildShareUrl(data))
    return true
  } catch {
    return false
  }
}
