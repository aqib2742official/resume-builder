'use client'

import { useEffect, useState } from 'react'
import { useLastSaved } from './useResumeData'

export function useAutoSave() {
  const lastSaved = useLastSaved()
  const [status, setStatus] = useState<'idle' | 'saved'>('idle')

  useEffect(() => {
    if (!lastSaved) return
    setStatus('saved')
    const timer = setTimeout(() => setStatus('idle'), 2000)
    return () => clearTimeout(timer)
  }, [lastSaved])

  return { status, lastSaved }
}
