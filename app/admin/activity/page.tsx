'use client'

import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { UserPlus, FileText, Trash2, Mail, Briefcase } from 'lucide-react'

interface ActivityEntry {
  _id: string
  action: string
  meta: Record<string, unknown>
  createdAt: string
  userId: { fullName: string; email: string; avatar: string } | null
}

const ACTION_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; darkColor: string }> = {
  signup:             { label: 'Signed up',         icon: UserPlus,  color: 'bg-emerald-100 text-emerald-700', darkColor: 'dark:bg-emerald-900/30 dark:text-emerald-400' },
  resume_saved:       { label: 'Saved resume',       icon: FileText,  color: 'bg-blue-100 text-blue-700',       darkColor: 'dark:bg-blue-900/30 dark:text-blue-400' },
  resume_deleted:     { label: 'Deleted resume',     icon: Trash2,    color: 'bg-red-100 text-red-700',         darkColor: 'dark:bg-red-900/30 dark:text-red-400' },
  cover_letter_saved: { label: 'Saved cover letter', icon: Mail,      color: 'bg-purple-100 text-purple-700',   darkColor: 'dark:bg-purple-900/30 dark:text-purple-400' },
  job_added:          { label: 'Added job',          icon: Briefcase, color: 'bg-amber-100 text-amber-700',     darkColor: 'dark:bg-amber-900/30 dark:text-amber-400' },
}

export default function AdminActivityPage() {
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/activity?limit=100')
      .then((r) => r.json())
      .then((d) => setActivity(d.activity ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Activity Feed</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Last 100 platform events</p>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={`sk-${i}`} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 h-16 animate-pulse" />
          ))}
        </div>
      ) : activity.length === 0 ? (
        <p className="text-gray-400 text-center py-16">No activity yet.</p>
      ) : (
        <div className="space-y-2">
          {activity.map((entry) => {
            const cfg = ACTION_CONFIG[entry.action] ?? { label: entry.action, icon: FileText, color: 'bg-gray-100 text-gray-600', darkColor: 'dark:bg-gray-700 dark:text-gray-300' }
            const Icon = cfg.icon
            const user = entry.userId
            return (
              <div key={entry._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-4">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${cfg.color} ${cfg.darkColor}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">{user?.fullName ?? 'Unknown'}</span>
                    {' '}
                    <span className="text-gray-600 dark:text-gray-300">{cfg.label}</span>
                    {!!entry.meta.name && (
                      <span className="text-gray-500 dark:text-gray-400"> — <span className="italic">{String(entry.meta.name)}</span></span>
                    )}
                    {!!entry.meta.company && (
                      <span className="text-gray-500 dark:text-gray-400"> at <span className="italic">{String(entry.meta.company)}</span></span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{user?.email}</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                  {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
