'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { X, CloudUpload, Eye, EyeOff, Loader2, LogIn, UserPlus } from 'lucide-react'

type Tab = 'signIn' | 'signUp'

interface Props {
  onClose: () => void
  /** Called right after credentials are verified — before the session propagates */
  onSuccess: () => void
  title?: string
  subtitle?: string
}

const GENDER_OPTIONS = [
  { value: 'male',              label: 'Male' },
  { value: 'female',            label: 'Female' },
  { value: 'other',             label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
]

function inputCls(err?: boolean) {
  return `w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-colors ${
    err
      ? 'border-red-300 dark:border-red-600 focus:ring-red-200'
      : 'border-gray-200 dark:border-gray-600 focus:ring-sky-300 focus:border-sky-400'
  }`
}

export function AuthToSaveModal({ onClose, onSuccess, title = 'Save your resume', subtitle = 'Sign in or create a free account to save to the cloud.' }: Readonly<Props>) {
  const [tab, setTab] = useState<Tab>('signIn')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Sign-in fields
  const [siEmail, setSiEmail] = useState('')
  const [siPass,  setSiPass]  = useState('')
  const [showSiPass, setShowSiPass] = useState(false)

  // Sign-up fields
  const [su, setSu] = useState({ fullName: '', email: '', phone: '', gender: 'prefer_not_to_say', password: '', confirmPassword: '' })
  const [showSuPass,    setShowSuPass]    = useState(false)
  const [showSuConfirm, setShowSuConfirm] = useState(false)

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await signIn('credentials', { email: siEmail, password: siPass, redirect: false })
      if (!res?.ok) { setError('Invalid email or password.'); return }
      onSuccess()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (su.password !== su.confirmPassword) { setError('Passwords do not match.'); return }
    if (su.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    try {
      const regRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: su.fullName, email: su.email, phone: su.phone, gender: su.gender, password: su.password }),
      })
      const regData = await regRes.json()
      if (!regRes.ok) { setError(regData.error ?? 'Registration failed.'); return }

      const res = await signIn('credentials', { email: su.email, password: su.password, redirect: false })
      if (!res?.ok) { setError('Signed up but could not sign in. Please sign in manually.'); return }
      onSuccess()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-[#0d1424] rounded-2xl shadow-2xl z-10 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col items-center pt-7 pb-4 px-6 text-center border-b border-gray-100 dark:border-gray-700">
          <div className="h-12 w-12 rounded-full bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center mb-3">
            <CloudUpload size={22} className="text-sky-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 mx-6 mt-5 rounded-xl p-1">
          {(['signIn', 'signUp'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setTab(t); setError('') }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t
                  ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {t === 'signIn' ? <><LogIn size={14} /> Sign In</> : <><UserPlus size={14} /> Create Account</>}
            </button>
          ))}
        </div>

        <div className="px-6 pb-6 pt-4">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 px-3 py-2.5 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Sign In form */}
          {tab === 'signIn' && (
            <form onSubmit={handleSignIn} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Email address</label>
                <input type="email" required value={siEmail} onChange={e => setSiEmail(e.target.value)} placeholder="you@example.com" className={inputCls()} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showSiPass ? 'text' : 'password'}
                    required
                    value={siPass}
                    onChange={e => setSiPass(e.target.value)}
                    placeholder="Your password"
                    className={`${inputCls()} pr-9`}
                  />
                  <button type="button" onClick={() => setShowSiPass(v => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    {showSiPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#0f2044] hover:bg-[#1a3a6e] text-white text-sm font-bold py-2.5 transition-colors disabled:opacity-60 mt-1"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <LogIn size={14} />}
                {loading ? 'Signing in…' : 'Sign In & Save'}
              </button>
            </form>
          )}

          {/* Sign Up form */}
          {tab === 'signUp' && (
            <form onSubmit={handleSignUp} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Full Name</label>
                  <input type="text" required minLength={2} value={su.fullName} onChange={e => setSu(s => ({ ...s, fullName: e.target.value }))} placeholder="Jane Doe" className={inputCls()} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Email address</label>
                  <input type="email" required value={su.email} onChange={e => setSu(s => ({ ...s, email: e.target.value }))} placeholder="you@example.com" className={inputCls()} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Phone</label>
                  <input type="tel" required value={su.phone} onChange={e => setSu(s => ({ ...s, phone: e.target.value }))} placeholder="+1 234 567 8900" className={inputCls()} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Gender</label>
                  <select value={su.gender} onChange={e => setSu(s => ({ ...s, gender: e.target.value }))} className={inputCls()}>
                    {GENDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showSuPass ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={su.password}
                      onChange={e => setSu(s => ({ ...s, password: e.target.value }))}
                      placeholder="Min 8 chars"
                      className={`${inputCls()} pr-9`}
                    />
                    <button type="button" onClick={() => setShowSuPass(v => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showSuPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Confirm</label>
                  <div className="relative">
                    <input
                      type={showSuConfirm ? 'text' : 'password'}
                      required
                      value={su.confirmPassword}
                      onChange={e => setSu(s => ({ ...s, confirmPassword: e.target.value }))}
                      placeholder="Repeat password"
                      className={`${inputCls(su.confirmPassword.length > 0 && su.confirmPassword !== su.password)} pr-9`}
                    />
                    <button type="button" onClick={() => setShowSuConfirm(v => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showSuConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold py-2.5 transition-colors disabled:opacity-60 mt-1"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                {loading ? 'Creating account…' : 'Create Account & Save'}
              </button>
            </form>
          )}

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
            Your resume data is kept — we&apos;ll save it right after you sign in.
          </p>
        </div>
      </div>
    </div>
  )
}
