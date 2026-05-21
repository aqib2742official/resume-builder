'use client'

import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Input } from '@/components/ui/Input'
import { SectionBlock } from '@/components/editor/SectionBlock'
import { ItemCard } from '@/components/editor/ItemCard'
import { SortableItemWrapper } from '@/components/editor/SortableItemWrapper'
import { useCertifications } from '@/hooks/useResumeData'
import { useResumeActions } from '@/hooks/useResumeActions'

export function CertificationsEditor() {
  const certifications = useCertifications()
  const { addCertification, updateCertification, removeCertification, moveCertification, reorderCertifications } =
    useResumeActions()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = certifications.findIndex((c) => c.id === active.id)
    const newIndex = certifications.findIndex((c) => c.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) reorderCertifications(oldIndex, newIndex)
  }

  return (
    <SectionBlock
      sectionKey="certifications"
      title="Certifications"
      onAdd={addCertification}
      addLabel="Add"
      itemCount={certifications.length}
    >
      {certifications.length === 0 && (
        <p className="text-xs text-gray-400 dark:text-slate-500 text-center py-2">No certifications added yet.</p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={certifications.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {certifications.map((cert, index) => (
            <SortableItemWrapper key={cert.id} id={cert.id}>
              <ItemCard
                title={cert.title || 'Untitled Certification'}
                subtitle={cert.issuer || undefined}
                isFirst={index === 0}
                isLast={index === certifications.length - 1}
                onMoveUp={() => moveCertification(cert.id, 'up')}
                onMoveDown={() => moveCertification(cert.id, 'down')}
                onDelete={() => removeCertification(cert.id)}
              >
                <div className="flex flex-col gap-2">
                  <Input
                    label="Certification Title"
                    placeholder="e.g. AWS Solutions Architect"
                    value={cert.title}
                    onChange={(e) => updateCertification(cert.id, { title: e.target.value })}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      label="Issuer"
                      placeholder="e.g. Amazon Web Services"
                      value={cert.issuer}
                      onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                    />
                    <Input
                      label="Date"
                      type="month"
                      value={cert.date}
                      onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Credential Link"
                    placeholder="https://..."
                    value={cert.credentialLink}
                    onChange={(e) => updateCertification(cert.id, { credentialLink: e.target.value })}
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
