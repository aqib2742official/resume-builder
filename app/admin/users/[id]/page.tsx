'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { formatDistanceToNow, format } from 'date-fns'
import { ArrowLeft, FileText, Mail, Briefcase, Activity, ShieldCheck, User, ToggleLeft, ToggleRight, Trash2, Loader2, Eye } from 'lucide-react'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { AdminResumePreviewModal } from '@/components/admin/AdminResumePreviewModal'

type Tab = 'resumes' | 'coverLetters' | 'jobs' | 'activity'

interface DetailUser {
  _id: string; fullName: string; email: string; phone: string
  gender: string; role: 'user' | 'admin' | 'super_admin'; avatar: string
  disabled: boolean; createdAt: string
}

const ACTION_LABELS: Record<string, string> = {
  signup: 'Signed up', resume_saved: 'Saved resume',
  resume_deleted: 'Deleted resume', cover_letter_saved: 'Saved cover letter', job_added: 'Added job',
}

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: session } = useSession()
  const isSuperAdmin = session?.user.role === 'super_admin'

  const [data, setData] = useState<{
    user: DetailUser
    resumes: { _id: string; name: string; updatedAt: string; completenessScore: number }[]
    coverLetters: { _id: string; name: string; updatedAt: string }[]
    jobs: { _id: string; company: string; role: string; status: string; appliedDate: string }[]
    activity: { _id: string; action: string; meta: Record<string, unknown>; createdAt: string }[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('resumes')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [previewResume, setPreviewResume] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => {
    fetch(`/api/admin/users/${id}/detail`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [id])

  async function toggleRole() {
    setActionLoading('role')
    const res = await fetch(`/api/admin/users/${id}/role`, { method: 'PUT' })
    if (res.ok) {
      const { role } = await res.json()
      setData((d) => d ? { ...d, user: { ...d.user, role } } : d)
    }
    setActionLoading(null)
  }

  async function toggleDisable() {
    setActionLoading('disable')
    const res = await fetch(`/api/admin/users/${id}/disable`, { method: 'PUT' })
    if (res.ok) {
      const { disabled } = await res.json()
      setData((d) => d ? { ...d, user: { ...d.user, disabled } } : d)
    }
    setActionLoading(null)
  }

  async function confirmDeleteUser() {
    setActionLoading('delete')
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin/users')
    else { setActionLoading(null); setShowDeleteModal(false) }
  }

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
  if (!data) return <div className="p-8 text-gray-500 dark:text-gray-400">User not found.</div>

  const { user, resumes, coverLetters, jobs, activity } = data
  const isSuperAdminUser = user.role === 'super_admin'
  const isAdminOrAbove = user.role === 'admin' || user.role === 'super_admin'

  const TABS: { id: Tab; label: string; icon: React.ElementType; count: number }[] = [
    { id: 'resumes', label: 'Resumes', icon: FileText, count: resumes.length },
    { id: 'coverLetters', label: 'Cover Letters', icon: Mail, count: coverLetters.length },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, count: jobs.length },
    { id: 'activity', label: 'Activity', icon: Activity, count: activity.length },
  ]

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button onClick={() => router.push('/admin/users')} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Users
      </button>

      {/* User card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6 flex items-start gap-5 flex-wrap">
        <div className="shrink-0">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-400 text-xl font-bold ring-2 ring-gray-200 dark:ring-gray-600">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user.fullName}</h1>
            {isSuperAdminUser ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"><ShieldCheck className="w-3 h-3" /> Super Admin</span>
            ) : isAdminOrAbove ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400"><ShieldCheck className="w-3 h-3" /> Admin</span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"><User className="w-3 h-3" /> User</span>
            )}
            {user.disabled && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400">Disabled</span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email} · {user.phone}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Joined {format(new Date(user.createdAt), 'MMM d, yyyy')}</p>
        </div>

        {!isSuperAdminUser && (
          <div className="flex items-center gap-2 shrink-0">
            {isSuperAdmin && user.role !== 'admin' && (
              <button
                onClick={toggleRole}
                disabled={!!actionLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors disabled:opacity-50"
              >
                {actionLoading === 'role' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                Promote to Admin
              </button>
            )}
            {isSuperAdmin && user.role === 'admin' && (
              <button
                onClick={toggleRole}
                disabled={!!actionLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {actionLoading === 'role' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <User className="w-3.5 h-3.5" />}
                Demote to User
              </button>
            )}
            {user.role !== 'admin' && (
              <button
                onClick={toggleDisable}
                disabled={!!actionLoading}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors disabled:opacity-50 ${
                  user.disabled
                    ? 'border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                    : 'border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                }`}
              >
                {actionLoading === 'disable' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : user.disabled ? <ToggleLeft className="w-3.5 h-3.5" /> : <ToggleRight className="w-3.5 h-3.5" />}
                {user.disabled ? 'Enable' : 'Disable'}
              </button>
            )}
            {(user.role !== 'admin' || isSuperAdmin) && (
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={!!actionLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-5">
        {TABS.map(({ id: tabId, label, icon: Icon, count }) => (
          <button
            key={tabId}
            onClick={() => setTab(tabId)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === tabId
                ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === tabId ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'}`}>{count}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {tab === 'resumes' && (
          resumes.length === 0 ? <Empty label="No resumes" /> :
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                <th className="text-left px-5 py-3 text-gray-500 dark:text-gray-400 font-medium">Name</th>
                <th className="text-left px-5 py-3 text-gray-500 dark:text-gray-400 font-medium">Score</th>
                <th className="text-left px-5 py-3 text-gray-500 dark:text-gray-400 font-medium">Last updated</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {resumes.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                  <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{r.name}</td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{r.completenessScore ?? '—'}%</td>
                  <td className="px-5 py-3 text-gray-500 dark:text-gray-400 text-xs">{formatDistanceToNow(new Date(r.updatedAt), { addSuffix: true })}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => setPreviewResume({ id: r._id, name: r.name })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-sky-200 dark:border-sky-700 text-sky-700 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview & Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'coverLetters' && (
          coverLetters.length === 0 ? <Empty label="No cover letters" /> :
          <table className="w-full text-sm"><thead><tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80"><th className="text-left px-5 py-3 text-gray-500 dark:text-gray-400 font-medium">Name</th><th className="text-left px-5 py-3 text-gray-500 dark:text-gray-400 font-medium">Last updated</th></tr></thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">{coverLetters.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{c.name}</td>
                <td className="px-5 py-3 text-gray-500 dark:text-gray-400 text-xs">{formatDistanceToNow(new Date(c.updatedAt), { addSuffix: true })}</td>
              </tr>
            ))}</tbody></table>
        )}

        {tab === 'jobs' && (
          jobs.length === 0 ? <Empty label="No job applications" /> :
          <table className="w-full text-sm"><thead><tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80"><th className="text-left px-5 py-3 text-gray-500 dark:text-gray-400 font-medium">Company</th><th className="text-left px-5 py-3 text-gray-500 dark:text-gray-400 font-medium">Role</th><th className="text-left px-5 py-3 text-gray-500 dark:text-gray-400 font-medium">Status</th></tr></thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">{jobs.map((j) => (
              <tr key={j._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{j.company}</td>
                <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{j.role}</td>
                <td className="px-5 py-3"><span className="capitalize text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{j.status}</span></td>
              </tr>
            ))}</tbody></table>
        )}

        {tab === 'activity' && (
          activity.length === 0 ? <Empty label="No activity yet" /> :
          <div className="divide-y divide-gray-100 dark:divide-gray-700">{activity.map((a) => (
            <div key={a._id} className="flex items-center justify-between px-5 py-3">
              <p className="text-sm text-gray-700 dark:text-gray-200">{ACTION_LABELS[a.action] ?? a.action}
                {!!a.meta.name && <span className="text-gray-400 dark:text-gray-500"> — {String(a.meta.name)}</span>}
                {!!a.meta.company && <span className="text-gray-400 dark:text-gray-500"> at {String(a.meta.company)}</span>}
              </p>
              <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 ml-4">{formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</span>
            </div>
          ))}</div>
        )}
      </div>

      {previewResume && (
        <AdminResumePreviewModal
          resumeId={previewResume.id}
          onClose={() => setPreviewResume(null)}
        />
      )}

      {showDeleteModal && (
        <ConfirmModal
          title="Delete User?"
          description={<>User <span className="font-semibold text-gray-800 dark:text-gray-200">{user.fullName}</span> and all their resumes, cover letters, and job data will be permanently deleted. This cannot be undone.</>}
          confirmLabel="Delete User"
          loading={actionLoading === 'delete'}
          onConfirm={confirmDeleteUser}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}

function Empty({ label }: Readonly<{ label: string }>) {
  return <p className="text-center text-gray-400 dark:text-gray-500 py-12 text-sm">{label}</p>
}
