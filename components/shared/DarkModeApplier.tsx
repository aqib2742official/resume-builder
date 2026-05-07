'use client'

import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

export function DarkModeApplier() {
  const darkMode = useSelector((state: RootState) => state.ui.darkMode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return null
}
