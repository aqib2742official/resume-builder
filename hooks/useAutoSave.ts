'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useSelector } from 'react-redux'
import { useResumeData } from './useResumeData'
import type { RootState } from '@/store'

const DB_RESUME_ID_KEY = 'resume-builder-db-id'

export { DB_RESUME_ID_KEY }

export function useAutoSave() {
  const resumeData = useResumeData()
  const theme      = useSelector((state: RootState) => state.theme)
  const { data: session } = useSession()

  const [status, setStatus]         = useState<'idle' | 'saved'>('idle')
  const [currentDbId, setCurrentDbId] = useState<string | null>(
    globalThis.window === undefined ? null : sessionStorage.getItem(DB_RESUME_ID_KEY)
  )

  // Snapshot of data when last saved or loaded from DB.
  // null = no resume is "owned" yet → isDirty stays false (new/blank editor)
  const savedSnapshotRef = useRef<string | null>(null)

  const currentSnapshot = JSON.stringify({ data: resumeData, theme })
  const isDirty = savedSnapshotRef.current !== null && savedSnapshotRef.current !== currentSnapshot

  /** Call after the Redux store has been populated with a DB resume. */
  function initResumeId(id: string) {
    setCurrentDbId(id)
    sessionStorage.setItem(DB_RESUME_ID_KEY, id)
    savedSnapshotRef.current = JSON.stringify({ data: resumeData, theme })
  }

  /** Save current editor state to the cloud. Returns the DB resume _id on success, null on failure. */
  async function saveToCloud(): Promise<string | null> {
    if (!session) return null

    const payload = {
      name: resumeData.personal?.fullName?.trim() || 'My Resume',
      template: theme.templateId,
      data: resumeData,
      theme,
      completenessScore: 0,
    }

    try {
      let savedId = currentDbId

      if (savedId) {
        const res = await fetch(`/api/resumes/${savedId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) savedId = null // deleted — fall through to create
      }

      if (!savedId) {
        const res = await fetch('/api/resumes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          const { resume } = await res.json()
          savedId = resume._id as string
          setCurrentDbId(savedId)
          sessionStorage.setItem(DB_RESUME_ID_KEY, savedId)
        }
      }

      if (savedId) {
        savedSnapshotRef.current = JSON.stringify({ data: resumeData, theme })
        setStatus('saved')
        setTimeout(() => setStatus('idle'), 2000)
      }

      return savedId ?? null
    } catch (err) {
      console.error('[saveToCloud]', err)
      return null
    }
  }

  return { status, isDirty, saveToCloud, initResumeId, currentDbId }
}
