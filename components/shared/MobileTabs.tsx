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
    <div className="flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0d1424] lg:hidden shrink-0">
      {(['editor', 'preview'] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => setMobileTab(tab)}
          className={clsx(
            'flex flex-1 items-center justify-center gap-2 h-11 text-sm font-semibold transition-colors',
            activeTab === tab
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          )}
        >
          {tab === 'editor' ? <PenLine size={15} /> : <Eye size={15} />}
          {tab === 'editor' ? 'Edit' : 'Preview'}
        </button>
      ))}
    </div>
  )
}
