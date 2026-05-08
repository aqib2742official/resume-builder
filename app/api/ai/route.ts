import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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
    user: (p) =>
      `Applicant: ${p.senderName || 'Applicant'}\nApplying for: ${p.role || 'the position'} at ${p.company || 'the company'}\nSkills: ${p.skills || 'various technical skills'}\nResume summary: ${p.summary || 'experienced professional'}`,
  },

  'ats-gap': {
    system: `Compare resumes against job descriptions and identify missing keywords.

Return ONLY a JSON array of strings — the important keywords, skills, tools, or phrases from the job description that are NOT present in the resume. Focus on technical skills, tools, certifications, and domain terms. Ignore soft skills.

Example output: ["Kubernetes", "CI/CD", "PostgreSQL", "Agile", "REST APIs"]

Return valid JSON only. No explanation.`,
    user: (p) =>
      `Resume skills: ${p.resumeSkills}\nResume text: ${p.resumeText}\n\nJob description:\n${p.jobDescription}`,
  },
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
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
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 600,
      system: [
        {
          type: 'text',
          text: prompt.system,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: prompt.user(payload) }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ text: text.trim() })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to reach Claude API', detail: String(e) }, { status: 502 })
  }
}
