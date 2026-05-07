'use client'

import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { AppHeader } from '@/components/shared/AppHeader'
import { MobileTabs } from '@/components/shared/MobileTabs'
import { EditorPanel } from '@/components/editor/EditorPanel'
import { ResumePreview } from '@/components/preview/ResumePreview'

export default function Home() {
  const mobileTab = useSelector((state: RootState) => state.ui.mobileTab)

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader />
      <MobileTabs />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor panel — hidden on mobile when preview tab active */}
        <div
          className={`
            w-full lg:w-105 lg:shrink-0 h-full
            ${mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'}
            flex-col
          `}
        >
          <EditorPanel />
        </div>

        {/* Preview panel — hidden on mobile when editor tab active */}
        <div
          className={`
            flex-1 h-full
            ${mobileTab === 'editor' ? 'hidden lg:flex' : 'flex'}
            flex-col
          `}
        >
          <ResumePreview />
        </div>
      </div>
    </div>
  )
}
