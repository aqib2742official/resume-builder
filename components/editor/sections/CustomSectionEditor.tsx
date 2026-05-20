'use client'

import { Plus } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { SectionBlock } from '@/components/editor/SectionBlock'
import { ItemCard } from '@/components/editor/ItemCard'
import { HoverActions } from '@/components/editor/HoverActions'
import { useCustomSections } from '@/hooks/useResumeData'
import { useResumeActions } from '@/hooks/useResumeActions'

export function CustomSectionEditor() {
  const customSections = useCustomSections()
  const {
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    addCustomSectionItem,
    updateCustomSectionItem,
    removeCustomSectionItem,
  } = useResumeActions()

  return (
    <>
      {customSections.map((section) => (
        <SectionBlock
          key={section.id}
          sectionKey={`custom-${section.id}`}
          title={section.title || 'Custom Section'}
          onAdd={() => addCustomSectionItem(section.id)}
          addLabel="Add Item"
          itemCount={section.items.length}
        >
          <div className="mb-2">
            <Input
              label="Section Title"
              placeholder="e.g. Volunteering, Publications..."
              value={section.title}
              onChange={(e) => updateCustomSection(section.id, { title: e.target.value })}
            />
          </div>
          <div className="flex justify-end">
            <Button
              variant="danger"
              size="sm"
              onClick={() => removeCustomSection(section.id)}
            >
              Remove Section
            </Button>
          </div>

          {section.items.map((item, index) => (
            <div key={item.id} className="relative group rounded-lg border border-gray-200 bg-white p-3 mt-2">
              <HoverActions
                onDelete={() => removeCustomSectionItem(section.id, item.id)}
                isFirst={index === 0}
                isLast={index === section.items.length - 1}
              />
              <div className="flex flex-col gap-2 pr-16">
                <Input
                  label="Title / Subtitle"
                  placeholder="e.g. Open Source Contributor"
                  value={item.subtitle}
                  onChange={(e) => updateCustomSectionItem(section.id, item.id, { subtitle: e.target.value })}
                />
                <Textarea
                  label="Description"
                  placeholder="Brief description..."
                  rows={2}
                  value={item.description}
                  onChange={(e) => updateCustomSectionItem(section.id, item.id, { description: e.target.value })}
                />
              </div>
            </div>
          ))}

          {section.items.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-1">No items added yet.</p>
          )}
        </SectionBlock>
      ))}

      <div className="px-4 pb-4">
        <Button variant="outline" size="sm" onClick={addCustomSection} className="w-full">
          <Plus size={14} />
          Add Custom Section
        </Button>
      </div>
    </>
  )
}
