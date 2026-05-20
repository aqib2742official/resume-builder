'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { Textarea } from '@/components/ui/Textarea'
import { SectionBlock } from '@/components/editor/SectionBlock'
import { WritingTips } from '@/components/editor/WritingTips'
import { usePersonal, useResumeData } from '@/hooks/useResumeData'
import { useResumeActions } from '@/hooks/useResumeActions'
import { callAI } from '@/lib/ai'

export function SummaryEditor() {
  const { summary, jobTitle } = usePersonal()
  const data = useResumeData()
  const { updatePersonal } = useResumeActions()
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(false)

  async function handleGenerate() {
    setGenerating(true)
    setError(false)
    try {
      const skills = data.skills.flatMap((c) => c.skills).slice(0, 15).join(', ')
      const experience = data.experience
        .slice(0, 3)
        .map((e) => `${e.position} at ${e.company}`)
        .join('; ')
      const result = await callAI('generate-summary', { jobTitle: jobTitle ?? '', skills, experience })
      updatePersonal({ summary: result })
    } catch {
      setError(true)
      setTimeout(() => setError(false), 3000)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <SectionBlock sectionKey="summary" title="Professional Summary">
      <WritingTips sectionKey="summary" />
      <Textarea
        placeholder="Write a compelling 2-4 sentence summary highlighting your experience, skills, and career goals..."
        rows={5}
        value={summary}
        onChange={(e) => updatePersonal({ summary: e.target.value })}
      />
      <div className="mt-1.5 flex items-center justify-between">
        <p className="text-xs text-gray-400">{summary.length} characters</p>
        <div className="flex items-center gap-2">
          {error && <span className="text-xs text-red-500">Failed — check API key</span>}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-[#0f2044] hover:bg-gray-50 hover:border-[#0f2044]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating
              ? <Loader2 size={11} className="animate-spin" />
              : <Sparkles size={11} />}
            {generating ? 'Generating…' : 'Generate with AI'}
          </button>
        </div>
      </div>
    </SectionBlock>
  )
}
