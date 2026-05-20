'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { LayoutDashboard, FileText, PenSquare, Mail, Briefcase, BarChart3, Globe, Moon, Sun, Menu, X, LayoutTemplate } from 'lucide-react'
import { clsx } from 'clsx'
import { toggleDarkMode } from '@/store/uiSlice'
import type { RootState, AppDispatch } from '@/store'

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/resumes', icon: FileText, label: 'My Resumes' },
  { href: '/templates', icon: LayoutTemplate, label: 'Templates' },
  { href: '/editor', icon: PenSquare, label: 'Editor' },
  { href: '/cover-letter', icon: Mail, label: 'Cover Letter' },
  { href: '/job-tracker', icon: Briefcase, label: 'Job Tracker' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/jobs', icon: Globe, label: 'Find Jobs' },
]

export function Navbar() {
  const pathname = usePathname()
  const dispatch = useDispatch<AppDispatch>()
  const darkMode = useSelector((state: RootState) => state.ui.darkMode)
  const [mobileOpen, setMobileOpen] = useState(false)

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <header className="sticky top-0 z-50 h-16 shrink-0 bg-[#0f2044] shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center gap-4">

          {/* Wordmark */}
          <Link href="/" className="shrink-0 flex flex-col leading-none gap-0.5">
            <span className="text-[10px] font-medium tracking-[0.18em] text-sky-300 uppercase">Maria</span>
            <span className="text-lg font-extrabold tracking-tight text-white leading-none">
              {'Resume'}<span className="text-sky-300">Builder</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 ml-6">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap',
                  isActive(href)
                    ? 'bg-white/15 text-white ring-1 ring-white/25'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                )}
              >
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => dispatch(toggleDarkMode())}
              title={darkMode ? 'Light mode' : 'Dark mode'}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white/50 hover:text-yellow-300 hover:bg-white/10 transition-colors"
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* CTA — inverted white-on-navy for clean contrast */}
            <Link
              href="/editor"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg text-sm font-bold px-4 py-2 bg-white text-[#0f2044] hover:bg-sky-50 transition-colors shadow-md whitespace-nowrap shrink-0"
            >
              <PenSquare size={14} />
              Build Resume
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 z-40 bg-[#0f2044] border-b border-white/10 shadow-2xl">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive(href)
                    ? 'bg-white/15 text-white ring-1 ring-white/25'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}

            <Link
              href="/editor"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-white text-[#0f2044] text-sm font-bold px-4 py-2.5 hover:bg-sky-50 transition-colors"
            >
              <PenSquare size={14} />
              Build Resume
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
