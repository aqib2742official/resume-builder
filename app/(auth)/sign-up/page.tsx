'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, FileText, Camera, User } from 'lucide-react'

const GENDER_OPTIONS = [
  { value: 'male',              label: 'Male' },
  { value: 'female',            label: 'Female' },
  { value: 'other',             label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
]

export default function SignUpPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
    confirmPassword: '',
  })
  const [avatar, setAvatar] = useState<string>('')
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleField(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setAvatarPreview(result)
      setAvatar(result)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (!form.gender) {
      setError('Please select your gender')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          gender: form.gender,
          password: form.password,
          avatar,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Registration failed')
        setLoading(false)
        return
      }

      router.push('/sign-in?registered=1')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-lg">
      <div className="bg-white dark:bg-[#0d1424] rounded-2xl shadow-2xl shadow-black/40 p-8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f2044] text-white mb-3 shadow-lg">
            <FileText size={22} />
          </div>
          <span className="text-[10px] font-medium tracking-[0.18em] text-sky-500 uppercase">Maria</span>
          <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-none">
            Resume<span className="text-sky-500">Builder</span>
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-1">Create your account</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">Save and access your resumes anywhere</p>

        {/* Avatar picker */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative group"
          >
            <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-500 flex items-center justify-center overflow-hidden transition group-hover:border-sky-400">
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <User size={32} className="text-gray-400" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-sky-500 flex items-center justify-center shadow-md group-hover:bg-sky-600 transition">
              <Camera size={13} className="text-white" />
            </div>
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={e => handleField('fullName', e.target.value)}
              placeholder="Maria Ameen"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => handleField('email', e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
            />
          </div>

          {/* Phone + Gender row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={e => handleField('phone', e.target.value)}
                placeholder="+92 300 0000000"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.gender}
                onChange={e => handleField('gender', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              >
                <option value="">Select…</option>
                {GENDER_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                minLength={8}
                value={form.password}
                onChange={e => handleField('password', e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 pr-10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              />
              <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                value={form.confirmPassword}
                onChange={e => handleField('confirmPassword', e.target.value)}
                placeholder="Re-enter your password"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 pr-10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold py-2.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-sky-600 dark:text-sky-400 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
