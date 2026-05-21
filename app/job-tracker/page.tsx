'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import {
  Plus, X, ExternalLink, Briefcase, Edit2, Trash2, GripVertical,
  Loader2, AlertCircle, Calendar, Video, Phone, MapPin, MessageSquare, Send,
} from 'lucide-react'
import { clsx } from 'clsx'
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  useDraggable, useDroppable,
  type DragEndEvent, type DragStartEvent, type DragOverEvent,
} from '@dnd-kit/core'
import {
  getJobs, addJob, updateJob, deleteJob,
  type JobApplication, type JobStatus, type InterviewType, type JobNote,
  STATUS_CONFIG, ALL_STATUSES,
} from '@/lib/jobTrackerStorage'
import { getSavedResumes, type SavedResume } from '@/lib/resumeStorage'
import { getCoverLetters, type CoverLetter } from '@/lib/coverLetterStorage'
import { format, isPast, parseISO } from 'date-fns'

// ── Helpers ───────────────────────────────────────────────────────────────────

function isOverdue(job: JobApplication): boolean {
  if (!job.deadline) return false
  if (['offer', 'rejected'].includes(job.status)) return false
  try { return isPast(parseISO(job.deadline)) } catch { return false }
}

const INTERVIEW_ICONS: Record<string, React.ReactNode> = {
  phone:  <Phone size={10} />,
  video:  <Video size={10} />,
  onsite: <MapPin size={10} />,
}

// ── Backdrop ──────────────────────────────────────────────────────────────────

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
    company:       job?.company ?? '',
    role:          job?.role ?? '',
    location:      job?.location ?? '',
    appliedDate:   job?.appliedDate ?? format(new Date(), 'yyyy-MM-dd'),
    status:        job?.status ?? 'applied',
    resumeId:      job?.resumeId ?? '',
    coverLetterId: job?.coverLetterId ?? '',
    notes:         job?.notes ?? '',
    notesHistory:  job?.notesHistory ?? [],
    url:           job?.url ?? '',
    deadline:      job?.deadline ?? '',
    interviewDate: job?.interviewDate ?? '',
    interviewType: job?.interviewType ?? '',
  })
  const [newNote, setNewNote] = useState('')

  const canSubmit = form.company.trim().length > 0 && form.role.trim().length > 0

  const inputCls = 'w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300'

  function addNote() {
    if (!newNote.trim()) return
    const note: JobNote = { id: crypto.randomUUID(), text: newNote.trim(), createdAt: new Date().toISOString() }
    setForm(f => ({ ...f, notesHistory: [note, ...f.notesHistory] }))
    setNewNote('')
  }

  function removeNote(id: string) {
    setForm(f => ({ ...f, notesHistory: f.notesHistory.filter(n => n.id !== id) }))
  }

  return (
    <Backdrop onClose={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="jm-title" className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 id="jm-title" className="font-bold text-gray-900 dark:text-white">{job ? 'Edit Application' : 'Add Application'}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X size={16} /></button>
        </div>

        <div className="p-5 space-y-3 max-h-[72vh] overflow-auto">
          {/* Basic fields */}
          {([
            { label: 'Company *', id: 'jm-company', key: 'company', placeholder: 'e.g. Google' },
            { label: 'Role *',    id: 'jm-role',    key: 'role',    placeholder: 'e.g. Software Engineer' },
            { label: 'Location',  id: 'jm-location', key: 'location', placeholder: 'e.g. Remote, New York' },
            { label: 'Job Posting URL', id: 'jm-url', key: 'url', placeholder: 'https://...' },
          ] as const).map(({ label, id, key, placeholder }) => (
            <div key={key}>
              <label htmlFor={id} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
              <input id={id} className={inputCls} placeholder={placeholder}
                value={form[key] as string}
                onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}

          {/* Status */}
          <div>
            <label htmlFor="jm-status" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select id="jm-status" className={inputCls} value={form.status}
              onChange={(e) => setForm(f => ({ ...f, status: e.target.value as JobStatus }))}>
              {ALL_STATUSES.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
            </select>
          </div>

          {/* Dates row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="jm-date" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Applied Date</label>
              <input id="jm-date" type="date" className={inputCls} value={form.appliedDate}
                onChange={(e) => setForm(f => ({ ...f, appliedDate: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="jm-deadline" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Deadline <span className="text-red-400 text-[10px]">(overdue alert)</span>
              </label>
              <input id="jm-deadline" type="date" className={inputCls} value={form.deadline ?? ''}
                onChange={(e) => setForm(f => ({ ...f, deadline: e.target.value }))} />
            </div>
          </div>

          {/* Interview row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="jm-interview-date" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Interview Date</label>
              <input id="jm-interview-date" type="date" className={inputCls} value={form.interviewDate ?? ''}
                onChange={(e) => setForm(f => ({ ...f, interviewDate: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="jm-interview-type" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Interview Type</label>
              <select id="jm-interview-type" className={inputCls} value={form.interviewType ?? ''}
                onChange={(e) => setForm(f => ({ ...f, interviewType: e.target.value as InterviewType }))}>
                <option value="">— None —</option>
                <option value="phone">📞 Phone</option>
                <option value="video">💻 Video</option>
                <option value="onsite">📍 Onsite</option>
              </select>
            </div>
          </div>

          {/* Linked Resume + Cover Letter */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="jm-resume" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Linked Resume</label>
              <select id="jm-resume" className={inputCls} value={form.resumeId ?? ''}
                onChange={(e) => setForm(f => ({ ...f, resumeId: e.target.value }))}>
                <option value="">— None —</option>
                {resumes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="jm-letter" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Letter</label>
              <select id="jm-letter" className={inputCls} value={form.coverLetterId ?? ''}
                onChange={(e) => setForm(f => ({ ...f, coverLetterId: e.target.value }))}>
                <option value="">— None —</option>
                {letters.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
          </div>

          {/* Notes History */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
              <MessageSquare size={12} /> Notes
              {form.notesHistory.length > 0 && (
                <span className="ml-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-full px-1.5 py-0.5 text-[10px] font-semibold">
                  {form.notesHistory.length}
                </span>
              )}
            </label>

            {/* Add note input */}
            <div className="flex gap-2 mb-2">
              <input
                className={clsx(inputCls, 'flex-1')}
                placeholder="Add a note…"
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addNote() } }}
              />
              <button onClick={addNote} disabled={!newNote.trim()}
                className="flex items-center justify-center h-9 w-9 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-40">
                <Send size={13} />
              </button>
            </div>

            {/* Notes list */}
            {form.notesHistory.length > 0 && (
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {form.notesHistory.map(note => (
                  <div key={note.id} className="flex items-start gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2 group">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed">{note.text}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {format(new Date(note.createdAt), 'MMM d, yyyy · h:mm a')}
                      </p>
                    </div>
                    <button onClick={() => removeNote(note.id)}
                      className="opacity-0 group-hover:opacity-100 rounded p-0.5 text-gray-400 hover:text-red-400 transition-all shrink-0">
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={onClose} className="rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Cancel
          </button>
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
  const linkedResume = resumes.find(r => r.id === job.resumeId)
  const overdue = isOverdue(job)
  const notesCount = job.notesHistory?.length ?? 0

  return (
    <div className={clsx(
      'bg-white dark:bg-gray-800 rounded-xl border p-3.5 shadow-sm transition-shadow',
      overdue ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700',
      isDragging ? 'opacity-50' : 'hover:shadow-md'
    )}>
      {/* Overdue banner */}
      {overdue && (
        <div className="flex items-center gap-1 mb-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 px-2 py-1 text-xs font-semibold text-red-600 dark:text-red-400">
          <AlertCircle size={11} /> Overdue — deadline passed
        </div>
      )}

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
        <p className="text-xs text-gray-400 mb-1.5 ml-5 flex items-center gap-1">
          <Calendar size={10} /> {format(new Date(job.appliedDate), 'MMM d, yyyy')}
        </p>
      )}

      {/* Interview chip */}
      {job.interviewDate && (
        <div className="flex items-center gap-1 mb-1.5 ml-5 text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 rounded-md px-2 py-1 border border-purple-200 dark:border-purple-700">
          {job.interviewType ? INTERVIEW_ICONS[job.interviewType] : <Calendar size={10} />}
          <span>{job.interviewType ? `${job.interviewType.charAt(0).toUpperCase() + job.interviewType.slice(1)} interview` : 'Interview'}</span>
          <span className="ml-1 text-purple-400">· {format(new Date(job.interviewDate), 'MMM d')}</span>
        </div>
      )}

      {/* Deadline chip (non-overdue only — overdue shows banner above) */}
      {job.deadline && !overdue && (
        <div className="flex items-center gap-1 mb-1.5 ml-5 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded-md px-2 py-1">
          <AlertCircle size={10} /> Due {format(new Date(job.deadline), 'MMM d')}
        </div>
      )}

      {linkedResume && (
        <div className="flex items-center gap-1 mb-1.5 ml-5 text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 rounded-md px-2 py-1">
          <Briefcase size={10} />
          <span className="truncate">{linkedResume.name}</span>
        </div>
      )}

      {/* Notes preview */}
      {notesCount > 0 && (
        <div className="flex items-center gap-1 mb-1.5 ml-5 text-xs text-gray-500 dark:text-gray-400">
          <MessageSquare size={10} />
          <span>{notesCount} note{notesCount > 1 ? 's' : ''}</span>
          <span className="mx-1">·</span>
          <span className="truncate max-w-28 text-gray-400">{job.notesHistory[0]?.text}</span>
        </div>
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

function DroppableColumn({ status, children, isOver }: Readonly<{ status: JobStatus; children: React.ReactNode; isOver: boolean }>) {
  const { setNodeRef } = useDroppable({ id: status })
  return (
    <div ref={setNodeRef} className={clsx(
      'flex-1 overflow-y-auto rounded-b-xl border p-2 space-y-2 min-h-48 transition-colors',
      STATUS_CONFIG[status].border,
      isOver ? 'bg-blue-50/60 dark:bg-blue-900/20' : 'bg-white/60 dark:bg-gray-800/40'
    )}>
      {children}
    </div>
  )
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────

function DeleteJobModal({ job, onConfirm, onClose }: Readonly<{ job: JobApplication; onConfirm: () => void; onClose: () => void }>) {
  const [deleting, setDeleting] = useState(false)
  return (
    <Backdrop onClose={onClose} zClass="z-60">
      <div role="dialog" aria-modal="true" className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/30 mb-4">
          <Trash2 size={22} className="text-red-500" />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Delete Application?</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <span className="font-medium text-gray-700 dark:text-gray-200">{job.company} — {job.role}</span> will be permanently deleted.
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
          <button onClick={() => { setDeleting(true); setTimeout(() => { onConfirm(); setDeleting(false) }, 400) }} disabled={deleting}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-70">
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
  const { data: session } = useSession()
  const [jobs, setJobs] = useState<JobApplication[]>([])
  const [resumes, setResumes] = useState<SavedResume[]>([])
  const [letters, setLetters] = useState<CoverLetter[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editJob, setEditJob] = useState<JobApplication | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<JobApplication | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overColumn, setOverColumn] = useState<JobStatus | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const load = useCallback(async () => {
    if (session) {
      const [jobsRes, resumesRes, lettersRes] = await Promise.all([
        fetch('/api/jobs'), fetch('/api/resumes'), fetch('/api/cover-letters'),
      ])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (jobsRes.ok)    { const { jobs: raw }    = await jobsRes.json();    setJobs(raw.map((j: any) => ({ notesHistory: [], deadline: '', interviewDate: '', interviewType: '', ...j, id: j._id ?? j.id }))) }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (resumesRes.ok) { const { resumes: raw } = await resumesRes.json(); setResumes(raw.map((r: any) => ({ id: r._id ?? r.id, name: r.name, data: r.data, versions: [], savedAt: r.updatedAt ?? r.createdAt }))) }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (lettersRes.ok) { const { letters: raw } = await lettersRes.json(); setLetters(raw.map((l: any) => ({ id: l._id ?? l.id, name: l.name, savedAt: l.updatedAt ?? l.createdAt }))) }
    } else {
      setJobs(getJobs())
      setResumes(getSavedResumes())
      setLetters(getCoverLetters())
    }
  }, [session])

  useEffect(() => { load() }, [load])

  async function handleSave(data: Omit<JobApplication, 'id'>) {
    if (session) {
      if (editJob) {
        await fetch(`/api/jobs/${editJob.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      } else {
        await fetch('/api/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      }
    } else {
      if (editJob) updateJob(editJob.id, data)
      else addJob(data)
    }
    await load()
    setEditJob(undefined)
  }

  function handleDragStart(event: DragStartEvent) { setActiveId(String(event.active.id)) }
  function handleDragOver(event: DragOverEvent) { setOverColumn(event.over ? String(event.over.id) as JobStatus : null) }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null); setOverColumn(null)
    if (!over) return
    const jobId = String(active.id)
    const newStatus = String(over.id) as JobStatus
    const job = jobs.find(j => j.id === jobId)
    if (job && job.status !== newStatus) {
      if (session) await fetch(`/api/jobs/${jobId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) })
      else updateJob(jobId, { status: newStatus })
      await load()
    }
  }

  const activeJob = activeId ? jobs.find(j => j.id === activeId) : null
  const overdueCount = jobs.filter(isOverdue).length

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Job Tracker</h1>
              {overdueCount > 0 && (
                <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-full px-2 py-0.5">
                  <AlertCircle size={11} /> {overdueCount} overdue
                </span>
              )}
            </div>
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
          {ALL_STATUSES.map(s => {
            const count = jobs.filter(j => j.status === s).length
            if (count === 0 && s !== 'applied') return null
            const cfg = STATUS_CONFIG[s]
            return (
              <span key={s} className={clsx('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border', cfg.color, cfg.bg, cfg.border)}>
                {cfg.label}: {count}
              </span>
            )
          })}
        </div>
      </div>

      {/* Kanban board */}
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} onDragCancel={() => { setActiveId(null); setOverColumn(null) }}>
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-3 h-full p-4 min-w-max pb-4">
            {ALL_STATUSES.map(status => {
              const cfg = STATUS_CONFIG[status]
              const colJobs = jobs.filter(j => j.status === status)
              return (
                <div key={status} className="flex flex-col w-68 shrink-0">
                  <div className={clsx('flex items-center justify-between rounded-t-xl px-3 py-2 border border-b-0', cfg.bg, cfg.border)}>
                    <span className={clsx('text-xs font-semibold', cfg.color)}>{cfg.label}</span>
                    <span className={clsx('text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center', cfg.bg, cfg.color)}>{colJobs.length}</span>
                  </div>
                  <DroppableColumn status={status} isOver={overColumn === status && activeJob?.status !== status}>
                    {colJobs.map(job => (
                      <DraggableJobCard key={job.id} job={job} resumes={resumes}
                        onEdit={() => { setEditJob(job); setShowModal(true) }}
                        onDelete={() => setDeleteTarget(job)} />
                    ))}
                    {colJobs.length === 0 && (
                      <div className="flex h-20 items-center justify-center text-xs text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg">
                        Drop here
                      </div>
                    )}
                    <button onClick={() => { setEditJob(undefined); setShowModal(true) }}
                      className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-gray-200 dark:border-gray-600 py-2 text-xs text-gray-400 dark:text-gray-500 hover:text-blue-500 hover:border-blue-300 transition-colors">
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
              <JobCardContent job={activeJob} resumes={resumes} onEdit={() => undefined} onDelete={() => undefined} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {(showModal || editJob) && (
        <JobModal job={editJob} resumes={resumes} letters={letters} onSave={handleSave}
          onClose={() => { setShowModal(false); setEditJob(undefined) }} />
      )}

      {deleteTarget && (
        <DeleteJobModal job={deleteTarget}
          onConfirm={async () => {
            if (session) await fetch(`/api/jobs/${deleteTarget.id}`, { method: 'DELETE' })
            else deleteJob(deleteTarget.id)
            await load()
            setDeleteTarget(null)
          }}
          onClose={() => setDeleteTarget(null)} />
      )}
    </div>
  )
}
