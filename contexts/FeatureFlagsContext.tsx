'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { DEFAULT_FEATURE_FLAGS, type FeatureFlags } from '@/lib/settingsTypes'

const FeatureFlagsContext = createContext<FeatureFlags>(DEFAULT_FEATURE_FLAGS)

export function FeatureFlagsProvider({ children }: { children: React.ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FEATURE_FLAGS)

  useEffect(() => {
    fetch('/api/features')
      .then((r) => r.json())
      .then((d) => { if (d.features) setFlags(d.features) })
      .catch(() => {})
  }, [])

  return (
    <FeatureFlagsContext.Provider value={flags}>
      {children}
    </FeatureFlagsContext.Provider>
  )
}

export function useFeatureFlags() {
  return useContext(FeatureFlagsContext)
}
