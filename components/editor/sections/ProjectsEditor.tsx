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
import { useProjects } from '@/hooks/useResumeData'
import { useResumeActions } from '@/hooks/useResumeActions'
import { Rocket } from 'lucide-react'

export function ProjectsEditor() {
  const projects = useProjects()
  const { addProject, updateProject, removeProject, moveProject, duplicateProject, reorderProjects } =
    useResumeActions()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = projects.findIndex((p) => p.id === active.id)
    const newIndex = projects.findIndex((p) => p.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) reorderProjects(oldIndex, newIndex)
  }

  return (
    <SectionBlock
      sectionKey="projects"
      title="Projects"
      onAdd={addProject}
      addLabel="Add"
      itemCount={projects.length}
    >
      <WritingTips sectionKey="projects" />

      {projects.length === 0 && (
        <EmptyState
          icon={Rocket}
          title="No projects yet"
          description="Showcase your side projects and open-source work."
          actionLabel="Add Project"
          onAction={addProject}
        />
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          {projects.map((project, index) => (
            <SortableItemWrapper key={project.id} id={project.id}>
              <ItemCard
                title={project.title || 'Untitled Project'}
                subtitle={project.techStack || undefined}
                isFirst={index === 0}
                isLast={index === projects.length - 1}
                onMoveUp={() => moveProject(project.id, 'up')}
                onMoveDown={() => moveProject(project.id, 'down')}
                onDuplicate={() => duplicateProject(project.id)}
                onDelete={() => removeProject(project.id)}
              >
                <div className="flex flex-col gap-2">
                  <Input
                    label="Project Title"
                    placeholder="e.g. E-Commerce Platform"
                    value={project.title}
                    onChange={(e) => updateProject(project.id, { title: e.target.value })}
                  />
                  <Input
                    label="Tech Stack"
                    placeholder="e.g. React, Node.js, PostgreSQL"
                    value={project.techStack}
                    onChange={(e) => updateProject(project.id, { techStack: e.target.value })}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      label="Live Link"
                      placeholder="https://..."
                      value={project.liveLink}
                      onChange={(e) => updateProject(project.id, { liveLink: e.target.value })}
                    />
                    <Input
                      label="GitHub Link"
                      placeholder="github.com/..."
                      value={project.githubLink}
                      onChange={(e) => updateProject(project.id, { githubLink: e.target.value })}
                    />
                  </div>
                  <BulletEditor
                    bullets={project.bullets.length ? project.bullets : ['']}
                    onChange={(bullets) => updateProject(project.id, { bullets })}
                    placeholder="Describe what you built and its impact..."
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
