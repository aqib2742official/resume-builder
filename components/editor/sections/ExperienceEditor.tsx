'use client'

import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Input } from '@/components/ui/Input'
import { BulletEditor } from '@/components/ui/BulletEditor'
import { SectionBlock } from '@/components/editor/SectionBlock'
import { ItemCard } from '@/components/editor/ItemCard'
import { SortableItemWrapper } from '@/components/editor/SortableItemWrapper'
import { WritingTips } from '@/components/editor/WritingTips'
import { EmptyState } from '@/components/editor/EmptyState'
import { useExperience } from '@/hooks/useResumeData'
import { useResumeActions } from '@/hooks/useResumeActions'
import { Briefcase } from 'lucide-react'

export function ExperienceEditor() {
  const experience = useExperience()
  const { addExperience, updateExperience, removeExperience, moveExperience, duplicateExperience, reorderExperience } = useResumeActions()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = experience.findIndex((e) => e.id === active.id)
    const newIndex = experience.findIndex((e) => e.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) reorderExperience(oldIndex, newIndex)
  }

  return (
    <SectionBlock
      sectionKey="experience"
      title="Work Experience"
      onAdd={addExperience}
      addLabel="Add"
      itemCount={experience.length}
    >
      <WritingTips sectionKey="experience" />

      {experience.length === 0 && (
        <EmptyState
          icon={Briefcase}
          title="No experience yet"
          description="Add your work history to show recruiters where you've been."
          actionLabel="Add Experience"
          onAction={addExperience}
        />
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={experience.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          {experience.map((exp, index) => (
            <SortableItemWrapper key={exp.id} id={exp.id}>
              <ItemCard
                title={exp.position || exp.company}
                subtitle={exp.company && exp.position ? exp.company : undefined}
                isFirst={index === 0}
                isLast={index === experience.length - 1}
                onMoveUp={() => moveExperience(exp.id, 'up')}
                onMoveDown={() => moveExperience(exp.id, 'down')}
                onDuplicate={() => duplicateExperience(exp.id)}
                onDelete={() => removeExperience(exp.id)}
              >
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="col-span-2">
                      <Input label="Position / Job Title" placeholder="e.g. Software Engineer"
                        value={exp.position} onChange={(e) => updateExperience(exp.id, { position: e.target.value })} />
                    </div>
                    <Input label="Company" placeholder="Company name"
                      value={exp.company} onChange={(e) => updateExperience(exp.id, { company: e.target.value })} />
                    <Input label="Location" placeholder="City, Country"
                      value={exp.location} onChange={(e) => updateExperience(exp.id, { location: e.target.value })} />
                    <Input label="Start Date" type="month" value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })} />
                    <Input label="End Date" type="month" value={exp.endDate} disabled={exp.currentlyWorking}
                      onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })} />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={exp.currentlyWorking}
                      onChange={(e) => updateExperience(exp.id, { currentlyWorking: e.target.checked, endDate: e.target.checked ? '' : exp.endDate })}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-xs text-gray-600 dark:text-slate-300">Currently working here</span>
                  </label>
                  <BulletEditor
                    bullets={exp.bullets.length ? exp.bullets : ['']}
                    onChange={(bullets) => updateExperience(exp.id, { bullets })}
                  />
                </div>
              </ItemCard>
            </SortableItemWrapper>
          ))}
        </SortableContext>
      </DndContext>
    </SectionBlock>
  )
}
