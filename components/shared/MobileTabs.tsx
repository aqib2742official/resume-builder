'use client'

import { useSelector } from 'react-redux'
import { PenLine, Eye } from 'lucide-react'
import { clsx } from 'clsx'
import type { RootState } from '@/store'
import { useResumeActions } from '@/hooks/useResumeActions'

export function MobileTabs() {
  const activeTab = useSelector((state: RootState) => state.ui.mobileTab)
  const { setMobileTab } = useResumeActions()

  return (
    <div className="flex border-b border-gray-200 bg-white lg:hidden">
      {(['editor', 'preview'] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => setMobileTab(tab)}
          className={clsx(
            'flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
            activeTab === tab
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          {tab === 'editor' ? <PenLine size={15} /> : <Eye size={15} />}
          {tab === 'editor' ? 'Edit' : 'Preview'}
        </button>
      ))}
    </div>
  )
}
