export type AIAction = 'improve-bullet' | 'generate-summary' | 'cover-letter' | 'ats-gap' | 'interview-questions'

export async function callAI(action: AIAction, payload: Record<string, string>): Promise<string> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'AI request failed')
  return data.text as string
}
