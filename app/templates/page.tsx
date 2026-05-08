'use client'

import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { setTemplateId } from '@/store/themeSlice'
import type { TemplateId } from '@/store/themeSlice'
import type { RootState, AppDispatch } from '@/store'
import { CheckCircle2 } from 'lucide-react'

interface TemplateCard {
  id: TemplateId
  name: string
  tagline: string
  description: string
  thumbnail: React.ReactNode
}

/* ─── CSS wireframe thumbnails ─────────────────────────────────────── */

function TwoColumnThumb({ accent = '#1e3a5f' }: { accent?: string }) {
  return (
    <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Header */}
      <rect x="0" y="0" width="120" height="28" fill={accent} />
      <rect x="8" y="7" width="50" height="5" rx="1" fill="white" opacity="0.9" />
      <rect x="8" y="16" width="30" height="3" rx="1" fill="white" opacity="0.5" />
      {/* Left col */}
      <rect x="8" y="35" width="42" height="2" rx="1" fill={accent} opacity="0.8" />
      <rect x="8" y="40" width="35" height="2" rx="1" fill="#e5e7eb" />
      <rect x="8" y="45" width="38" height="2" rx="1" fill="#e5e7eb" />
      <rect x="8" y="50" width="32" height="2" rx="1" fill="#e5e7eb" />
      <rect x="8" y="57" width="42" height="2" rx="1" fill={accent} opacity="0.8" />
      <rect x="8" y="62" width="18" height="5" rx="2" fill={accent} opacity="0.15" />
      <rect x="28" y="62" width="16" height="5" rx="2" fill={accent} opacity="0.15" />
      <rect x="8" y="70" width="22" height="5" rx="2" fill={accent} opacity="0.15" />
      {/* Right col */}
      <rect x="60" y="35" width="52" height="2" rx="1" fill={accent} opacity="0.8" />
      <rect x="60" y="40" width="44" height="2" rx="1" fill="#e5e7eb" />
      <rect x="60" y="45" width="48" height="2" rx="1" fill="#e5e7eb" />
      <rect x="60" y="50" width="40" height="2" rx="1" fill="#e5e7eb" />
      <rect x="60" y="57" width="52" height="2" rx="1" fill={accent} opacity="0.8" />
      <rect x="60" y="62" width="44" height="2" rx="1" fill="#e5e7eb" />
      <rect x="60" y="67" width="48" height="2" rx="1" fill="#e5e7eb" />
      <rect x="60" y="72" width="36" height="2" rx="1" fill="#e5e7eb" />
      {/* Divider */}
      <line x1="56" y1="32" x2="56" y2="100" stroke="#e5e7eb" strokeWidth="1" />
      {/* More content */}
      <rect x="8"  y="82" width="42" height="2" rx="1" fill={accent} opacity="0.8" />
      <rect x="8"  y="87" width="36" height="2" rx="1" fill="#e5e7eb" />
      <rect x="8"  y="92" width="40" height="2" rx="1" fill="#e5e7eb" />
      <rect x="60" y="82" width="52" height="2" rx="1" fill={accent} opacity="0.8" />
      <rect x="60" y="87" width="44" height="2" rx="1" fill="#e5e7eb" />
      <rect x="60" y="92" width="38" height="2" rx="1" fill="#e5e7eb" />
    </svg>
  )
}

function MinimalThumb({ accent = '#1e3a5f' }: { accent?: string }) {
  return (
    <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="0" y="0" width="120" height="32" fill={accent} />
      <rect x="8" y="7" width="55" height="6" rx="1" fill="white" opacity="0.9" />
      <rect x="8" y="17" width="35" height="3" rx="1" fill="white" opacity="0.5" />
      <rect x="8" y="24" width="80" height="2" rx="1" fill="white" opacity="0.3" />
      {[40, 65, 95, 125].map((y) => (
        <g key={y}>
          <rect x="8" y={y} width="72" height="2" rx="1" fill={accent} opacity="0.8" />
          <line x1="8" y1={y + 4} x2="104" y2={y + 4} stroke={accent} strokeWidth="0.5" opacity="0.4" />
          <rect x="8" y={y + 8}  width="90" height="2" rx="1" fill="#e5e7eb" />
          <rect x="8" y={y + 13} width="80" height="2" rx="1" fill="#e5e7eb" />
          <rect x="8" y={y + 18} width="85" height="2" rx="1" fill="#e5e7eb" />
        </g>
      ))}
    </svg>
  )
}

function AcademicThumb({ accent = '#1e3a5f' }: { accent?: string }) {
  return (
    <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="20" y="8" width="80" height="6" rx="1" fill="#111827" opacity="0.85" />
      <rect x="30" y="18" width="60" height="3" rx="1" fill="#6b7280" />
      <rect x="15" y="24" width="90" height="1" fill={accent} opacity="0.6" />
      <rect x="30" y="28" width="60" height="2" rx="1" fill="#9ca3af" />
      {[38, 63, 88, 113].map((y) => (
        <g key={y}>
          <rect x="8" y={y}    width="50" height="2" rx="1" fill="#111827" opacity="0.7" />
          <line x1="8" y1={y + 3} x2="112" y2={y + 3} stroke={accent} strokeWidth="0.5" opacity="0.4" />
          <rect x="8" y={y + 6}  width="95" height="2" rx="1" fill="#e5e7eb" />
          <rect x="8" y={y + 11} width="85" height="2" rx="1" fill="#e5e7eb" />
          <rect x="8" y={y + 16} width="90" height="2" rx="1" fill="#e5e7eb" />
        </g>
      ))}
    </svg>
  )
}

function ProfessionalThumb({ accent = '#1e3a5f' }: { accent?: string }) {
  return (
    <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="8" y="8"  width="65" height="6" rx="1" fill="#111827" opacity="0.85" />
      <rect x="8" y="18" width="42" height="3" rx="1" fill="#6b7280" />
      <rect x="8" y="25" width="100" height="2" rx="1" fill="#9ca3af" />
      <line x1="8" y1="32" x2="112" y2="32" stroke={accent} strokeWidth="1.5" />
      {/* Skills table */}
      <rect x="8"  y="38" width="55" height="2" rx="1" fill="#111827" opacity="0.7" />
      <line x1="8" y1="42" x2="112" y2="42" stroke={accent} strokeWidth="0.5" opacity="0.4" />
      <rect x="8"  y="46" width="24" height="2" rx="1" fill="#374151" opacity="0.6" />
      <rect x="38" y="46" width="50" height="2" rx="1" fill="#e5e7eb" />
      <rect x="8"  y="52" width="20" height="2" rx="1" fill="#374151" opacity="0.6" />
      <rect x="38" y="52" width="55" height="2" rx="1" fill="#e5e7eb" />
      <rect x="8"  y="58" width="28" height="2" rx="1" fill="#374151" opacity="0.6" />
      <rect x="38" y="58" width="45" height="2" rx="1" fill="#e5e7eb" />
      {/* Experience section */}
      <rect x="8"  y="68" width="55" height="2" rx="1" fill="#111827" opacity="0.7" />
      <line x1="8" y1="72" x2="112" y2="72" stroke={accent} strokeWidth="0.5" opacity="0.4" />
      <rect x="8"  y="76" width="55" height="2" rx="1" fill="#111827" opacity="0.6" />
      <rect x="8"  y="82" width="40" height="2" rx="1" fill={accent} opacity="0.5" />
      <rect x="8"  y="87" width="90" height="2" rx="1" fill="#e5e7eb" />
      <rect x="8"  y="92" width="85" height="2" rx="1" fill="#e5e7eb" />
      <rect x="8"  y="97" width="78" height="2" rx="1" fill="#e5e7eb" />
    </svg>
  )
}

function ExecutiveThumb({ accent = '#1e3a5f' }: { accent?: string }) {
  return (
    <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Sidebar */}
      <rect x="0" y="0" width="38" height="160" fill={accent} />
      <circle cx="19" cy="22" r="11" fill="white" opacity="0.2" />
      <rect x="6"  y="38" width="26" height="3" rx="1" fill="white" opacity="0.85" />
      <rect x="9"  y="44" width="20" height="2" rx="1" fill="white" opacity="0.5" />
      <rect x="4"  y="53" width="30" height="1" fill="white" opacity="0.2" />
      <rect x="4"  y="57" width="18" height="1.5" rx="0.5" fill="white" opacity="0.5" />
      <rect x="4"  y="62" width="28" height="1.5" rx="0.5" fill="white" opacity="0.35" />
      <rect x="4"  y="67" width="22" height="1.5" rx="0.5" fill="white" opacity="0.35" />
      <rect x="4"  y="72" width="26" height="1.5" rx="0.5" fill="white" opacity="0.35" />
      <rect x="4"  y="80" width="18" height="1.5" rx="0.5" fill="white" opacity="0.5" />
      <rect x="4"  y="84" width="5" height="5" rx="2" fill="white" opacity="0.2" />
      <rect x="11" y="84" width="5" height="5" rx="2" fill="white" opacity="0.2" />
      <rect x="18" y="84" width="5" height="5" rx="2" fill="white" opacity="0.2" />
      {/* Main area */}
      <rect x="44" y="10" width="70" height="2" rx="1" fill={accent} opacity="0.8" />
      <line  x1="44" y1="14" x2="114" y2="14" stroke={accent} strokeWidth="0.5" opacity="0.3" />
      <rect x="44" y="17" width="60" height="2" rx="1" fill="#e5e7eb" />
      <rect x="44" y="22" width="55" height="2" rx="1" fill="#e5e7eb" />
      <rect x="44" y="32" width="70" height="2" rx="1" fill={accent} opacity="0.8" />
      <line  x1="44" y1="36" x2="114" y2="36" stroke={accent} strokeWidth="0.5" opacity="0.3" />
      <rect x="44" y="39" width="55" height="2" rx="1" fill="#111827" opacity="0.6" />
      <rect x="44" y="44" width="40" height="1.5" rx="0.5" fill={accent} opacity="0.5" />
      <rect x="44" y="49" width="65" height="1.5" rx="0.5" fill="#e5e7eb" />
      <rect x="44" y="53" width="60" height="1.5" rx="0.5" fill="#e5e7eb" />
      <rect x="44" y="60" width="55" height="2" rx="1" fill="#111827" opacity="0.6" />
      <rect x="44" y="65" width="40" height="1.5" rx="0.5" fill={accent} opacity="0.5" />
      <rect x="44" y="70" width="65" height="1.5" rx="0.5" fill="#e5e7eb" />
      <rect x="44" y="74" width="55" height="1.5" rx="0.5" fill="#e5e7eb" />
    </svg>
  )
}

function ModernThumb({ accent = '#1e3a5f' }: { accent?: string }) {
  return (
    <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Header band */}
      <rect x="0" y="0" width="120" height="36" fill={accent} />
      <rect x="20" y="6" width="80" height="7" rx="1" fill="white" opacity="0.9" />
      <rect x="28" y="17" width="64" height="3" rx="1" fill="white" opacity="0.55" />
      <rect x="10" y="27" width="100" height="1.5" rx="0.5" fill="white" opacity="0.25" />
      <rect x="10" y="31" width="70" height="1.5" rx="0.5" fill="white" opacity="0.4" />
      {/* Sections with left-bar headings */}
      {[46, 90, 130].map((y) => (
        <g key={y}>
          <rect x="8" y={y}    width="3"  height="12" rx="1" fill={accent} />
          <rect x="14" y={y+2} width="40" height="2"  rx="1" fill="#111827" opacity="0.7" />
          {/* Timeline dots + lines for experience */}
          <circle cx="17" cy={y + 18} r="3" fill={accent} />
          <line x1="17" y1={y + 21} x2="17" y2={y + 35} stroke={accent} strokeWidth="1" opacity="0.2" />
          <rect x="24" y={y + 15} width="40" height="2" rx="1" fill="#111827" opacity="0.6" />
          <rect x="24" y={y + 20} width="30" height="1.5" rx="0.5" fill={accent} opacity="0.5" />
          <rect x="24" y={y + 25} width="72" height="1.5" rx="0.5" fill="#e5e7eb" />
          <rect x="24" y={y + 29} width="65" height="1.5" rx="0.5" fill="#e5e7eb" />
        </g>
      ))}
    </svg>
  )
}

/* ─── Template definitions ─────────────────────────────────────────── */

const TEMPLATES: TemplateCard[] = [
  {
    id: 'two-column',
    name: 'Classic',
    tagline: 'Two-column layout',
    description: 'A balanced two-column design with a draggable divider. Great for tech and business professionals.',
    thumbnail: <TwoColumnThumb />,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    tagline: 'Clean single-column',
    description: 'A sleek, header-first single-column layout. Modern and distraction-free.',
    thumbnail: <MinimalThumb />,
  },
  {
    id: 'academic',
    name: 'Academic',
    tagline: 'Dense CV format',
    description: 'A formal academic CV with serif typography. Ideal for research, academia and graduate applications.',
    thumbnail: <AcademicThumb />,
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'Table-style skills',
    description: 'A clean, ATS-friendly single-column format with a structured skills table. Inspired by traditional corporate résumés.',
    thumbnail: <ProfessionalThumb />,
  },
  {
    id: 'executive',
    name: 'Executive',
    tagline: 'Dark sidebar layout',
    description: 'An elegant two-panel design with a dark sidebar for contact & skills. Perfect for senior roles.',
    thumbnail: <ExecutiveThumb />,
  },
  {
    id: 'modern',
    name: 'Modern',
    tagline: 'Timeline experience',
    description: 'A contemporary single-column with a bold header band and timeline-style experience entries.',
    thumbnail: <ModernThumb />,
  },
]

export default function TemplatesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const activeId = useSelector((state: RootState) => state.theme.templateId)
  const accentColor = useSelector((state: RootState) => state.theme.accentColor)

  function handleSelect(id: TemplateId) {
    dispatch(setTemplateId(id))
    router.push('/editor')
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 custom-scroll">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Templates</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Choose a template to apply it instantly. All templates support the same color, font, and spacing customizations.
          </p>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map((tpl) => {
            const isActive = tpl.id === activeId
            return (
              <div
                key={tpl.id}
                className={`group relative flex flex-col rounded-xl border-2 bg-white dark:bg-gray-800 overflow-hidden transition-all duration-200 ${
                  isActive
                    ? 'border-blue-500 shadow-lg shadow-blue-100 dark:shadow-blue-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md'
                }`}
              >
                {/* Active badge */}
                {isActive && (
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-blue-500 px-2.5 py-1 text-[10px] font-semibold text-white shadow">
                    <CheckCircle2 size={10} />
                    Active
                  </div>
                )}

                {/* Thumbnail */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 flex items-center justify-center" style={{ height: 200 }}>
                  <div className="w-32 h-44 drop-shadow-md rounded overflow-hidden bg-white">
                    {/* Pass accent color to thumbnails by cloning with props */}
                    {tpl.id === 'two-column'   && <TwoColumnThumb   accent={accentColor} />}
                    {tpl.id === 'minimal'      && <MinimalThumb      accent={accentColor} />}
                    {tpl.id === 'academic'     && <AcademicThumb     accent={accentColor} />}
                    {tpl.id === 'professional' && <ProfessionalThumb accent={accentColor} />}
                    {tpl.id === 'executive'    && <ExecutiveThumb    accent={accentColor} />}
                    {tpl.id === 'modern'       && <ModernThumb       accent={accentColor} />}
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 p-4 gap-3">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{tpl.name}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">{tpl.tagline}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">{tpl.description}</p>
                  </div>
                  <div className="mt-auto">
                    <button
                      type="button"
                      onClick={() => handleSelect(tpl.id)}
                      className={`w-full rounded-lg py-2 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 cursor-default'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isActive ? 'Currently Active' : 'Use Template'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-600">
          You can also switch templates anytime from the Theme button in the editor toolbar.
        </p>
      </div>
    </div>
  )
}
