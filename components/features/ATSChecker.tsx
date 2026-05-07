'use client'

import { useState } from 'react'
import { X, Zap, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import { analyzeATS, type ATSResult } from '@/lib/atsUtils'
import { useResumeData } from '@/hooks/useResumeData'
import { Button } from '@/components/ui/Button'

function ScoreRing({ score }: { score: number }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg width="96" height="96" className="-rotate-90">
        <circle cx="48" cy="48" r={radius} strokeWidth="8" stroke="#e5e7eb" fill="none" />
        <circle
          cx="48" cy="48" r={radius} strokeWidth="8" stroke={color} fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold text-gray-800">{score}%</span>
        <span className="text-xs text-gray-500">match</span>
      </div>
    </div>
  )
}

interface ATSCheckerProps {
  onClose: () => void
}

export function ATSChecker({ onClose }: ATSCheckerProps) {
  const data = useResumeData()
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState<ATSResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  function handleAnalyze() {
    if (!jobDescription.trim()) return
    setAnalyzing(true)
    setTimeout(() => {
      setResult(analyzeATS(data, jobDescription))
      setAnalyzing(false)
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-blue-600" />
            <h2 className="text-base font-semibold text-gray-800">ATS Keyword Checker</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Job description input */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Paste the Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here — requirements, skills, responsibilities..."
              rows={7}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!jobDescription.trim() || analyzing}
            className="self-start"
          >
            {analyzing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
            {analyzing ? 'Analyzing…' : 'Analyze Match'}
          </Button>

          {/* Results */}
          {result && (
            <div className="flex flex-col gap-5 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-6">
                <ScoreRing score={result.score} />
                <div>
                  <p className="text-sm text-gray-600">
                    Your resume matched{' '}
                    <span className="font-bold text-gray-800">{result.matchedKeywords.length}</span> of{' '}
                    <span className="font-bold text-gray-800">{result.totalJDKeywords}</span> keywords
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {result.score >= 70
                      ? '✅ Strong match — your resume is well-targeted'
                      : result.score >= 45
                      ? '⚠️ Fair match — add missing keywords to improve ATS score'
                      : '❌ Low match — tailor your resume to this job description'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Matched */}
                <div>
                  <p className="text-xs font-semibold text-emerald-600 mb-2">
                    ✓ Matched ({result.matchedKeywords.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matchedKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs text-emerald-700"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing */}
                <div>
                  <p className="text-xs font-semibold text-red-500 mb-2">
                    ✗ Missing ({result.missingKeywords.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-xs text-red-600"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
                💡 <strong>Tip:</strong> Add missing keywords naturally into your experience bullets, skills, or summary. Focus on tech skills and domain-specific terms the recruiter is looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
