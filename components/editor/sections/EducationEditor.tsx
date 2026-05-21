'use client'

import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { SectionBlock } from '@/components/editor/SectionBlock'
import { ItemCard } from '@/components/editor/ItemCard'
import { SortableItemWrapper } from '@/components/editor/SortableItemWrapper'
import { WritingTips } from '@/components/editor/WritingTips'
import { EmptyState } from '@/components/editor/EmptyState'
import { useEducation } from '@/hooks/useResumeData'
import { useResumeActions } from '@/hooks/useResumeActions'
import { GraduationCap } from 'lucide-react'

export function EducationEditor() {
  const education = useEducation()
  const { addEducation, updateEducation, removeEducation, moveEducation, duplicateEducation, reorderEducation } =
    useResumeActions()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = education.findIndex((e) => e.id === active.id)
    const newIndex = education.findIndex((e) => e.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) reorderEducation(oldIndex, newIndex)
  }

  return (
    <SectionBlock
      sectionKey="education"
      title="Education"
      onAdd={addEducation}
      addLabel="Add"
      itemCount={education.length}
    >
      <WritingTips sectionKey="education" />

      {education.length === 0 && (
        <EmptyState
          icon={GraduationCap}
          title="No education yet"
          description="Add your degrees and courses to build credibility."
          actionLabel="Add Education"
          onAction={addEducation}
        />
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={education.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          {education.map((edu, index) => (
            <SortableItemWrapper key={edu.id} id={edu.id}>
              <ItemCard
                title={edu.degree || edu.institution}
                subtitle={edu.institution && edu.degree ? edu.institution : undefined}
                isFirst={index === 0}
                isLast={index === education.length - 1}
                onMoveUp={() => moveEducation(edu.id, 'up')}
                onMoveDown={() => moveEducation(edu.id, 'down')}
                onDuplicate={() => duplicateEducation(edu.id)}
                onDelete={() => removeEducation(edu.id)}
              >
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="col-span-1 sm:col-span-2">
                      <Input
                        label="Institution"
                        placeholder="University or School name"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                      />
                    </div>
                    <Input
                      label="Degree"
                      placeholder="e.g. Bachelor's"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                    />
                    <Input
                      label="Field of Study"
                      placeholder="e.g. Computer Science"
                      value={edu.fieldOfStudy}
                      onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })}
                    />
                    <Input
                      label="Location"
                      placeholder="City, Country"
                      value={edu.location}
                      onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                    />
                    <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        label="Start Date"
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                      />
                      <Input
                        label="End Date"
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <Textarea
                    label="Description (optional)"
                    placeholder="Relevant coursework, achievements, GPA..."
                    rows={2}
                    value={edu.description}
                    onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
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
