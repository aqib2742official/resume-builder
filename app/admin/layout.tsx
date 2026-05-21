'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Users, Activity, Settings, ChevronLeft } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const role = session?.user.role
  const isAdmin = role === 'admin' || role === 'super_admin'
  const isSuperAdmin = role === 'super_admin'

  useEffect(() => {
    if (status === 'loading') return
    if (!session) router.replace('/sign-in')
    else if (!isAdmin) router.replace('/')
  }, [session, status, router, isAdmin])

  if (status === 'loading' || !session || !isAdmin) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const NAV_ITEMS = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true, show: true },
    { href: '/admin/users', label: 'Users', icon: Users, exact: false, show: true },
    { href: '/admin/activity', label: 'Activity', icon: Activity, exact: false, show: true },
    { href: '/admin/settings', label: 'Settings', icon: Settings, exact: false, show: isSuperAdmin },
  ]

  return (
    <div className="flex h-full">
      <aside className="w-56 shrink-0 bg-[#0f2044] text-white flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-0.5">
            {isSuperAdmin ? 'Super Admin' : 'Admin'}
          </p>
          <p className="text-sm text-white/70 truncate">{session.user.email}</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.filter((i) => i.show).map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-blue-600 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to App
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
    </div>
  )
}
