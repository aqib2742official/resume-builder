'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { LayoutDashboard, FileText, PenSquare, Mail, Briefcase, BarChart3, Moon, Sun } from 'lucide-react'
import { clsx } from 'clsx'
import { toggleDarkMode } from '@/store/uiSlice'
import type { RootState, AppDispatch } from '@/store'

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/resumes', icon: FileText, label: 'My Resumes' },
  { href: '/editor', icon: PenSquare, label: 'Editor' },
  { href: '/cover-letter', icon: Mail, label: 'Cover Letter' },
  { href: '/job-tracker', icon: Briefcase, label: 'Job Tracker' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
]

export function Sidebar() {
  const pathname = usePathname()
  const dispatch = useDispatch<AppDispatch>()
  const darkMode = useSelector((state: RootState) => state.ui.darkMode)

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-14 shrink-0 h-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 z-40">
        {/* Logo mark */}
        <div className="flex h-14 items-center justify-center border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <FileText size={15} />
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col items-center gap-1 p-2 flex-1 pt-3">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              title={label}
              className={clsx(
                'group relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                isActive(href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <Icon size={18} />
              <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md bg-gray-900 dark:bg-gray-700 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 z-50">
                {label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Dark mode toggle at bottom */}
        <div className="flex items-center justify-center p-2 pb-4">
          <button
            onClick={() => dispatch(toggleDarkMode())}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors',
              isActive(href) ? 'text-blue-600' : 'text-gray-400 dark:text-gray-500'
            )}
          >
            <Icon size={18} />
            <span className="text-[9px] font-medium leading-none">{label}</span>
          </Link>
        ))}
        {/* Dark mode toggle in mobile nav */}
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className={clsx(
            'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors',
            'text-gray-400 dark:text-yellow-400'
          )}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          <span className="text-[9px] font-medium leading-none">{darkMode ? 'Light' : 'Dark'}</span>
        </button>
      </nav>
    </>
  )
}
