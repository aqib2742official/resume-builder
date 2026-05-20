'use client'

import { useState } from 'react'

export function usePDFExport() {
  const [exporting, setExporting] = useState(false)

  async function exportPDF(_filename = 'resume.pdf') {
    setExporting(true)

    const resumeEl = document.getElementById('resume-template')
    if (!resumeEl) { setExporting(false); return }

    const stylesHtml = Array.from(
      document.querySelectorAll<HTMLElement>('style, link[rel="stylesheet"]')
    ).map((el) => el.outerHTML).join('\n')

    const clone = resumeEl.cloneNode(true) as HTMLElement
    clone.querySelectorAll('.no-print').forEach((el) => el.remove())
    clone.removeAttribute('id')

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  ${stylesHtml}
  <style>
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    html, body { margin: 0; padding: 0; background: #fff; }
    .a4-page { width: 210mm; min-height: 297mm; box-shadow: none !important; }
    .page-break-avoid { break-inside: avoid; page-break-inside: avoid; }

    /* margin:0 removes browser-added headers/footers (URL, page number, date).
       The template itself provides all internal padding. */
    @page { size: A4 portrait; margin: 0; }
  </style>
</head>
<body>${clone.outerHTML}</body>
</html>`

    const blob = new Blob([html], { type: 'text/html' })
    const url  = URL.createObjectURL(blob)

    const printWindow = window.open(url, '_blank', 'width=900,height=700')
    if (!printWindow) { URL.revokeObjectURL(url); setExporting(false); return }

    printWindow.addEventListener('load', () => {
      printWindow.focus()
      printWindow.print()
      URL.revokeObjectURL(url)
      setExporting(false)
      // Close the preview window after the print dialog is dismissed
      printWindow.addEventListener('afterprint', () => printWindow.close())
    })
  }

  return { exportPDF, exporting }
}
