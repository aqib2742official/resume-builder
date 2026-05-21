'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Search, Plus, SortAsc, GitCompare, X, Cloud, LogIn } from 'lucide-react'
import { AuthToSaveModal } from '@/components/shared/AuthToSaveModal'
import type { SavedResume } from '@/lib/resumeStorage'
import { ResumeCard } from '@/components/resumes/ResumeCard'
import { calculateCompleteness } from '@/lib/completenessScore'
import { useDispatch } from 'react-redux'
import { loadResumeData } from '@/store/resumeSlice'
import { defaultResume } from '@/constants/defaultResume'
import type { AppDispatch } from '@/store'
import { ResumeComparison } from '@/components/features/ResumeComparison'
import type { ResumeData } from '@/types/resume'

type SortKey = 'date-desc' | 'date-asc' | 'name' | 'completeness'

// Normalize a raw DB resume document to SavedResume shape
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeDbResume(r: any): SavedResume {
  return {
    id: r._id ?? r.id,
    name: r.name ?? 'My Resume',
    data: r.data as ResumeData,
    versions: (r.versions ?? []).map((v: { versionId?: string; label?: string; data: ResumeData; savedAt: string }) => ({
      versionId: v.versionId ?? crypto.randomUUID(),
      label: v.label ?? 'v1',
      data: v.data,
      savedAt: v.savedAt,
    })),
    savedAt: r.updatedAt ?? r.savedAt ?? r.createdAt ?? new Date().toISOString(),
    isFavorite: r.isFavorite ?? false,
  }
}

export default function ResumesPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { data: session } = useSession()

  const [resumes, setResumes] = useState<SavedResume[]>([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('date-desc')
  const [compareMode, setCompareMode] = useState(false)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  async function load() {
    if (!session) return
    const res = await fetch('/api/resumes')
    if (res.ok) {
      const { resumes: dbResumes } = await res.json()
      setResumes(dbResumes.map(normalizeDbResume))
    }
  }

  useEffect(() => { load() }, [session])

  // DB-backed handlers passed to ResumeCard when signed in
  async function handleDbDelete(id: string) {
    await fetch(`/api/resumes/${id}`, { method: 'DELETE' })
    await load()
  }

  async function handleDbRename(id: string, name: string) {
    await fetch(`/api/resumes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    await load()
  }

  async function handleDbDuplicate(id: string) {
    const source = resumes.find(r => r.id === id)
    if (!source) return
    await fetch('/api/resumes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${source.name} (copy)`,
        data: source.data,
        template: 'classic',
      }),
    })
    await load()
  }

  async function handleDbFavorite(id: string, current: boolean) {
    if (current) {
      await fetch(`/api/resumes/${id}/favorite`, { method: 'DELETE' })
      setResumes(prev => prev.map(r => r.id === id ? { ...r, isFavorite: false } : r))
    } else {
      await fetch(`/api/resumes/${id}/favorite`, { method: 'POST' })
      setResumes(prev => prev.map(r => ({ ...r, isFavorite: r.id === id })))
    }
  }

  const filtered = useMemo(() => {
    let list = resumes.filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.data.personal.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      r.data.personal.jobTitle?.toLowerCase().includes(search.toLowerCase())
    )
    if (sort === 'date-desc') list = [...list].sort((a, b) => b.savedAt.localeCompare(a.savedAt))
    else if (sort === 'date-asc') list = [...list].sort((a, b) => a.savedAt.localeCompare(b.savedAt))
    else if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    else if (sort === 'completeness') list = [...list].sort((a, b) => calculateCompleteness(b.data).total - calculateCompleteness(a.data).total)
    return list
  }, [resumes, search, sort])

  function handleCompareSelect(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 2) return [prev[1], id]
      return [...prev, id]
    })
  }

  async function createNew() {
    let resumeData = { ...defaultResume }

    if (session) {
      try {
        const res = await fetch('/api/profile')
        if (res.ok) {
          const { user } = await res.json()
          resumeData = {
            ...defaultResume,
            personal: {
              ...defaultResume.personal,
              fullName:  user.fullName  || defaultResume.personal.fullName,
              email:     user.email     || defaultResume.personal.email,
              phone:     user.phone     || defaultResume.personal.phone,
              photo:     user.avatar    || defaultResume.personal.photo,
            },
          }
        }
      } catch { /* fall through to default */ }
    }

    dispatch(loadResumeData(resumeData))
    router.push('/editor')
  }

  const compareResumes = compareIds.map((id) => resumes.find((r) => r.id === id)).filter(Boolean) as SavedResume[]

  return (
    <div className="flex flex-col h-full overflow-auto bg-gray-50 dark:bg-gray-950">
      {/* Page header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Resumes</h1>
              {session && (
                <span className="flex items-center gap-1 text-xs text-sky-600 bg-sky-50 dark:bg-sky-900/20 dark:text-sky-400 px-2 py-0.5 rounded-full font-medium">
                  <Cloud size={11} /> Cloud
                </span>
              )}
            </div>
            {session ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{resumes.length} saved resume{resumes.length === 1 ? '' : 's'}</p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Sign in to view your saved resumes</p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search resumes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-52 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
              />
            </div>

            <div className="relative flex items-center gap-1">
              <SortAsc size={14} className="text-gray-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pl-2 pr-7 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="date-desc">Newest first</option>
                <option value="date-asc">Oldest first</option>
                <option value="name">Name A–Z</option>
                <option value="completeness">By completeness</option>
              </select>
            </div>

            <button
              onClick={() => { setCompareMode((v) => !v); setCompareIds([]) }}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${compareMode ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <GitCompare size={14} />
              Compare
            </button>

            <button
              onClick={createNew}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <Plus size={14} />
              New Resume
            </button>
          </div>
        </div>

        {compareMode && (
          <div className="mt-3 flex items-center gap-3 rounded-lg bg-blue-50 border border-blue-200 px-4 py-2.5">
            <GitCompare size={15} className="text-blue-600 shrink-0" />
            <p className="text-sm text-blue-700 flex-1">
              {compareIds.length === 0 && 'Select 2 resumes to compare side-by-side'}
              {compareIds.length === 1 && 'Select 1 more resume'}
              {compareIds.length === 2 && 'Ready to compare!'}
            </p>
            {compareIds.length === 2 && (
              <button
                onClick={() => setShowComparison(true)}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Compare Now
              </button>
            )}
            <button onClick={() => { setCompareMode(false); setCompareIds([]) }} className="text-blue-500 hover:text-blue-700">
              <X size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="flex-1 p-6">
        {!session ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 dark:bg-sky-900/20 mb-4">
              <LogIn size={28} className="text-sky-500" />
            </div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">Sign in to access your resumes</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Your resumes are saved to the cloud and accessible from anywhere.</p>
            <button
              onClick={() => setShowAuth(true)}
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 transition-colors"
            >
              Sign In / Create Account
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            {search ? (
              <>
                <Search size={32} className="text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No resumes match &quot;{search}&quot;</p>
                <button onClick={() => setSearch('')} className="mt-2 text-sm text-blue-600 hover:underline">Clear search</button>
              </>
            ) : (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20 mb-4">
                  <Plus size={28} className="text-blue-400" />
                </div>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">No saved resumes yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Create your first resume and save it to your account</p>
                <button
                  onClick={createNew}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Create New Resume
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filtered.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onUpdate={load}
                compareMode={compareMode}
                compareSelected={compareIds.includes(resume.id)}
                onCompareSelect={handleCompareSelect}
                {...(session ? {
                  onDelete: handleDbDelete,
                  onRename: handleDbRename,
                  onDuplicate: handleDbDuplicate,
                  onFavorite: handleDbFavorite,
                } : {})}
              />
            ))}
          </div>
        )}
      </div>

      {showComparison && compareResumes.length === 2 && (
        <ResumeComparison
          resumeA={compareResumes[0]}
          resumeB={compareResumes[1]}
          onClose={() => setShowComparison(false)}
        />
      )}

      {showAuth && (
        <AuthToSaveModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => { setShowAuth(false); load() }}
          title="Access your resumes"
          subtitle="Sign in or create a free account to view and manage your cloud resumes."
        />
      )}
    </div>
  )
}
