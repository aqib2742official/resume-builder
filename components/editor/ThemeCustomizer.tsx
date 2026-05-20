'use client'

import { useState } from 'react'
import { Palette, RotateCcw, Columns2, AlignJustify, Circle, Square, ImageOff, GraduationCap, FileText, LayoutPanelLeft, Zap } from 'lucide-react'
import { clsx } from 'clsx'
import { ACCENT_PRESETS, FONT_OPTIONS } from '@/store/themeSlice'
import type { Density, PhotoShape, TemplateId, HeadingStyle, NameSize } from '@/store/themeSlice'
import { useTheme } from '@/hooks/useTheme'

const DENSITY_OPTIONS: { value: Density; label: string }[] = [
  { value: 'compact',  label: 'Compact'  },
  { value: 'standard', label: 'Standard' },
  { value: 'spacious', label: 'Spacious' },
]

const PHOTO_OPTIONS: { value: PhotoShape; icon: React.ReactNode; label: string }[] = [
  { value: 'circle', icon: <Circle size={14} />,   label: 'Circle'  },
  { value: 'square', icon: <Square size={14} />,   label: 'Square'  },
  { value: 'none',   icon: <ImageOff size={14} />, label: 'None'    },
]

const TEMPLATE_OPTIONS: { value: TemplateId; icon: React.ReactNode; label: string; sub: string }[] = [
  { value: 'two-column',   icon: <Columns2 size={15} />,        label: 'Classic',      sub: 'Two columns'   },
  { value: 'minimal',      icon: <AlignJustify size={15} />,    label: 'Minimal',      sub: 'Single column' },
  { value: 'academic',     icon: <GraduationCap size={15} />,   label: 'Academic',     sub: 'CV / dense'    },
  { value: 'professional', icon: <FileText size={15} />,        label: 'Professional', sub: 'Clean & formal'},
  { value: 'executive',    icon: <LayoutPanelLeft size={15} />, label: 'Executive',    sub: 'Sidebar layout'},
  { value: 'modern',       icon: <Zap size={15} />,             label: 'Modern',       sub: 'Timeline style'},
]

const HEADING_STYLE_OPTIONS: { value: HeadingStyle; label: string; preview: React.ReactNode }[] = [
  {
    value: 'underline',
    label: 'Underline',
    preview: (
      <div className="w-full">
        <div className="text-[9px] font-bold uppercase tracking-widest text-blue-600 border-b border-blue-600 pb-0.5">Section</div>
      </div>
    ),
  },
  {
    value: 'leftbar',
    label: 'Left Bar',
    preview: (
      <div className="w-full pl-1.5 border-l-2 border-blue-600">
        <div className="text-[9px] font-bold uppercase tracking-widest text-blue-600">Section</div>
      </div>
    ),
  },
  {
    value: 'plain',
    label: 'Plain',
    preview: (
      <div className="w-full">
        <div className="text-[9px] font-bold uppercase tracking-widest text-blue-600">Section</div>
      </div>
    ),
  },
  {
    value: 'filled',
    label: 'Filled',
    preview: (
      <div className="w-full">
        <div className="inline-block text-[9px] font-bold uppercase tracking-widest text-white bg-blue-600 px-1.5 py-0.5 rounded-sm">Section</div>
      </div>
    ),
  },
]

const NAME_SIZE_OPTIONS: { value: NameSize; label: string; size: string }[] = [
  { value: 'normal', label: 'Normal', size: 'text-sm'  },
  { value: 'large',  label: 'Large',  size: 'text-base' },
  { value: 'xlarge', label: 'XLarge', size: 'text-lg'  },
]

export function ThemeCustomizer() {
  const [open, setOpen] = useState(false)
  const {
    theme,
    setAccentColor, setHeaderBg, applyPreset,
    setFontFamily, setTemplateId, setDensity,
    setPhotoShape, setHeadingStyle, setNameSize, setColumnRatio,
    resetTheme,
  } = useTheme()

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        title="Customize theme"
      >
        <Palette size={14} />
        <span className="hidden sm:block">Theme</span>
        <span
          className="w-3.5 h-3.5 rounded-full border border-white/50 shadow-sm shrink-0"
          style={{ backgroundColor: theme.accentColor }}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-40 w-80 rounded-xl border border-gray-200 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-xl overflow-y-auto max-h-[82vh]">
            <div className="p-4 flex flex-col gap-5">

              {/* Header */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">Customize Theme</p>
                <button
                  type="button"
                  onClick={resetTheme}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                >
                  <RotateCcw size={11} /> Reset
                </button>
              </div>

              {/* Layout */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">Layout</p>
                <div className="grid grid-cols-3 gap-2">
                  {TEMPLATE_OPTIONS.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTemplateId(t.value)}
                      className={clsx(
                        'flex flex-col items-center gap-1.5 rounded-lg p-3 border transition-all text-center',
                        theme.templateId === t.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
                          : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-500'
                      )}
                    >
                      {t.icon}
                      <span className="text-xs font-medium">{t.label}</span>
                      <span className="text-[10px] text-gray-400 dark:text-slate-500">{t.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color presets */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">Color Scheme</p>
                <div className="grid grid-cols-4 gap-2">
                  {ACCENT_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={clsx(
                        'flex flex-col items-center gap-1 rounded-lg p-2 border transition-all',
                        theme.accentColor === preset.accent
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                          : 'border-gray-100 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500'
                      )}
                    >
                      <span className="w-6 h-6 rounded-full shadow-sm" style={{ backgroundColor: preset.header }} />
                      <span className="text-[10px] text-gray-600 dark:text-slate-400">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom accent */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">Custom Color</p>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={theme.accentColor}
                    onChange={(e) => { setAccentColor(e.target.value); setHeaderBg(e.target.value) }}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-200 dark:border-slate-600"
                  />
                  <span className="text-xs font-mono text-gray-600 dark:text-slate-400">{theme.accentColor}</span>
                </div>
              </div>

              {/* Font family */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">Font Family</p>
                <div className="flex flex-col gap-1">
                  {FONT_OPTIONS.map((font) => (
                    <button
                      key={font.value}
                      type="button"
                      onClick={() => setFontFamily(font.value)}
                      className={clsx(
                        'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors text-left',
                        theme.fontFamily === font.value
                          ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 font-semibold'
                          : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                      )}
                      style={{ fontFamily: font.css }}
                    >
                      {font.name}
                      <span className="ml-auto text-xs text-gray-400 dark:text-slate-500" style={{ fontFamily: 'system-ui' }}>Aa</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section heading style */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">Heading Style</p>
                <div className="grid grid-cols-2 gap-2">
                  {HEADING_STYLE_OPTIONS.map((h) => (
                    <button
                      key={h.value}
                      type="button"
                      onClick={() => setHeadingStyle(h.value)}
                      className={clsx(
                        'flex flex-col gap-2 rounded-lg p-2.5 border transition-all text-left',
                        theme.headingStyle === h.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                          : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500'
                      )}
                    >
                      {h.preview}
                      <span className={clsx('text-[10px] font-medium',
                        theme.headingStyle === h.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-slate-400'
                      )}>
                        {h.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name size */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">Name Size</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {NAME_SIZE_OPTIONS.map((n) => (
                    <button
                      key={n.value}
                      type="button"
                      onClick={() => setNameSize(n.value)}
                      className={clsx(
                        'flex flex-col items-center gap-1 rounded-lg py-2 px-1 border transition-all',
                        theme.nameSize === n.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                          : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500'
                      )}
                    >
                      <span className={clsx(n.size, 'font-bold text-gray-700 dark:text-slate-200 leading-none')}>Aa</span>
                      <span className={clsx('text-[10px] font-medium',
                        theme.nameSize === n.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-slate-400'
                      )}>
                        {n.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Column width — two-column only */}
              {theme.templateId === 'two-column' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Column Width</p>
                    <span className="text-xs font-mono text-gray-500 dark:text-slate-400">
                      {theme.columnRatio}% · {100 - theme.columnRatio}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={30}
                    max={70}
                    value={theme.columnRatio}
                    onChange={(e) => setColumnRatio(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">
                    <span>Wider right</span>
                    <span>Wider left</span>
                  </div>
                </div>
              )}

              {/* Spacing */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">Spacing</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {DENSITY_OPTIONS.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDensity(d.value)}
                      className={clsx(
                        'rounded-md py-1.5 text-xs font-medium border transition-all',
                        theme.density === d.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
                          : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-gray-300'
                      )}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo shape */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">Photo Shape</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {PHOTO_OPTIONS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPhotoShape(p.value)}
                      className={clsx(
                        'flex flex-col items-center gap-1 rounded-md py-2 text-[10px] font-medium border transition-all',
                        theme.photoShape === p.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
                          : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-gray-300'
                      )}
                    >
                      {p.icon}
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  )
}
