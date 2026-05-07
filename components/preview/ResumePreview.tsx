'use client'

import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { ResumeTemplate } from './ResumeTemplate'
import { MinimalTemplate } from './MinimalTemplate'

export function ResumePreview() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const templateId = useSelector((state: RootState) => state.theme.templateId)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width
      setScale(Math.min(width / 794, 1))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto bg-gray-100 custom-scroll">
      <div className="flex justify-center py-8" style={{ minHeight: `${1123 * scale + 64}px` }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', width: 794, flexShrink: 0 }}>
          {templateId === 'minimal' ? <MinimalTemplate /> : <ResumeTemplate />}
        </div>
      </div>
    </div>
  )
}
