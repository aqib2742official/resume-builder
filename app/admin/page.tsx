'use client'

import { useEffect, useState } from 'react'
import { Users, FileText, Mail, Briefcase, TrendingUp } from 'lucide-react'

interface Stats {
  totalUsers: number
  totalResumes: number
  totalCoverLetters: number
  totalJobs: number
  newUsersThisMonth: number
}

function StatCard({ label, value, icon: Icon, color }: Readonly<{ label: string; value: number; icon: React.ElementType; color: string }>) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => setStats(d))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Overview of your Resume Builder platform</p>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={`sk-${i}`} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 h-24 animate-pulse" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Total Users"       value={stats.totalUsers}        icon={Users}     color="bg-blue-600" />
          <StatCard label="Resumes"           value={stats.totalResumes}      icon={FileText}  color="bg-indigo-600" />
          <StatCard label="Cover Letters"     value={stats.totalCoverLetters} icon={Mail}      color="bg-purple-600" />
          <StatCard label="Job Applications"  value={stats.totalJobs}         icon={Briefcase} color="bg-amber-500" />
          <StatCard label="New Users (30d)"   value={stats.newUsersThisMonth} icon={TrendingUp}color="bg-emerald-600" />
        </div>
      ) : (
        <p className="text-red-500">Failed to load stats.</p>
      )}
    </div>
  )
}
