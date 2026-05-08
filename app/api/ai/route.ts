import { NextRequest, NextResponse } from 'next/server'

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=`

type Payload = Record<string, string>

const PROMPTS: Record<string, (p: Payload) => string> = {
  'improve-bullet': (p) =>
    `You are a professional resume writer. Rewrite this resume bullet point to:
- Start with a strong past-tense action verb (e.g. Built, Reduced, Led, Designed)
- Include a quantified metric or measurable outcome if possible (%, $, scale, time)
- Be concise — one sentence, under 20 words
- Demonstrate business impact

Role: ${p.role || 'Software Engineer'}
Original bullet: ${p.bullet}

Return ONLY the rewritten bullet point. No explanation, no quotes, no prefix.`,

  'generate-summary': (p) =>
    `Write a professional resume summary for a ${p.jobTitle || 'professional'}.

Skills: ${p.skills || 'not specified'}
Experience highlights: ${p.experience || 'not specified'}

Requirements:
- 80 to 100 words exactly
- Written in third-person implied style (no "I" or "my")
- Opens with job title and years/level of experience
- Mentions 2-3 key technical skills
- Closes with value proposition or career goal

Return ONLY the summary paragraph. No title, no quotes.`,

  'cover-letter': (p) =>
    `Write a professional cover letter body for the following application:

Applicant: ${p.senderName || 'Applicant'}
Applying for: ${p.role || 'the position'} at ${p.company || 'the company'}
Skills: ${p.skills || 'various technical skills'}
Resume summary: ${p.summary || 'experienced professional'}

Requirements:
- Exactly 3 paragraphs
- Paragraph 1: Express interest in the specific role and company, mention 1 relevant skill
- Paragraph 2: Highlight 1-2 achievements with numbers/impact
- Paragraph 3: Enthusiasm for the role and call to action
- Total 200-280 words
- Professional but warm tone

Return ONLY the letter body paragraphs. No salutation, no sign-off, no subject line.`,

  'ats-gap': (p) =>
    `Compare this resume against the job description and identify missing keywords.

Resume skills: ${p.resumeSkills}
Resume text: ${p.resumeText}

Job description:
${p.jobDescription}

Return ONLY a JSON array of strings — the important keywords, skills, tools, or phrases from the job description that are NOT present in the resume. Focus on technical skills, tools, certifications, and domain terms. Ignore soft skills.

Example output: ["Kubernetes", "CI/CD", "PostgreSQL", "Agile", "REST APIs"]

Return valid JSON only. No explanation.`,
}

export async function POST(req: NextRequest) {
  const key = process.env.GEMINI_API_KEY
  if (!key) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 })
  }

  let body: { action?: string; payload?: Payload }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { action, payload = {} } = body
  const promptFn = action ? PROMPTS[action] : undefined
  if (!promptFn) {
    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
  }

  try {
    const res = await fetch(GEMINI_URL + key, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptFn(payload) }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `Gemini error: ${res.status}`, detail: err }, { status: 502 })
    }

    const data = await res.json()
    const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    return NextResponse.json({ text: text.trim() })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to reach Gemini API', detail: String(e) }, { status: 502 })
  }
}
