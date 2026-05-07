'use client'

import { useEffect, useRef, useState, Fragment } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { ResumeTemplate } from './ResumeTemplate'
import { MinimalTemplate } from './MinimalTemplate'
import { AcademicTemplate } from './AcademicTemplate'

const A4_H   = 1123
const PAGE_GAP = 28

export function ResumePreview() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sourceRef    = useRef<HTMLDivElement>(null)
  const [scale, setScale]           = useState(1)
  const [templateH, setTemplateH]   = useState(A4_H)
  const [pageStarts, setPageStarts] = useState<number[]>([0])
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

  // Compute content-aware page break positions so preview matches PDF output.
  // We break BEFORE any .page-break-avoid element that would be split at an A4 boundary.
  useEffect(() => {
    if (templateH <= A4_H) { setPageStarts([0]); return }

    // The source template (no noPdfId) keeps id="resume-template"
    const templateEl = document.getElementById('resume-template')
    if (!templateEl) { setPageStarts([0]); return }

    const templateTop = templateEl.getBoundingClientRect().top
    const avoidEls    = Array.from(templateEl.querySelectorAll('.page-break-avoid'))

    const starts  = [0]
    let idealBreak = A4_H

    while (idealBreak < templateH) {
      const straddle = avoidEls.find((el) => {
        const t = el.getBoundingClientRect().top    - templateTop
        const b = el.getBoundingClientRect().bottom - templateTop
        return t < idealBreak && b > idealBreak
      })

      // Pull the break back by SECTION_LEAD px so page 2 begins with
      // the flex-gap whitespace above the section, not flush to the heading.
      const SECTION_LEAD = 20
      const prevPageStart = starts[starts.length - 1]
      const candidateBreak = straddle
        ? straddle.getBoundingClientRect().top - templateTop - SECTION_LEAD
        : idealBreak
      // If the section is taller than a full page we can't avoid breaking inside it;
      // fall back to the ideal break so the while-loop always advances.
      const breakAt = candidateBreak > prevPageStart ? candidateBreak : idealBreak

      starts.push(breakAt)
      idealBreak = breakAt + A4_H
    }

    setPageStarts(starts)
  }, [templateH])

  const visualW   = 794 * scale
  const pageCount = pageStarts.length

  function TemplateComponent({ noPdfId }: { noPdfId?: boolean }) {
    if (templateId === 'minimal') return <MinimalTemplate noPdfId={noPdfId} />
    if (templateId === 'academic') return <AcademicTemplate noPdfId={noPdfId} />
    return <ResumeTemplate noPdfId={noPdfId} />
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto bg-gray-100 custom-scroll">
      {/*
        Hidden source template — full natural render at 794px.
        - Has id="resume-template" for PDF export
        - position:fixed keeps it at y=0 viewport-relative so getBoundingClientRect()
          gives natural element offsets regardless of page scroll
        - ResizeObserver reads scrollHeight to track content height
      */}
      <div
        ref={sourceRef}
        id="pdf-source"
        style={{ position: 'fixed', left: -9999, top: 0, width: 794, pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <TemplateComponent />
      </div>

      <div className="flex flex-col items-center py-8">
        {pageStarts.map((pageStart, pageIndex) => {
          const pageEnd = pageStarts[pageIndex + 1] ?? templateH
          const pageH   = (pageEnd - pageStart) * scale

          return (
            <Fragment key={`page-start-${pageStart}`}>
              {/* Clip window: shows exactly one page worth of the template */}
              <div style={{
                width: visualW,
                height: pageH,
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
                boxShadow: '0 4px 40px rgba(0,0,0,0.12)',
              }}>
                <div style={{
                  position: 'absolute',
                  top: -pageStart * scale,
                  left: 0,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  width: 794,
                }}>
                  <TemplateComponent noPdfId />
                </div>
              </div>

              {pageIndex < pageCount - 1 && (
                <div
                  className="no-print"
                  style={{
                    width: visualW,
                    height: PAGE_GAP,
                    background: '#d1d5db',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{
                    fontSize: 10,
                    color: '#6b7280',
                    fontFamily: 'system-ui, sans-serif',
                    letterSpacing: '0.08em',
                    userSelect: 'none',
                  }}>
                    — Page {pageIndex + 2} —
                  </span>
                </div>
              )}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
