'use client'

import { useState, useEffect } from 'react'

export default function Footer() {
  // Placeholder values until GET /api/v1/stats is built
  const [stats, setStats] = useState({
    totalSheets: 1247,
    totalInstitutes: 23
  })

  // TODO: Replace with real API call when backend endpoint exists
  // useEffect(() => {
  //   fetch('/api/v1/stats').then(r => r.json()).then(setStats)
  // }, [])

  return (
    <footer className="border-t border-sand-200 bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <p className="text-sm text-ink-400">
          Total Answersheets evaluated:{' '}
          <span className="font-bold text-ink-700">
            {stats.totalSheets.toLocaleString()}
          </span>
        </p>
        <p className="text-sm text-ink-400">
          Total institutes joined:{' '}
          <span className="font-bold text-ink-700">
            {stats.totalInstitutes.toLocaleString()}
          </span>
        </p>
      </div>
    </footer>
  )
}
