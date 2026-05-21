'use client'

import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { SectionBlock } from '@/components/editor/SectionBlock'
import { ItemCard } from '@/components/editor/ItemCard'
import { SortableItemWrapper } from '@/components/editor/SortableItemWrapper'
import { useLanguages } from '@/hooks/useResumeData'
import { useResumeActions } from '@/hooks/useResumeActions'
import type { LanguageProficiency } from '@/types/resume'

const PROFICIENCY_OPTIONS: { value: LanguageProficiency; label: string }[] = [
  { value: 'Native', label: 'Native' },
  { value: 'Fluent', label: 'Fluent' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Basic', label: 'Basic' },
]

export function LanguagesEditor() {
  const languages = useLanguages()
  const { addLanguage, updateLanguage, removeLanguage, moveLanguage, reorderLanguages } = useResumeActions()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = languages.findIndex((l) => l.id === active.id)
    const newIndex = languages.findIndex((l) => l.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) reorderLanguages(oldIndex, newIndex)
  }

  return (
    <SectionBlock
      sectionKey="languages"
      title="Languages"
      onAdd={addLanguage}
      addLabel="Add"
      itemCount={languages.length}
    >
      {languages.length === 0 && (
        <p className="text-xs text-gray-400 dark:text-slate-500 text-center py-2">No languages added yet.</p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={languages.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {languages.map((lang, index) => (
            <SortableItemWrapper key={lang.id} id={lang.id}>
              <ItemCard
                title={lang.name || 'Language'}
                subtitle={lang.proficiency}
                isFirst={index === 0}
                isLast={index === languages.length - 1}
                onMoveUp={() => moveLanguage(lang.id, 'up')}
                onMoveDown={() => moveLanguage(lang.id, 'down')}
                onDelete={() => removeLanguage(lang.id)}
                defaultExpanded={false}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    label="Language"
                    placeholder="e.g. English"
                    value={lang.name}
                    onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
                  />
                  <Select
                    label="Proficiency"
                    options={PROFICIENCY_OPTIONS}
                    value={lang.proficiency}
                    onChange={(e) => updateLanguage(lang.id, { proficiency: e.target.value as LanguageProficiency })}
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
