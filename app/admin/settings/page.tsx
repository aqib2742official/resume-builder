'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Save, Loader2, CheckCircle, XCircle, Settings, Sliders } from 'lucide-react'
import type { SettingsMap, FeatureFlags } from '@/lib/settingsTypes'
import { DEFAULT_SETTINGS } from '@/lib/settingsTypes'

type ActiveTab = 'system' | 'features'

const FEATURE_FLAGS_META: { key: keyof FeatureFlags; label: string; description: string }[] = [
  { key: 'aiFeatures',     label: 'AI Features',      description: 'AI generate buttons in editor, cover letter, and analytics' },
  { key: 'darkMode',       label: 'Dark Mode',         description: 'Dark mode toggle in the navbar' },
  { key: 'analytics',      label: 'Analytics',         description: '/analytics page and nav item' },
  { key: 'jobTracker',     label: 'Job Tracker',       description: '/job-tracker page and nav item' },
  { key: 'coverLetter',    label: 'Cover Letter',      description: '/cover-letter page and nav item' },
  { key: 'templates',      label: 'Templates',         description: '/templates page and nav item' },
  { key: 'findJobs',       label: 'Find Jobs',         description: '/jobs page and nav item' },
  { key: 'resumeCompare',  label: 'Resume Compare',    description: 'Compare mode on the resumes page' },
  { key: 'versionHistory', label: 'Version History',   description: 'Version history button on resume cards' },
  { key: 'atsChecker',     label: 'ATS Checker',       description: 'ATS checker panel in editor and analytics' },
]

function Toggle({ checked, onChange }: Readonly<{ checked: boolean; onChange: () => void }>) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

function SaveAlert({ alert }: Readonly<{ alert: { type: 'success' | 'error'; message: string } | null }>) {
  if (!alert) return null
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${
      alert.type === 'success'
        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
    }`}>
      {alert.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
      {alert.message}
    </div>
  )
}

export default function AdminSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ActiveTab>('system')
  const [settings, setSettings] = useState<SettingsMap>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [systemSaving, setSystemSaving] = useState(false)
  const [featureSaving, setFeatureSaving] = useState(false)
  const [systemAlert, setSystemAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [featureAlert, setFeatureAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (session?.user.role !== 'super_admin') { router.replace('/admin'); return }
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => setSettings({ ...DEFAULT_SETTINGS, ...d.settings, features: { ...DEFAULT_SETTINGS.features, ...d.settings?.features } }))
      .finally(() => setLoading(false))
  }, [session, status, router])

  async function saveSystemSettings(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setSystemSaving(true)
    setSystemAlert(null)
    try {
      const payload = {
        maintenanceMode: settings.maintenanceMode,
        maxResumesPerUser: settings.maxResumesPerUser,
        announcement: settings.announcement,
      }
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) { setSystemAlert({ type: 'error', message: data.error ?? 'Failed to save' }); return }
      setSystemAlert({ type: 'success', message: 'System settings saved.' })
      setTimeout(() => setSystemAlert(null), 3000)
    } finally {
      setSystemSaving(false)
    }
  }

  async function saveFeatureFlags(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setFeatureSaving(true)
    setFeatureAlert(null)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: settings.features }),
      })
      const data = await res.json()
      if (!res.ok) { setFeatureAlert({ type: 'error', message: data.error ?? 'Failed to save' }); return }
      setFeatureAlert({ type: 'success', message: 'Feature flags saved.' })
      setTimeout(() => setFeatureAlert(null), 3000)
    } finally {
      setFeatureSaving(false)
    }
  }

  function toggleFlag(key: keyof FeatureFlags) {
    setSettings((s) => ({ ...s, features: { ...s.features, [key]: !s.features[key] } }))
  }

  if (status === 'loading' || loading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
  }

  const TABS: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: 'system',   label: 'System Settings', icon: Settings },
    { id: 'features', label: 'Feature Flags',   icon: Sliders  },
  ]

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Settings</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Platform configuration — Super Admin only</p>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === id
                ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* System Settings Tab */}
      {activeTab === 'system' && (
        <form onSubmit={saveSystemSettings} className="space-y-5">

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Maintenance Mode</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Show a maintenance banner to all non-admin users</p>
              </div>
              <Toggle
                checked={settings.maintenanceMode}
                onChange={() => setSettings((s) => ({ ...s, maintenanceMode: !s.maintenanceMode }))}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <p className="font-medium text-gray-900 dark:text-white mb-1">Max Resumes Per User</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Limit how many resumes each user can save (0 = unlimited)</p>
            <input
              type="number"
              min={0}
              max={100}
              value={settings.maxResumesPerUser}
              onChange={(e) => setSettings((s) => ({ ...s, maxResumesPerUser: Number.parseInt(e.target.value) || 0 }))}
              className="w-32 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <p className="font-medium text-gray-900 dark:text-white mb-1">Broadcast Announcement</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Shown as a banner to all signed-in users. Leave empty to hide.</p>
            <textarea
              rows={3}
              placeholder="e.g. We're performing maintenance on Sunday 10pm–12am UTC…"
              value={settings.announcement}
              onChange={(e) => setSettings((s) => ({ ...s, announcement: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none"
            />
            {settings.announcement && (
              <div className="mt-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-4 py-2.5 text-sm text-blue-800 dark:text-blue-300">
                <span className="font-semibold">Preview: </span>{settings.announcement}
              </div>
            )}
          </div>

          <SaveAlert alert={systemAlert} />

          <button
            type="submit"
            disabled={systemSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {systemSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {systemSaving ? 'Saving…' : 'Save System Settings'}
          </button>
        </form>
      )}

      {/* Feature Flags Tab */}
      {activeTab === 'features' && (
        <form onSubmit={saveFeatureFlags} className="space-y-5">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <p className="font-medium text-gray-900 dark:text-white">Feature Flags</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Toggle which features are visible across the platform</p>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {FEATURE_FLAGS_META.map(({ key, label, description }) => (
                <div key={key} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
                  </div>
                  <Toggle checked={settings.features[key]} onChange={() => toggleFlag(key)} />
                </div>
              ))}
            </div>
          </div>

          <SaveAlert alert={featureAlert} />

          <button
            type="submit"
            disabled={featureSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {featureSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {featureSaving ? 'Saving…' : 'Save Feature Flags'}
          </button>
        </form>
      )}
    </div>
  )
}
