'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { useSession } from 'next-auth/react'
import { Trash2, ShieldCheck, User, Search, Download, ToggleLeft, ToggleRight, ChevronUp, ChevronDown } from 'lucide-react'
import { ConfirmModal } from '@/components/shared/ConfirmModal'

interface AdminUser {
  _id: string
  fullName: string
  email: string
  phone: string
  gender: string
  role: 'user' | 'admin' | 'super_admin'
  avatar: string
  disabled: boolean
  createdAt: string
}

type SortField = 'fullName' | 'email' | 'createdAt' | 'role'
type SortDir = 'asc' | 'desc'

function exportCSV(users: AdminUser[]) {
  const headers = ['Full Name', 'Email', 'Phone', 'Gender', 'Role', 'Status', 'Joined']
  const rows = users.map((u) => [
    u.fullName,
    u.email,
    u.phone,
    u.gender,
    u.role,
    u.disabled ? 'Disabled' : 'Active',
    new Date(u.createdAt).toLocaleDateString(),
  ])
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `users-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function RoleBadge({ role }: Readonly<{ role: string }>) {
  if (role === 'super_admin') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
      <ShieldCheck className="w-3 h-3" /> Super Admin
    </span>
  )
  if (role === 'admin') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
      <ShieldCheck className="w-3 h-3" /> Admin
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
      <User className="w-3 h-3" /> User
    </span>
  )
}

function SortIcon({ field, sortField, sortDir }: Readonly<{ field: SortField; sortField: SortField; sortDir: 'asc' | 'desc' }>) {
  if (sortField !== field) return <ChevronUp className="w-3 h-3 text-gray-300" />
  return sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-blue-500" /> : <ChevronDown className="w-3 h-3 text-blue-500" />
}

export default function AdminUsersPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const isSuperAdmin = session?.user.role === 'super_admin'
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all')
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [actionId, setActionId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then((d) => setUsers(d.users ?? []))
      .finally(() => setLoading(false))
  }, [])

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortField(field); setSortDir('asc') }
  }

  const filtered = useMemo(() => {
    let list = users.filter((u) => {
      const q = search.toLowerCase()
      const matchesSearch = !q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      const matchesRole = roleFilter === 'all' || u.role === roleFilter
      return matchesSearch && matchesRole
    })
    list = [...list].sort((a, b) => {
      let av = String(a[sortField])
      let bv = String(b[sortField])
      if (sortField === 'createdAt') { av = new Date(av).getTime().toString(); bv = new Date(bv).getTime().toString() }
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
    return list
  }, [users, search, roleFilter, sortField, sortDir])

  async function handleToggleRole(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    setActionId(id)
    const res = await fetch(`/api/admin/users/${id}/role`, { method: 'PUT' })
    if (res.ok) {
      const { role } = await res.json()
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, role } : u))
    }
    setActionId(null)
  }

  async function handleToggleDisable(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    setActionId(id)
    const res = await fetch(`/api/admin/users/${id}/disable`, { method: 'PUT' })
    if (res.ok) {
      const { disabled } = await res.json()
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, disabled } : u))
    }
    setActionId(null)
  }

  function handleDelete(e: React.MouseEvent, id: string, name: string) {
    e.stopPropagation()
    setDeleteTarget({ id, name })
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleteLoading(true)
    const res = await fetch(`/api/admin/users/${deleteTarget.id}`, { method: 'DELETE' })
    if (res.ok) setUsers((prev) => prev.filter((u) => u._id !== deleteTarget.id))
    setDeleteLoading(false)
    setDeleteTarget(null)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-0.5">Users</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{filtered.length} of {users.length} accounts</p>
        </div>
        <button
          onClick={() => exportCSV(filtered)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as 'all' | 'user' | 'admin')}
          className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="all">All roles</option>
          <option value="user">Users only</option>
          <option value="admin">Admins only</option>
          <option value="super_admin">Super Admin only</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={`skeleton-${i}`} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 h-16 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                <th className="text-left px-5 py-3">
                  <button onClick={() => toggleSort('fullName')} className="flex items-center gap-1 text-gray-500 dark:text-gray-400 font-medium hover:text-gray-700 dark:hover:text-gray-200">
                    User <SortIcon field="fullName" sortField={sortField} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-left px-5 py-3">
                  <button onClick={() => toggleSort('role')} className="flex items-center gap-1 text-gray-500 dark:text-gray-400 font-medium hover:text-gray-700 dark:hover:text-gray-200">
                    Role <SortIcon field="role" sortField={sortField} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-left px-5 py-3 text-gray-500 dark:text-gray-400 font-medium">Status</th>
                <th className="text-left px-5 py-3">
                  <button onClick={() => toggleSort('createdAt')} className="flex items-center gap-1 text-gray-500 dark:text-gray-400 font-medium hover:text-gray-700 dark:hover:text-gray-200">
                    Joined <SortIcon field="createdAt" sortField={sortField} sortDir={sortDir} />
                  </button>
                </th>
                <th className="px-5 py-3 text-gray-500 dark:text-gray-400 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((user) => (
                <tr
                  key={user._id}
                  onClick={() => router.push(`/admin/users/${user._id}`)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">{user.fullName.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{user.fullName}</p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-5 py-3">
                    {user.disabled ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">Disabled</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">Active</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-500 dark:text-gray-400 text-xs">
                    {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                  </td>
                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                    {user.role !== 'super_admin' && (
                      <div className="flex items-center justify-end gap-1">
                        {isSuperAdmin && (
                          <button
                            onClick={(e) => handleToggleRole(e, user._id)}
                            disabled={actionId === user._id}
                            title={user.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors disabled:opacity-40"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>
                        )}
                        {user.role !== 'admin' && (
                          <>
                            <button
                              onClick={(e) => handleToggleDisable(e, user._id)}
                              disabled={actionId === user._id}
                              title={user.disabled ? 'Enable account' : 'Disable account'}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors disabled:opacity-40"
                            >
                              {user.disabled ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={(e) => handleDelete(e, user._id, user.fullName)}
                              disabled={actionId === user._id}
                              title="Delete user"
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors disabled:opacity-40"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {user.role === 'admin' && isSuperAdmin && (
                          <button
                            onClick={(e) => handleDelete(e, user._id, user.fullName)}
                            disabled={actionId === user._id}
                            title="Delete admin"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors disabled:opacity-40"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 dark:text-gray-500 py-12">No users match your filters.</p>
          )}
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete User?"
          description={<>User <span className="font-semibold text-gray-800 dark:text-gray-200">{deleteTarget.name}</span> and all their resumes, cover letters, and job data will be permanently deleted.</>}
          confirmLabel="Delete User"
          loading={deleteLoading}
          onConfirm={confirmDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
