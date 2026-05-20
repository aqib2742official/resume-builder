'use client'

import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { ResumeTemplate } from './ResumeTemplate'
import { MinimalTemplate } from './MinimalTemplate'
import { AcademicTemplate } from './AcademicTemplate'
import { ProfessionalTemplate } from './ProfessionalTemplate'
import { ExecutiveTemplate } from './ExecutiveTemplate'
import { ModernTemplate } from './ModernTemplate'

export function ResumePreview() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sourceRef    = useRef<HTMLDivElement>(null)
  const [scale, setScale]         = useState(1)
  const [templateH, setTemplateH] = useState(1123)
  const templateId = useSelector((state: RootState) => state.theme.templateId)

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

  function TemplateComponent({ noPdfId }: { noPdfId?: boolean }) {
    if (templateId === 'minimal')       return <MinimalTemplate noPdfId={noPdfId} />
    if (templateId === 'academic')      return <AcademicTemplate noPdfId={noPdfId} />
    if (templateId === 'professional')  return <ProfessionalTemplate noPdfId={noPdfId} />
    if (templateId === 'executive')     return <ExecutiveTemplate noPdfId={noPdfId} />
    if (templateId === 'modern')        return <ModernTemplate noPdfId={noPdfId} />
    return <ResumeTemplate noPdfId={noPdfId} />
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto bg-gray-100 custom-scroll">
      <div
        ref={sourceRef}
        id="pdf-source"
        style={{ position: 'fixed', left: -9999, top: 0, width: 794, pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <TemplateComponent />
      </div>

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
            <TemplateComponent noPdfId />
          </div>
        </div>
      </div>
    </div>
  )
}
