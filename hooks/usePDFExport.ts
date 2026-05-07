'use client'

import { useState } from 'react'

export function usePDFExport() {
  const [exporting, setExporting] = useState(false)

  async function exportPDF(filename = 'resume.pdf') {
    setExporting(true)
    try {
      const element = document.getElementById('resume-template')
      if (!element) return

      const html2pdf = (await import('html2pdf.js')).default

      const opt = {
        margin: 0,
        filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
      }

      await html2pdf().set(opt).from(element).save()
    } finally {
      setExporting(false)
    }
  }

  return { exportPDF, exporting }
}
