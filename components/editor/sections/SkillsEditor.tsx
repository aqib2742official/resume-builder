'use client'

import { useState, useRef } from 'react'
import { Plus } from 'lucide-react'
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { SectionBlock } from '@/components/editor/SectionBlock'
import { ItemCard } from '@/components/editor/ItemCard'
import { SortableItemWrapper } from '@/components/editor/SortableItemWrapper'
import { WritingTips } from '@/components/editor/WritingTips'
import { EmptyState } from '@/components/editor/EmptyState'
import { useSkills } from '@/hooks/useResumeData'
import { useResumeActions } from '@/hooks/useResumeActions'
import { Zap } from 'lucide-react'

function SkillCategoryCard({
  category,
  index,
  total,
}: {
  category: { id: string; category: string; skills: string[] }
  index: number
  total: number
}) {
  const { updateSkillCategory, removeSkillCategory, moveSkillCategory, addSkillToCategory, removeSkillFromCategory } =
    useResumeActions()
  const [newSkill, setNewSkill] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleAddSkill() {
    if (!newSkill.trim()) return
    addSkillToCategory(category.id, newSkill.trim())
    setNewSkill('')
    inputRef.current?.focus()
  }

  return (
    <ItemCard
      title={category.category || 'Skill Category'}
      subtitle={`${category.skills.length} skill${category.skills.length !== 1 ? 's' : ''}`}
      isFirst={index === 0}
      isLast={index === total - 1}
      onMoveUp={() => moveSkillCategory(category.id, 'up')}
      onMoveDown={() => moveSkillCategory(category.id, 'down')}
      onDelete={() => removeSkillCategory(category.id)}
    >
      <div className="flex flex-col gap-2.5">
        <Input
          label="Category Name"
          placeholder="e.g. Frontend, Backend, Tools"
          value={category.category}
          onChange={(e) => updateSkillCategory(category.id, { category: e.target.value })}
        />

        <div>
          <p className="text-xs font-medium text-gray-600 dark:text-slate-300 mb-1.5">Skills</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {category.skills.map((skill, i) => (
              <Badge key={i} onRemove={() => removeSkillFromCategory(category.id, i)}>
                {skill}
              </Badge>
            ))}
            {category.skills.length === 0 && (
              <span className="text-xs text-gray-400 dark:text-slate-500">No skills added</span>
            )}
          </div>

          <div className="flex gap-1.5">
            <input
              ref={inputRef}
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              placeholder="Add a skill, press Enter"
              className="flex-1 h-7 rounded-md border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-2 text-xs text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 focus:bg-white dark:focus:bg-slate-600"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>
      </div>
    </ItemCard>
  )
}

export function SkillsEditor() {
  const skills = useSkills()
  const { addSkillCategory, reorderSkills } = useResumeActions()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = skills.findIndex((s) => s.id === active.id)
    const newIndex = skills.findIndex((s) => s.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) reorderSkills(oldIndex, newIndex)
  }

  return (
    <SectionBlock
      sectionKey="skills"
      title="Skills"
      onAdd={addSkillCategory}
      addLabel="Add Category"
      itemCount={skills.length}
    >
      <WritingTips sectionKey="skills" />

      {skills.length === 0 && (
        <EmptyState
          icon={Zap}
          title="No skills yet"
          description="Group skills by category — Frontend, Backend, Tools…"
          actionLabel="Add Category"
          onAction={addSkillCategory}
        />
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={skills.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {skills.map((cat, index) => (
            <SortableItemWrapper key={cat.id} id={cat.id}>
              <SkillCategoryCard category={cat} index={index} total={skills.length} />
            </SortableItemWrapper>
          ))}
        </SortableContext>
      </DndContext>
    </SectionBlock>
  )
}
