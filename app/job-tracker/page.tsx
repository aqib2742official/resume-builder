'use client'

import { useState, useEffect } from 'react'
import { Plus, X, ExternalLink, Briefcase, Edit2, Trash2, GripVertical, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import {
  getJobs, addJob, updateJob, deleteJob,
  type JobApplication, type JobStatus,
  STATUS_CONFIG, ALL_STATUSES,
} from '@/lib/jobTrackerStorage'
import { getSavedResumes, type SavedResume } from '@/lib/resumeStorage'
import { getCoverLetters, type CoverLetter } from '@/lib/coverLetterStorage'
import { format } from 'date-fns'

// ── Backdrop helper ───────────────────────────────────────────────────────────

function Backdrop({ onClose, children, zClass = 'z-50' }: Readonly<{ onClose: () => void; children: React.ReactNode; zClass?: string }>) {
  return (
    <div
      className={clsx('fixed inset-0 flex items-center justify-center bg-black/50 p-4', zClass)}
      onClick={onClose}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose() }}
    >
      {children}
    </div>
  )
}

// ── Job Form Modal ────────────────────────────────────────────────────────────

function JobModal({ job, resumes, letters, onSave, onClose }: Readonly<{
  job?: JobApplication
  resumes: SavedResume[]
  letters: CoverLetter[]
  onSave: (data: Omit<JobApplication, 'id'>) => void
  onClose: () => void
}>) {
  const [form, setForm] = useState<Omit<JobApplication, 'id'>>({
    company: job?.company ?? '',
    role: job?.role ?? '',
    location: job?.location ?? '',
    appliedDate: job?.appliedDate ?? format(new Date(), 'yyyy-MM-dd'),
    status: job?.status ?? 'applied',
    resumeId: job?.resumeId ?? '',
    coverLetterId: job?.coverLetterId ?? '',
    notes: job?.notes ?? '',
    url: job?.url ?? '',
  })

  const canSubmit = form.company.trim().length > 0 && form.role.trim().length > 0

  const textFields = [
    { label: 'Company', id: 'jm-company', key: 'company', placeholder: 'e.g. Google', required: true },
    { label: 'Role', id: 'jm-role', key: 'role', placeholder: 'e.g. Software Engineer', required: true },
    { label: 'Location', id: 'jm-location', key: 'location', placeholder: 'e.g. Remote, New York', required: false },
    { label: 'Job Posting URL', id: 'jm-url', key: 'url', placeholder: 'https://...', required: false },
  ]

  return (
    <Backdrop onClose={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="jm-title" className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 id="jm-title" className="font-bold text-gray-900 dark:text-white">{job ? 'Edit Application' : 'Add Application'}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-3 max-h-[70vh] overflow-auto">
          {textFields.map(({ label, id, key, placeholder, required }) => (
            <div key={key}>
              <label htmlFor={id} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}{required && ' *'}
              </label>
              <input
                id={id}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder={placeholder}
                value={form[key as keyof typeof form] as string}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              />
            </div>
          ))}

          <div>
            <label htmlFor="jm-status" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              id="jm-status"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as JobStatus }))}
            >
              {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="jm-date" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Applied Date</label>
            <input
              id="jm-date"
              type="date"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={form.appliedDate}
              onChange={(e) => setForm((f) => ({ ...f, appliedDate: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="jm-resume" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Linked Resume</label>
            <select
              id="jm-resume"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={form.resumeId ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, resumeId: e.target.value }))}
            >
              <option value="">— None —</option>
              {resumes.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="jm-letter" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Linked Cover Letter</label>
            <select
              id="jm-letter"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={form.coverLetterId ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, coverLetterId: e.target.value }))}
            >
              <option value="">— None —</option>
              {letters.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="jm-notes" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea
              id="jm-notes"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              rows={3}
              placeholder="Interview notes, follow-up actions, contacts…"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={onClose} className="rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
          <button
            onClick={() => { if (canSubmit) { onSave(form); onClose() } }}
            disabled={!canSubmit}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {job ? 'Save Changes' : 'Add Application'}
          </button>
        </div>
      </div>
    </Backdrop>
  )
}

// ── Job Card ──────────────────────────────────────────────────────────────────

interface JobCardProps {
  job: JobApplication
  resumes: SavedResume[]
  onEdit: () => void
  onDelete: () => void
  isDragging?: boolean
}

function JobCardContent({ job, resumes, onEdit, onDelete, isDragging }: Readonly<JobCardProps>) {
  const cfg = STATUS_CONFIG[job.status]
  const linkedResume = resumes.find((r) => r.id === job.resumeId)

  return (
    <div className={clsx(
      'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3.5 shadow-sm transition-shadow',
      isDragging ? 'opacity-50' : 'hover:shadow-md'
    )}>
      <div className="flex items-start gap-2 mb-2">
        <div className="mt-0.5 text-gray-300 dark:text-gray-600 cursor-grab active:cursor-grabbing shrink-0">
          <GripVertical size={14} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{job.company}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{job.role}</p>
          {job.location && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{job.location}</p>}
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={onEdit} className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 transition-colors"><Edit2 size={12} /></button>
          <button onClick={onDelete} className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
        </div>
      </div>

      {job.appliedDate && (
        <p className="text-xs text-gray-400 mb-2 ml-5">{format(new Date(job.appliedDate), 'MMM d, yyyy')}</p>
      )}

      {linkedResume && (
        <div className="flex items-center gap-1 mb-2 ml-5 text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 rounded-md px-2 py-1">
          <Briefcase size={10} />
          <span className="truncate">{linkedResume.name}</span>
        </div>
      )}

      {job.notes && (
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2 ml-5 bg-gray-50 dark:bg-gray-700/50 rounded-md px-2 py-1.5">{job.notes}</p>
      )}

      <div className="flex items-center justify-between gap-2 mt-2 ml-5">
        <span className={clsx('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border', cfg.color, cfg.bg, cfg.border)}>
          {cfg.label}
        </span>
        {job.url && (
          <a href={job.url} target="_blank" rel="noopener noreferrer" className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors">
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  )
}

function DraggableJobCard(props: Readonly<JobCardProps>) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: props.job.id,
    data: { status: props.job.status },
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 50, position: 'relative' as const }
    : undefined

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <JobCardContent {...props} isDragging={isDragging} />
    </div>
  )
}

// ── Droppable Column ──────────────────────────────────────────────────────────

function DroppableColumn({ status, children, isOver }: Readonly<{
  status: JobStatus
  children: React.ReactNode
  isOver: boolean
}>) {
  const { setNodeRef } = useDroppable({ id: status })
  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'flex-1 overflow-y-auto rounded-b-xl border p-2 space-y-2 min-h-48 transition-colors',
        STATUS_CONFIG[status].border,
        isOver ? 'bg-blue-50/60 dark:bg-blue-900/20' : 'bg-white/60 dark:bg-gray-800/40'
      )}
    >
      {children}
    </div>
  )
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────

function DeleteJobModal({ job, onConfirm, onClose }: Readonly<{
  job: JobApplication
  onConfirm: () => void
  onClose: () => void
}>) {
  const [deleting, setDeleting] = useState(false)

  function handleDelete() {
    setDeleting(true)
    setTimeout(() => { onConfirm(); setDeleting(false) }, 400)
  }

  return (
    <Backdrop onClose={onClose} zClass="z-60">
      <div role="dialog" aria-modal="true" aria-labelledby="djm-title" className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/30 mb-4">
          <Trash2 size={22} className="text-red-500" />
        </div>
        <h3 id="djm-title" className="font-bold text-gray-900 dark:text-white text-lg mb-1">Delete Application?</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <span className="font-medium text-gray-700 dark:text-gray-200">{job.company} — {job.role}</span> will be permanently deleted.
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-70"
          >
            {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </Backdrop>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function JobTrackerPage() {
  const [jobs, setJobs] = useState<JobApplication[]>([])
  const [resumes, setResumes] = useState<SavedResume[]>([])
  const [letters, setLetters] = useState<CoverLetter[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editJob, setEditJob] = useState<JobApplication | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<JobApplication | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overColumn, setOverColumn] = useState<JobStatus | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  function load() {
    setJobs(getJobs())
    setResumes(getSavedResumes())
    setLetters(getCoverLetters())
  }

  useEffect(() => { load() }, [])

  function handleSave(data: Omit<JobApplication, 'id'>) {
    if (editJob) updateJob(editJob.id, data)
    else addJob(data)
    load()
    setEditJob(undefined)
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    setOverColumn(null)
    if (!over) return
    const jobId = String(active.id)
    const newStatus = String(over.id) as JobStatus
    const job = jobs.find((j) => j.id === jobId)
    if (job && job.status !== newStatus) {
      updateJob(jobId, { status: newStatus })
      load()
    }
  }

  function handleDragOver(event: DragOverEvent) {
    setOverColumn(event.over ? (String(event.over.id) as JobStatus) : null)
  }

  const activeJob = activeId ? jobs.find((j) => j.id === activeId) : null

  const statusTotals = ALL_STATUSES.map((s) => ({
    status: s,
    count: jobs.filter((j) => j.status === s).length,
    cfg: STATUS_CONFIG[s],
  }))

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Job Tracker</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{jobs.length} application{jobs.length === 1 ? '' : 's'}</p>
          </div>
          <button
            onClick={() => { setEditJob(undefined); setShowModal(true) }}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus size={14} /> Add Application
          </button>
        </div>

        <div className="flex gap-2 mt-3 flex-wrap">
          {statusTotals.filter((s) => s.count > 0 || s.status === 'applied').map(({ status, count, cfg }) => (
            <span key={status} className={clsx('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border', cfg.color, cfg.bg, cfg.border)}>
              {cfg.label}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* Kanban board */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => { setActiveId(null); setOverColumn(null) }}
      >
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-3 h-full p-4 min-w-max pb-4">
            {ALL_STATUSES.map((status) => {
              const cfg = STATUS_CONFIG[status]
              const colJobs = jobs.filter((j) => j.status === status)
              return (
                <div key={status} className="flex flex-col w-64 shrink-0">
                  <div className={clsx('flex items-center justify-between rounded-t-xl px-3 py-2 border border-b-0', cfg.bg, cfg.border)}>
                    <span className={clsx('text-xs font-semibold', cfg.color)}>{cfg.label}</span>
                    <span className={clsx('text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center', cfg.bg, cfg.color)}>
                      {colJobs.length}
                    </span>
                  </div>

                  <DroppableColumn status={status} isOver={overColumn === status && activeJob?.status !== status}>
                    {colJobs.map((job) => (
                      <DraggableJobCard
                        key={job.id}
                        job={job}
                        resumes={resumes}
                        onEdit={() => { setEditJob(job); setShowModal(true) }}
                        onDelete={() => setDeleteTarget(job)}
                      />
                    ))}
                    {colJobs.length === 0 && (
                      <div className="flex h-20 items-center justify-center text-xs text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg">
                        Drop here
                      </div>
                    )}
                    <button
                      onClick={() => { setEditJob(undefined); setShowModal(true) }}
                      className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-gray-200 dark:border-gray-600 py-2 text-xs text-gray-400 dark:text-gray-500 hover:text-blue-500 hover:border-blue-300 transition-colors"
                    >
                      <Plus size={12} /> Add here
                    </button>
                  </DroppableColumn>
                </div>
              )
            })}
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeJob && (
            <div style={{ transform: 'rotate(2deg)', opacity: 0.95 }}>
              <JobCardContent
                job={activeJob}
                resumes={resumes}
                onEdit={() => undefined}
                onDelete={() => undefined}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {(showModal || editJob) && (
        <JobModal
          job={editJob}
          resumes={resumes}
          letters={letters}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditJob(undefined) }}
        />
      )}

      {deleteTarget && (
        <DeleteJobModal
          job={deleteTarget}
          onConfirm={() => { deleteJob(deleteTarget.id); load(); setDeleteTarget(null) }}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
