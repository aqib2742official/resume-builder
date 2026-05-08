'use client'

import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '@/store'
import { seedInitialResumes } from '@/lib/resumeStorage'

export function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef(store)

  useEffect(() => {
    seedInitialResumes()
  }, [])

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
