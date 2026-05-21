'use client'

import { useEffect, useRef, useState } from 'react'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { X, Download, Loader2, FileText } from 'lucide-react'
import resumeReducer from '@/store/resumeSlice'
import themeReducer, { DEFAULT_SECTION_ORDER, type ResumeTheme } from '@/store/themeSlice'
import uiReducer from '@/store/uiSlice'
import { usePDFExport } from '@/hooks/usePDFExport'
import { ResumeTemplate } from '@/components/preview/ResumeTemplate'
import { MinimalTemplate } from '@/components/preview/MinimalTemplate'
import { AcademicTemplate } from '@/components/preview/AcademicTemplate'
import { ProfessionalTemplate } from '@/components/preview/ProfessionalTemplate'
import { ExecutiveTemplate } from '@/components/preview/ExecutiveTemplate'
import { ModernTemplate } from '@/components/preview/ModernTemplate'
import type { ResumeData } from '@/types/resume'

interface DBResume {
  _id: string
  name: string
  template: string
  data: ResumeData
  theme: Partial<ResumeTheme>
}

interface Props {
  resumeId: string
  onClose: () => void
}

function buildPreviewStore(data: ResumeData, theme: Partial<ResumeTheme>) {
  const fullTheme: ResumeTheme = {
    accentColor: '#1e3a5f',
    headerBg:    '#1e3a5f',
    fontFamily:  'geist',
    templateId:  'two-column',
    density:     'standard',
    photoShape:  'circle',
    headingStyle:'underline',
    nameSize:    'normal',
    columnRatio: 60,
    sectionOrder: DEFAULT_SECTION_ORDER,
    ...theme,
  }
  return configureStore({
    reducer: combineReducers({
      resume: resumeReducer,
      theme:  themeReducer,
      ui:     uiReducer,
    }),
    preloadedState: {
      resume: { data, past: [], future: [], lastSaved: null },
      theme:  fullTheme,
    },
  })
}

function TemplateRenderer({ templateId }: Readonly<{ templateId: string }>) {
  if (templateId === 'minimal')       return <MinimalTemplate />
  if (templateId === 'academic')      return <AcademicTemplate />
  if (templateId === 'professional')  return <ProfessionalTemplate />
  if (templateId === 'executive')     return <ExecutiveTemplate />
  if (templateId === 'modern')        return <ModernTemplate />
  return <ResumeTemplate />
}

function PreviewContent({ resume, onClose }: { resume: DBResume; onClose: () => void }) {
  const { exportPDF, exporting } = usePDFExport()
  const filename = `${resume.name.replace(/\s+/g, '_')}_Resume.pdf`

  const containerRef = useRef<HTMLDivElement>(null)
  const sourceRef    = useRef<HTMLDivElement>(null)
  const [scale, setScale]       = useState(1)
  const [templateH, setTemplateH] = useState(1123)

  const templateId = resume.theme?.templateId ?? 'two-column'

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      setScale(Math.min(entries[0].contentRect.width / 794, 1))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const el = sourceRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setTemplateH(el.scrollHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const visualW = 794 * scale
  const visualH = templateH * scale

  return (
    <>
      {/* Off-screen full-size copy — usePDFExport reads #resume-template from here */}
      <div
        ref={sourceRef}
        aria-hidden="true"
        style={{ position: 'fixed', left: -9999, top: 0, width: 794, pointerEvents: 'none' }}
      >
        <TemplateRenderer templateId={templateId} />
      </div>

      {/* Modal */}
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        <div className="relative z-10 w-full max-w-4xl h-full flex flex-col bg-gray-100 dark:bg-gray-900 shadow-2xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <FileText size={16} className="text-sky-500 shrink-0" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">{resume.name}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-4">
              <button
                onClick={() => exportPDF(filename)}
                disabled={exporting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f2044] hover:bg-[#1a3a6e] text-white text-xs font-semibold transition-colors disabled:opacity-60"
              >
                {exporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                {exporting ? 'Preparing…' : 'Download PDF'}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Scaled preview — identical logic to ResumePreview.tsx */}
          <div ref={containerRef} className="flex-1 min-h-0 overflow-y-auto bg-gray-100 dark:bg-gray-900 custom-scroll">
            <div className="flex flex-col items-center py-8">
              <div style={{
                width: visualW,
                height: visualH,
                background: 'white',
                boxShadow: '0 4px 40px rgba(0,0,0,0.12)',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0,
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  width: 794,
                }}>
                  <TemplateRenderer templateId={templateId} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export function AdminResumePreviewModal({ resumeId, onClose }: Readonly<Props>) {
  const [resume, setResume]     = useState<DBResume | null>(null)
  const [loading, setLoading]   = useState(true)
  const [store, setStore]       = useState<ReturnType<typeof buildPreviewStore> | null>(null)

  useEffect(() => {
    fetch(`/api/admin/resumes/${resumeId}`)
      .then((r) => r.json())
      .then(({ resume: r }) => {
        if (!r) return
        setResume(r as DBResume)
        setStore(buildPreviewStore(r.data as ResumeData, (r.theme ?? {}) as Partial<ResumeTheme>))
      })
      .finally(() => setLoading(false))
  }, [resumeId])

  if (loading) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 flex items-center gap-3">
          <Loader2 size={20} className="animate-spin text-sky-500" />
          <span className="text-sm text-gray-700 dark:text-gray-200">Loading resume…</span>
        </div>
      </div>
    )
  }

  if (!resume || !store) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Resume not found.</p>
          <button onClick={onClose} className="text-sm text-sky-600 hover:underline">Close</button>
        </div>
      </div>
    )
  }

  return (
    <Provider store={store}>
      <PreviewContent resume={resume} onClose={onClose} />
    </Provider>
  )
}
