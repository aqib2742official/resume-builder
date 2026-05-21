'use client'

import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { SectionBlock } from '@/components/editor/SectionBlock'
import { ItemCard } from '@/components/editor/ItemCard'
import { SortableItemWrapper } from '@/components/editor/SortableItemWrapper'
import { WritingTips } from '@/components/editor/WritingTips'
import { useAwards } from '@/hooks/useResumeData'
import { useResumeActions } from '@/hooks/useResumeActions'

export function AwardsEditor() {
  const awards = useAwards()
  const { addAward, updateAward, removeAward, moveAward, duplicateAward, reorderAwards } = useResumeActions()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = awards.findIndex((a) => a.id === active.id)
    const newIndex = awards.findIndex((a) => a.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) reorderAwards(oldIndex, newIndex)
  }

  return (
    <SectionBlock
      sectionKey="awards"
      title="Awards & Achievements"
      onAdd={addAward}
      addLabel="Add"
      itemCount={awards.length}
    >
      <WritingTips sectionKey="awards" />

      {awards.length === 0 && (
        <p className="text-xs text-gray-400 dark:text-slate-500 text-center py-2">No awards added yet.</p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={awards.map((a) => a.id)} strategy={verticalListSortingStrategy}>
          {awards.map((award, index) => (
            <SortableItemWrapper key={award.id} id={award.id}>
              <ItemCard
                title={award.title || 'Untitled Award'}
                subtitle={award.date || undefined}
                isFirst={index === 0}
                isLast={index === awards.length - 1}
                onMoveUp={() => moveAward(award.id, 'up')}
                onMoveDown={() => moveAward(award.id, 'down')}
                onDuplicate={() => duplicateAward(award.id)}
                onDelete={() => removeAward(award.id)}
              >
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="col-span-1 sm:col-span-2">
                      <Input
                        label="Award Title"
                        placeholder="e.g. Employee of the Year"
                        value={award.title}
                        onChange={(e) => updateAward(award.id, { title: e.target.value })}
                      />
                    </div>
                    <Input
                      label="Date"
                      type="month"
                      value={award.date}
                      onChange={(e) => updateAward(award.id, { date: e.target.value })}
                    />
                  </div>
                  <Textarea
                    label="Description"
                    placeholder="Briefly describe this achievement..."
                    rows={2}
                    value={award.description}
                    onChange={(e) => updateAward(award.id, { description: e.target.value })}
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
