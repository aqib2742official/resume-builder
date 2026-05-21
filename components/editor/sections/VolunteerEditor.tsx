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
import { useVolunteer } from '@/hooks/useResumeData'
import { useResumeActions } from '@/hooks/useResumeActions'
import { Heart } from 'lucide-react'

export function VolunteerEditor() {
  const volunteer = useVolunteer()
  const { addVolunteer, updateVolunteer, removeVolunteer, reorderVolunteer } = useResumeActions()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = volunteer.findIndex((v) => v.id === active.id)
    const newIndex = volunteer.findIndex((v) => v.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) reorderVolunteer(oldIndex, newIndex)
  }

  return (
    <SectionBlock
      sectionKey="volunteer"
      title="Volunteer Work"
      onAdd={addVolunteer}
      addLabel="Add"
      itemCount={volunteer.length}
    >
      <WritingTips sectionKey="volunteer" />

      {volunteer.length === 0 && (
        <EmptyState
          icon={Heart}
          title="No volunteer work yet"
          description="Showcase your community involvement and contributions."
          actionLabel="Add Volunteer Work"
          onAction={addVolunteer}
        />
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={volunteer.map((v) => v.id)} strategy={verticalListSortingStrategy}>
          {volunteer.map((item, index) => (
            <SortableItemWrapper key={item.id} id={item.id}>
              <ItemCard
                title={item.organization || 'Untitled Organization'}
                subtitle={item.role || undefined}
                isFirst={index === 0}
                isLast={index === volunteer.length - 1}
                onMoveUp={() => {
                  const i = volunteer.findIndex((v) => v.id === item.id)
                  if (i > 0) reorderVolunteer(i, i - 1)
                }}
                onMoveDown={() => {
                  const i = volunteer.findIndex((v) => v.id === item.id)
                  if (i < volunteer.length - 1) reorderVolunteer(i, i + 1)
                }}
                onDelete={() => removeVolunteer(item.id)}
              >
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="col-span-1 sm:col-span-2">
                      <Input
                        label="Organization"
                        placeholder="e.g. Red Cross, Local Food Bank"
                        value={item.organization}
                        onChange={(e) => updateVolunteer(item.id, { organization: e.target.value })}
                      />
                    </div>
                    <Input
                      label="Role"
                      placeholder="e.g. Event Coordinator"
                      value={item.role}
                      onChange={(e) => updateVolunteer(item.id, { role: e.target.value })}
                    />
                    <Input
                      label="Location"
                      placeholder="City, Country"
                      value={item.location}
                      onChange={(e) => updateVolunteer(item.id, { location: e.target.value })}
                    />
                    <Input
                      label="Start Date"
                      type="month"
                      value={item.startDate}
                      onChange={(e) => updateVolunteer(item.id, { startDate: e.target.value })}
                    />
                    {!item.currentlyVolunteering && (
                      <Input
                        label="End Date"
                        type="month"
                        value={item.endDate}
                        onChange={(e) => updateVolunteer(item.id, { endDate: e.target.value })}
                      />
                    )}
                  </div>
                  <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.currentlyVolunteering}
                      onChange={(e) => updateVolunteer(item.id, { currentlyVolunteering: e.target.checked, endDate: e.target.checked ? '' : item.endDate })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Currently volunteering here
                  </label>
                  <Textarea
                    label="Description"
                    placeholder="Describe your contributions and impact..."
                    rows={2}
                    value={item.description}
                    onChange={(e) => updateVolunteer(item.id, { description: e.target.value })}
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
