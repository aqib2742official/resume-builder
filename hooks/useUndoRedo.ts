'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/store'
import { undo, redo } from '@/store/resumeSlice'

export function useUndoRedo() {
  const dispatch = useDispatch<AppDispatch>()
  const canUndo = useSelector((state: RootState) => state.resume.past.length > 0)
  const canRedo = useSelector((state: RootState) => state.resume.future.length > 0)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.ctrlKey || e.metaKey
      if (!mod) return
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        dispatch(undo())
      } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
        e.preventDefault()
        dispatch(redo())
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dispatch])

  return {
    canUndo,
    canRedo,
    undo: () => dispatch(undo()),
    redo: () => dispatch(redo()),
  }
}
