'use client'

import { X, Keyboard } from 'lucide-react'

const SHORTCUTS = [
  { keys: ['Ctrl', 'Z'],          mac: ['⌘', 'Z'],          action: 'Undo' },
  { keys: ['Ctrl', 'Y'],          mac: ['⌘', 'Shift', 'Z'], action: 'Redo' },
  { keys: ['Ctrl', 'S'],          mac: ['⌘', 'S'],          action: 'Save to cloud' },
  { keys: ['Ctrl', 'P'],          mac: ['⌘', 'P'],          action: 'Download PDF' },
]

interface Props { onClose: () => void }

export function KeyboardShortcutsModal({ onClose }: Readonly<Props>) {
  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose() }}
    >
      <div
        className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Keyboard size={16} className="text-sky-500" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Shortcuts table */}
        <div className="p-4 flex flex-col gap-1">
          {SHORTCUTS.map((s) => (
            <div
              key={s.action}
              className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">{s.action}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((k, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <kbd className="inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-[11px] font-semibold text-gray-600 dark:text-gray-300 font-mono">
                      {k}
                    </kbd>
                    {i < s.keys.length - 1 && <span className="text-[10px] text-gray-400">+</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 pb-4 text-xs text-gray-400 dark:text-gray-500 text-center">
          On Mac, use ⌘ instead of Ctrl
        </div>
      </div>
    </div>
  )
}
