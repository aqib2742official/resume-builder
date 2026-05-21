import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

let groq: Groq | null = null
function getGroq(): Groq {
  if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  return groq
}

type Payload = Record<string, string>

interface PromptParts {
  system: string
  user: (p: Payload) => string
}

const PROMPTS: Record<string, PromptParts> = {
  'improve-bullet': {
    system: `You are a professional resume writer. Rewrite resume bullet points to:
- Start with a strong past-tense action verb (e.g. Built, Reduced, Led, Designed)
- Include a quantified metric or measurable outcome if possible (%, $, scale, time)
- Be concise — one sentence, under 20 words
- Demonstrate business impact

Return ONLY the rewritten bullet point. No explanation, no quotes, no prefix.`,
    user: (p) => `Role: ${p.role || 'Software Engineer'}\nOriginal bullet: ${p.bullet}`,
  },

  'generate-summary': {
    system: `Write professional resume summaries.

Requirements:
- 80 to 100 words exactly
- Written in third-person implied style (no "I" or "my")
- Opens with job title and years/level of experience
- Mentions 2-3 key technical skills
- Closes with value proposition or career goal

Return ONLY the summary paragraph. No title, no quotes.`,
    user: (p) =>
      `Job title: ${p.jobTitle || 'professional'}\nSkills: ${p.skills || 'not specified'}\nExperience highlights: ${p.experience || 'not specified'}`,
  },

  'cover-letter': {
    system: `Write professional cover letter bodies.

Requirements:
- Exactly 3 paragraphs
- Paragraph 1: Express interest in the specific role and company, mention 1 relevant skill
- Paragraph 2: Highlight 1-2 achievements with numbers/impact
- Paragraph 3: Enthusiasm for the role and call to action
- Total 200-280 words
- Professional but warm tone

Return ONLY the letter body paragraphs. No salutation, no sign-off, no subject line.`,
    user: (p) => {
      const lines = [
        `Applicant: ${p.senderName || 'Applicant'}`,
        `Applying for: ${p.role || 'the position'} at ${p.company || 'the company'}`,
        `Skills: ${p.skills || 'various technical skills'}`,
        `Resume summary: ${p.summary || 'experienced professional'}`,
      ]
      if (p.experience) lines.push(`Work experience: ${p.experience}`)
      if (p.education) lines.push(`Education: ${p.education}`)
      if (p.projects) lines.push(`Notable projects: ${p.projects}`)
      return lines.join('\n')
    },
  },

  'ats-gap': {
    system: `Compare resumes against job descriptions and identify missing keywords.

Return ONLY a JSON array of strings — the important keywords, skills, tools, or phrases from the job description that are NOT present in the resume. Focus on technical skills, tools, certifications, and domain terms. Ignore soft skills.

Example output: ["Kubernetes", "CI/CD", "PostgreSQL", "Agile", "REST APIs"]

Return valid JSON only. No explanation.`,
    user: (p) =>
      `Resume skills: ${p.resumeSkills}\nResume text: ${p.resumeText}\n\nJob description:\n${p.jobDescription}`,
  },

  'interview-questions': {
    system: `You are an expert interview coach. Generate exactly 20 interview questions for the given role and candidate background.

For each question:
- Vary the types: mix behavioral, technical, and situational questions
- Provide a model answer using the STAR method where applicable (Situation, Task, Action, Result)
- Keep answers concise but complete (80-120 words each)

Return ONLY a valid JSON array with this exact shape:
[{ "question": "...", "answer": "...", "type": "behavioral" | "technical" | "situational" }]

No explanation outside the JSON. No markdown fences.`,
    user: (p) => {
      const lines = [`Job Title: ${p.jobTitle || 'Software Engineer'}`]
      if (p.jobDescription) lines.push(`Job Description:\n${p.jobDescription}`)
      if (p.experience)     lines.push(`Candidate Experience: ${p.experience}`)
      if (p.skills)         lines.push(`Candidate Skills: ${p.skills}`)
      if (p.projects)       lines.push(`Notable Projects: ${p.projects}`)
      return lines.join('\n\n')
    },
  },
}

export async function POST(req: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 })
  }

  let body: { action?: string; payload?: Payload }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { action, payload = {} } = body
  const prompt = action ? PROMPTS[action] : undefined
  if (!prompt) {
    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
  }

  try {
    const isLarge = action === 'interview-questions'
    const response = await getGroq().chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: isLarge ? 2000 : 600,
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user(payload) },
      ],
    })

    const text = response.choices[0]?.message?.content ?? ''
    return NextResponse.json({ text: text.trim() })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to reach Groq API', detail: String(e) }, { status: 502 })
  }
}
