'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useSelector } from 'react-redux'
import { useLastSaved, useResumeData } from './useResumeData'
import type { RootState } from '@/store'

// Key used to track which DB resume is currently loaded in this editor session
const DB_RESUME_ID_KEY = 'resume-builder-db-id'

export function useAutoSave() {
  const lastSaved  = useLastSaved()
  const resumeData = useResumeData()
  const theme      = useSelector((state: RootState) => state.theme)
  const { data: session } = useSession()

  const [status, setStatus] = useState<'idle' | 'saved'>('idle')
  // dbResumeId tracks the MongoDB _id of the currently open resume for upserts
  const dbResumeIdRef = useRef<string | null>(
    globalThis.window === undefined ? null : sessionStorage.getItem(DB_RESUME_ID_KEY)
  )

  useEffect(() => {
    if (!lastSaved) return
    setStatus('saved')
    const timer = setTimeout(() => setStatus('idle'), 2000)
    return () => clearTimeout(timer)
  }, [lastSaved])

  async function saveToCloud(): Promise<void> {
    if (!session) return

    const payload = {
      name: resumeData.personal?.fullName?.trim() || 'My Resume',
      template: theme.templateId,
      data: resumeData,
      theme,
      completenessScore: 0,
    }

    const existingId = dbResumeIdRef.current

    try {
      if (existingId) {
        // Update existing resume
        const res = await fetch(`/api/resumes/${existingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          // Resume may have been deleted — create a new one
          dbResumeIdRef.current = null
          sessionStorage.removeItem(DB_RESUME_ID_KEY)
          await saveToCloud()
        }
      } else {
        // Create new resume
        const res = await fetch('/api/resumes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          const { resume } = await res.json()
          dbResumeIdRef.current = resume._id
          sessionStorage.setItem(DB_RESUME_ID_KEY, resume._id)
        }
      }
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2000)
    } catch (err) {
      console.error('[saveToCloud]', err)
    }
  }

  return { status, lastSaved, saveToCloud }
}
