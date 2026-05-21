import type { ResumeData } from '@/types/resume'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CategoryScore {
  key: string
  label: string
  description: string
  weight: number
  score: number      // 0–100 raw category score
  earned: number     // score × weight / 100
  status: 'excellent' | 'good' | 'weak' | 'poor'
  tips: string[]
}

export interface RedFlag {
  issue: string
  penalty: number
  severity: 'critical' | 'major' | 'minor'
}

export interface BulletAnalysis {
  total: number
  withMetrics: number
  withStrongVerbs: number
  withWeakVerbs: number
  metricsRate: number
  strongRate: number
  weakRate: number
}

export interface InternationalScore {
  rawScore: number
  totalPenalty: number
  finalScore: number
  categories: CategoryScore[]
  redFlags: RedFlag[]
  verdict: VerdictKey
  bulletAnalysis: BulletAnalysis
  strengths: string[]
  topImprovements: string[]
}

export type VerdictKey =
  | 'global-shortlist'
  | 'competitive'
  | 'local-only'
  | 'ats-risk'
  | 'rewrite-needed'

export const VERDICTS: Record<
  VerdictKey,
  { label: string; meaning: string; textColor: string; badgeBg: string; badgeBorder: string; scoreRange: string }
> = {
  'global-shortlist': {
    label: 'Global Shortlist Ready',
    meaning: 'Ready for international recruiter review at top-tier employers',
    scoreRange: '90–100',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800',
  },
  'competitive': {
    label: 'Competitive with Edits',
    meaning: 'Strong base — targeted improvements will make it globally competitive',
    scoreRange: '80–89',
    textColor: 'text-sky-700 dark:text-sky-400',
    badgeBg: 'bg-sky-50 dark:bg-sky-900/20',
    badgeBorder: 'border-sky-200 dark:border-sky-800',
  },
  'local-only': {
    label: 'Local Market Only',
    meaning: 'May work locally but lacks the signals needed for international shortlisting',
    scoreRange: '70–79',
    textColor: 'text-amber-700 dark:text-amber-400',
    badgeBg: 'bg-amber-50 dark:bg-amber-900/20',
    badgeBorder: 'border-amber-200 dark:border-amber-800',
  },
  'ats-risk': {
    label: 'ATS Risk',
    meaning: 'Structural or keyword gaps may block it before a human ever sees it',
    scoreRange: '60–69',
    textColor: 'text-orange-700 dark:text-orange-400',
    badgeBg: 'bg-orange-50 dark:bg-orange-900/20',
    badgeBorder: 'border-orange-200 dark:border-orange-800',
  },
  'rewrite-needed': {
    label: 'Major Rewrite Needed',
    meaning: 'Not competitive for serious international applications in current state',
    scoreRange: 'Below 60',
    textColor: 'text-red-700 dark:text-red-400',
    badgeBg: 'bg-red-50 dark:bg-red-900/20',
    badgeBorder: 'border-red-200 dark:border-red-800',
  },
}

// ── Detection Patterns ────────────────────────────────────────────────────────

const METRIC_RE = [
  /\d+\s*%/,
  /\$[\d,]+/,
  /£[\d,]+/,
  /€[\d,]+/,
  /\d+[xX]\b/,
  /\d+\s*(million|billion|thousand|k)\b/i,
  /\d+\s*(users|customers|clients|employees|engineers|people|team\s*members)\b/i,
  /\d+\s*(countries|markets|regions|cities|accounts)\b/i,
  /\b(increased|decreased|reduced|improved|grew|cut|saved|generated|earned|boosted)\b[^.]{0,40}\d+/i,
  /\d+\s*(hours|days|weeks|months)\s*(saved|reduced|faster|earlier)\b/i,
  /\d+[+]?\s*(features|projects|apps|services|integrations|deployments)\b/i,
]

const WEAK_VERB_RE = [
  /^responsible for\b/i,
  /^was responsible/i,
  /^helped\b/i,
  /^assisted\b/i,
  /^was involved\b/i,
  /^participated\b/i,
  /^worked on\b/i,
  /^tasked with\b/i,
  /duties (include|included)\b/i,
  /^supported\s+the\b/i,
  /^collaborated on\b/i,
]

const STRONG_VERBS = new Set([
  'achieved', 'architected', 'automated', 'built', 'coached', 'conceptualized',
  'created', 'delivered', 'deployed', 'designed', 'developed', 'directed', 'drove',
  'engineered', 'established', 'exceeded', 'executed', 'founded', 'grew', 'improved',
  'increased', 'initiated', 'launched', 'led', 'managed', 'mentored', 'migrated',
  'modernized', 'negotiated', 'optimized', 'oversaw', 'pioneered', 'produced',
  'reduced', 'refactored', 'resolved', 'restructured', 'scaled', 'secured', 'shipped',
  'spearheaded', 'streamlined', 'transformed', 'unified', 'upgraded',
])

// ── Helpers ───────────────────────────────────────────────────────────────────

function hasMetric(t: string) { return METRIC_RE.some((r) => r.test(t)) }
function hasWeakVerb(t: string) { return WEAK_VERB_RE.some((r) => r.test(t.trim())) }
function hasStrongVerb(t: string) {
  return STRONG_VERBS.has(t.trim().toLowerCase().split(/\s+/)[0])
}
function wordCount(text: string) { return text.trim().split(/\s+/).filter(Boolean).length }
function catStatus(s: number): CategoryScore['status'] {
  if (s >= 72) return 'excellent'
  if (s >= 50) return 'good'
  if (s >= 28) return 'weak'
  return 'poor'
}

// ── Bullet Analysis ───────────────────────────────────────────────────────────

function analyzeBullets(data: ResumeData): BulletAnalysis {
  const bullets = [
    ...data.experience.flatMap((e) => e.bullets.filter(Boolean)),
    ...data.projects.flatMap((p) => p.bullets.filter(Boolean)),
  ]
  const total = bullets.length
  if (total === 0) return { total: 0, withMetrics: 0, withStrongVerbs: 0, withWeakVerbs: 0, metricsRate: 0, strongRate: 0, weakRate: 0 }

  const withMetrics    = bullets.filter(hasMetric).length
  const withStrongVerbs = bullets.filter(hasStrongVerb).length
  const withWeakVerbs  = bullets.filter(hasWeakVerb).length

  return {
    total,
    withMetrics,
    withStrongVerbs,
    withWeakVerbs,
    metricsRate: Math.round((withMetrics / total) * 100),
    strongRate:  Math.round((withStrongVerbs / total) * 100),
    weakRate:    Math.round((withWeakVerbs / total) * 100),
  }
}

// ── Category Scorers (one per category) ─────────────────────────────────────

function cat1_RoleMarketFit(data: ResumeData): { score: number; tips: string[] } {
  const tips: string[] = []
  let s = 0

  if (data.personal.jobTitle) s += 30
  else tips.push('Add a clear, globally recognized job title to every version of your resume')

  const wc = wordCount(data.personal.summary ?? '')
  if (wc >= 60)      s += 35
  else if (wc >= 35) { s += 22; tips.push('Expand your summary to 60+ words — target your exact role, industry, and unique value') }
  else if (wc >= 15) { s += 10; tips.push('Summary is too short for international standards — aim for 60–100 words') }
  else               { tips.push('Missing professional summary — critical for global role positioning') }

  if (data.personal.linkedin) s += 20
  else tips.push('Add your LinkedIn URL — the #1 signal international recruiters check after the PDF')

  if (data.personal.location) s += 15
  else tips.push('Add city + country to your contact info for geographic targeting')

  return { score: Math.min(100, s), tips }
}

function cat2_RelevantExperience(data: ResumeData): { score: number; tips: string[] } {
  const tips: string[] = []
  const exp = data.experience

  if (exp.length === 0) return { score: 0, tips: ['Add at least 2–3 relevant work experiences with dates, role, and bullet points'] }

  let s = 0

  if      (exp.length >= 4) s += 25
  else if (exp.length >= 2) { s += 15; tips.push('Aim for 3–5 experience entries; fewer suggests limited career history') }
  else                      { s += 5;  tips.push('Only 1 experience entry — add more to show career depth') }

  const complete = exp.filter((e) => e.company && e.position && e.startDate && e.bullets.filter(Boolean).length >= 2)
  const rate = complete.length / exp.length
  if      (rate === 1)   s += 30
  else if (rate >= 0.7) { s += 18; tips.push('Some roles are missing company, title, dates, or bullets — fill all fields') }
  else                  { s += 8;  tips.push('Many experience entries are incomplete — each needs company, role, dates, and 3+ bullets') }

  const avgBullets = exp.reduce((sum, e) => sum + e.bullets.filter(Boolean).length, 0) / exp.length
  if      (avgBullets >= 4)  s += 25
  else if (avgBullets >= 2) { s += 15; tips.push('Aim for 4–5 bullet points per role to demonstrate full scope') }
  else if (avgBullets >= 1) { s += 6;  tips.push('Too few bullets per role — each position needs 3–5 achievement-focused points') }
  else                      { tips.push('Roles have no bullet points — add measurable achievements to every position') }

  const allHaveDates = exp.every((e) => e.startDate)
  if (allHaveDates) s += 20
  else tips.push('Add start/end dates to every experience entry — gaps or missing dates are red flags')

  return { score: Math.min(100, s), tips }
}

function cat3_MeasurableAchievements(data: ResumeData): { score: number; tips: string[] } {
  const tips: string[] = []
  const bullets = data.experience.flatMap((e) => e.bullets.filter(Boolean))

  if (bullets.length === 0) return { score: 0, tips: ['Add bullet points to your experience with quantified outcomes (%, $, scale, time)'] }

  const withMetrics = bullets.filter(hasMetric).length
  const rate = withMetrics / bullets.length
  const weakCount = bullets.filter(hasWeakVerb).length

  let s = 0
  if      (rate >= 0.45) s = 100
  else if (rate >= 0.30) { s = 80; tips.push('Good metric coverage — push above 45% for a globally competitive resume') }
  else if (rate >= 0.18) { s = 60; tips.push('Add more quantified results — target 30%+ of bullets with numbers, %, $, or scale') }
  else if (rate >= 0.1)  { s = 38; tips.push('Low metric density — add numbers or outcomes to your strongest achievements') }
  else                   { s = 15; tips.push('Very few metrics detected — quantify at least a few contributions with data') }

  if (weakCount > 0) {
    const deduct = Math.min(25, weakCount * 6)
    s = Math.max(0, s - deduct)
    tips.push(`${weakCount} bullet${weakCount > 1 ? 's' : ''} open with weak phrases — replace with strong action verbs + outcomes`)
  }

  return { score: Math.min(100, s), tips }
}

function cat4_SkillsDepth(data: ResumeData): { score: number; tips: string[] } {
  const tips: string[] = []
  let s = 0

  const total = data.skills.reduce((sum, c) => sum + c.skills.length, 0)
  if      (total >= 18) s += 28
  else if (total >= 12) { s += 20; tips.push(`${total} skills is decent — push to 18+ with specific tools, frameworks, and methodologies`) }
  else if (total >= 6)  { s += 12; tips.push(`Only ${total} skills listed — aim for 15–20 specific, named skills`) }
  else                  { s += 4;  tips.push('Skills section is critically thin — expand with technologies, tools, and methods') }

  if      (data.skills.length >= 4) s += 12
  else if (data.skills.length >= 2) { s += 7; tips.push('Organize skills into 4+ categories: e.g. Technical, Frameworks, Cloud, Soft Skills') }
  else                              { tips.push('Group skills into structured categories — shows professional depth to ATS and recruiters') }

  const provenProjects = data.projects.filter((p) => p.techStack && p.bullets.filter(Boolean).length > 0)
  if      (provenProjects.length >= 3) s += 25
  else if (provenProjects.length >= 1) { s += 12; tips.push('Add 3+ projects that prove your skills with real tech stack and measurable outcomes') }
  else                                 { tips.push('No projects linked to skills — add portfolio projects that demonstrate what you can build') }

  if      (data.certifications.length >= 3) s += 20
  else if (data.certifications.length >= 1) { s += 10; tips.push('Add more relevant certifications — 3+ is the global benchmark for skill credibility') }
  else                                      { tips.push('No certifications listed — add at least 2 relevant certs to substantiate your skills') }

  const hasPortfolio = !!(data.personal.github || data.personal.portfolio)
  if (hasPortfolio) s += 15
  else tips.push('Add GitHub or portfolio URL — essential proof for technical, creative, or product roles')

  return { score: Math.min(100, s), tips }
}

function cat5_ATSKeywords(data: ResumeData): { score: number; tips: string[] } {
  const tips: string[] = []
  let s = 0

  if (data.personal.jobTitle)       s += 20
  else tips.push('Job title missing — ATS systems match this field first for role relevance')

  if (data.personal.summary)        s += 15
  else tips.push('Add a keyword-rich summary paragraph targeting your specific role and industry')

  if (data.skills.length > 0)       s += 20
  else tips.push('Missing Skills section — most ATS parsers weight this section heavily')

  if (data.experience.length > 0)   s += 15
  else tips.push('Work Experience section absent — ATS cannot rank you without it')

  if (data.education.length > 0)    s += 10
  else tips.push('Education section missing — many ATS systems filter it out as a minimum requirement')

  if (data.personal.email?.includes('@')) s += 10
  else tips.push('Valid email address is required for any ATS or recruiter contact')

  if (data.personal.linkedin)        s += 10
  else tips.push('LinkedIn URL boosts ATS scoring on platforms like Greenhouse, Workday, and Lever')

  return { score: Math.min(100, s), tips }
}

function cat6_InternationalCommunication(data: ResumeData): { score: number; tips: string[] } {
  const tips: string[] = []
  let s = 0

  const wc = wordCount(data.personal.summary ?? '')
  if      (wc >= 60) s += 30
  else if (wc >= 35) { s += 18; tips.push('Expand summary to 60+ words with a clear global value proposition') }
  else if (wc >= 15) { s += 8;  tips.push('Summary is too brief — international recruiters read this in the first 10 seconds') }
  else               { tips.push('Missing summary — international applications without one are rarely shortlisted') }

  if      (data.languages.length >= 3) s += 25
  else if (data.languages.length === 2) { s += 16; tips.push('Add all languages you speak — multilingual candidates are strongly preferred for global roles') }
  else if (data.languages.length === 1) { s += 8;  tips.push('List all languages with proficiency level; add IELTS/TOEFL/CEFR scores if available') }
  else                                  { tips.push('No languages section — add English + any other languages with proficiency levels') }

  if (data.personal.linkedin) s += 20
  else tips.push('LinkedIn is the global professional identity standard — missing it signals a weak international profile')

  const hasPortfolio = !!(data.personal.github || data.personal.portfolio)
  if (hasPortfolio) s += 15
  else tips.push('Add GitHub, portfolio, or published work links — proof of output matters globally')

  if (data.personal.location) s += 10
  else tips.push('Add city and country — global employers need your time zone and geography')

  return { score: Math.min(100, s), tips }
}

function cat7_FormattingStructure(data: ResumeData): { score: number; tips: string[] } {
  const tips: string[] = []
  let s = 0

  const sections = [
    data.experience.length > 0,
    data.education.length > 0,
    data.skills.length > 0,
    !!data.personal.summary,
  ]
  const filled = sections.filter(Boolean).length
  if      (filled === 4) s += 40
  else if (filled === 3) { s += 25; tips.push('All 4 core sections (Experience, Education, Skills, Summary) must be present') }
  else                   { s += 10; tips.push('Multiple core sections missing — a structurally complete resume is the baseline') }

  if (data.certifications.length > 0 || data.projects.length > 0) s += 15
  else tips.push('Add Certifications or Projects — these depth sections distinguish strong candidates')

  const contact = [data.personal.email, data.personal.phone, data.personal.location, data.personal.linkedin]
  const contactFilled = contact.filter(Boolean).length
  if      (contactFilled === 4) s += 25
  else if (contactFilled >= 3)  { s += 16; tips.push('Complete all contact fields: email, phone, location, and LinkedIn') }
  else                          { s += 6;  tips.push('Contact information is critically incomplete') }

  const totalBullets = data.experience.reduce((sum, e) => sum + e.bullets.filter(Boolean).length, 0)
  if      (totalBullets >= 15) s += 20
  else if (totalBullets >= 8)  { s += 12; tips.push('Aim for 15+ total bullets across all roles — 4–5 per position') }
  else                         { s += 4;  tips.push('Resume is too sparse — needs significantly more content to be credible') }

  return { score: Math.min(100, s), tips }
}

function cat8_CredibilityRisk(data: ResumeData): { score: number; tips: string[] } {
  const tips: string[] = []
  let s = 0

  if (data.personal.email?.includes('@')) s += 18
  else tips.push('Add a valid, professional email address (critical for credibility)')

  const expWithDates = data.experience.filter((e) => e.startDate)
  if (data.experience.length > 0) {
    if (expWithDates.length === data.experience.length) s += 22
    else { s += 8; tips.push('Missing dates on some roles — incomplete dates are a major red flag for recruiters') }
  }

  if (data.personal.github || data.personal.portfolio) s += 20
  else tips.push('No portfolio or GitHub — claims without external proof are difficult for recruiters to verify')

  if      (data.certifications.length >= 2) s += 22
  else if (data.certifications.length === 1) { s += 12; tips.push('Add more verifiable credentials — 2+ certifications significantly boost credibility') }
  else                                        { tips.push('No certifications at all — credentials are strong trust signals in international hiring') }

  if (data.personal.linkedin) s += 18
  else tips.push('LinkedIn missing — international recruiters cross-reference it to validate your resume claims')

  return { score: Math.min(100, s), tips }
}

// ── Red Flag Detection ────────────────────────────────────────────────────────

function detectRedFlags(data: ResumeData, ba: BulletAnalysis): RedFlag[] {
  const flags: RedFlag[] = []

  if (ba.total === 0) {
    flags.push({ issue: 'No bullet points anywhere — resume has no evidence of accomplishments', penalty: 14, severity: 'critical' })
  } else if (ba.metricsRate === 0) {
    flags.push({ issue: 'Zero measurable achievements — no numbers, %, $, or quantified outcomes anywhere', penalty: 12, severity: 'critical' })
  } else if (ba.metricsRate < 15) {
    flags.push({ issue: `Only ${ba.metricsRate}% of bullets contain metrics — aim for 30%+`, penalty: 8, severity: 'major' })
  }

  if (ba.weakRate > 40) {
    flags.push({ issue: `${ba.withWeakVerbs} bullets use weak phrasing ("responsible for", "helped", "assisted")`, penalty: 7, severity: 'major' })
  } else if (ba.weakRate > 0) {
    flags.push({ issue: `${ba.withWeakVerbs} bullet${ba.withWeakVerbs > 1 ? 's' : ''} use weak verbs — rewrite as outcome-led statements`, penalty: 3, severity: 'minor' })
  }

  if (!data.personal.summary) {
    flags.push({ issue: 'No professional summary — eliminates immediate role clarity for every recruiter', penalty: 7, severity: 'critical' })
  } else if (wordCount(data.personal.summary) < 20) {
    flags.push({ issue: 'Summary is very short — aim for 40+ words to communicate your value', penalty: 3, severity: 'major' })
  }

  if (!data.personal.linkedin) {
    flags.push({ issue: 'LinkedIn URL missing — critical for international hiring pipelines and background checks', penalty: 5, severity: 'major' })
  }

  if (!data.personal.github && !data.personal.portfolio) {
    flags.push({ issue: 'No portfolio or GitHub link — skills lack verifiable, external proof', penalty: 4, severity: 'major' })
  }

  if (!data.personal.email) {
    flags.push({ issue: 'No email address — applications cannot proceed without contact information', penalty: 10, severity: 'critical' })
  }

  const totalSkills = data.skills.reduce((sum, c) => sum + c.skills.length, 0)
  if (totalSkills < 6) {
    flags.push({ issue: `Only ${totalSkills} skills listed — aim for 12–18 named, specific skills`, penalty: 6, severity: 'major' })
  }

  if (data.certifications.length === 0) {
    flags.push({ issue: 'No certifications — credentials boost credibility with global employers', penalty: 3, severity: 'minor' })
  }

  if (data.experience.length > 0) {
    const noBullets = data.experience.filter((e) => e.bullets.filter(Boolean).length === 0)
    if (noBullets.length > 0) {
      flags.push({ issue: `${noBullets.length} role${noBullets.length > 1 ? 's' : ''} have zero bullet points — add achievements to every position`, penalty: 7, severity: 'critical' })
    }

    const missingDates = data.experience.filter((e) => !e.startDate)
    if (missingDates.length > 0) {
      flags.push({ issue: `${missingDates.length} experience entr${missingDates.length > 1 ? 'ies' : 'y'} missing dates — unexplained gaps are red flags`, penalty: 5, severity: 'major' })
    }
  } else {
    flags.push({ issue: 'No work experience — resume cannot be considered for professional roles', penalty: 14, severity: 'critical' })
  }

  return flags.sort((a, b) => b.penalty - a.penalty)
}

// ── Category Metadata ─────────────────────────────────────────────────────────

const CATEGORY_META = [
  { key: 'roleFit',       label: 'Role & Market Fit',           description: 'Target role clarity, seniority signal, market positioning',    weight: 20 },
  { key: 'experience',    label: 'Relevant Experience',         description: 'Work history depth, completeness, and bullet density',          weight: 20 },
  { key: 'achievements',  label: 'Measurable Achievements',     description: 'Quantified outcomes, business impact, and metric density',      weight: 15 },
  { key: 'skillsDepth',   label: 'Skills Depth & Proof',        description: 'Skill breadth, category structure, certs, and portfolio',       weight: 15 },
  { key: 'ats',           label: 'ATS & Keyword Alignment',     description: 'Machine-readable structure, sections, and keyword coverage',    weight: 10 },
  { key: 'communication', label: 'International Communication', description: 'Summary quality, language profile, and global signals',         weight: 10 },
  { key: 'formatting',    label: 'Formatting & Structure',      description: 'Section coverage, contact completeness, content density',       weight: 5  },
  { key: 'credibility',   label: 'Credibility & Risk Factors',  description: 'Verifiable claims, consistent dates, and trust signals',        weight: 5  },
]

const SCORERS = [
  cat1_RoleMarketFit,
  cat2_RelevantExperience,
  cat3_MeasurableAchievements,
  cat4_SkillsDepth,
  cat5_ATSKeywords,
  cat6_InternationalCommunication,
  cat7_FormattingStructure,
  cat8_CredibilityRisk,
]

// ── Main Export ───────────────────────────────────────────────────────────────

export function calculateInternationalScore(data: ResumeData): InternationalScore {
  const bulletAnalysis = analyzeBullets(data)

  const categories: CategoryScore[] = CATEGORY_META.map((meta, i) => {
    const { score, tips } = SCORERS[i](data)
    return {
      ...meta,
      score,
      earned: Math.round((score * meta.weight) / 100),
      status: catStatus(score),
      tips,
    }
  })

  const rawScore = categories.reduce((sum, c) => sum + c.earned, 0)

  const redFlags = detectRedFlags(data, bulletAnalysis)
  const totalPenalty = Math.min(30, redFlags.reduce((sum, f) => sum + f.penalty, 0))
  const finalScore   = Math.max(0, Math.round(rawScore - totalPenalty))

  const hasAtsRisk = (categories.find((c) => c.key === 'ats')?.score ?? 100) < 50
  const verdict: VerdictKey =
    finalScore >= 90 ? 'global-shortlist'
    : finalScore >= 80 ? 'competitive'
    : finalScore >= 70 ? (hasAtsRisk ? 'ats-risk' : 'local-only')
    : finalScore >= 55 ? 'ats-risk'
    : 'rewrite-needed'

  const strengths = categories
    .filter((c) => c.score >= 70)
    .map((c) => c.label)

  const topImprovements = [...categories]
    .filter((c) => c.tips.length > 0)
    .sort((a, b) => b.weight * (100 - b.score) - a.weight * (100 - a.score))
    .slice(0, 6)
    .flatMap((c) => c.tips.slice(0, 1))

  return {
    rawScore: Math.round(rawScore),
    totalPenalty,
    finalScore,
    categories,
    redFlags,
    verdict,
    bulletAnalysis,
    strengths,
    topImprovements,
  }
}
