export interface CoverLetter {
  id: string
  name: string
  linkedResumeId?: string
  recipientName: string
  companyName: string
  jobTitle: string
  body: string
  savedAt: string
}

const STORAGE_KEY = 'resume-builder-cover-letters-v1'

export function getCoverLetters(): CoverLetter[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch { return [] }
}

export function saveCoverLetter(data: Omit<CoverLetter, 'id' | 'savedAt'>): CoverLetter {
  const letters = getCoverLetters()
  const letter: CoverLetter = { ...data, id: crypto.randomUUID(), savedAt: new Date().toISOString() }
  letters.push(letter)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(letters))
  return letter
}

export function updateCoverLetter(id: string, data: Partial<Omit<CoverLetter, 'id'>>): void {
  const letters = getCoverLetters().map((l) =>
    l.id === id ? { ...l, ...data, savedAt: new Date().toISOString() } : l
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(letters))
}

export function deleteCoverLetter(id: string): void {
  const letters = getCoverLetters().filter((l) => l.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(letters))
}
