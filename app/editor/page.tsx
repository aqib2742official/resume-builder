'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useDispatch, useSelector } from 'react-redux'
import { loadResumeData } from '@/store/resumeSlice'
import { setTemplateId } from '@/store/themeSlice'
import { AppHeader } from '@/components/shared/AppHeader'
import { MobileTabs } from '@/components/shared/MobileTabs'
import { EditorPanel } from '@/components/editor/EditorPanel'
import { ResumePreview } from '@/components/preview/ResumePreview'
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal'
import { useAutoSave } from '@/hooks/useAutoSave'
import { usePDFExport } from '@/hooks/usePDFExport'
import type { RootState } from '@/store'
import type { AppDispatch } from '@/store'
import type { TemplateId } from '@/store/themeSlice'

function EditorPageInner() {
  const mobileTab  = useSelector((state: RootState) => state.ui.mobileTab)
  const dispatch   = useDispatch<AppDispatch>()
  const router     = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()

  const resumeId       = searchParams.get('id')
  const templateParam  = searchParams.get('template') as TemplateId | null

  const { status, isDirty, saveToCloud, initResumeId } = useAutoSave()
  const { exportPDF } = usePDFExport()

  // Tracks when the DB resume data has been dispatched to Redux
  const [loadedId, setLoadedId]           = useState<string | null>(null)
  const hasLoadedRef                       = useRef(false)
  const [pendingUrl, setPendingUrl]        = useState<string | null>(null)
  const [showUnsaved, setShowUnsaved]      = useState(false)

  // ── Load resume from DB when ?id= is present ─────────────────────────────
  useEffect(() => {
    if (!resumeId || !session || hasLoadedRef.current) return
    hasLoadedRef.current = true

    fetch(`/api/resumes/${resumeId}`)
      .then((r) => r.json())
      .then(({ resume }) => {
        if (!resume) return
        dispatch(loadResumeData(resume.data))
        const tpl = templateParam ?? resume.theme?.templateId
        if (tpl) dispatch(setTemplateId(tpl as TemplateId))
        setLoadedId(resumeId)
      })
      .catch(console.error)
  }, [resumeId, session]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── After Redux reflects the loaded resume, mark snapshot as clean ────────
  useEffect(() => {
    if (loadedId) initResumeId(loadedId)
  }, [loadedId]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── After a first-time save, update URL so refresh reloads from DB ────────
  function handleNewResumeId(id: string) {
    if (!resumeId) {
      hasLoadedRef.current = true // prevent re-fetching on URL change
      router.replace(`/editor?id=${id}`)
    }
  }

  // ── Global keyboard shortcuts ────────────────────────────────────────────
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const ctrl = e.ctrlKey || e.metaKey
      if (!ctrl) return
      if (e.key === 's') { e.preventDefault(); saveToCloud() }
      if (e.key === 'p') { e.preventDefault(); exportPDF() }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [saveToCloud, exportPDF]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Browser close / refresh guard ─────────────────────────────────────────
  useEffect(() => {
    if (!isDirty) return
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  // ── In-app link-click guard ───────────────────────────────────────────────
  useEffect(() => {
    if (!isDirty) return
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return
      const href = anchor.getAttribute('href') ?? ''
      // Allow same-page anchors and staying on /editor
      if (!href || href.startsWith('#') || href.startsWith('/editor')) return
      e.preventDefault()
      e.stopPropagation()
      setPendingUrl(href)
      setShowUnsaved(true)
    }
    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [isDirty])

  async function handleSaveAndNavigate() {
    await saveToCloud()
    setShowUnsaved(false)
    if (pendingUrl) router.push(pendingUrl)
  }

  function handleDiscardAndNavigate() {
    setShowUnsaved(false)
    if (pendingUrl) router.push(pendingUrl)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AppHeader
        saveToCloud={saveToCloud}
        saveStatus={status}
        onNewResumeId={handleNewResumeId}
      />
      <MobileTabs />

      <div className="flex flex-1 overflow-hidden">
        <div className={`w-full lg:w-105 lg:shrink-0 h-full ${mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'} flex-col`}>
          <EditorPanel />
        </div>
        <div className={`flex-1 h-full ${mobileTab === 'editor' ? 'hidden lg:flex' : 'flex'} flex-col`}>
          <ResumePreview />
        </div>
      </div>

      {showUnsaved && (
        <UnsavedChangesModal
          onSave={handleSaveAndNavigate}
          onDiscard={handleDiscardAndNavigate}
          onCancel={() => { setShowUnsaved(false); setPendingUrl(null) }}
        />
      )}
    </div>
  )
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="flex h-full items-center justify-center text-gray-400 text-sm">
        Loading…
      </div>
    }>
      <EditorPageInner />
    </Suspense>
  )
}
