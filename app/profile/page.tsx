'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User, Lock, AlertTriangle, Save, Camera, Loader2, CheckCircle, XCircle } from 'lucide-react'

type Tab = 'profile' | 'password' | 'danger'

interface ProfileData {
  fullName: string
  email: string
  phone: string
  gender: string
  avatar: string
}

function Alert({ type, message }: Readonly<{ type: 'success' | 'error'; message: string }>) {
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${
      type === 'success'
        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
    }`}>
      {type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
      {message}
    </div>
  )
}

function inputCls(error?: boolean) {
  return `w-full rounded-lg border px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-colors ${
    error
      ? 'border-red-300 dark:border-red-600 focus:ring-red-200'
      : 'border-gray-200 dark:border-gray-600 focus:ring-blue-200 focus:border-blue-400'
  }`
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const [tab, setTab] = useState<Tab>('profile')

  // Profile form
  const [profile, setProfile] = useState<ProfileData>({ fullName: '', email: '', phone: '', gender: '', avatar: '' })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileAlert, setProfileAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  // Password form
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordAlert, setPasswordAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Danger zone
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteAlert, setDeleteAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/sign-in')
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      setProfile({
        fullName: session.user.fullName || session.user.name || '',
        email: session.user.email || '',
        phone: (session.user as { phone?: string }).phone || '',
        gender: (session.user as { gender?: string }).gender || '',
        avatar: (session.user as { avatar?: string }).avatar || '',
      })
    }
  }, [session])

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      if (res.ok) {
        const { url } = await res.json()
        setProfile((p) => ({ ...p, avatar: url }))
      }
    } finally {
      setAvatarUploading(false)
    }
  }

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    setProfileSaving(true)
    setProfileAlert(null)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: profile.fullName, phone: profile.phone, gender: profile.gender, avatar: profile.avatar }),
      })
      const data = await res.json()
      if (!res.ok) { setProfileAlert({ type: 'error', message: data.error }); return }
      await update({ fullName: data.user.fullName, avatar: data.user.avatar, phone: data.user.phone, gender: data.user.gender })
      setProfileAlert({ type: 'success', message: 'Profile updated successfully.' })
    } finally {
      setProfileSaving(false)
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault()
    setPasswordAlert(null)
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordAlert({ type: 'error', message: 'New passwords do not match.' }); return
    }
    setPasswordSaving(true)
    try {
      const res = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }),
      })
      const data = await res.json()
      if (!res.ok) { setPasswordAlert({ type: 'error', message: data.error }); return }
      setPasswordAlert({ type: 'success', message: 'Password changed successfully.' })
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } finally {
      setPasswordSaving(false)
    }
  }

  async function handleDeleteAccount(e: React.FormEvent) {
    e.preventDefault()
    if (deleteConfirmText !== 'DELETE') {
      setDeleteAlert({ type: 'error', message: 'Type DELETE to confirm.' }); return
    }
    setDeleteLoading(true)
    setDeleteAlert(null)
    try {
      const res = await fetch('/api/profile/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword }),
      })
      const data = await res.json()
      if (!res.ok) { setDeleteAlert({ type: 'error', message: data.error }); return }
      await signOut({ redirect: false })
      router.replace('/')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (status === 'loading' || !session) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
  }

  const isAdmin = session.user.role === 'admin'
  const initials = (profile.fullName || '?')[0].toUpperCase()

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'Edit Profile', icon: User },
    { id: 'password', label: 'Change Password', icon: Lock },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
  ]

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Account Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Manage your profile, password, and account</p>

        {/* Avatar header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6 flex items-center gap-5">
          <div className="relative shrink-0">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.fullName} className="w-20 h-20 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold ring-2 ring-gray-200 dark:ring-gray-600">
                {initials}
              </div>
            )}
            <button
              onClick={() => avatarInputRef.current?.click()}
              disabled={avatarUploading}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              {avatarUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" /> : <Camera className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />}
            </button>
            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-lg">{profile.fullName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
            {isAdmin && (
              <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400">Admin</span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === id
                  ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Edit Profile */}
        {tab === 'profile' && (
          <form onSubmit={handleProfileSave} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Edit Profile</h2>
            {profileAlert && <Alert {...profileAlert} />}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input className={inputCls()} value={profile.fullName} onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input className={`${inputCls()} bg-gray-50 dark:bg-gray-700/50 cursor-not-allowed opacity-70`} value={profile.email} disabled />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
              <input className={inputCls()} value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} placeholder="+1 234 567 8900" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Gender</label>
              <select className={inputCls()} value={profile.gender} onChange={(e) => setProfile((p) => ({ ...p, gender: e.target.value }))}>
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={profileSaving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {profileSaving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        )}

        {/* Change Password */}
        {tab === 'password' && (
          <form onSubmit={handlePasswordSave} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Change Password</h2>
            {passwordAlert && <Alert {...passwordAlert} />}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
              <input type="password" className={inputCls()} value={passwords.currentPassword} onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))} required autoComplete="current-password" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
              <input type="password" className={inputCls()} value={passwords.newPassword} onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))} required minLength={8} autoComplete="new-password" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                className={inputCls(passwords.confirmPassword.length > 0 && passwords.confirmPassword !== passwords.newPassword)}
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
                required
                autoComplete="new-password"
              />
              {passwords.confirmPassword.length > 0 && passwords.confirmPassword !== passwords.newPassword && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={passwordSaving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {passwordSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {passwordSaving ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        )}

        {/* Danger Zone */}
        {tab === 'danger' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-red-200 dark:border-red-800 p-6 space-y-4">
            <h2 className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Danger Zone</h2>

            {isAdmin ? (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
                Admin accounts cannot be self-deleted. To remove this account, ask another admin to delete it from the Admin Panel.
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Permanently deletes your account and <span className="font-medium text-gray-900 dark:text-white">all associated data</span> — resumes, cover letters, and job applications. This cannot be undone.
                </p>

                {deleteAlert && <Alert {...deleteAlert} />}

                <form onSubmit={handleDeleteAccount} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Your password</label>
                    <input type="password" className={inputCls()} placeholder="Enter your password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Type <span className="font-mono font-bold text-red-600 dark:text-red-400">DELETE</span> to confirm
                    </label>
                    <input className={inputCls(deleteConfirmText.length > 0 && deleteConfirmText !== 'DELETE')} placeholder="DELETE" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} required />
                  </div>
                  <button
                    type="submit"
                    disabled={deleteLoading || deleteConfirmText !== 'DELETE'}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                    {deleteLoading ? 'Deleting…' : 'Delete My Account'}
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
