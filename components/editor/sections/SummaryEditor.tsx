'use client'

import { Textarea } from '@/components/ui/Textarea'
import { SectionBlock } from '@/components/editor/SectionBlock'
import { WritingTips } from '@/components/editor/WritingTips'
import { usePersonal } from '@/hooks/useResumeData'
import { useResumeActions } from '@/hooks/useResumeActions'

export function SummaryEditor() {
  const { summary } = usePersonal()
  const { updatePersonal } = useResumeActions()

  return (
    <SectionBlock sectionKey="summary" title="Professional Summary">
      <WritingTips sectionKey="summary" />
      <Textarea
        placeholder="Write a compelling 2-4 sentence summary highlighting your experience, skills, and career goals..."
        rows={5}
        value={summary}
        onChange={(e) => updatePersonal({ summary: e.target.value })}
      />
      <p className="mt-1.5 text-xs text-gray-400">{summary.length} characters</p>
    </SectionBlock>
  )
}
