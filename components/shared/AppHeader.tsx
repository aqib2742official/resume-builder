'use client'

import { useState } from 'react'
import { FileText, Download, Trash2, Sparkles, Check, Loader2, Undo2, Redo2, Moon, Sun, Zap, FolderOpen } from 'lucide-react'
import { useSelector } from 'react-redux'
import { clsx } from 'clsx'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { ThemeCustomizer } from '@/components/editor/ThemeCustomizer'
import { ATSChecker } from '@/components/features/ATSChecker'
import { ResumeManager } from '@/components/features/ResumeManager'
import { useResumeActions } from '@/hooks/useResumeActions'
import { useAutoSave } from '@/hooks/useAutoSave'
import { usePDFExport } from '@/hooks/usePDFExport'
import { useUndoRedo } from '@/hooks/useUndoRedo'
import { usePersonal } from '@/hooks/useResumeData'
import type { RootState } from '@/store'

export function AppHeader() {
  const { loadSampleData, clearResume, toggleDarkEditor } = useResumeActions()
  const { status } = useAutoSave()
  const { exportPDF, exporting } = usePDFExport()
  const { canUndo, canRedo, undo, redo } = useUndoRedo()
  const personal = usePersonal()
  const darkEditor = useSelector((state: RootState) => state.ui.darkEditor)

  const [confirmClear, setConfirmClear] = useState(false)
  const [showATS, setShowATS] = useState(false)
  const [showManager, setShowManager] = useState(false)

  function handleClear() {
    if (confirmClear) {
      clearResume()
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 3000)
    }
  }

  const filename = personal.fullName
    ? `${personal.fullName.replaceAll(/\s+/g, '_')}_Resume.pdf`
    : 'resume.pdf'

  return (
    <>
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 shadow-sm gap-2">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <FileText size={15} />
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white hidden md:block">ResumeBuilder</span>
        </div>

        {/* Left controls — undo/redo + save status */}
        <div className="flex items-center gap-1">
          <IconButton tooltip="Undo (Ctrl+Z)" onClick={undo} disabled={!canUndo} size="sm">
            <Undo2 size={15} />
          </IconButton>
          <IconButton tooltip="Redo (Ctrl+Y)" onClick={redo} disabled={!canRedo} size="sm">
            <Redo2 size={15} />
          </IconButton>
          {status === 'saved' && (
            <span className="hidden sm:flex items-center gap-1 text-xs text-green-600 ml-1">
              <Check size={11} /> Saved
            </span>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto">
          {/* Theme customizer */}
          <ThemeCustomizer />

          {/* Dark mode toggle */}
          <IconButton
            tooltip={darkEditor ? 'Light editor' : 'Dark editor'}
            onClick={toggleDarkEditor}
            size="sm"
            className={clsx(darkEditor && 'text-blue-500 bg-blue-50')}
          >
            {darkEditor ? <Sun size={15} /> : <Moon size={15} />}
          </IconButton>

          {/* ATS checker */}
          <IconButton tooltip="ATS Keyword Checker" onClick={() => setShowATS(true)} size="sm" className="hidden sm:flex">
            <Zap size={15} />
          </IconButton>

          {/* Resume manager */}
          <IconButton tooltip="My Resumes" onClick={() => setShowManager(true)} size="sm" className="hidden sm:flex">
            <FolderOpen size={15} />
          </IconButton>

          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 hidden sm:block mx-1" />

          {/* Sample data */}
          <Button variant="ghost" size="sm" onClick={loadSampleData} className="hidden md:inline-flex">
            <Sparkles size={13} /> Sample
          </Button>

          {/* Clear */}
          <Button
            variant={confirmClear ? 'danger' : 'ghost'}
            size="sm"
            onClick={handleClear}
            className="hidden md:inline-flex"
          >
            <Trash2 size={13} />
            <span>{confirmClear ? 'Confirm?' : 'Clear'}</span>
          </Button>

          {/* PDF download */}
          <Button variant="primary" size="sm" onClick={() => exportPDF(filename)} disabled={exporting}>
            {exporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
            <span className="hidden sm:block">{exporting ? 'Exporting…' : 'Download PDF'}</span>
          </Button>
        </div>
      </header>

      {showATS && <ATSChecker onClose={() => setShowATS(false)} />}
      {showManager && <ResumeManager onClose={() => setShowManager(false)} />}
    </>
  )
}
