import type { ResumeData } from '@/types/resume'

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has',
  'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall',
  'can', 'this', 'that', 'these', 'those', 'i', 'we', 'you', 'he', 'she', 'it', 'they',
  'my', 'your', 'his', 'her', 'our', 'their', 'what', 'which', 'who', 'whom', 'how',
  'when', 'where', 'why', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
  'some', 'such', 'no', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  'just', 'also', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'between', 'out', 'off', 'over', 'under', 'again', 'then', 'once', 'there',
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^[-.']+|[-.']+$/g, ''))
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
}

function extractUniqueKeywords(text: string): string[] {
  return [...new Set(tokenize(text))]
}

function getResumeText(data: ResumeData): string {
  const parts: string[] = [
    data.personal.fullName,
    data.personal.jobTitle,
    data.personal.summary,
    ...data.experience.flatMap((e) => [e.company, e.position, e.location, ...e.bullets]),
    ...data.education.flatMap((e) => [e.institution, e.degree, e.fieldOfStudy, e.description]),
    ...data.projects.flatMap((p) => [p.title, p.techStack, ...p.bullets]),
    ...data.skills.flatMap((s) => [s.category, ...s.skills]),
    ...data.certifications.flatMap((c) => [c.title, c.issuer]),
    ...data.languages.map((l) => l.name),
    ...data.awards.flatMap((a) => [a.title, a.description]),
  ]
  return parts.join(' ')
}

export interface ATSResult {
  score: number
  matchedKeywords: string[]
  missingKeywords: string[]
  totalJDKeywords: number
}

export function analyzeATS(data: ResumeData, jobDescription: string): ATSResult {
  const jdKeywords = extractUniqueKeywords(jobDescription)
  const resumeText = getResumeText(data)
  const resumeKeywords = new Set(extractUniqueKeywords(resumeText))

  const matchedKeywords = jdKeywords.filter((kw) => resumeKeywords.has(kw))
  const missingKeywords = jdKeywords
    .filter((kw) => !resumeKeywords.has(kw))
    .slice(0, 30)  // limit to top 30 missing

  const score = jdKeywords.length > 0
    ? Math.round((matchedKeywords.length / jdKeywords.length) * 100)
    : 0

  return {
    score,
    matchedKeywords: matchedKeywords.slice(0, 30),
    missingKeywords,
    totalJDKeywords: jdKeywords.length,
  }
}
