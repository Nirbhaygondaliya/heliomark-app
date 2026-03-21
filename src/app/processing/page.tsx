'use client'

import { useState, useEffect } from 'react'
import {
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw
} from 'lucide-react'
import AppShell from '@/components/AppShell'
import { getJobs } from '@/lib/api'

interface Job {
  jobId: string
  fileName: string
  status: string
  error?: string
  createdAt: string
}

export default function ProcessingPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchJobs = async () => {
    try {
      const data = await getJobs()
      setJobs(data.jobs || [])
    } catch (err) {
      console.error('Failed to fetch jobs:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchJobs()
  }

  const statusConfig: Record<string, any> = {
    queued: { label: 'Queued', icon: Clock, color: 'text-ink-400', bg: 'bg-sand-100' },
    processing: { label: 'Processing', icon: Loader2, color: 'text-helio-500', bg: 'bg-helio-50' },
    done: { label: 'Done', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    error: { label: 'Error', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
  }

  if (loading) {
    return (
      <AppShell>
        <div className="pt-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-helio-500" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="pt-8 pb-8 px-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-ink-900">Answer Sheets in Process</h1>
            <p className="text-ink-400 text-sm mt-1">{jobs.length} total submissions</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-sand-200 text-ink-600 hover:bg-sand-50 transition-colors text-sm font-semibold disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="card p-12 text-center">
            <FileText size={32} className="text-ink-200 mx-auto mb-4" />
            <p className="text-ink-400 font-semibold">No submissions yet</p>
            <p className="text-ink-300 text-sm mt-1">Upload answer sheets to start evaluating</p>
            <a href="/evaluate" className="btn-primary inline-flex items-center gap-2 mt-6 text-sm">
              Go to Upload
            </a>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sand-200 bg-sand-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-ink-400 uppercase tracking-wider">No</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-ink-400 uppercase tracking-wider">Name of PDF</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-ink-400 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-ink-400 uppercase tracking-wider">Error</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, index) => {
                  const config = statusConfig[job.status] || statusConfig.queued
                  const StatusIcon = config.icon
                  return (
                    <tr key={job.jobId} className="border-b border-sand-100 last:border-0 hover:bg-sand-50/50 transition-colors">
                      <td className="py-3 px-4 text-sm text-ink-400">{index + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-helio-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-ink-700">{job.fileName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${config.bg} ${config.color}`}>
                          <StatusIcon size={12} className={job.status === 'processing' ? 'animate-spin' : ''} />
                          {config.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-red-500">
                        {job.error || '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  )
}