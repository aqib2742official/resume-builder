'use client'

import Link from 'next/link'
import { X, CloudUpload, LogIn, UserPlus } from 'lucide-react'

interface Props {
  onClose: () => void
}

export function SignInToSaveModal({ onClose }: Readonly<Props>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white dark:bg-[#0d1424] rounded-2xl shadow-2xl p-6 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="h-14 w-14 rounded-full bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center mb-4">
            <CloudUpload size={26} className="text-sky-500" />
          </div>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Save to your account
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Create a free account to save your resume to the cloud and access it from any device.
          </p>

          <div className="flex flex-col gap-2 w-full">
            <Link
              href="/sign-up"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold py-2.5 transition-colors"
            >
              <UserPlus size={15} />
              Create Free Account
            </Link>

            <Link
              href="/sign-in"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <LogIn size={15} />
              Sign In
            </Link>

            <button
              onClick={onClose}
              className="text-xs text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 mt-1 transition-colors"
            >
              Continue without saving
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
