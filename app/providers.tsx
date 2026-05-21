'use client'

import { useRef } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { SessionProvider } from 'next-auth/react'
import { store, persistor } from '@/store'
import { FeatureFlagsProvider } from '@/contexts/FeatureFlagsContext'

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  const storeRef = useRef(store)

  return (
    <SessionProvider>
      <FeatureFlagsProvider>
        <Provider store={storeRef.current}>
          <PersistGate loading={null} persistor={persistor}>
            {children}
          </PersistGate>
        </Provider>
      </FeatureFlagsProvider>
    </SessionProvider>
  )
}
